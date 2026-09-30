import { z } from "zod";
import { COMBUSTIBLES, ESTADOS, MONEDAS, TRANSMISIONES } from "./types";

const anioMaximo = new Date().getFullYear() + 1;

/** Acepta "85.000", "85000" o un número y devuelve solo la parte entera. */
function aEntero(valor: unknown) {
  if (typeof valor === "number") return valor;
  const digitos = String(valor ?? "").replace(/\D/g, "");
  return digitos === "" ? undefined : Number(digitos);
}

export const vehiculoSchema = z.object({
  marca: z.string().trim().min(1, "Ingrese la marca").max(60, "Máximo 60 caracteres"),
  modelo: z.string().trim().min(1, "Ingrese el modelo").max(80, "Máximo 80 caracteres"),
  version: z.string().trim().max(120, "Máximo 120 caracteres"),
  anio: z.preprocess(
    aEntero,
    z
      .number({ error: "Ingrese el año" })
      .int()
      .min(1950, "El año debe ser 1950 o posterior")
      .max(anioMaximo, `El año no puede ser mayor a ${anioMaximo}`),
  ),
  kilometraje: z.preprocess(
    aEntero,
    z
      .number({ error: "Ingrese el kilometraje (0 si es 0 km)" })
      .int()
      .min(0, "El kilometraje no puede ser negativo")
      .max(2_000_000, "Revise el kilometraje"),
  ),
  combustible: z.enum(COMBUSTIBLES, { error: "Elija el combustible" }),
  transmision: z.enum(TRANSMISIONES, { error: "Elija la transmisión" }),
  precio: z.preprocess(
    (v) => aEntero(v) ?? null,
    z.number().int().positive("El precio debe ser mayor a 0").nullable(),
  ),
  moneda: z.enum(MONEDAS, { error: "Elija la moneda" }),
  estado: z.enum(ESTADOS, { error: "Elija el estado" }),
  destacado: z.boolean(),
  descripcion: z.string().trim().max(5000, "Máximo 5000 caracteres"),
});

export type VehiculoFormInput = z.input<typeof vehiculoSchema>;
export type VehiculoFormData = z.output<typeof vehiculoSchema>;

export const imagenesSchema = z.array(z.url()).max(30, "Máximo 30 fotos por auto");
