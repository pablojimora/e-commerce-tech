
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./Layout.module.css";
import Providers from "./Providers";
import HeaderSession from "./components/headerSession/HeaderSession";
import SidebarMenu from "./components/sidebarmenu/SideBarMenu";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./components/languageSwitcher/LanguageSwitcher";
import HeaderCart from "./components/cart/HeaderCart";
import { ToastContainer } from "react-toastify";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Next Store",
  description: "Encuentra tecnología moderna en un clic",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={styles.container}>
        <LanguageProvider>
        <Providers>
          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.leftSection}>
              <SidebarMenu />
              <div className={styles.logo}>Copcity</div>
            </div>

            <div className={styles.search}>
              <LanguageSwitcher />
            </div>

            <div className={styles.rightSection}>
              <div className="mr-3">
                <HeaderCart />
              </div>
              <HeaderSession />
            </div>
          </header>

          <main className={styles.main}>{children}</main>
          <ToastContainer />

          {/* FOOTER (sin cambios) */}
          <footer className={styles.footer}>
            <div className={styles.footerTop}>
              <p>© 2025 YNS Demo. All rights reserved.</p>
              <div className={styles.social}>
                <span>🌐</span>
                <span>📸</span>
                <span>💼</span>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <nav>
                <a href="/">Accessories</a>
                <a href="/">Celulares</a>
                <a href="/">Tecnología</a>
              </nav>
              <div className={styles.subscribe}>
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </footer>
        </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
} 