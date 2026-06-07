"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="surface-card border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-brand-dark">
          Masuk ke akun
        </CardTitle>
        <CardDescription>
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Daftar gratis
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" className="h-11 rounded-xl" {...register("email")} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="h-11 rounded-xl" {...register("password")} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Lupa Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-4 rounded-xl bg-brand-light/80 px-3 py-2.5 text-xs text-muted-foreground">
          <p>Demo admin: admin@makanbang.com / admin123</p>
          <p>Demo customer: customer@makanbang.com / customer123</p>
        </div>
      </CardContent>
    </Card>
  );
}
