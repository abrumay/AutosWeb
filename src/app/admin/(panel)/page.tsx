import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListadoVehiculos } from "@/components/admin/listado-vehiculos";
import { createClient } from "@/lib/supabase/server";
import type { Vehiculo } from "@/lib/types";

export const dynamic = "force-dynamic";

const MENSAJES: Record<string, string> = {
  guardado: "Auto guardado con éxito.",
  creado: "Auto publicado con éxito.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ mensaje?: string }>;
}) {
  const { mensaje } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("vehiculos").select("*").order("created_at", { ascending: false });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tinta sm:text-4xl">Mis autos</h1>
          <p className="mt-1 text-lg text-texto-suave">Cargue, edite o cambie el estado de los autos publicados.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/nuevo">
            <Plus aria-hidden /> Cargar auto nuevo
          </Link>
        </Button>
      </div>

      <ListadoVehiculos
        vehiculos={(data ?? []) as Vehiculo[]}
        mensajeInicial={mensaje ? MENSAJES[mensaje] : undefined}
        errorCarga={error ? `No se pudieron cargar los autos: ${error.message}` : undefined}
      />
    </>
  );
}
