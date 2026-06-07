import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Memuat...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
