'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // para redirigir
import styles from "./HomePage.module.css";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true, // 🔒 obliga a tener sesión
    onUnauthenticated() {
      // Si no hay sesión, redirige al login
      // router.push("/login");
    },
  });

  if (status === "loading") return <p>Cargando...</p>;

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div>
          <h1>Bienvenido a Copcity. DASHBOARD</h1>
          <p>Encuentra todo lo semejante a tecnología con nosotros</p>
          <button>Nuestros Productos</button>
        </div>
        <img src="/" alt="Product" />
      </section>

      <section className={styles.products}>
        <div className={styles.card}>Horizon Gaze Sunglasses - $50.00</div>
        <div className={styles.card}>Sunbeam Tote - $99.00</div>
        <div className={styles.card}>Shadow Stride Shoes - $120.00</div>
        <div className={styles.card}>Zebra Blend T-Shirt - $45.00</div>
      </section>
    </div>
  );
}
