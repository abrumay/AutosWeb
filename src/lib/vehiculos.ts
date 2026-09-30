import { createClient } from "@/lib/supabase/server";
import { COMBUSTIBLES, MONEDAS, TRANSMISIONES, type Vehiculo } from "./types";

export interface FiltrosCatalogo {
  q?: string;
  marca?: string;
  anioDesde?: number;
  transmision?: string;
  combustible?: string;
  moneda?: string;
  precioMin?: number;
  precioMax?: number;
  destacados?: boolean;
}

type Params = Record<string, string | string[] | undefined>;

function texto(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  return s?.trim() || undefined;
}

function numero(v: string | string[] | undefined) {
  const s = texto(v)?.replace(/\D/g, "");
  return s ? Number(s) : undefined;
}

function opcion<T extends readonly string[]>(v: string | string[] | undefined, validas: T) {
  const s = texto(v);
  return s && (validas as readonly string[]).includes(s) ? s : undefined;
}

export function leerFiltros(params: Params): FiltrosCatalogo {
  return {
    q: texto(params.q),
    marca: texto(params.marca),
    anioDesde: numero(params.anioDesde),
    transmision: opcion(params.transmision, TRANSMISIONES),
    combustible: opcion(params.combustible, COMBUSTIBLES),
    moneda: opcion(params.moneda, MONEDAS),
    precioMin: numero(params.precioMin),
    precioMax: numero(params.precioMax),
    destacados: texto(params.destacados) === "1",
  };
}

/** Quita caracteres con significado especial en los filtros de PostgREST. */
function limpiarBusqueda(s: string) {
  return s.replace(/[,()*%\\:"']/g, " ");
}

/** Autos visibles en el catálogo público (Disponibles y Reservados). */
export async function obtenerCatalogo(filtros: FiltrosCatalogo): Promise<Vehiculo[]> {
  const supabase = await createClient();
  let query = supabase.from("vehiculos").select("*").in("estado", ["Disponible", "Reservado"]);

  if (filtros.q) {
    // Cada palabra debe aparecer en la marca, el modelo o la versión.
    for (const palabra of limpiarBusqueda(filtros.q).split(/\s+/).filter(Boolean)) {
      query = query.or(`marca.ilike.%${palabra}%,modelo.ilike.%${palabra}%,version.ilike.%${palabra}%`);
    }
  }
  if (filtros.marca) query = query.ilike("marca", limpiarBusqueda(filtros.marca));
  if (filtros.anioDesde) query = query.gte("anio", filtros.anioDesde);
  if (filtros.transmision) query = query.eq("transmision", filtros.transmision);
  if (filtros.combustible) query = query.eq("combustible", filtros.combustible);
  if (filtros.destacados) query = query.eq("destacado", true);
  if (filtros.precioMin != null || filtros.precioMax != null) {
    query = query.eq("moneda", filtros.moneda ?? "USD");
    if (filtros.precioMin != null) query = query.gte("precio", filtros.precioMin);
    if (filtros.precioMax != null) query = query.lte("precio", filtros.precioMax);
  }

  const { data, error } = await query
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);
  return (data ?? []) as Vehiculo[];
}

export async function obtenerDestacados(limite = 4): Promise<Vehiculo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select("*")
    .eq("destacado", true)
    .eq("estado", "Disponible")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw new Error(`No se pudieron cargar los destacados: ${error.message}`);
  return (data ?? []) as Vehiculo[];
}

/** Marcas y años existentes, para armar los filtros. */
export async function obtenerOpcionesFiltros() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehiculos")
    .select("marca, anio")
    .in("estado", ["Disponible", "Reservado"]);
  if (error) throw new Error(`No se pudieron cargar los filtros: ${error.message}`);

  const marcas = new Map<string, string>();
  const anios = new Set<number>();
  for (const fila of data ?? []) {
    marcas.set(fila.marca.toLowerCase(), fila.marca);
    anios.add(fila.anio);
  }
  return {
    marcas: [...marcas.values()].sort((a, b) => a.localeCompare(b, "es")),
    anios: [...anios].sort((a, b) => b - a),
  };
}

export async function obtenerVehiculo(id: string): Promise<Vehiculo | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehiculos").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`No se pudo cargar el auto: ${error.message}`);
  return data as Vehiculo | null;
}
