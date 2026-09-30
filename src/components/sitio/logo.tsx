import Image from "next/image";
import { sitio } from "@/config/site";
import { cn } from "@/lib/utils";
import logoAzul from "../../../public/logo.png";
import logoBlanco from "../../../public/logo-blanco.png";

/** Logo de la agencia. Usar `claro` sobre fondos oscuros. */
export function Logo({ claro, className, priority }: { claro?: boolean; className?: string; priority?: boolean }) {
  return (
    <Image
      src={claro ? logoBlanco : logoAzul}
      alt={`${sitio.nombre} ${sitio.rubro}`}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}
