"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HeaderSession() {
  const { data: session } = useSession();

  return (
    <div style={{ marginLeft: "auto" }}>
      {session ? (
        <button onClick={() => signOut({ callbackUrl: "/login" })}>
          Cerrar sesión
        </button>
      ) : (
        <Link href="/login">Iniciar sesión</Link>
      )}
    </div>
  );
}
