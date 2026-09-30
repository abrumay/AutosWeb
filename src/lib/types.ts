export const COMBUSTIBLES = ["Nafta", "Diésel", "GNC", "Híbrido"] as const;
export const TRANSMISIONES = ["Manual", "Automática"] as const;
export const MONEDAS = ["USD", "ARS"] as const;
export const ESTADOS = ["Disponible", "Reservado", "Vendido"] as const;

export type Combustible = (typeof COMBUSTIBLES)[number];
export type Transmision = (typeof TRANSMISIONES)[number];
export type Moneda = (typeof MONEDAS)[number];
export type Estado = (typeof ESTADOS)[number];

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string;
  version: string | null;
  anio: number;
  kilometraje: number;
  combustible: Combustible;
  transmision: Transmision;
  precio: number | null;
  moneda: Moneda;
  estado: Estado;
  destacado: boolean;
  descripcion: string | null;
  imagenes: string[];
  created_at: string;
}
