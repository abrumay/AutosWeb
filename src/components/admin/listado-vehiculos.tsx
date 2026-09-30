"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CarFront, Pencil, Search, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge, varianteEstado } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ConfirmarEliminar } from "./confirmar-eliminar";
import { cambiarEstado } from "@/app/admin/actions";
import { ESTADOS, type Estado, type Vehiculo } from "@/lib/types";
import { cn, formatearKm, formatearPrecio, tituloVehiculo } from "@/lib/utils";

interface Props {
  vehiculos: Vehiculo[];
  mensajeInicial?: string;
  errorCarga?: string;
}

type Feedback = { tipo: "exito" | "error"; texto: string } | null;

const colorEstado: Record<Estado, string> = {
  Disponible: "border-exito text-exito",
  Reservado: "border-aviso text-aviso",
  Vendido: "border-error text-error",
};

export function ListadoVehiculos({ vehiculos, mensajeInicial, errorCarga }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<Estado | "Todos">("Todos");
  const [feedback, setFeedback] = useState<Feedback>(
    errorCarga
      ? { tipo: "error", texto: errorCarga }
      : mensajeInicial
        ? { tipo: "exito", texto: mensajeInicial }
        : null,
  );
  const [pendiente, startTransition] = useTransition();
  const [actualizando, setActualizando] = useState<string | null>(null);

  // Quita "?mensaje=..." de la URL para que no reaparezca al recargar.
  useEffect(() => {
    if (mensajeInicial) router.replace(pathname, { scroll: false });
  }, [mensajeInicial, pathname, router]);

  const conteo = useMemo(() => {
    const c: Record<string, number> = { Todos: vehiculos.length };
    for (const e of ESTADOS) c[e] = vehiculos.filter((v) => v.estado === e).length;
    return c;
  }, [vehiculos]);

  const visibles = useMemo(() => {
    const palabras = busqueda.toLowerCase().split(/\s+/).filter(Boolean);
    return vehiculos.filter((v) => {
      if (filtroEstado !== "Todos" && v.estado !== filtroEstado) return false;
      const texto = `${v.marca} ${v.modelo} ${v.version ?? ""} ${v.anio}`.toLowerCase();
      return palabras.every((p) => texto.includes(p));
    });
  }, [vehiculos, busqueda, filtroEstado]);

  const onCambiarEstado = (v: Vehiculo, estado: Estado) => {
    setActualizando(v.id);
    startTransition(async () => {
      const r = await cambiarEstado(v.id, estado);
      setActualizando(null);
      setFeedback(
        r.ok
          ? { tipo: "exito", texto: `${tituloVehiculo(v)}: ahora figura como "${estado}".` }
          : { tipo: "error", texto: r.error },
      );
      if (r.ok) router.refresh();
    });
  };

  return (
    <div className="mt-8 space-y-6">
      {feedback && (
        <Alert tipo={feedback.tipo} onCerrar={() => setFeedback(null)}>
          {feedback.texto}
        </Alert>
      )}

      <div className="rounded-2xl border border-borde bg-white p-5">
        <label htmlFor="buscar-admin" className="sr-only">
          Buscar auto
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-6 -translate-y-1/2 text-texto-suave"
            aria-hidden
          />
          <Input
            id="buscar-admin"
            type="search"
            placeholder="Buscar por marca, modelo o año"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-13"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
          {(["Todos", ...ESTADOS] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setFiltroEstado(e)}
              aria-pressed={filtroEstado === e}
              className={cn(
                "min-h-12 rounded-xl border-2 px-5 text-base font-semibold transition-colors cursor-pointer",
                filtroEstado === e
                  ? "border-tinta bg-tinta text-white"
                  : "border-borde bg-white text-texto hover:border-tinta",
              )}
            >
              {e} ({conteo[e]})
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-borde bg-white px-6 py-14 text-center">
          <CarFront className="mx-auto size-14 text-texto-suave" aria-hidden />
          <p className="mt-4 text-2xl font-bold text-tinta">
            {vehiculos.length === 0 ? "Todavía no hay autos cargados" : "No hay autos que coincidan"}
          </p>
          {vehiculos.length === 0 && (
            <Button asChild size="lg" className="mt-6">
              <Link href="/admin/nuevo">Cargar el primer auto</Link>
            </Button>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {visibles.map((v) => (
            <li
              key={v.id}
              className="grid gap-4 rounded-2xl border border-borde bg-white p-4 sm:grid-cols-[9rem_1fr] lg:grid-cols-[9rem_1fr_auto] lg:items-center"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-arena">
                {v.imagenes[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.imagenes[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <CarFront className="absolute inset-0 m-auto size-10 text-texto-suave" aria-hidden />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-tinta">
                    {tituloVehiculo(v)} {v.anio}
                  </h2>
                  <Badge variant={varianteEstado(v.estado)}>{v.estado}</Badge>
                  {v.destacado && <Badge variant="destacado">Destacado</Badge>}
                </div>
                {v.version && <p className="text-lg text-texto-suave">{v.version}</p>}
                <p className="mt-1 text-lg">
                  <span className="font-semibold">{formatearPrecio(v.precio, v.moneda)}</span>
                  <span className="text-texto-suave"> · {formatearKm(v.kilometraje)}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-1 lg:justify-end">
                <div className="w-full sm:w-48">
                  <label htmlFor={`estado-${v.id}`} className="sr-only">
                    Estado de {tituloVehiculo(v)}
                  </label>
                  <Select
                    id={`estado-${v.id}`}
                    value={v.estado}
                    disabled={pendiente && actualizando === v.id}
                    onChange={(e) => onCambiarEstado(v, e.target.value as Estado)}
                    className={cn("min-h-12 font-semibold", colorEstado[v.estado])}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button asChild variant="secondary">
                  <Link href={`/admin/${v.id}/editar`}>
                    <Pencil aria-hidden /> Editar
                  </Link>
                </Button>
                <ConfirmarEliminar
                  vehiculo={v}
                  onResultado={(fb) => {
                    setFeedback(fb);
                    if (fb.tipo === "exito") router.refresh();
                  }}
                >
                  <Button variant="outline" className="text-error hover:border-error">
                    <Trash2 aria-hidden /> Eliminar
                  </Button>
                </ConfirmarEliminar>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
