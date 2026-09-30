import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { Logo } from "./logo";
import { mapaUrl, sitio } from "@/config/site";
import { whatsappUrl } from "@/lib/utils";

export function Header() {
  return (
    <header className="border-b border-borde bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-4 sm:px-6">
        <Link href="/" aria-label={`${sitio.nombre} ${sitio.rubro} - Inicio`}>
          <Logo priority className="h-16 sm:h-20" />
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={mapaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 text-lg text-texto hover:text-tinta md:flex"
          >
            <MapPin className="size-6 text-dorado" aria-hidden />
            <span>
              {sitio.direccion}, {sitio.localidad.split(",")[0]}
            </span>
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Teléfonos">
            {sitio.contactos.map((c) => (
              <li key={c.nombre}>
                <a
                  href={`tel:${c.telefonoLink}`}
                  className="flex items-center gap-2 text-lg text-tinta hover:underline"
                >
                  <Phone className="size-5 text-dorado" aria-hidden />
                  <span>
                    <span className="font-semibold">{c.telefono}</span> ({c.nombre})
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Button asChild variant="whatsapp" size="md">
            <a href={whatsappUrl("Hola! Quería hacer una consulta.")} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
      <a
        href={mapaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-t border-borde bg-arena px-4 py-2 text-base text-texto md:hidden"
      >
        <MapPin className="size-5 text-dorado" aria-hidden />
        {sitio.direccion}, {sitio.localidad}
      </a>
    </header>
  );
}
