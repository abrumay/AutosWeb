import Image from "next/image";
import { CarFront } from "lucide-react";
import { cn } from "@/lib/utils";

interface FotoAutoProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Foto de un auto con un marcador de posición si no tiene imágenes. */
export function FotoAuto({ src, alt, sizes, priority, className }: FotoAutoProps) {
  return (
    <div className={cn("relative overflow-hidden bg-arena", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-texto-suave">
          <CarFront className="size-16" aria-hidden />
          <span className="text-base">Foto próximamente</span>
        </div>
      )}
    </div>
  );
}
