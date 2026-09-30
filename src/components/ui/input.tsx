import * as React from "react";
import { cn } from "@/lib/utils";

export const campoBase =
  "w-full min-h-14 rounded-xl border-2 border-borde bg-white px-4 text-lg text-texto placeholder:text-texto-suave/70 transition-colors focus:border-tinta focus:outline-none aria-[invalid=true]:border-error";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(campoBase, className)} {...props} />;
}

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        campoBase,
        "appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%2314213d' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:1.5rem] bg-[right_0.9rem_center] bg-no-repeat pr-12",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(campoBase, "min-h-40 py-3 leading-relaxed", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("mb-2 block text-lg font-semibold text-texto", className)} {...props} />;
}

export function MensajeError({ children, id }: { children?: React.ReactNode; id?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-base font-medium text-error">
      {children}
    </p>
  );
}
