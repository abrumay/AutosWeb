import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-base font-medium [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "bg-arena text-texto",
        destacado: "bg-dorado-claro text-[#6b5220] font-semibold",
        disponible: "bg-exito-fondo text-exito font-semibold",
        reservado: "bg-aviso-fondo text-aviso font-semibold",
        vendido: "bg-error-fondo text-error font-semibold",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function varianteEstado(estado: string) {
  if (estado === "Reservado") return "reservado" as const;
  if (estado === "Vendido") return "vendido" as const;
  return "disponible" as const;
}
