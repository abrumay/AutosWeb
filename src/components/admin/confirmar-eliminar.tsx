"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { eliminarVehiculo } from "@/app/admin/actions";
import { tituloVehiculo } from "@/lib/utils";
import type { Vehiculo } from "@/lib/types";

interface Props {
  vehiculo: Vehiculo;
  children: React.ReactNode;
  onResultado: (feedback: { tipo: "exito" | "error"; texto: string }) => void;
}

export function ConfirmarEliminar({ vehiculo, children, onResultado }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const nombre = `${tituloVehiculo(vehiculo)} ${vehiculo.anio}`;

  const confirmar = () =>
    startTransition(async () => {
      const r = await eliminarVehiculo(vehiculo.id);
      setAbierto(false);
      onResultado(r.ok ? { tipo: "exito", texto: `Se eliminó el ${nombre}.` } : { tipo: "error", texto: r.error });
    });

  return (
    <Dialog open={abierto} onOpenChange={(v) => !pendiente && setAbierto(v)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>¿Eliminar este auto?</DialogTitle>
        <DialogDescription>
          Va a eliminar el <strong className="text-texto">{nombre}</strong> y todas sus fotos. Esta acción no se puede
          deshacer.
        </DialogDescription>
        <p className="mt-3 text-lg text-texto-suave">
          Si solo se vendió, puede cambiar su estado a <strong>Vendido</strong> en lugar de eliminarlo.
        </p>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="lg" disabled={pendiente}>
              No, cancelar
            </Button>
          </DialogClose>
          <Button variant="danger" size="lg" onClick={confirmar} disabled={pendiente}>
            <Trash2 aria-hidden /> {pendiente ? "Eliminando..." : "Sí, eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
