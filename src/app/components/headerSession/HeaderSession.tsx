"use client";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from '@/contexts/LanguageContext';
import Link from "next/link";

export default function HeaderSession() {
  const { data: session } = useSession();

  const {t} = useLanguage();

  return (
    <div className="ml-auto flex items-center">
      {session ? (
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="block px-6 py-4 bg-[#111] text-white rounded-lg border border-transparent font-semibold text-center transition-all duration-300 ease-in-out hover:bg-white hover:text-[#111] hover:border-[#111] hover:translate-x-1"
        >
          {t('headerSession.logout')}
        </button>
      ) : (
        <Link
          href="/login"
          className="block px-6 py-4 bg-[#111] text-white rounded-lg border border-transparent font-semibold text-center transition-all duration-300 ease-in-out hover:bg-white hover:text-[#111] hover:border-[#111] hover:translate-x-1"
        >
          {t('headerSession.login')}
        </Link>
      )}
    </div>
  );
}
