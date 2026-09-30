import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AutoNoEncontrado() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-tinta">No encontramos este auto</h1>
      <p className="mt-4 text-xl text-texto-suave">Es posible que ya no esté publicado.</p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/#autos">Ver todos los autos</Link>
      </Button>
    </div>
  );
}
