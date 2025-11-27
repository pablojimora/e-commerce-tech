"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart } from '@/services/cart';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';

export function HeaderCart() {
  const [count, setCount] = useState<number | null>(null);
  const { t } = useLanguage();
  const { data: session, status } = useSession();

  const load = async () => {
    if (status === 'loading') {
      return; // No hacer nada mientras se carga la sesión
    }
    if (status !== 'authenticated') {
      setCount(0);
      return;
    }
    const res = await getCart();
    if (res?.data) setCount(res.data.length);
    else setCount(0);
  };

  useEffect(() => {
    // Solo cargar si no está en loading
    if (status !== 'loading') {
      load();
    }
    const interval = setInterval(() => {
      if (status === 'authenticated') {
        load();
      }
    }, 10000);
    const onUpdate = () => {
      if (status === 'authenticated') {
        load();
      }
    };
    window.addEventListener('cart-updated', onUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('cart-updated', onUpdate);
    };
  }, [status]);

  return (
    <Link href="/cart" className="flex items-center gap-2">
      <span>🛒</span>
      <span className="text-sm">{t('cart.title') || 'Cart'}</span>
      {count !== null && <span className="ml-1 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">{count}</span>}
    </Link>
  );
}

export default HeaderCart;
