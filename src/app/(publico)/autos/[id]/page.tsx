import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Cog, Fuel, Gauge, Phone, Star, Tag } from "lucide-react";
import { Galeria } from "@/components/catalogo/galeria";
import { Badge, varianteEstado } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { sitio } from "@/config/site";
import { obtenerVehiculo } from "@/lib/vehiculos";
import { formatearKm, formatearPrecio, tituloVehiculo, whatsappVehiculoUrl } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vehiculo = await obtenerVehiculo((await params).id);
  if (!vehiculo) return { title: "Auto no encontrado" };
  const titulo = `${tituloVehiculo(vehiculo)} ${vehiculo.anio}`;
  return {
    title: titulo,
    description: `${titulo} · ${formatearKm(vehiculo.kilometraje)} · ${vehiculo.combustible} · ${vehiculo.transmision}. ${formatearPrecio(vehiculo.precio, vehiculo.moneda)}.`,
    openGraph: vehiculo.imagenes[0] ? { images: [vehiculo.imagenes[0]] } : undefined,
  };
}

export default async function DetalleAutoPage({ params }: Props) {
  const vehiculo = await obtenerVehiculo((await params).id);
  if (!vehiculo) notFound();

  const titulo = tituloVehiculo(vehiculo);
  const vendido = vehiculo.estado === "Vendido";
  const ficha = [
    { etiqueta: "Marca", valor: vehiculo.marca },
    { etiqueta: "Modelo", valor: vehiculo.modelo },
    { etiqueta: "Versión", valor: vehiculo.version || "—" },
    { etiqueta: "Año", valor: vehiculo.anio, icono: Calendar },
    { etiqueta: "Kilometraje", valor: formatearKm(vehiculo.kilometraje), icono: Gauge },
    { etiqueta: "Combustible", valor: vehiculo.combustible, icono: Fuel },
    { etiqueta: "Transmisión", valor: vehiculo.transmision, icono: Cog },
    { etiqueta: "Estado", valor: vehiculo.estado, icono: Tag },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-8 sm:px-6 lg:pb-0">
      <Link
        href="/#autos"
        className="inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-tinta hover:underline"
      >
        <ArrowLeft className="size-6" aria-hidden /> Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-8 lg:gap-x-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:grid-rows-[auto_1fr]">
        <div className="min-w-0">
          <Galeria imagenes={vehiculo.imagenes} titulo={`${titulo} ${vehiculo.anio}`} />
        </div>

        {/* En celulares la ficha de precio va justo debajo de las fotos. */}
        <aside className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="rounded-2xl border border-borde bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {vehiculo.destacado && (
                <Badge variant="destacado">
                  <Star className="fill-current" aria-hidden /> Destacado
                </Badge>
              )}
              {vehiculo.estado !== "Disponible" && (
                <Badge variant={varianteEstado(vehiculo.estado)}>{vehiculo.estado}</Badge>
              )}
            </div>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-tinta">{titulo}</h1>
            {vehiculo.version && <p className="mt-1 text-xl text-texto-suave">{vehiculo.version}</p>}

            <ul className="mt-5 flex flex-wrap gap-2">
              <li>
                <Badge>
                  <Calendar aria-hidden /> {vehiculo.anio}
                </Badge>
              </li>
              <li>
                <Badge>
                  <Gauge aria-hidden /> {formatearKm(vehiculo.kilometraje)}
                </Badge>
              </li>
              <li>
                <Badge>
                  <Fuel aria-hidden /> {vehiculo.combustible}
                </Badge>
              </li>
              <li>
                <Badge>
                  <Cog aria-hidden /> {vehiculo.transmision}
                </Badge>
              </li>
            </ul>

            <p className="mt-6 text-base text-texto-suave">Precio</p>
            <p className="text-4xl font-bold text-tinta">{formatearPrecio(vehiculo.precio, vehiculo.moneda)}</p>

            {vendido ? (
              <p className="mt-6 rounded-xl bg-error-fondo p-4 text-lg font-semibold text-error">
                Este auto ya fue vendido. Consúltenos por unidades similares.
              </p>
            ) : (
              <div className="mt-6 hidden lg:block">
                <p className="text-lg font-semibold">Consultar por WhatsApp con:</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {sitio.contactos.map((c) => (
                    <Button key={c.nombre} asChild variant="whatsapp" size="lg">
                      <a href={whatsappVehiculoUrl(vehiculo, c.whatsapp)} target="_blank" rel="noopener noreferrer">
                        <WhatsAppIcon /> {c.nombre}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-6 text-lg font-semibold">Llamar por teléfono:</p>
            <div className="mt-2 space-y-3">
              {sitio.contactos.map((c) => (
                <Button key={c.nombre} asChild variant="secondary" size="lg" className="w-full whitespace-nowrap px-4 text-base sm:text-lg">
                  <a href={`tel:${c.telefonoLink}`}>
                    <Phone aria-hidden /> {c.nombre}: {c.telefono}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-10">
          {vehiculo.descripcion && (
            <section>
              <h2 className="font-serif text-3xl font-bold text-tinta">Descripción</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">{vehiculo.descripcion}</p>
            </section>
          )}

          <section>
            <h2 className="font-serif text-3xl font-bold text-tinta">Ficha técnica</h2>
            <dl className="mt-4 grid overflow-hidden rounded-2xl border border-borde bg-white sm:grid-cols-2">
              {ficha.map(({ etiqueta, valor, icono: Icono }) => (
                <div key={etiqueta} className="flex items-center justify-between gap-4 border-b border-borde px-5 py-4">
                  <dt className="flex items-center gap-2 text-lg text-texto-suave">
                    {Icono && <Icono className="size-5 text-dorado" aria-hidden />}
                    {etiqueta}
                  </dt>
                  <dd className="text-right text-lg font-semibold">{valor}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

      </div>

      {!vendido && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-white/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <p className="mb-2 text-center text-base font-semibold">Consultar por WhatsApp con:</p>
          <div className="grid grid-cols-2 gap-3">
            {sitio.contactos.map((c) => (
              <Button key={c.nombre} asChild variant="whatsapp" size="lg" className="px-3">
                <a href={whatsappVehiculoUrl(vehiculo, c.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon /> {c.nombre}
                </a>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
