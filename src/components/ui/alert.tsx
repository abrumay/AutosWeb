import * as React from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  tipo: "exito" | "error";
  children: React.ReactNode;
  onCerrar?: () => void;
  className?: string;
}

/** Mensaje de feedback grande y bien visible. */
export function Alert({ tipo, children, onCerrar, className }: AlertProps) {
  const Icono = tipo === "exito" ? CircleCheck : CircleAlert;
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-4 rounded-2xl border-2 p-5 text-lg font-semibold",
        tipo === "exito"
          ? "border-exito bg-exito-fondo text-exito"
          : "border-error bg-error-fondo text-error",
        className,
      )}
    >
      <Icono className="mt-0.5 size-8 shrink-0" aria-hidden />
      <div className="flex-1">{children}</div>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="-m-2 rounded-lg p-2 hover:bg-black/5 cursor-pointer"
          aria-label="Cerrar mensaje"
        >
          <X className="size-6" />
        </button>
      )}
    </div>
  );
}
