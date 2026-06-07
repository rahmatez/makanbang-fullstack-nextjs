"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { id: 1, label: "Keranjang" },
  { id: 2, label: "Pengiriman" },
  { id: 3, label: "Pembayaran" },
];

export function CheckoutSteps({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="surface-card mb-8 rounded-2xl p-4 md:p-5">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30",
                    isActive && "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/15",
                    !isCompleted && !isActive && "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium md:text-xs",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-0.5 flex-1 rounded-full transition-colors duration-300",
                    step.id < currentStep ? "bg-emerald-400" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
