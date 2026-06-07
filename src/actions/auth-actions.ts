"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations";
import { Role } from "@prisma/client";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { headers } from "next/headers";

async function getClientIp() {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function registerUser(formData: FormData) {
  const ip = await getClientIp();
  const rate = checkRateLimit(getRateLimitKey("register", ip), 5, 60_000);
  if (!rate.success) {
    return { error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "Email sudah terdaftar" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: Role.CUSTOMER,
      emailVerifyTokens: {
        create: {
          token: verifyToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const verifyUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/auth/verify-email?token=${verifyToken}`;

  return {
    success: true,
    email: user.email,
    verifyUrl: process.env.NODE_ENV === "development" ? verifyUrl : undefined,
  };
}

export async function requestPasswordReset(formData: FormData) {
  const ip = await getClientIp();
  const rate = checkRateLimit(getRateLimitKey("forgot-password", ip), 5, 60_000);
  if (!rate.success) {
    return { error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return { success: true, message: "Jika email terdaftar, link reset akan dikirim." };
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const resetUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/auth/reset-password?token=${token}`;

  return {
    success: true,
    message: "Jika email terdaftar, link reset akan dikirim.",
    resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
  };
}

export async function resetPassword(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: "Token tidak valid atau sudah kedaluwarsa" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
  ]);

  return { success: true };
}

export async function verifyEmail(token: string) {
  const verifyToken = await prisma.emailVerifyToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verifyToken || verifyToken.expiresAt < new Date()) {
    return { error: "Token verifikasi tidak valid atau kedaluwarsa" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verifyToken.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerifyToken.delete({ where: { id: verifyToken.id } }),
  ]);

  return { success: true };
}
