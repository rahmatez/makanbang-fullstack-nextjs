"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-brand-dark">Terjadi Kesalahan</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Maaf, terjadi gangguan saat memuat halaman. Silakan coba lagi.
      </p>
      <Button onClick={reset} className="bg-primary hover:bg-brand-dark">
        Coba Lagi
      </Button>
    </div>
  );
}
