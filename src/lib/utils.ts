import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sitio } from "@/config/site";
import type { Moneda, Vehiculo } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearPrecio(precio: number | null, moneda: Moneda) {
  if (precio == null) return "Consultar precio";
  const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(precio);
  return moneda === "USD" ? `US$ ${numero}` : `$ ${numero}`;
}

export function formatearKm(km: number) {
  return `${new Intl.NumberFormat("es-AR").format(km)} km`;
}

export function tituloVehiculo(v: Pick<Vehiculo, "marca" | "modelo">) {
  return `${v.marca} ${v.modelo}`;
}

export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${sitio.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export function whatsappVehiculoUrl(v: Pick<Vehiculo, "marca" | "modelo" | "anio">) {
  return whatsappUrl(`Hola! Me interesa el auto ${v.marca} ${v.modelo} ${v.anio} publicado en su web`);
}
