"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FotoAuto } from "./foto-auto";
import { cn } from "@/lib/utils";

interface GaleriaProps {
  imagenes: string[];
  titulo: string;
}

export function Galeria({ imagenes, titulo }: GaleriaProps) {
  const [actual, setActual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const inicioToque = useRef<number | null>(null);
  const total = imagenes.length;

  if (total === 0) {
    return <FotoAuto alt={titulo} sizes="100vw" className="aspect-[4/3] rounded-2xl" />;
  }

  const ir = (i: number) => setActual((i + total) % total);
  const anterior = () => ir(actual - 1);
  const siguiente = () => ir(actual + 1);

  // Deslizar con el dedo en pantallas táctiles.
  const toqueProps = {
    onTouchStart: (e: React.TouchEvent) => {
      inicioToque.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (inicioToque.current == null) return;
      const delta = e.changedTouches[0].clientX - inicioToque.current;
      if (Math.abs(delta) > 50) (delta > 0 ? anterior : siguiente)();
      inicioToque.current = null;
    },
  };

  const teclas = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") siguiente();
  };

  const flechas = (grande: boolean) =>
    total > 1 && (
      <>
        <button
          type="button"
          onClick={anterior}
          aria-label="Foto anterior"
          className={cn(
            "absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-tinta shadow-lg hover:bg-white cursor-pointer",
            grande ? "size-16" : "size-14",
          )}
        >
          <ChevronLeft className="size-9" />
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Foto siguiente"
          className={cn(
            "absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-tinta shadow-lg hover:bg-white cursor-pointer",
            grande ? "size-16" : "size-14",
          )}
        >
          <ChevronRight className="size-9" />
        </button>
      </>
    );

  return (
    <div onKeyDown={teclas}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-arena" {...toqueProps}>
        <button
          type="button"
          onClick={() => setAmpliada(true)}
          className="absolute inset-0 cursor-zoom-in"
          aria-label="Ver foto en pantalla completa"
        >
          <Image
            src={imagenes[actual]}
            alt={`${titulo} - foto ${actual + 1} de ${total}`}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </button>
        {flechas(false)}
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-base font-semibold text-white">
          Foto {actual + 1} de {total}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1 text-base text-white">
          <Expand className="size-4" aria-hidden /> Ampliar
        </span>
      </div>

      {total > 1 && (
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Miniaturas">
          {imagenes.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === actual}
                className={cn(
                  "relative block h-20 w-28 overflow-hidden rounded-xl border-4 transition-opacity cursor-pointer",
                  i === actual ? "border-tinta" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="112px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={ampliada} onOpenChange={setAmpliada}>
        <DialogContent className="max-w-6xl bg-black p-0 sm:p-0 [&>button:last-child]:bg-white [&>button:last-child]:text-tinta">
          <DialogTitle className="sr-only">
            {titulo} - foto {actual + 1} de {total}
          </DialogTitle>
          <div className="relative aspect-[4/3] max-h-[85dvh] w-full" onKeyDown={teclas} {...toqueProps}>
            <Image
              src={imagenes[actual]}
              alt={`${titulo} - foto ${actual + 1} de ${total}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {flechas(true)}
          </div>
          <p className="py-3 text-center text-lg font-semibold text-white">
            Foto {actual + 1} de {total}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
