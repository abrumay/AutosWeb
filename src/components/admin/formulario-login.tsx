"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label, MensajeError } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Ingrese su correo").email("El correo no es válido"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

type LoginData = z.infer<typeof loginSchema>;

export function FormularioLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [verPassword, setVerPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (datos: LoginData) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(datos);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "El correo o la contraseña no son correctos."
          : "No se pudo ingresar. Intente nuevamente.",
      );
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      {error && <Alert tipo="error">{error}</Alert>}

      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          {...register("email")}
        />
        <MensajeError id="email-error">{errors.email?.message}</MensajeError>
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={verPassword ? "text" : "password"}
            autoComplete="current-password"
            className="pr-16"
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setVerPassword((v) => !v)}
            className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-lg text-texto-suave hover:bg-arena cursor-pointer"
            aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {verPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
          </button>
        </div>
        <MensajeError id="password-error">{errors.password?.message}</MensajeError>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        <LogIn aria-hidden /> {isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
