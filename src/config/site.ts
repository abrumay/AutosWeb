/**
 * Datos de contacto de la concesionaria.
 * Editá estos valores para que se reflejen en todo el sitio.
 */
export const sitio = {
  nombre: "Edison 1632",
  descripcion:
    "Concesionaria de autos usados seleccionados. Atención personalizada, papeles al día y la tranquilidad de comprar con confianza.",
  direccion: "Edison 1632",
  localidad: "Buenos Aires, Argentina",
  /** Teléfono tal como se muestra en pantalla. */
  telefono: "011 1234-5678",
  /** Teléfono para el enlace "tel:" (solo dígitos, con código de país). */
  telefonoLink: "+541112345678",
  /** Número de WhatsApp en formato internacional, solo dígitos (ej: 5491112345678). */
  whatsapp: "5491112345678",
  email: "contacto@edison1632.com.ar",
  horarios: [
    { dias: "Lunes a Viernes", horas: "9:00 a 18:00 hs" },
    { dias: "Sábados", horas: "9:00 a 13:00 hs" },
    { dias: "Domingos y feriados", horas: "Cerrado" },
  ],
} as const;

export const direccionCompleta = `${sitio.direccion}, ${sitio.localidad}`;

/** Mapa embebido de Google Maps (no requiere API key). */
export const mapaEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
export const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`;

export const BUCKET_FOTOS = "vehiculos-fotos";
