import Link from "next/link";
import { Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FotoAuto } from "./foto-auto";
import { formatearPrecio, tituloVehiculo } from "@/lib/utils";
import type { Vehiculo } from "@/lib/types";

export function Hero({ busqueda, destacados }: { busqueda?: string; destacados: Vehiculo[] }) {
  return (
    <section className="bg-gradient-to-b from-white to-marfil">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-dorado-claro px-4 py-1.5 text-base font-semibold text-[#6b5220]">
            <ShieldCheck className="size-5" aria-hidden />
            Autos revisados y con papeles al día
          </p>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-tinta sm:text-5xl">
            Su próximo auto, con la confianza de siempre.
          </h1>
          <p className="mt-4 text-xl text-texto-suave">
            Lo atendemos personalmente, sin apuros y con toda la información clara. Busque el modelo que le interesa
            o consúltenos directamente.
          </p>

          <form action="/#autos" method="get" role="search" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="busqueda-hero" className="sr-only">
              Buscar por marca o modelo
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-texto-suave"
                aria-hidden
              />
              <input
                id="busqueda-hero"
                name="q"
                type="search"
                defaultValue={busqueda}
                placeholder="Ej: Toyota Corolla"
                className="h-16 w-full rounded-xl border-2 border-borde bg-white pl-13 pr-4 text-xl focus:border-tinta focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="h-16">
              <Search aria-hidden /> Buscar
            </Button>
          </form>
        </div>

        {destacados.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-tinta">
                <Star className="size-6 fill-dorado text-dorado" aria-hidden />
                Destacados de la semana
              </h2>
              <Link href="/?destacados=1#autos" className="text-lg font-semibold text-tinta underline underline-offset-4">
                Ver todos los destacados
              </Link>
            </div>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {destacados.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/autos/${v.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-borde bg-white p-3 transition-shadow hover:shadow-md"
                  >
                    <FotoAuto
                      src={v.imagenes[0]}
                      alt=""
                      sizes="112px"
                      className="aspect-[4/3] w-28 shrink-0 rounded-xl [&_svg]:size-8 [&_span]:hidden"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-tinta">{tituloVehiculo(v)}</p>
                      <p className="text-base text-texto-suave">{v.anio}</p>
                      <p className="text-base font-semibold text-tinta">{formatearPrecio(v.precio, v.moneda)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
