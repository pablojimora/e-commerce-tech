"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MiButton } from '@/app/components/MiButton/MiButton';
import { createUser } from '@/services/users';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError('Email and password required');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    const res = await createUser({ name, email, password });
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-slate-800 p-6 rounded-xl text-white">
        <h2 className="text-2xl mb-4">{t('register.title') || 'Create account'}</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <label className="block mb-2">{t('register.name')}</label>
        <input className="w-full mb-3 p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="block mb-2">{t('register.email')}</label>
        <input className="w-full mb-3 p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2">{t('register.password')}</label>
        <input type="password" className="w-full mb-3 p-2 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label className="block mb-2">{t('register.confirm')}</label>
        <input type="password" className="w-full mb-4 p-2 rounded" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <MiButton type="submit" text={t('register.create')} loading={loading} />
      </form>
    </div>
  );
}
