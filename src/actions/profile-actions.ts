"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import {
  profileSchema,
  savedAddressSchema,
  type ProfileInput,
  type SavedAddressInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await requireAuth();

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      savedAddresses: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function updateProfile(input: ProfileInput) {
  const session = await requireAuth();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function addSavedAddress(input: SavedAddressInput) {
  const session = await requireAuth();
  const parsed = savedAddressSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  if (parsed.data.isDefault) {
    await prisma.savedAddress.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  await prisma.savedAddress.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
    },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteSavedAddress(id: string) {
  const session = await requireAuth();

  await prisma.savedAddress.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function getNotifications() {
  const session = await requireAuth();

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationRead(id: string) {
  const session = await requireAuth();

  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await requireAuth();

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}

export async function getUnreadNotificationCount() {
  const session = await requireAuth();

  return prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
}
