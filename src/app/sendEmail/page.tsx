'use client';

import { useSession } from "next-auth/react";
import SendEmailForm from "../components/formSendEmail/formSendEmail";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/login";
    },
  });

  if (status === "loading") return <p>Cargando...</p>;

  return (
    <div>
      <h1>Bienvenido {session?.user?.name}</h1>
      <SendEmailForm />
    </div>
  );
}