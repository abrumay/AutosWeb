import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sitio } from "@/config/site";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Doble control además del middleware.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-borde bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/admin" className="leading-tight">
            <span className="block font-serif text-2xl font-bold text-tinta sm:text-3xl">{sitio.nombre}</span>
            <span className="text-base text-texto-suave">Administración</span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <ExternalLink aria-hidden /> Ver sitio
              </Link>
            </Button>
            <form action={cerrarSesion}>
              <Button type="submit" variant="ghost">
                <LogOut aria-hidden /> Salir
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
