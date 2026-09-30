"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImagePlus, Save, Star, Trash2, Upload } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label, MensajeError, Select, Textarea } from "@/components/ui/input";
import { guardarVehiculo } from "@/app/admin/actions";
import { BUCKET_FOTOS } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { comprimirImagen, extensionDe } from "@/lib/imagenes";
import { COMBUSTIBLES, ESTADOS, MONEDAS, TRANSMISIONES, type Vehiculo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { vehiculoSchema, type VehiculoFormData, type VehiculoFormInput } from "@/lib/validations";

const MAX_FOTOS = 30;
const MAX_MB = 15;

/** Una foto ya guardada (solo url) o una nueva pendiente de subir (con archivo). */
type Foto = { clave: string; url: string; archivo?: File };

type Feedback = { tipo: "exito" | "error"; texto: string } | null;

export function FormularioVehiculo({ vehiculo }: { vehiculo?: Vehiculo }) {
  const router = useRouter();
  const esEdicion = !!vehiculo;
  const inputFotos = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<Foto[]>(() =>
    (vehiculo?.imagenes ?? []).map((url) => ({ clave: url, url })),
  );
  const [eliminadas, setEliminadas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [progreso, setProgreso] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehiculoFormInput, unknown, VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      marca: vehiculo?.marca ?? "",
      modelo: vehiculo?.modelo ?? "",
      version: vehiculo?.version ?? "",
      anio: vehiculo?.anio?.toString() ?? "",
      kilometraje: vehiculo?.kilometraje?.toString() ?? "",
      combustible: vehiculo?.combustible ?? ("" as never),
      transmision: vehiculo?.transmision ?? ("" as never),
      precio: vehiculo?.precio?.toString() ?? "",
      moneda: vehiculo?.moneda ?? "USD",
      estado: vehiculo?.estado ?? "Disponible",
      destacado: vehiculo?.destacado ?? false,
      descripcion: vehiculo?.descripcion ?? "",
    },
  });

  // Libera las previsualizaciones locales al salir.
  const fotosRef = useRef(fotos);
  useEffect(() => {
    fotosRef.current = fotos;
  }, [fotos]);
  useEffect(
    () => () => fotosRef.current.forEach((f) => f.archivo && URL.revokeObjectURL(f.url)),
    [],
  );

  const agregarArchivos = (lista: FileList | null) => {
    if (!lista) return;
    const archivos = Array.from(lista);
    const imagenes = archivos.filter((a) => a.type.startsWith("image/") && a.size <= MAX_MB * 1024 * 1024);
    const lugar = MAX_FOTOS - fotos.length;
    const aceptadas = imagenes.slice(0, Math.max(0, lugar));

    if (aceptadas.length < archivos.length) {
      setFeedback({
        tipo: "error",
        texto:
          aceptadas.length < imagenes.length
            ? `Se pueden cargar hasta ${MAX_FOTOS} fotos por auto.`
            : `Algunos archivos no se agregaron: solo se aceptan fotos de hasta ${MAX_MB} MB.`,
      });
    }
    setFotos((prev) => [
      ...prev,
      ...aceptadas.map((archivo) => ({
        clave: crypto.randomUUID(),
        url: URL.createObjectURL(archivo),
        archivo,
      })),
    ]);
    if (inputFotos.current) inputFotos.current.value = "";
  };

  const quitarFoto = (foto: Foto) => {
    setFotos((prev) => prev.filter((f) => f.clave !== foto.clave));
    if (foto.archivo) URL.revokeObjectURL(foto.url);
    else setEliminadas((prev) => [...prev, foto.url]);
  };

  const hacerPrincipal = (foto: Foto) =>
    setFotos((prev) => [foto, ...prev.filter((f) => f.clave !== foto.clave)]);

  const onSubmit = async (datos: VehiculoFormData) => {
    setFeedback(null);
    const supabase = createClient();
    const nuevas = fotos.filter((f) => f.archivo);
    const subidas = new Map<string, { url: string; ruta: string }>();

    const deshacerSubidas = async () => {
      if (subidas.size > 0) {
        await supabase.storage.from(BUCKET_FOTOS).remove([...subidas.values()].map((s) => s.ruta));
      }
    };

    // 1) Subir las fotos nuevas a Supabase Storage.
    try {
      for (const [i, foto] of nuevas.entries()) {
        setProgreso(`Subiendo fotos: ${i + 1} de ${nuevas.length}...`);
        const blob = await comprimirImagen(foto.archivo!);
        const ruta = `vehiculos/${crypto.randomUUID()}.${extensionDe(blob.type)}`;
        const { error } = await supabase.storage
          .from(BUCKET_FOTOS)
          .upload(ruta, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET_FOTOS).getPublicUrl(ruta);
        subidas.set(foto.clave, { url: data.publicUrl, ruta });
      }
    } catch (e) {
      await deshacerSubidas();
      setProgreso(null);
      setFeedback({
        tipo: "error",
        texto: `Error al subir fotos. Revise su conexión e intente nuevamente.${
          e instanceof Error && e.message ? ` (${e.message})` : ""
        }`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2) Guardar los datos del auto.
    setProgreso("Guardando el auto...");
    const urls = fotos.map((f) => subidas.get(f.clave)?.url ?? f.url);
    const r = await guardarVehiculo(vehiculo?.id ?? null, datos, urls, eliminadas);

    if (!r.ok) {
      await deshacerSubidas();
      setProgreso(null);
      setFeedback({ tipo: "error", texto: r.error });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFeedback({ tipo: "exito", texto: "Auto guardado con éxito." });
    router.push(`/admin?mensaje=${esEdicion ? "guardado" : "creado"}`);
  };

  const onInvalido = () => {
    setFeedback({ tipo: "error", texto: "Faltan datos o hay datos incorrectos. Revise los campos marcados en rojo." });
  };

  const ocupado = isSubmitting || !!progreso;

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalido)} noValidate className="space-y-8">
      <Link
        href="/admin"
        className="inline-flex min-h-12 items-center gap-2 text-lg font-semibold text-tinta hover:underline"
      >
        <ArrowLeft className="size-5" aria-hidden /> Volver al listado
      </Link>

      <h1 className="text-3xl font-bold text-tinta sm:text-4xl">
        {esEdicion ? `Editar ${vehiculo.marca} ${vehiculo.modelo}` : "Cargar auto nuevo"}
      </h1>

      {feedback && (
        <Alert tipo={feedback.tipo} onCerrar={() => setFeedback(null)}>
          {feedback.texto}
        </Alert>
      )}

      {/* Datos principales */}
      <Seccion titulo="Datos del auto">
        <div className="grid gap-6 sm:grid-cols-2">
          <Campo id="marca" etiqueta="Marca" error={errors.marca?.message}>
            <Input id="marca" placeholder="Ej: Toyota" {...register("marca")} {...aria("marca", errors.marca)} />
          </Campo>
          <Campo id="modelo" etiqueta="Modelo" error={errors.modelo?.message}>
            <Input id="modelo" placeholder="Ej: Corolla" {...register("modelo")} {...aria("modelo", errors.modelo)} />
          </Campo>
          <Campo id="version" etiqueta="Versión" opcional error={errors.version?.message}>
            <Input id="version" placeholder="Ej: 1.8 XEi CVT" {...register("version")} {...aria("version", errors.version)} />
          </Campo>
          <Campo id="anio" etiqueta="Año" error={errors.anio?.message}>
            <Input id="anio" inputMode="numeric" placeholder="Ej: 2019" {...register("anio")} {...aria("anio", errors.anio)} />
          </Campo>
          <Campo id="kilometraje" etiqueta="Kilometraje" error={errors.kilometraje?.message}>
            <Input
              id="kilometraje"
              inputMode="numeric"
              placeholder="Ej: 85000"
              {...register("kilometraje")}
              {...aria("kilometraje", errors.kilometraje)}
            />
          </Campo>
          <Campo id="combustible" etiqueta="Combustible" error={errors.combustible?.message}>
            <Select id="combustible" {...register("combustible")} {...aria("combustible", errors.combustible)}>
              <option value="">Elegir...</option>
              {COMBUSTIBLES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Campo>
          <Campo id="transmision" etiqueta="Transmisión" error={errors.transmision?.message}>
            <Select id="transmision" {...register("transmision")} {...aria("transmision", errors.transmision)}>
              <option value="">Elegir...</option>
              {TRANSMISIONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Campo>
          <Campo id="estado" etiqueta="Estado" error={errors.estado?.message}>
            <Select id="estado" {...register("estado")}>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </Campo>
        </div>
      </Seccion>

      <Seccion titulo="Precio">
        <div className="grid gap-6 sm:grid-cols-[1fr_12rem]">
          <Campo id="precio" etiqueta="Precio" opcional ayuda="Si lo deja vacío se mostrará “Consultar precio”." error={errors.precio?.message}>
            <Input id="precio" inputMode="numeric" placeholder="Ej: 18500" {...register("precio")} {...aria("precio", errors.precio)} />
          </Campo>
          <fieldset>
            <legend className="mb-2 text-lg font-semibold">Moneda</legend>
            <div className="grid grid-cols-2 gap-2">
              {MONEDAS.map((m) => (
                <label
                  key={m}
                  className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-borde bg-white text-lg font-semibold has-[:checked]:border-tinta has-[:checked]:bg-tinta has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-dorado"
                >
                  <input type="radio" value={m} className="sr-only" {...register("moneda")} />
                  {m}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Seccion>

      <Seccion titulo="Descripción y publicación">
        <Campo id="descripcion" etiqueta="Descripción" opcional error={errors.descripcion?.message}>
          <Textarea
            id="descripcion"
            placeholder="Ej: Único dueño, service al día en concesionario oficial, cubiertas nuevas..."
            {...register("descripcion")}
          />
        </Campo>
        <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-xl border-2 border-borde bg-white p-4 has-[:checked]:border-dorado has-[:checked]:bg-dorado-claro">
          <input type="checkbox" className="mt-1 size-7 shrink-0 cursor-pointer accent-tinta" {...register("destacado")} />
          <span>
            <span className="flex items-center gap-2 text-lg font-semibold">
              <Star className="size-5 text-dorado" aria-hidden /> Marcar como destacado
            </span>
            <span className="block text-base text-texto-suave">Aparece primero en el catálogo y en la portada.</span>
          </span>
        </label>
      </Seccion>

      {/* Fotos */}
      <Seccion titulo={`Fotos (${fotos.length})`}>
        <p className="text-lg text-texto-suave">
          La <strong className="text-texto">primera foto</strong> es la que se ve en el catálogo. Puede elegir otra con
          el botón “Hacer principal”.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            agregarArchivos(e.dataTransfer.files);
          }}
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-2xl border-3 border-dashed px-6 py-10 text-center transition-colors",
            arrastrando ? "border-tinta bg-arena" : "border-borde bg-white",
          )}
        >
          <ImagePlus className="size-14 text-texto-suave" aria-hidden />
          <p className="mt-3 text-lg">Arrastre las fotos aquí o</p>
          <Button type="button" size="lg" className="mt-3" onClick={() => inputFotos.current?.click()} disabled={ocupado}>
            <Upload aria-hidden /> Elegir fotos
          </Button>
          <input
            ref={inputFotos}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => agregarArchivos(e.target.files)}
          />
        </div>

        {fotos.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((foto, i) => (
              <li key={foto.clave} className="overflow-hidden rounded-2xl border border-borde bg-white">
                <div className="relative aspect-[4/3] bg-arena">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded-lg bg-tinta px-3 py-1 text-base font-semibold text-white">
                      Foto principal
                    </span>
                  )}
                  {foto.archivo && (
                    <span className="absolute right-2 top-2 rounded-lg bg-dorado-claro px-3 py-1 text-base font-semibold text-[#6b5220]">
                      Nueva
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {i !== 0 && (
                    <Button type="button" variant="outline" className="flex-1" onClick={() => hacerPrincipal(foto)} disabled={ocupado}>
                      <Star aria-hidden /> Hacer principal
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-error hover:border-error"
                    onClick={() => quitarFoto(foto)}
                    disabled={ocupado}
                  >
                    <Trash2 aria-hidden /> Quitar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {eliminadas.length > 0 && (
          <p className="mt-4 text-base text-texto-suave">
            Las fotos quitadas se borrarán definitivamente al guardar los cambios.
          </p>
        )}
      </Seccion>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-borde bg-white/95 p-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:justify-end sm:rounded-2xl sm:border">
        {progreso && (
          <p className="text-lg font-semibold text-tinta sm:mr-auto" role="status">
            {progreso}
          </p>
        )}
        <Button asChild variant="outline" size="lg">
          <Link href="/admin">Cancelar</Link>
        </Button>
        <Button type="submit" size="lg" disabled={ocupado}>
          <Save aria-hidden /> {ocupado ? "Guardando..." : esEdicion ? "Guardar cambios" : "Guardar auto"}
        </Button>
      </div>
    </form>
  );
}

function aria(id: string, error?: { message?: string }) {
  return { "aria-invalid": !!error, "aria-describedby": error ? `${id}-error` : undefined };
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-borde bg-white p-5 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-tinta">{titulo}</h2>
      {children}
    </section>
  );
}

function Campo({
  id,
  etiqueta,
  opcional,
  ayuda,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  opcional?: boolean;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {etiqueta} {opcional && <span className="font-normal text-texto-suave">(opcional)</span>}
      </Label>
      {children}
      {ayuda && !error && <p className="mt-2 text-base text-texto-suave">{ayuda}</p>}
      <MensajeError id={`${id}-error`}>{error}</MensajeError>
    </div>
  );
}
