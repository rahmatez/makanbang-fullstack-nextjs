"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("email", data.email);
    formData.set("password", data.password);

    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.verifyUrl) {
      setVerifyUrl(result.verifyUrl);
    }

    const loginResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (loginResult?.error) {
      router.push("/auth/login?registered=1");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Card className="surface-card border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-brand-dark">
          Buat akun baru
        </CardTitle>
        <CardDescription>Daftar dan mulai pesan menu favoritmu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" placeholder="Nama kamu" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Minimal 6 karakter" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          {verifyUrl && (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Dev mode: verifikasi email via{" "}
              <Link href={verifyUrl} className="underline">
                link ini
              </Link>
            </div>
          )}

          <Button type="submit" className="h-11 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-primary">
            Masuk di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
