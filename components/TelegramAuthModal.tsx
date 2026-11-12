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
  const [demoCodeNotice, setDemoCodeNotice] = useState('');

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

  const handleGetDemoCode = async () => {
    try {
      const res = await fetch('/api/auth/telegram/demo-code', { method: 'POST' });
      const data = await res.json();
      if (data.code) {
        setCode(data.code);
        setDemoCodeNotice(`Сгенерирован код: ${data.code}. Нажмите "Подтвердить код"!`);
      }
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Send className="w-5 h-5 -rotate-12 ml-0.5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 leading-tight">
                {t.auth.title}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {t.auth.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 font-black text-sm p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-slate-900 text-lg">{t.auth.successTitle}</h4>
            <p className="text-xs text-slate-500">
              {t.auth.successDesc}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Open Bot */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="font-extrabold text-xs text-blue-950">
                  {t.auth.step1Title}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {t.auth.step1Desc}
              </p>
              <a
                href="https://t.me/boshlaupbot?start=auth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95"
              >
                <Bot className="w-4 h-4" />
                <span>{t.auth.openBotBtn}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Step 2: Enter 6-digit Code */}
            <form onSubmit={handleVerify} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {t.auth.step2Title}
                  </span>
                </div>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  className="w-full pl-10 pr-4 py-3 text-base font-mono font-bold tracking-widest text-center bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {demoCodeNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  {demoCodeNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{loading ? t.auth.verifying : t.auth.submitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Test Helper for Instant Demo */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Нет доступа к Telegram прямо сейчас?</span>
              <button
                type="button"
                onClick={handleGetDemoCode}
                className="font-bold text-[#FF5A1F] hover:underline"
              >
                Тестовый код
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
