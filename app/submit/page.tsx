'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { FEATURES } from '@/lib/config';
import {
  Rocket,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Tag,
  MapPin,
  Globe,
  Sparkles,
  HelpCircle,
  Gift,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronUp,
  MessageCircle,
  Eye,
  Upload,
  X,
  Image as ImageIcon,
  Bot,
  CreditCard,
  GraduationCap,
  ShoppingBag,
  Cloud,
  Sprout,
  Dna,
  Gamepad2,
  Users,
  Building2,
  Truck,
  Briefcase,
  Lightbulb,
  Hammer,
  TrendingUp,
  UserCheck,
  Phone,
  Send,
  Loader2
} from 'lucide-react';

import { Language } from '@/lib/i18n';
import { localizeRegion, localizeStage } from '@/lib/localize';

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case 'Bot': return <Bot className={className} />;
    case 'CreditCard': return <CreditCard className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Cloud': return <Cloud className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Dna': return <Dna className={className} />;
    case 'Gamepad2': return <Gamepad2 className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    default: return <Sparkles className={className} />;
  }
}

function detectContactType(contact: string) {
  const trimmed = contact.trim();
  if (!trimmed) return null;
  const cleanDigits = trimmed.replace(/[\s\-\(\)]/g, '');
  if (trimmed.startsWith('+') || /^\d{7,15}$/.test(cleanDigits)) {
    return { label: 'Телефон', icon: Phone, color: 'text-amber-700 bg-amber-50 border-amber-200' };
  }
  if (trimmed.toLowerCase().includes('bot')) {
    return { label: 'Telegram-бот', icon: Bot, color: 'text-blue-700 bg-blue-50 border-blue-200' };
  }
  if (trimmed.startsWith('t.me/') || trimmed.startsWith('https://t.me/')) {
    return { label: 'Telegram-ссылка', icon: Globe, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
  }
  if (trimmed.startsWith('@') || /^[a-zA-Z0-9_]{3,}$/.test(trimmed)) {
    return { label: 'Telegram @ник', icon: MessageCircle, color: 'text-[#FF5A1F] bg-orange-50 border-orange-200' };
  }
  return { label: 'Контакт', icon: MessageCircle, color: 'text-slate-700 bg-slate-50 border-slate-200' };
}

export default function SubmitStartupWizard() {
  const router = useRouter();
  const { t, lang, user, setAuthModalOpen } = useApp();

  const REGION_OPTIONS = [
    { value: 'Ташкент', label: localizeRegion('Ташкент', lang) },
    { value: 'Самарканд', label: localizeRegion('Самарканд', lang) },
    { value: 'Бухара', label: localizeRegion('Бухара', lang) },
    { value: 'Фергана', label: localizeRegion('Фергана', lang) },
    { value: 'Андижан', label: localizeRegion('Андижан', lang) },
    { value: 'Наманган', label: localizeRegion('Наманган', lang) },
    { value: 'Узбекистан', label: localizeRegion('Весь Узбекистан', lang) },
    { value: 'Global', label: localizeRegion('Global', lang) },
  ];

  const CATEGORY_CARDS = [
    { value: 'AI', label: t.wizard.categories.ai.label, iconName: 'Bot', desc: t.wizard.categories.ai.desc },
    { value: 'FinTech', label: t.wizard.categories.fintech.label, iconName: 'CreditCard', desc: t.wizard.categories.fintech.desc },
    { value: 'EdTech', label: t.wizard.categories.edtech.label, iconName: 'GraduationCap', desc: t.wizard.categories.edtech.desc },
    { value: 'E-commerce', label: t.wizard.categories.ecommerce.label, iconName: 'ShoppingBag', desc: t.wizard.categories.ecommerce.desc },
    { value: 'SaaS', label: t.wizard.categories.saas.label, iconName: 'Cloud', desc: t.wizard.categories.saas.desc },
    { value: 'PropTech', label: (t.wizard.categories as any).proptech?.label || 'PropTech & Стройка', iconName: 'Building2', desc: (t.wizard.categories as any).proptech?.desc || 'Недвижимость, стройка, аренда' },
    { value: 'Логистика', label: (t.wizard.categories as any).logistics?.label || 'Логистика & Авто', iconName: 'Truck', desc: (t.wizard.categories as any).logistics?.desc || 'Доставка, склады, авто' },
    { value: 'AgriTech', label: t.wizard.categories.agritech.label, iconName: 'Sprout', desc: t.wizard.categories.agritech.desc },
    { value: 'HealthTech', label: t.wizard.categories.health.label, iconName: 'Dna', desc: t.wizard.categories.health.desc },
    { value: 'Услуги', label: (t.wizard.categories as any).services?.label || 'Услуги & Сервисы', iconName: 'Briefcase', desc: (t.wizard.categories as any).services?.desc || 'Бытовые услуги, b2c' },
    { value: 'Игры', label: t.wizard.categories.games.label, iconName: 'Gamepad2', desc: t.wizard.categories.games.desc },
    { value: 'Социальные', label: t.wizard.categories.social.label, iconName: 'Users', desc: t.wizard.categories.social.desc },
    { value: 'Другое', label: (t.wizard.categories as any).other?.label || 'Другое / Своя сфера', iconName: 'Sparkles', desc: (t.wizard.categories as any).other?.desc || 'Указать своё направление' },
  ];

  const STAGE_CARDS = [
    { value: 'Только идея', label: t.wizard.stages.idea.label, icon: Lightbulb, desc: t.wizard.stages.idea.desc },
    { value: 'MVP / Прототип', label: t.wizard.stages.mvp.label, icon: Hammer, desc: t.wizard.stages.mvp.desc },
    { value: 'Есть первые продажи', label: t.wizard.stages.sales.label, icon: TrendingUp, desc: t.wizard.stages.sales.desc },
  ];

  const FOUNDER_NEEDS = [
    { value: 'Ищу тестеров', label: t.wizard.needs.testers.label, desc: t.wizard.needs.testers.desc },
    { value: 'Нужен фидбек', label: t.wizard.needs.feedback.label, desc: t.wizard.needs.feedback.desc },
    { value: 'Ищу кофаундера', label: t.wizard.needs.cofounder.label, desc: t.wizard.needs.cofounder.desc },
  ];

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('AI');
  const [customCategory, setCustomCategory] = useState('');
  const [region, setRegion] = useState('Ташкент');
  const [logoUrl, setLogoUrl] = useState('');

  // Step 2 fields
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [stage, setStage] = useState('MVP / Прототип');
  const isIdeaStage = stage === 'Только идея' || stage.toLowerCase().includes('иде') || stage.toLowerCase().includes('idea');

  // Step 3 fields
  const [founderNeed, setFounderNeed] = useState('Ищу тестеров');
  const [earlyUserOffer, setEarlyUserOffer] = useState('');
  const [telegramContact, setTelegramContact] = useState(user?.telegram || '');
  const [legalAgreed, setLegalAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill founder telegram handle from logged-in account
  useEffect(() => {
    if (user?.telegram && !telegramContact) {
      setTelegramContact(user.telegram);
    }
  }, [user?.telegram]);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл логотипа слишком большой (максимум 5 МБ)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!name.trim()) return setError('Укажите название стартапа');
      if (!tagline.trim()) return setError('Укажите слоган продукта');
      const isIdeaStage = stage === 'Только идея' || stage.toLowerCase().includes('иде') || stage.toLowerCase().includes('idea');
      if (!isIdeaStage && !websiteUrl.trim()) {
        return setError('Укажите ссылку на сайт или Telegram-бота');
      }
      if (category === 'Другое' && !customCategory.trim()) {
        return setError((t.wizard as any).customCategoryError || 'Укажите название вашей сферы (например: LegalTech, Туризм, Робототехника)');
      }
    }
    if (currentStep === 2) {
      if (!problem.trim()) return setError('Опишите решаемую проблему');
      if (!solution.trim()) return setError('Опишите ваше решение');
    }
    setCurrentStep(prev => Math.min(3, prev + 1));
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || isSubmittingRef.current) return;
    setError('');

    if (!legalAgreed) {
      setError('Необходимо согласиться с Пользовательским соглашением и Политикой конфиденциальности');
      return;
    }

    if (!telegramContact.trim()) {
      setError('Укажите контакт для связи с первыми тестерами');
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);

    const finalCategory = (category === 'Другое' && customCategory.trim()) ? customCategory.trim() : category;

    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          tagline: tagline.trim(),
          description: solution.trim() || tagline.trim(),
          problem: problem.trim(),
          solution: solution.trim(),
          targetAudience: targetAudience.trim(),
          websiteUrl: websiteUrl.trim(),
          category: finalCategory,
          region,
          logoUrl: logoUrl.trim() || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name.trim())}`,
          bannerUrl: null, // Clean UX: only real logo, no forced fake banners
          stage,
          founderNeed,
          earlyUserOffer: earlyUserOffer.trim() || null,
          telegramContact: telegramContact.trim() || user?.telegram || null,
          telegramUserId: user?.telegramId || null,
          founderName: user?.name || 'Фаундер проекта',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка при сохранении стартапа');
      }

      const created = await res.json();

      // Persist in localStorage under user's created startups
      try {
        const savedIds = JSON.parse(localStorage.getItem('starthub_my_startups') || '[]');
        if (!savedIds.includes(created.id)) {
          localStorage.setItem('starthub_my_startups', JSON.stringify([...savedIds, created.id]));
        }
      } catch (e) {}

      // Redirect to Profile where the founder immediately sees their project in "Мои проекты"
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Ошибка сервера');
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleBackNav = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/profile');
    }
  };

  const steps = [
    { step: 1, label: t.wizard.step1 },
    { step: 2, label: t.wizard.step2 },
    { step: 3, label: t.wizard.step3 },
  ];

  if (!user.isLoggedIn) {
    const gate = (t as any).submitGate || {};
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-6 text-[#FF5A1F] shadow-sm">
          <Send className="w-10 h-10 ml-0.5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          {gate.title || 'Вход для публикации стартапа'}
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          {gate.desc || 'Чтобы опубликовать проект на BoshlaUp, сначала авторизуйтесь через Telegram. Это необходимо, чтобы проект закрепился за вашим профилем, и вы могли получать отзывы, баг-репорты и контакты первых тестеров.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all text-sm active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{gate.loginBtn || 'Войти через Telegram'}</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-sm text-center"
          >
            {gate.toCatalog || 'В каталог'}
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <p className="font-extrabold text-xs text-slate-900 mb-1">{gate.card1Title || 'Без паролей'}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">{gate.card1Desc || 'Вход по безопасному 6-значному PIN-коду из Telegram-бота.'}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <p className="font-extrabold text-xs text-slate-900 mb-1">{gate.card2Title || 'Прямой фидбек'}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">{gate.card2Desc || 'Уведомления о найденных багах приходят в ваш Telegram.'}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <p className="font-extrabold text-xs text-slate-900 mb-1">{gate.card3Title || 'Статус Фаундера'}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">{gate.card3Desc || 'Управление апдейтами, сменой стадий и офферами тестерам.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <button
        type="button"
        onClick={handleBackNav}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.detail.back}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Wizard Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.wizard.title}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              {t.wizard.subtitle}
            </p>

            {/* Stepper progress */}
            <div className="grid grid-cols-3 gap-2.5 mt-6">
              {steps.map((s) => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => {
                      if (isPassed) setCurrentStep(s.step);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isActive
                        ? 'border-[#FF5A1F] bg-orange-50/50 shadow-xs'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/30 cursor-pointer'
                        : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        isActive ? 'text-[#FF5A1F]' : isPassed ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {(t.wizard as any).stepWord || 'Шаг'} {s.step}
                      </span>
                      {isPassed && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                    </div>
                    <p className="font-extrabold text-xs text-slate-900 truncate">{s.label.split('. ')[1]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1: BASICS */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.wizard.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.wizard.namePlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-semibold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      {t.wizard.taglineLabel}
                    </label>
                    <span className={`text-[10px] font-bold ${tagline.length > 70 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {tagline.length}/70
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={70}
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder={t.wizard.taglinePlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.wizard.taglineTip}
                  </p>
                </div>

                {/* Stage Selection in Step 1 (Basics) */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    {t.wizard.stageLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {STAGE_CARDS.map((stg) => {
                      const isSelected = stage === stg.value;
                      const IconComp = stg.icon;
                      return (
                        <button
                          key={stg.value}
                          type="button"
                          onClick={() => setStage(stg.value)}
                          className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF5A1F] bg-orange-50/70 shadow-sm ring-1 ring-[#FF5A1F]/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#FF5A1F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5A1F] stroke-[3]" />}
                          </div>
                          <span className={`font-extrabold text-xs block ${isSelected ? 'text-[#FF5A1F]' : 'text-slate-800'}`}>
                            {stg.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                            {stg.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Cards (No emojis, clean Lucide icons) */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    {t.wizard.categoryLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CATEGORY_CARDS.map((cat) => {
                      const isSelected = category === cat.value;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-2xl text-left border transition-all ${
                            isSelected
                              ? 'border-[#FF5A1F] bg-orange-50/70 shadow-sm ring-1 ring-[#FF5A1F]/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#FF5A1F] text-white' : 'bg-slate-100 text-slate-600'}`}>
                              <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5A1F] stroke-[3]" />}
                          </div>
                          <span className={`font-extrabold text-xs block ${isSelected ? 'text-[#FF5A1F]' : 'text-slate-800'}`}>
                            {cat.label}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {cat.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Category Input if "Другое" is selected */}
                  {category === 'Другое' && (
                    <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-orange-50/70 border-2 border-[#FF5A1F]/30 animate-in fade-in slide-in-from-top-1">
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
                          <span>{(t.wizard as any).customCategoryLabel || 'Ваша сфера или индустрия *'}</span>
                        </label>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {(t.wizard as any).customCategoryHint || 'Отобразится на карточке проекта'}
                        </span>
                      </div>
                      <input
                        type="text"
                        required={category === 'Другое'}
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder={(t.wizard as any).customCategoryPlaceholder || 'Например: PropTech, HR-Tech, LegalTech, Туризм...'}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F] font-semibold text-slate-900 shadow-2xs"
                        maxLength={40}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {isIdeaStage
                            ? (lang === 'uz' ? 'Havola (mavjud bo‘lsa)' : lang === 'en' ? 'Website URL (if available)' : 'Ссылка (если есть)')
                            : t.wizard.linkLabel}
                        </span>
                      </span>
                      {isIdeaStage ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {(t as any).submitGate?.ideaOptional || 'Необязательно для идеи'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-500">
                          {(t as any).submitGate?.required || '* Обязательно'}
                        </span>
                      )}
                    </label>
                    <input
                      type="url"
                      required={!isIdeaStage}
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder={
                        isIdeaStage
                          ? (t as any).submitGate?.ideaLinkPlaceholder || 'https://... (или оставьте пустым, если сайта еще нет)'
                          : t.wizard.linkPlaceholder
                      }
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                    />
                    {isIdeaStage && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {lang === 'uz'
                          ? '💡 G‘oya bosqichi uchun veb-sayt majburiy emas. Taqdimot, Figma, Telegram-kanal havolasini qo‘yishingiz yoki bo‘sh qoldirishingiz mumkin.'
                          : lang === 'en'
                          ? '💡 A live website is not required for the idea stage. You can link a pitch deck, Figma mockup, Telegram channel, or leave it blank.'
                          : '💡 Для стадии идеи сайт не обязателен. Можно прикрепить презентацию, Figma, Telegram-канал или оставить поле пустым.'}
                      </p>
                    )}
                  </div>

                  <div>
                    <CustomSelect
                      label={t.wizard.regionLabel}
                      required
                      options={REGION_OPTIONS}
                      value={region}
                      onChange={setRegion}
                      placeholder={t.wizard.selectRegion}
                    />
                  </div>
                </div>

                {/* LOGO FILE UPLOAD (Only logo, real file upload) */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>{t.wizard.logoLabel}</span>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, SVG, WebP</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />

                  {logoUrl ? (
                    <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs shrink-0">
                        <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-800">{t.wizard.logoSuccess}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{t.wizard.logoDisplayHint}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-[#FF5A1F] hover:text-[#E04810] underline"
                          >
                            {t.wizard.logoReplace}
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => setLogoUrl('')}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                          >
                            {t.wizard.logoRemove}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl bg-slate-50/50 hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-[#FF5A1F] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xs text-slate-700 group-hover:text-[#FF5A1F]">
                        {t.wizard.logoUploadPrompt}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {t.wizard.logoUploadHint}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: ESSENCE & DETAILS (Problem, solution, audience) */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.wizard.problemLabel}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder={t.wizard.problemPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.wizard.solutionLabel}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder={t.wizard.solutionPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    {t.wizard.targetLabel}
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder={t.wizard.targetPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: TESTING OFFER & CONTACT */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                {/* Founder Need */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    {t.wizard.needLabel}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {FOUNDER_NEEDS.map((nd) => {
                      const isSelected = founderNeed === nd.value;
                      return (
                        <button
                          key={nd.value}
                          type="button"
                          onClick={() => setFounderNeed(nd.value)}
                          className={`p-3.5 rounded-2xl text-left border transition-all ${
                            isSelected
                              ? 'border-[#FF5A1F] bg-orange-50/70 shadow-sm ring-1 ring-[#FF5A1F]/30'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-xs text-slate-900">{nd.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5A1F] stroke-[3]" />}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {nd.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Early tester offer */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300">
                  <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-emerald-600" />
                    <span>{t.wizard.offerLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={earlyUserOffer}
                    onChange={(e) => setEarlyUserOffer(e.target.value)}
                    placeholder={t.wizard.offerPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                  <p className="text-[11px] text-emerald-800 mt-1.5 font-medium">
                    {t.wizard.offerTip}
                  </p>
                </div>

                {/* Founder Contact for feedback */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      {t.wizard.telegramContactLabel}
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {user?.telegram && telegramContact === user.telegram && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{t.wizard.autoContactBadge} {user.telegram}</span>
                        </span>
                      )}
                      {(() => {
                        const info = detectContactType(telegramContact);
                        if (!info) return null;
                        const Icon = info.icon;
                        return (
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${info.color}`}>
                            <Icon className="w-3 h-3" />
                            <span>{info.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    value={telegramContact}
                    onChange={(e) => setTelegramContact(e.target.value)}
                    placeholder={t.wizard.telegramContactPlaceholder}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
                  />

                  {/* Format suggestion chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {(t as any).submitGate?.examples || 'Примеры:'}
                    </span>
                    {user?.telegram && telegramContact !== user.telegram && (
                      <button
                        type="button"
                        onClick={() => setTelegramContact(user.telegram || '')}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5A1F] border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{(t as any).submitGate?.myNick || 'Мой ник:'} {user.telegram}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!telegramContact.startsWith('@')) setTelegramContact('@' + telegramContact.replace(/^[@+]/, ''));
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      @username
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!telegramContact.startsWith('t.me/')) setTelegramContact('t.me/');
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      t.me/bot
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!telegramContact.startsWith('t.me/')) setTelegramContact('t.me/channel');
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      t.me/channel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!telegramContact.startsWith('+998')) setTelegramContact('+998 ');
                      }}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      +998
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                    {t.wizard.contactHint}
                  </p>
                </div>

                {/* Legal agreement checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={legalAgreed}
                      onChange={(e) => setLegalAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#FF5A1F] rounded border-slate-300 focus:ring-[#FF5A1F] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug font-medium">
                      {lang === 'uz' ? (
                        <>
                          Platformaning{' '}
                          <Link
                            href="/terms"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Foydalanuvchi shartnomasi (oferta)
                          </Link>{' '}
                          va{' '}
                          <Link
                            href="/privacy"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Maxfiylik siyosatiga
                          </Link>{' '}
                          roziman *
                        </>
                      ) : lang === 'en' ? (
                        <>
                          I agree to the{' '}
                          <Link
                            href="/terms"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            href="/privacy"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Privacy Policy
                          </Link>{' '}
                          *
                        </>
                      ) : (
                        <>
                          Я подтверждаю согласие с{' '}
                          <Link
                            href="/terms"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Пользовательским соглашением (офертой)
                          </Link>{' '}
                          и{' '}
                          <Link
                            href="/privacy"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#FF5A1F] underline font-bold hover:text-[#E04810]"
                          >
                            Политикой конфиденциальности
                          </Link>{' '}
                          платформы *
                        </>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-3 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                >
                  {t.wizard.prev}
                </button>
              ) : <div />}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-orange-500/25 active:scale-95 flex items-center gap-1.5"
                >
                  <span>{t.wizard.next}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-3 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-75 disabled:cursor-wait flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 stroke-[2.5] animate-spin" />
                      <span>Запускаем проект...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 stroke-[2.5]" />
                      <span>{t.wizard.publish}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Live Card Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>{t.wizard.previewTitle}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              {t.wizard.previewDesc}
            </p>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-md">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Rocket className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <h4 className="font-black text-sm text-slate-900 truncate">
                    {name || t.wizard.previewNamePlaceholder}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5A1F] border border-orange-200">
                    {stage}
                  </span>
                </div>

                <p className="text-slate-600 text-xs line-clamp-1 mb-2 font-normal">
                  {tagline || t.wizard.previewTaglinePlaceholder}
                </p>

                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                  {earlyUserOffer && (
                    <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      <Gift className="w-3 h-3" />
                      <span>{t.wizard.previewBonus}</span>
                    </span>
                  )}

                  <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                    {category === 'Другое' ? (customCategory.trim() || 'Своя сфера') : category}
                  </span>

                  <span className="inline-flex items-center gap-1 font-medium text-slate-500 text-[10px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{region}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}