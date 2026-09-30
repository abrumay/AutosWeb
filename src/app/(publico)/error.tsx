"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPublico({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-tinta">Algo salió mal</h1>
      <p className="mt-4 text-xl text-texto-suave">No pudimos cargar la información. Por favor, intente nuevamente.</p>
      <Button size="lg" className="mt-8" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
