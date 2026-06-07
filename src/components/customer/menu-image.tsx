"use client";

import { useState } from "react";
import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuImageProps {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function MenuImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 25vw",
  priority = false,
}: MenuImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-brand-light text-primary/40",
          className,
        )}
      >
        <UtensilsCrossed className="h-10 w-10" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setError(true)}
    />
  );
}
