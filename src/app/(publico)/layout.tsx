import { Header } from "@/components/sitio/header";
import { Footer } from "@/components/sitio/footer";
import { WhatsAppFlotante } from "@/components/sitio/whatsapp-flotante";

export default function PublicoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFlotante />
    </>
  );
}
