"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setError(null);
    const formData = new FormData();
    formData.set("email", data.email);
    const result = await requestPasswordReset(formData);

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage(result.message ?? "Permintaan berhasil diproses");
    if (result.resetUrl) setResetUrl(result.resetUrl);
  }

  return (
    <Card className="surface-card border-0 shadow-none">
      <CardHeader>
        <CardTitle>Lupa Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          {resetUrl && (
            <p className="text-xs text-amber-700">
              Dev mode:{" "}
              <Link href={resetUrl} className="underline">
                reset password
              </Link>
            </p>
          )}
          <Button type="submit" className="w-full bg-primary hover:bg-brand-dark" disabled={isSubmitting}>
            Kirim Link Reset
          </Button>
        </form>
        <Link href="/auth/login" className="mt-4 block text-center text-sm text-primary">
          Kembali ke login
        </Link>
      </CardContent>
    </Card>
  );
}
