import { BUCKET_FOTOS } from "@/config/site";

/** Obtiene la ruta interna del archivo a partir de su URL pública. */
export function rutaDesdeUrl(url: string) {
  const marca = `/storage/v1/object/public/${BUCKET_FOTOS}/`;
  const i = url.indexOf(marca);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length).split("?")[0]);
}
