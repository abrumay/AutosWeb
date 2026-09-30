import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NoEncontrado() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-4xl font-bold text-tinta">Página no encontrada</h1>
      <p className="mt-4 text-xl text-texto-suave">La dirección que buscó no existe.</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Ir al inicio</Link>
      </Button>
    </main>
  );
}
