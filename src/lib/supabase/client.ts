import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Next.js reemplaza estas variables en tiempo de compilación.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
