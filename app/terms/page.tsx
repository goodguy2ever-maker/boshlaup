'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, FileText, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/i18n';

export default function TermsPage() {
  const { lang, setLang } = useApp();
  const [activeLang, setActiveLang] = useState<Language>(lang || 'ru');

  // Keep in sync with header language change
  useEffect(() => {
    if (lang) {
      setActiveLang(lang);
    }
  }, [lang]);

  const handleLanguageSwitch = (newLang: Language) => {
    setActiveLang(newLang);
    setLang(newLang);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {activeLang === 'uz' ? 'Bosh sahifaga' : activeLang === 'en' ? 'Back to Home' : 'На главную'}
          </span>
        </Link>

        {/* In-page language switcher */}
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => handleLanguageSwitch('uz')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLang === 'uz'
                ? 'bg-white text-[#FF5A1F] shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            O'zbek
          </button>
          <button
            type="button"
            onClick={() => handleLanguageSwitch('ru')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLang === 'ru'
                ? 'bg-white text-[#FF5A1F] shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Русский
          </button>
          <button
            type="button"
            onClick={() => handleLanguageSwitch('en')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeLang === 'en'
                ? 'bg-white text-[#FF5A1F] shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="rounded-3xl bg-[#18181B] p-6 sm:p-10 text-white mb-10 border-[3px] border-[#FF5A1F]/60 shadow-xl shadow-orange-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#FF5A1F]/30 via-orange-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] text-xs font-bold mb-3 border border-[#FF5A1F]/30">
            <FileText className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>
              {activeLang === 'uz'
                ? 'Rasmiy yuridik hujjat'
                : activeLang === 'en'
                ? 'Official Legal Document'
                : 'Официальный юридический документ'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            {activeLang === 'uz'
              ? 'Foydalanuvchi shartnomasi'
              : activeLang === 'en'
              ? 'Terms of Service'
              : 'Пользовательское соглашение'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            {activeLang === 'uz'
              ? "BoshlaUp internet-platformasining ommaviy ofertasi (https://boshlaup.uz)"
              : activeLang === 'en'
              ? 'Public Offer Agreement of BoshlaUp Platform (https://boshlaup.uz)'
              : 'Публичная оферта интернет-платформы BoshlaUp (https://boshlaup.uz)'}
          </p>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            {activeLang === 'uz'
              ? "Kuchga kirish sanasi: 2026-yil 13-noyabr • O'zbekiston Respublikasi"
              : activeLang === 'en'
              ? 'Effective Date: November 13, 2026 • Republic of Uzbekistan'
              : 'Дата вступления в силу: 13 ноября 2026 г. • Республика Узбекистан'}
          </p>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
        {activeLang === 'uz' ? (
          /* ================= O'ZBEK TILI ================= */
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">1.</span> Atamalar va umumiy qoidalar
              </h2>
              <p>
                <strong className="text-slate-900">1.1. Platforma (Ma'muriyat)</strong> — Internet tarmog'ida{' '}
                <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a> manzilida joylashgan,{' '}
                <strong className="text-slate-900">Platforma Ma'muriyati (Admin)</strong> tomonidan boshqariladigan axborot tizimi.
              </p>
              <p>
                <strong className="text-slate-900">1.2. Foydalanuvchi</strong> — Platformadan Asoschi (loyiha muallifi), Sinovchi (tester / faol foydalanuvchi) yoki Investor sifatida foydalanuvchi har qanday muomala layoqatiga ega jismoniy yoki yuridik shaxs.
              </p>
              <p>
                <strong className="text-slate-900">1.3. Startap (Loyiha)</strong> — Foydalanuvchi tomonidan Platformada e'lon qilingan dasturiy ta'minot, raqamli xizmat, g'oya yoki minimal hayotiy mahsulot (MVP) haqidagi axborotlar to'plami.
              </p>
              <p>
                <strong className="text-slate-900">1.4.</strong> Mazkur hujjat O'zbekiston Respublikasi Fuqarolik kodeksining 367-moddasiga muvofiq rasmiy ommaviy oferta hisoblanadi. Platformadan foydalanishni boshlash, hisob qaydnomasini ochish, startap formasini yuborish yoki tegishli katakchani belgilash ushbu Shartnoma shartlarini to'liq va so'zsiz qabul qilish (aksept) hisoblanadi.
              </p>
              <p>
                <strong className="text-slate-900">1.5.</strong> Agar Foydalanuvchi Shartnomaning biron-bir shartiga rozi bo'lmasa, u Platformadan foydalanishni zudlik bilan to'xtatishi shart.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> Platformaning maqomi va vazifasi
              </h2>
              <p>
                <strong className="text-slate-900">2.1.</strong> BoshlaUp platformasi O'zbekiston startap ekotizimi uchun ochiq axborot vitrinasi, dastlabki mahsulotlarni test qilish qumdoni va muloqot maydoni hisoblanadi.
              </p>
              <p>
                <strong className="text-slate-900">2.2.</strong> Platforma investitsiya fondi, moliya tashkiloti, broker, kraudfanding maydoni yoki ish beruvchi emas va foydalanuvchilar o'rtasida tuziladigan o'zaro bitimlarga kafolat bermaydi.
              </p>
              <p>
                <strong className="text-slate-900">2.3.</strong> Platformaning asosiy funksionali barcha foydalanuvchilarga bepul va «boricha» (as is) tamoyili bo'yicha taqdim etiladi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> Foydalanuvchining huquq va majburiyatlari
              </h2>
              <p className="font-bold text-slate-900">3.1. Foydalanuvchi quyidagilarga majburdir:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>O'zi, jamoasi va e'lon qilinayotgan Loyiha to'g'risida to'liq, haqqoniy va ishonchli ma'lumotlarni kiritish.</li>
                <li>Faqat o'ziga tegishli yoki qonuniy ruxsatga ega bo'lgan intellektual mulk ob'ektlaridan (matnlar, logotiplar, skrinshotlar, videolar) foydalanish.</li>
                <li>Ovoz berish (apvout) tizimida adolatli raqobat tamoyillariga rioya qilish, sun'iy nakrutkalar, botlar va ko'p marotaba ro'yxatdan o'tish usullarini qo'llamaslik.</li>
                <li>Loyiha kartochkasida ko'rsatilgan taklif va bonuslarni (erta kirish huquqi, chegirmalar, sovg'alar) ilk sinovchilarga vijdonan taqdim etish.</li>
              </ul>

              <p className="font-bold text-slate-900 pt-2">3.2. Quyidagi harakatlar qat'iyan man etiladi:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>O'zbekiston Respublikasining amaldagi qonunchiligiga zid axborotlar, zo'ravonlik, ekstremizm, nafrat uyg'otuvchi va behayo materiallarni tarqatish.</li>
                <li>Firibgarlik sxemalari (moliyaviy piramidalar, fishing, skam-loyihalar), zararli dasturlar va ruxsatsiz reklamalarni (spam) joylashtirish.</li>
                <li>O'zganing startapini, kodi, dizayni yoki intellektual mulkini o'zlashtirish (plagiat).</li>
                <li>Sharh va muhokamalarda haqoratli so'zlar, tahdidlar va nojo'ya iboralarni ishlatish.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">4.</span> Platforma Ma'muriyatining huquqlari
              </h2>
              <p className="font-bold text-slate-900">4.1. Ma'muriyat quyidagi huquqlarga ega:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Shartnoma talablariga zid keladigan har qanday loyiha yoki sharhni ogohlantirishsiz tahrirlash, o'chirish yoki e'lon qilinishini rad etish.</li>
                <li>Firibgarlik, plagiat, spam yoki sun'iy nakrutka holatlari aniqlanganda Foydalanuvchi hisobini vaqtincha yoki butunlay bloklash.</li>
                <li>Platforma dizayni, reyting algoritmlari va texnik imkoniyatlarini yangilab borish.</li>
              </ul>
              <p>
                <strong className="text-slate-900">4.2.</strong> Foydalanuvchi o'z loyihasini joylashtirish orqali Ma'muriyatga loyiha nomi va muallifini ko'rsatgan holda BoshlaUp platformasida hamda uning rasmiy Telegram (@boshlaup) va ijtimoiy tarmoq kanallarida axborot va promo maqsadlarida bepul foydalanish huquqini beradi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">5.</span> Javobgarlikni cheklash (Diskleymer)
              </h2>
              <p>
                <strong className="text-slate-900">5.1.</strong> Startaplar, ularning ko'rsatkichlari (daromad, foydalanuvchilar soni, tayyorlik darajasi) haqidagi ma'lumotlar bevosita foydalanuvchilar tomonidan kiritiladi. Ma'muriyat ularning to'g'riligiga majburiy kafolat bermaydi.
              </p>
              <p className="font-bold text-slate-900">5.2. Ma'muriyat quyidagi holatlar bo'yicha javobgar emas:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Platformadan foydalanish yoki undagi vaqtinchalik texnik uzilishlar;</li>
                <li>Loyiha kartochkalarida berilgan tashqi dastur va havolalarni yuklab olish yoki sinab ko'rish oqibatlari;</li>
                <li>Foydalanuvchilar (Asoschilar, Sinovchilar, Investorlar) o'rtasida mustaqil tuzilgan shartnomalar, hamkorliklar va investitsiya bitimlari. Har bir foydalanuvchi investitsion qarorlarni o'z xohishi va javobgarligi ostida qabul qiladi.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">6.</span> Intellektual mulk
              </h2>
              <p>
                <strong className="text-slate-900">6.1.</strong> BoshlaUp savdo belgisi, sayt dizayni, dasturiy kodi va logotipiga oid barcha mutlaq huquqlar Platforma Ma'muriyatiga tegishlidir.
              </p>
              <p>
                <strong className="text-slate-900">6.2.</strong> E'lon qilingan Startaplar, ularning g'oyalari, dizaynlari va kodlariga bo'lgan barcha mualliflik huquqlari ularning qonuniy mualliflarida (Asoschilarida) saqlanib qoladi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">7.</span> Nizolarni hal etish tartibi
              </h2>
              <p>
                <strong className="text-slate-900">7.1.</strong> Mualliflik huquqlari buzilishi bo'yicha e'tirozlar va murojaatlar Ma'muriyat tomonidan 5 (besh) ish kuni ichida ko'rib chiqiladi.
              </p>
              <p>
                <strong className="text-slate-900">7.2.</strong> Tomonlar o'rtasida yuzaga keladigan barcha nizolar muzokaralar yo'li bilan, kelishuvga erishilmaganda esa O'zbekiston Respublikasining amaldagi qonunchiligiga muvofiq sud tartibida hal etiladi.
              </p>
            </section>
          </>
        ) : activeLang === 'en' ? (
          /* ================= ENGLISH ================= */
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">1.</span> Terms and General Provisions
              </h2>
              <p>
                <strong className="text-slate-900">1.1. Platform (Administration)</strong> — The BoshlaUp online service available at{' '}
                <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>, managed by the{' '}
                <strong className="text-slate-900">BoshlaUp Platform Administration (Admin)</strong>.
              </p>
              <p>
                <strong className="text-slate-900">1.2. User</strong> — Any individual or legal entity utilizing the Platform as a Founder, Beta Tester, or Investor.
              </p>
              <p>
                <strong className="text-slate-900">1.3. Startup (Project)</strong> — Information regarding a digital product, software, startup idea, or Minimum Viable Product (MVP) published by a User.
              </p>
              <p>
                <strong className="text-slate-900">1.4.</strong> This document constitutes a public offer under Article 367 of the Civil Code of the Republic of Uzbekistan. Accessing the Platform, submitting a project, or creating an account implies unconditional acceptance of these terms.
              </p>
              <p>
                <strong className="text-slate-900">1.5.</strong> If you do not agree with any part of these Terms, you must immediately cease using the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> Purpose and Status of the Platform
              </h2>
              <p>
                <strong className="text-slate-900">2.1.</strong> BoshlaUp is an open directory, early product testing sandbox, and community hub for the startup ecosystem of Uzbekistan.
              </p>
              <p>
                <strong className="text-slate-900">2.2.</strong> The Platform is not an investment fund, broker, crowdfunding portal, or employer, and does not guarantee deals or transactions between Users.
              </p>
              <p>
                <strong className="text-slate-900">2.3.</strong> Core functionality is provided free of charge on an "as is" and "as available" basis.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> User Rights and Obligations
              </h2>
              <p className="font-bold text-slate-900">3.1. Users agree to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Provide accurate, genuine, and lawful information about their project and team.</li>
                <li>Upload only content they legally own or have explicit permission to distribute.</li>
                <li>Respect fair competition in voting (upvoting) and refrain from automated bots, script abuse, or fake accounts.</li>
                <li>Honor promised perks and bonuses specified for early beta testers.</li>
              </ul>
              <p className="font-bold text-slate-900 pt-2">3.2. Prohibited activities:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Publishing illegal, fraudulent, extremist, or copyrighted content without authorization.</li>
                <li>Spamming, distributing malware, or advertising pyramid schemes.</li>
                <li>Plagiarism and misrepresenting third-party products as one's own.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">4.</span> Administration Rights
              </h2>
              <p>
                The Administration reserves the right to moderate, edit formatting of, or remove any project violating this Agreement, and suspend accounts involved in fraudulent activity or vote manipulation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">5.</span> Disclaimer of Liability
              </h2>
              <p>
                All project metrics, statements, and links are supplied by users. The Administration does not conduct an audit and disclaims all liability for third-party products or investment decisions made between Users.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">6.</span> Intellectual Property
              </h2>
              <p>
                All trademarks, codebase, and branding of BoshlaUp belong to the Administration. All startup ideas, code, and content belong strictly to their respective creators (Founders).
              </p>
            </section>
          </>
        ) : (
          /* ================= RUSSIAN ================= */
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">1.</span> Термины и общие положения
              </h2>
              <p>
                <strong className="text-slate-900">1.1. Платформа (Администрация)</strong> — Интернет-ресурс BoshlaUp, расположенный в сети Интернет по адресу{' '}
                <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>, администрируемый{' '}
                <strong className="text-slate-900">Администрацией платформы (Admin)</strong>.
              </p>
              <p>
                <strong className="text-slate-900">1.2. Пользователь</strong> — Любое дееспособное физическое или юридическое лицо, использующее функционал Платформы в роли Фаундера (автора проекта), Тестировщика (рядового пользователя) или Инвестора.
              </p>
              <p>
                <strong className="text-slate-900">1.3. Стартап (Проект)</strong> — Информация о продукте, цифровом сервисе, идее или минимально жизнеспособном продукте (MVP), размещенная Пользователем на Платформе.
              </p>
              <p>
                <strong className="text-slate-900">1.4.</strong> Настоящий документ является официальной публичной офертой в соответствии со статьей 367 Гражданского кодекса Республики Узбекистан. Начало использования Платформы, регистрация учетной записи, отправка формы добавления проекта или проставление отметки в поле «Согласен с Пользовательским соглашением» означает полное и безоговорочное принятие (акцепт) всех условий настоящего Соглашения.
              </p>
              <p>
                <strong className="text-slate-900">1.5.</strong> В случае несогласия с какими-либо положениями настоящего Соглашения Пользователь обязан немедленно прекратить использование Платформы.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> Статус и назначение Платформы
              </h2>
              <p>
                <strong className="text-slate-900">2.1.</strong> Платформа является открытой информационной витриной, песочницей для тестирования ранних продуктов и коммуникационной площадкой для участников стартап-экосистемы Узбекистана.
              </p>
              <p>
                <strong className="text-slate-900">2.2.</strong> Платформа не является инвестиционным фондом, финансовым посредником, брокером, краудфандинговой площадкой, работодателем или гарантом совершения сделок между Пользователями.
              </p>
              <p>
                <strong className="text-slate-900">2.3.</strong> Базовый функционал Платформы предоставляется Пользователям на безвозмездной основе по принципу «как есть» (as is).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> Права и обязанности Пользователя
              </h2>
              <p className="font-bold text-slate-900">3.1. Пользователь обязуется:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Предоставлять достоверную, актуальную и не вводящую в заблуждение информацию о себе, своей команде и публикуемом Проекте.</li>
                <li>Публиковать только те материалы (тексты, названия, логотипы, скриншоты, видео, ссылки), на которые у Пользователя имеются законные права или письменные разрешения правообладателей.</li>
                <li>Соблюдать принципы добросовестной конкуренции при использовании системы голосования (апвоутов) и не применять автоматизированные скрипты, ботов, массовые регистрации или искусственную накрутку показателей.</li>
                <li>Добросовестно выполнять заявленные перед тестировщиками условия (офферы, бонусы, промокоды, ранний доступ), если таковые были указаны в карточке Проекта.</li>
              </ul>

              <p className="font-bold text-slate-900 pt-2">3.2. Пользователю строго запрещается:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Размещать информацию, противоречащую законодательству Республики Узбекистан, включая призывы к насилию, экстремизму, разжиганию розни, а также материалы оскорбительного или порнографического характера.</li>
                <li>Публиковать мошеннические схемы (финансовые пирамиды, фишинг, скам-проекты), вредоносное программное обеспечение и несанкционированную рекламу (спам).</li>
                <li>Выдавать чужие проекты, код, дизайн и разработки за свои собственные (плагиат).</li>
                <li>Использовать оскорбления, угрозы и ненормативную лексику в комментариях, отзывах и обсуждениях.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">4.</span> Права Администрации Платформы
              </h2>
              <p className="font-bold text-slate-900">4.1. Администрация имеет право в любое время без предварительного уведомления и объяснения причин:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Проводить предварительную или последующую модерацию, редактировать (в части исправления технических опечаток и форматирования) или удалять любые Проекты и комментарии, нарушающие настоящее Соглашение или этические нормы сообщества.</li>
                <li>Временно приостанавливать или бессрочно блокировать учетную запись Пользователя при выявлении фактов мошенничества, плагиата, спама или накрутки голосов.</li>
                <li>Изменять дизайн, структуру, алгоритмы ранжирования и технический функционал Платформы.</li>
              </ul>
              <p>
                <strong className="text-slate-900">4.2.</strong> Размещая материалы о Проекте на Платформе, Пользователь предоставляет Администрации простую (неисключительную) безвозмездную лицензию на их публикацию, хранение, отображение на сайте и использование в информационных и промо-материалах Платформы (включая официальные каналы BoshlaUp в Telegram и Instagram) с обязательным указанием названия Проекта и его автора.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">5.</span> Ограничение ответственности (Дисклеймер)
              </h2>
              <p>
                <strong className="text-slate-900">5.1.</strong> Вся информация о Стартапах, их метриках (выручке, количестве пользователей, стадии готовности) и условиях бонусов публикуется непосредственно Пользователями. Администрация не проводит обязательный юридический или финансовый аудит и не гарантирует абсолютную точность указанных сведений.
              </p>
              <p className="font-bold text-slate-900">5.2. Администрация не несет ответственности за любые прямые или косвенные убытки, упущенную выгоду, потерю данных или репутационный ущерб, возникшие в результате:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Использования или временной невозможности использования Платформы;</li>
                <li>Скачивания, установки или тестирования сторонних продуктов, ссылки на которые размещены в карточках Проектов;</li>
                <li>Переговоров, партнерств, трудоустройства или инвестиционных сделок, заключенных между Пользователями (Фаундерами, Тестировщиками и Инвесторами). Все инвестиционные и коммерческие решения Пользователи принимают самостоятельно и на свой страх и риск.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">6.</span> Интеллектуальная собственность
              </h2>
              <p>
                <strong className="text-slate-900">6.1.</strong> Все исключительные права на дизайн, программный код, логотип, фирменный стиль и товарный знак BoshlaUp принадлежат Администрации Платформы.
              </p>
              <p>
                <strong className="text-slate-900">6.2.</strong> Исключительные права на размещаемые Стартапы, их идеи, код и брендинг сохраняются за их законными авторами (Фаундерами). Публикация информации о Проекте на Платформе не влечет отчуждения прав на сам стартап в пользу Администрации.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">7.</span> Порядок разрешения споров
              </h2>
              <p>
                <strong className="text-slate-900">7.1.</strong> В случае обнаружения нарушения авторских прав правообладатель вправе направить мотивированное обращение Администрации. Обращения рассматриваются в срок до 5 (пяти) рабочих дней.
              </p>
              <p>
                <strong className="text-slate-900">7.2.</strong> Все споры и разногласия разрешаются путем переговоров, а при недостижении согласия — в судебном порядке в соответствии с законодательством Республики Узбекистан.
              </p>
            </section>
          </>
        )}

        {/* Section: Contacts (common to all languages) */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">8.</span>{' '}
            {activeLang === 'uz'
              ? "Ma'muriyat rekvizitlari va aloqalar"
              : activeLang === 'en'
              ? 'Administration Details & Contacts'
              : 'Реквизиты и контакты Администрации'}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900 w-1/3">
                    {activeLang === 'uz' ? 'Resurs nomi:' : activeLang === 'en' ? 'Platform Name:' : 'Наименование ресурса:'}
                  </td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-800">BoshlaUp</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">
                    {activeLang === 'uz' ? 'Administrator:' : activeLang === 'en' ? 'Administrator:' : 'Владелец / Администратор:'}
                  </td>
                  <td className="p-3 sm:p-4 text-slate-700">
                    {activeLang === 'uz'
                      ? "BoshlaUp platformasi ma'muriyati (Admin)"
                      : activeLang === 'en'
                      ? 'BoshlaUp Platform Administration (Admin)'
                      : 'Администрация платформы BoshlaUp (Admin)'}
                  </td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">
                    {activeLang === 'uz' ? 'Rasmiy veb-sayt:' : activeLang === 'en' ? 'Official Website:' : 'Официальный веб-сайт:'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">
                      https://boshlaup.uz
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">
                    {activeLang === 'uz' ? 'Elektron pochta:' : activeLang === 'en' ? 'Email:' : 'Электронная почта:'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <a href="mailto:info@boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>info@boshlaup.uz</span>
                    </a>
                  </td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">
                    {activeLang === 'uz' ? "Telegram-qo'llab-quvvatlash:" : activeLang === 'en' ? 'Telegram Support:' : 'Telegram-поддержка:'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <a
                      href="https://t.me/boshlaup_admin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>@boshlaup_admin</span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
