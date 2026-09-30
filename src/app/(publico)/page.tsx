import Link from "next/link";
import { SearchX } from "lucide-react";
import { Hero } from "@/components/catalogo/hero";
import { Filtros } from "@/components/catalogo/filtros";
import { TarjetaAuto } from "@/components/catalogo/tarjeta-auto";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { leerFiltros, obtenerCatalogo, obtenerDestacados, obtenerOpcionesFiltros } from "@/lib/vehiculos";
import { whatsappUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InicioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filtros = leerFiltros(await searchParams);
  const [vehiculos, destacados, opciones] = await Promise.all([
    obtenerCatalogo(filtros),
    obtenerDestacados(),
    obtenerOpcionesFiltros(),
  ]);

  return (
    <>
      <Hero busqueda={filtros.q} destacados={destacados} />

      <section id="autos" className="mx-auto max-w-7xl scroll-mt-6 px-4 pt-10 sm:px-6">
        <Filtros filtros={filtros} marcas={opciones.marcas} anios={opciones.anios} />

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-3xl font-bold text-tinta">Nuestros autos</h2>
          <p className="text-lg text-texto-suave" aria-live="polite">
            {vehiculos.length === 1 ? "1 auto encontrado" : `${vehiculos.length} autos encontrados`}
            {filtros.q && (
              <>
                {" "}
                para <strong className="text-texto">“{filtros.q}”</strong>
              </>
            )}
          </p>
        </div>

        {vehiculos.length > 0 ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehiculos.map((v, i) => (
              <li key={v.id} className="flex">
                <div className="w-full [&>article]:h-full">
                  <TarjetaAuto vehiculo={v} prioridad={i < 3} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-borde bg-white px-6 py-14 text-center">
            <SearchX className="size-14 text-texto-suave" aria-hidden />
            <p className="mt-4 text-2xl font-bold text-tinta">No encontramos autos con esos filtros</p>
            <p className="mt-2 max-w-xl text-lg text-texto-suave">
              Pruebe quitando algún filtro, o escríbanos: muchas veces tenemos unidades que todavía no publicamos.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/#autos">Ver todos los autos</Link>
              </Button>
              <Button asChild variant="whatsapp">
                <a
                  href={whatsappUrl("Hola! Estoy buscando un auto y quería consultar si tienen algo disponible.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon /> Consultar por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
