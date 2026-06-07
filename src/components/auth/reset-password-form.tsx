"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: ResetPasswordInput) {
    setError(null);
    const formData = new FormData();
    formData.set("token", data.token);
    formData.set("password", data.password);
    const result = await resetPassword(formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/auth/login?reset=1");
  }

  return (
    <Card className="surface-card border-0 shadow-none">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input id="password" type="password" {...register("password")} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!token && <p className="text-sm text-red-600">Token tidak valid</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-brand-dark" disabled={isSubmitting || !token}>
            Simpan Password
          </Button>
        </form>
        <Link href="/auth/login" className="mt-4 block text-center text-sm text-primary">
          Kembali ke login
        </Link>
      </CardContent>
    </Card>
  );
}
