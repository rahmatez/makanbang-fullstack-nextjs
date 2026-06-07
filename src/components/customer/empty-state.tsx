import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel = "Pesan Sekarang",
  actionHref = "/",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-white/70 px-6 py-16 text-center backdrop-blur-sm">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-primary/50">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionHref && (
        <Link href={actionHref} className="mt-6">
          <Button className="rounded-full bg-primary px-8 shadow-sm shadow-primary/20 hover:bg-brand-dark">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
