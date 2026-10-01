import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { COMBUSTIBLES, MONEDAS, TRANSMISIONES } from "@/lib/types";
import type { FiltrosCatalogo } from "@/lib/vehiculos";

interface FiltrosProps {
  filtros: FiltrosCatalogo;
  marcas: string[];
  anios: number[];
}

/**
 * Formulario GET: funciona incluso sin JavaScript y
 * los filtros quedan en la URL (se pueden compartir o volver atrás).
 */
export function Filtros({ filtros, marcas, anios }: FiltrosProps) {
  // La moneda sola no es un filtro: solo cuenta junto con un precio.
  const hayFiltros = Boolean(
    filtros.q ||
      filtros.marca ||
      filtros.anioDesde ||
      filtros.transmision ||
      filtros.combustible ||
      filtros.precioMin != null ||
      filtros.precioMax != null ||
      filtros.destacados,
  );

  return (
    <form action="/#autos" method="get" className="rounded-2xl border border-borde bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-tinta">
        <SlidersHorizontal className="size-6" aria-hidden />
        Filtrar autos
      </h2>
      {filtros.q && <input type="hidden" name="q" value={filtros.q} />}

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="f-marca">Marca</Label>
          <Select id="f-marca" name="marca" defaultValue={filtros.marca ?? ""}>
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="f-anio">Año desde</Label>
          <Select id="f-anio" name="anioDesde" defaultValue={filtros.anioDesde?.toString() ?? ""}>
            <option value="">Cualquier año</option>
            {anios.map((a) => (
              <option key={a} value={a}>
                {a} o más nuevo
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="f-transmision">Transmisión</Label>
          <Select id="f-transmision" name="transmision" defaultValue={filtros.transmision ?? ""}>
            <option value="">Todas</option>
            {TRANSMISIONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="f-combustible">Combustible</Label>
          <Select id="f-combustible" name="combustible" defaultValue={filtros.combustible ?? ""}>
            <option value="">Todos</option>
            {COMBUSTIBLES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-lg font-semibold">Rango de precio</legend>
        <div className="grid gap-3 sm:grid-cols-[10rem_1fr_1fr]">
          <div>
            <label htmlFor="f-moneda" className="sr-only">
              Moneda
            </label>
            <Select id="f-moneda" name="moneda" defaultValue={filtros.moneda ?? "USD"}>
              {MONEDAS.map((m) => (
                <option key={m} value={m}>
                  {m === "USD" ? "Dólares" : "Pesos"}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="f-min" className="sr-only">
              Precio mínimo
            </label>
            <Input
              id="f-min"
              name="precioMin"
              inputMode="numeric"
              placeholder="Desde"
              defaultValue={filtros.precioMin?.toString() ?? ""}
            />
          </div>
          <div>
            <label htmlFor="f-max" className="sr-only">
              Precio máximo
            </label>
            <Input
              id="f-max"
              name="precioMax"
              inputMode="numeric"
              placeholder="Hasta"
              defaultValue={filtros.precioMax?.toString() ?? ""}
            />
          </div>
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <label className="flex min-h-12 cursor-pointer items-center gap-3 text-lg">
          <input
            type="checkbox"
            name="destacados"
            value="1"
            defaultChecked={filtros.destacados}
            className="size-6 cursor-pointer accent-tinta"
          />
          Solo destacados
        </label>
        <div className="ml-auto flex flex-wrap gap-3">
          {hayFiltros && (
            <Button asChild variant="outline">
              <Link href="/#autos">
                <X aria-hidden /> Limpiar filtros
              </Link>
            </Button>
          )}
          <Button type="submit">
            <SlidersHorizontal aria-hidden /> Aplicar filtros
          </Button>
        </div>
      </div>
    </form>
  );
}
