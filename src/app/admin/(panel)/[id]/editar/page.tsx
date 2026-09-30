import { notFound } from "next/navigation";
import { FormularioVehiculo } from "@/components/admin/formulario-vehiculo";
import { obtenerVehiculo } from "@/lib/vehiculos";

export const metadata = { title: "Editar auto" };

export default async function EditarVehiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const vehiculo = await obtenerVehiculo((await params).id);
  if (!vehiculo) notFound();
  return <FormularioVehiculo vehiculo={vehiculo} />;
}
