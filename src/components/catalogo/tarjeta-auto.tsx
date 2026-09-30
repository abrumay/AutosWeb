import Link from "next/link";
import { ArrowRight, Calendar, Cog, Fuel, Gauge, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FotoAuto } from "./foto-auto";
import { formatearKm, formatearPrecio, tituloVehiculo } from "@/lib/utils";
import type { Vehiculo } from "@/lib/types";

export function TarjetaAuto({ vehiculo, prioridad }: { vehiculo: Vehiculo; prioridad?: boolean }) {
  const titulo = tituloVehiculo(vehiculo);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-borde bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative">
        <FotoAuto
          src={vehiculo.imagenes[0]}
          alt={`${titulo} ${vehiculo.anio}`}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          priority={prioridad}
          className="aspect-[4/3]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {vehiculo.destacado && (
            <Badge variant="destacado" className="shadow">
              <Star className="fill-current" aria-hidden /> Destacado
            </Badge>
          )}
          {vehiculo.estado === "Reservado" && (
            <Badge variant="reservado" className="shadow">
              Reservado
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl font-bold text-tinta">
          <Link href={`/autos/${vehiculo.id}`} className="after:absolute after:inset-0">
            {titulo}
          </Link>
        </h3>
        {vehiculo.version && <p className="mt-1 text-lg text-texto-suave">{vehiculo.version}</p>}

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Datos principales">
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

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
          <p className="text-3xl font-bold text-tinta">{formatearPrecio(vehiculo.precio, vehiculo.moneda)}</p>
          <span className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-tinta px-5 text-base font-semibold text-white transition-colors group-hover:bg-tinta-suave">
            Ver detalles <ArrowRight className="size-5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
