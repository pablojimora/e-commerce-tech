"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; 

import styles from "./SidebarMenu.module.css";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SidebarMenu() {
  const [open, setOpen] = useState(false);
  const {t} = useLanguage();


  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className={styles.menuButton}
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Fondo semitransparente cuando el menú está abierto */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      {/* Menú lateral */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <nav className={styles.nav}>
          <Link href="/dashboard/products" onClick={() => setOpen(false)}>
            {t('sidebarMenu.products')}
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            {t('sidebarMenu.dashboard')}
          </Link>
          <Link href="/sendEmail" onClick={() => setOpen(false)}>
            {t('sidebarMenu.sendEmail')}
          </Link>
        </nav>
      </aside>
    </>
  );
}
