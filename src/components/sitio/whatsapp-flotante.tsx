"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { sitio } from "@/config/site";
import { whatsappUrl } from "@/lib/utils";

/**
 * Botón de WhatsApp siempre visible abajo a la derecha.
 * Al tocarlo se elige con quién hablar. En la página de cada auto no se muestra,
 * porque ahí ya están los botones de consulta con el mensaje del auto.
 */
export function WhatsAppFlotante() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const cerrarAfuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    const cerrarConEscape = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", cerrarAfuera);
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.removeEventListener("pointerdown", cerrarAfuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  if (pathname.startsWith("/autos/")) return null;

  return (
    <div
      ref={contenedor}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-6"
    >
      {abierto && (
        <div
          id="menu-whatsapp"
          className="w-72 rounded-2xl border border-borde bg-white p-4 shadow-2xl"
          role="dialog"
          aria-label="Elegir con quién hablar por WhatsApp"
        >
          <p className="text-lg font-semibold text-tinta">¿Con quién quiere hablar?</p>
          <ul className="mt-3 space-y-2">
            {sitio.contactos.map((c) => (
              <li key={c.nombre}>
                <a
                  href={whatsappUrl("Hola! Quería hacer una consulta.", c.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setAbierto(false)}
                  className="flex min-h-14 items-center gap-3 rounded-xl bg-whatsapp px-4 text-lg font-semibold text-white hover:bg-whatsapp-oscuro"
                >
                  <WhatsAppIcon className="size-6 shrink-0" />
                  <span>
                    {c.nombre}
                    <span className="block text-base font-normal text-white/85">{c.telefono}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-whatsapp"
        className="flex min-h-14 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-5 text-lg font-semibold text-white shadow-xl ring-4 ring-white hover:bg-whatsapp-oscuro cursor-pointer"
      >
        {abierto ? <X className="size-7" aria-hidden /> : <WhatsAppIcon className="size-7" />}
        {abierto ? "Cerrar" : "WhatsApp"}
      </button>
    </div>
  );
}
