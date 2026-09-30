"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BUCKET_FOTOS } from "@/config/site";
import { createClient } from "@/lib/supabase/server";
import { rutaDesdeUrl } from "@/lib/storage";
import { ESTADOS, type Estado } from "@/lib/types";
import { imagenesSchema, vehiculoSchema } from "@/lib/validations";

export type Resultado = { ok: true; id?: string } | { ok: false; error: string };

async function clienteAutenticado() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Su sesión expiró. Vuelva a ingresar.");
  return supabase;
}

async function borrarFotos(supabase: Awaited<ReturnType<typeof createClient>>, urls: string[]) {
  const rutas = urls.map(rutaDesdeUrl).filter((r): r is string => !!r);
  if (rutas.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET_FOTOS).remove(rutas);
  // No es crítico: el auto ya se guardó; solo quedan archivos sin uso.
  if (error) console.error("No se pudieron borrar fotos:", error.message);
}

function refrescar(id?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (id) revalidatePath(`/autos/${id}`);
}

export async function guardarVehiculo(
  id: string | null,
  datos: unknown,
  imagenes: string[],
  imagenesEliminadas: string[],
): Promise<Resultado> {
  try {
    const supabase = await clienteAutenticado();
    const vehiculo = vehiculoSchema.safeParse(datos);
    if (!vehiculo.success) return { ok: false, error: "Revise los datos del formulario." };
    const fotos = imagenesSchema.safeParse(imagenes);
    if (!fotos.success) return { ok: false, error: "Hay un problema con las fotos." };

    const fila = {
      ...vehiculo.data,
      version: vehiculo.data.version || null,
      descripcion: vehiculo.data.descripcion || null,
      imagenes: fotos.data,
    };

    let guardadoId = id;
    if (id) {
      const { error } = await supabase.from("vehiculos").update(fila).eq("id", id);
      if (error) return { ok: false, error: `No se pudo guardar el auto: ${error.message}` };
    } else {
      const { data, error } = await supabase.from("vehiculos").insert(fila).select("id").single();
      if (error) return { ok: false, error: `No se pudo guardar el auto: ${error.message}` };
      guardadoId = data.id;
    }

    // Solo se borran del almacenamiento las fotos que ya no usa el auto.
    await borrarFotos(
      supabase,
      imagenesEliminadas.filter((u) => !fotos.data.includes(u)),
    );

    refrescar(guardadoId ?? undefined);
    return { ok: true, id: guardadoId ?? undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

export async function cambiarEstado(id: string, estado: Estado): Promise<Resultado> {
  try {
    if (!ESTADOS.includes(estado)) return { ok: false, error: "Estado no válido." };
    const supabase = await clienteAutenticado();
    const { error } = await supabase.from("vehiculos").update({ estado }).eq("id", id);
    if (error) return { ok: false, error: `No se pudo cambiar el estado: ${error.message}` };
    refrescar(id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

export async function eliminarVehiculo(id: string): Promise<Resultado> {
  try {
    const supabase = await clienteAutenticado();
    const { data, error } = await supabase.from("vehiculos").delete().eq("id", id).select("imagenes").maybeSingle();
    if (error) return { ok: false, error: `No se pudo eliminar el auto: ${error.message}` };
    if (!data) return { ok: false, error: "El auto ya no existe." };
    await borrarFotos(supabase, data.imagenes ?? []);
    refrescar(id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Error inesperado." };
  }
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
