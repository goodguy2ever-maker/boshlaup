'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  KeyRound,
  Bot
} from 'lucide-react';

export default function TelegramAuthModal() {
  const { t, authModalOpen, setAuthModalOpen, loginWithTelegram } = useApp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code || code.trim().length !== 6) {
      setError(t.auth.enterValidCode);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/telegram/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.auth.checkError);
      }

      setSuccess(true);
      setTimeout(() => {
        loginWithTelegram(data.user);
      }, 900);
    } catch (err: any) {
      setError(err.message || t.auth.checkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Send className="w-4 h-4 -rotate-12" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950 leading-tight">
                {t.auth.title}
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                {t.auth.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-zinc-400 hover:text-zinc-700 font-bold text-sm p-1 rounded"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-950 text-base">{t.auth.successTitle}</h4>
            <p className="text-xs text-zinc-500">
              {t.auth.successDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step 1: Open Bot */}
            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-bold text-xs text-zinc-900">
                  {t.auth.step1Title}
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                {t.auth.step1Desc}
              </p>
              <a
                href="https://t.me/boshlaupbot?start=auth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>{t.auth.openBotBtn}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>

            {/* Step 2: Enter 6-digit Code */}
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-xs text-zinc-900">
                    {t.auth.step2Title}
                  </span>
                </div>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  placeholder={t.auth.codePlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-base font-mono font-bold tracking-widest text-center bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] focus:border-[#FF5A1F] transition-all text-zinc-950"
                />
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>{loading ? t.auth.verifying : t.auth.submitBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
