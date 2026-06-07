"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-bold">Error Admin Panel</h2>
      <p className="text-slate-500">{error.message}</p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
