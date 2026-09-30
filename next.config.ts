import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

// Permite que next/image optimice las fotos guardadas en Supabase Storage.
const patrones: RemotePattern[] = [
  { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
];

try {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  patrones.push({
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname: "/storage/v1/object/public/**",
  });
} catch {
  // Sin URL configurada: se usa solo el patrón genérico de supabase.co
}

const nextConfig: NextConfig = {
  images: { remotePatterns: patrones },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
