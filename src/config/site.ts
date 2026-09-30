/**
 * Datos de contacto de la concesionaria.
 * Editá estos valores para que se reflejen en todo el sitio.
 */
export const sitio = {
  nombre: "Edison 1632",
  rubro: "Automotores",
  descripcion:
    "Concesionaria de autos usados seleccionados. Atención personalizada, papeles al día y la tranquilidad de comprar con confianza.",
  direccion: "Edison 1632",
  localidad: "Mar del Plata, Buenos Aires",
  /**
   * Personas de contacto. El primero es el contacto principal
   * (botón de WhatsApp del encabezado).
   * - telefono: como se muestra en pantalla.
   * - telefonoLink: para el enlace "tel:" (con código de país).
   * - whatsapp: formato internacional, solo dígitos (54 9 + característica + número).
   */
  contactos: [
    { nombre: "Osvaldo", telefono: "223 447-8207", telefonoLink: "+542234478207", whatsapp: "5492234478207" },
    { nombre: "Franco", telefono: "223 656-8466", telefonoLink: "+542236568466", whatsapp: "5492236568466" },
  ],
  horarios: [
    { dias: "Lunes a Viernes", horas: "9:00 a 18:00 hs" },
    { dias: "Sábados", horas: "9:00 a 13:00 hs" },
    { dias: "Domingos y feriados", horas: "Cerrado" },
  ],
} as const;

export const direccionCompleta = `${sitio.direccion}, ${sitio.localidad}, Argentina`;

export type Contacto = (typeof sitio.contactos)[number];
export const contactoPrincipal: Contacto = sitio.contactos[0];

/** Mapa embebido de Google Maps (no requiere API key). */
export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
export const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;

export const BUCKET_FOTOS = "vehiculos-fotos";
