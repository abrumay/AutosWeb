/**
 * Dirección pública del sitio, necesaria para las vistas previas al compartir
 * (WhatsApp, Facebook). En Vercel se toma sola; NEXT_PUBLIC_SITE_URL permite fijarla.
 */
export function urlSitio() {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicita) return explicita.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/**
 * Versión liviana de una foto (1200px, JPEG/WebP según quien la pida),
 * servida por el optimizador de imágenes de Next. WhatsApp no muestra
 * vistas previas de imágenes muy pesadas.
 */
export function urlFotoParaCompartir(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=75`;
}
