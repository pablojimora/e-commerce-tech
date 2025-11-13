"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MiButton } from "../components/MiButton/MyButton";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result?.error) setError(result.error);
    else router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6">
      <div className="w-full max-w-lg flex flex-col gap-8">
        {/* Título */}
        <h1 className="text-center text-3xl font-semibold text-gray-900 tracking-tight">
          Iniciar Sesión
        </h1>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>

          {/* Botón de inicio de sesión */}
          <MiButton
            type="submit"
            variant="primary"
            text="Iniciar sesión"
            loading={loading}
            leftIcon={<LogIn size={18} />}
          />
        </form>

        {/* Separador */}
        <div className="text-center text-gray-500 text-sm font-medium">o</div>

        {/* Login con Google */}
        <MiButton
          variant="danger"
          text="Login con Google"
          onClick={handleGoogleLogin}
        />

        {error && (
          <p className="text-red-600 text-center text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
