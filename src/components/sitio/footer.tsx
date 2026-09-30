import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { direccionCompleta, mapaEmbedUrl, sitio } from "@/config/site";
import { whatsappUrl } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-20 bg-tinta text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-serif text-3xl font-bold">{sitio.nombre}</p>
          <p className="mt-3 text-lg text-white/85">{sitio.descripcion}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#e6d3a8]">Contacto</h2>
            <ul className="mt-4 space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-6 shrink-0 text-[#e6d3a8]" aria-hidden />
                {direccionCompleta}
              </li>
              <li>
                <a href={`tel:${sitio.telefonoLink}`} className="flex items-center gap-3 hover:underline">
                  <Phone className="size-6 shrink-0 text-[#e6d3a8]" aria-hidden />
                  {sitio.telefono}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl("Hola! Quería hacer una consulta.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:underline"
                >
                  <WhatsAppIcon className="size-6 shrink-0 text-[#e6d3a8]" />
                  Escribinos por WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${sitio.email}`} className="flex items-center gap-3 break-all hover:underline">
                  <Mail className="size-6 shrink-0 text-[#e6d3a8]" aria-hidden />
                  {sitio.email}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#e6d3a8]">
              <Clock className="size-6" aria-hidden />
              Horarios de atención
            </h2>
            <dl className="mt-4 space-y-2 text-lg">
              {sitio.horarios.map((h) => (
                <div key={h.dias} className="flex flex-wrap justify-between gap-x-4 border-b border-white/15 pb-2">
                  <dt>{h.dias}</dt>
                  <dd className="font-semibold">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
          <iframe
            title={`Mapa: ${direccionCompleta}`}
            src={mapaEmbedUrl}
            className="h-80 w-full lg:h-full lg:min-h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-base text-white/70 sm:px-6">
          <p>
            © {new Date().getFullYear()} {sitio.nombre}. Todos los derechos reservados.
          </p>
          <Link href="/admin" className="text-white/50 hover:text-white hover:underline">
            Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
