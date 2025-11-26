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
          className="px-4 py-2 bg-black text-white rounded-md font-medium hover:bg-white hover:text-black border border-black transition-colors duration-200"
        >
          {t('headerSession.logout')}
        </button>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 text-black font-medium rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          {t('headerSession.login')}
        </Link>
      )}
    </div>
  );
}
