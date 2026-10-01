"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WhatsAppIcon } from "@/components/icons";

/**
 * En el celular abre el menú de compartir del teléfono (WhatsApp, mensajes, etc.).
 * En la computadora muestra dos opciones simples: WhatsApp o copiar el enlace.
 */
export function Compartir({ titulo, className }: { titulo: string; className?: string }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [url, setUrl] = useState("");
  const texto = `Mirá este auto: ${titulo}`;

  const compartir = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      } catch (e) {
        // Si la persona cerró el menú no hacemos nada; ante otro error, mostramos las opciones.
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    setUrl(url);
    setCopiado(false);
    setAbierto(true);
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" size="lg" className={className} onClick={compartir}>
        <Share2 aria-hidden /> Compartir este auto
      </Button>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent>
          <DialogTitle>Compartir este auto</DialogTitle>
          <DialogDescription>Envíele el enlace a un familiar o amigo.</DialogDescription>
          <div className="mt-6 space-y-3">
            <Button asChild variant="whatsapp" size="lg" className="w-full">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAbierto(false)}
              >
                <WhatsAppIcon /> Enviar por WhatsApp
              </a>
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full" onClick={copiar}>
              {copiado ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copiado ? "¡Enlace copiado!" : "Copiar enlace"}
            </Button>
            <p className="sr-only" role="status">
              {copiado ? "Enlace copiado" : ""}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
