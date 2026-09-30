import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sitio } from "@/config/site";
import { FormularioLogin } from "@/components/admin/formulario-login";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center font-serif text-4xl font-bold text-tinta">{sitio.nombre}</p>
        <div className="mt-8 rounded-2xl border border-borde bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-tinta">Ingresar</h1>
          <p className="mt-2 text-lg text-texto-suave">Panel de administración de autos.</p>
          <FormularioLogin />
        </div>
        <Link
          href="/"
          className="mt-6 flex min-h-12 items-center justify-center gap-2 text-lg font-semibold text-tinta hover:underline"
        >
          <ArrowLeft className="size-5" aria-hidden /> Volver al sitio
        </Link>
      </div>
    </main>
  );
}
