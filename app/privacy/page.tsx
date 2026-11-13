'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send, Lock, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/i18n';

export default function PrivacyPage() {
  const { lang, setLang } = useApp();
  const [activeLang, setActiveLang] = useState<Language>(lang || 'ru');

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
            <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>
              {activeLang === 'uz'
                ? "Shaxsiy ma'lumotlar himoyasi (O'RQ-547)"
                : activeLang === 'en'
                ? 'Personal Data Protection (Law No. 547)'
                : 'Защита персональных данных (ЗРУ-547)'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            {activeLang === 'uz'
              ? 'Maxfiylik siyosati'
              : activeLang === 'en'
              ? 'Privacy Policy'
              : 'Политика конфиденциальности'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            {activeLang === 'uz'
              ? "BoshlaUp (https://boshlaup.uz) foydalanuvchilarining shaxsiy ma'lumotlarini to'plash, qayta ishlash va himoya qilish tartibi"
              : activeLang === 'en'
              ? 'Collection, processing, and protection of user information on BoshlaUp (https://boshlaup.uz)'
              : 'Порядок сбора, обработки и защиты информации пользователей BoshlaUp (https://boshlaup.uz)'}
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
                <span className="text-[#FF5A1F]">1.</span> Umumiy qoidalar
              </h2>
              <p>
                <strong className="text-slate-900">1.1.</strong> Ushbu Maxfiylik siyosati (keyingi o'rinlarda — «Siyosat») BoshlaUp internet-platformasi (<a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>) foydalanuvchilarining shaxsiy ma'lumotlarini to'plash, saqlash, tizimlashtirish, foydalanish va himoya qilish tartibini belgilaydi.
              </p>
              <p>
                <strong className="text-slate-900">1.2.</strong> Mazkur Siyosat <strong className="text-slate-900">O'zbekiston Respublikasining 2019-yil 2-iyuldagi «Shaxsiy ma'lumotlar to'g'risida»gi O'RQ-547-son Qonuni</strong> va boshqa normativ-huquqiy hujjatlarga qat'iy muvofiq holda ishlab chiqilgan.
              </p>
              <p>
                <strong className="text-slate-900">1.3.</strong> Platformadan foydalanish, profil yaratish yoki sayt veb-shakllari orqali ma'lumot yuborish Foydalanuvchining ushbu Siyosat shartlariga to'liq va so'zsiz roziligini bildiradi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> To'planadigan shaxsiy ma'lumotlar tarkibi
              </h2>
              <p className="font-bold text-slate-900">2.1. Foydalanuvchi tomonidan mustaqil kiritiladigan ma'lumotlar:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Ism, familiya yoki ommaviy taxallus (nikneym);</li>
                <li>Aloqa ma'lumotlari: elektron pochta manzili (Email), Telegram foydalanuvchi nomi (@username) yoki Telegram identifikatori (ID);</li>
                <li>Startap ma'lumotlari: loyiha nomi, tavsifi, veb-sayti, logotip va skrinshotlari;</li>
                <li>Foydalanuvchi tomonidan qoldirilgan sharhlar, fikr-mulohazalar va berilgan ovozlar (apvoutlar).</li>
              </ul>

              <p className="font-bold text-slate-900 pt-2">2.2. Avtomatik tarzda to'planadigan texnik ma'lumotlar:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Qurilmaning IP-manzili, brauzer turi va versiyasi, operatsion tizim;</li>
                <li>Fayllar cookie (kuki), seans ko'rsatkichlari va sun'iy botlardan himoya qilish uchun zarur bo'lgan xavfsizlik jurnallari.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> Ma'lumotlarni qayta ishlash maqsadlari
              </h2>
              <p className="font-bold text-slate-900">3.1. Ma'muriyat shaxsiy ma'lumotlarni quyidagi qonuniy maqsadlarda qayta ishlaydi:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Foydalanuvchini identifikatsiya qilish va shaxsiy kabinet imkoniyatlaridan foydalanishni ta'minlash;</li>
                <li>Startap kartochkalarini e'lon qilish hamda Asoschilar, Sinovchilar va Investorlar o'rtasida to'g'ridan-to'g'ri aloqa o'rnatish;</li>
                <li>Axborot xavfsizligini ta'minlash, firibgarlik, spam va sun'iy reyting nakrutkalarining oldini olish;</li>
                <li>Telegram-bot orqali xizmat bildirishnomalarini (yangi sharhlar, loyiha holati) yetkazish.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">4.</span> Ma'lumotlar xavfsizligi va uchinchi shaxslarga berilmasligi
              </h2>
              <p>
                <strong className="text-slate-900">4.1.</strong> Foydalanuvchining ochiq profili va startap kartochkasida ko'rsatilgan ma'lumotlar barcha tashrif buyuruvchilar uchun ochiq hisoblanadi.
              </p>
              <p>
                <strong className="text-slate-900">4.2.</strong> Ma'muriyat foydalanuvchilarning shaxsiy ma'lumotlarini uchinchi shaxslarga sotmaydi va tarqatmaydi, qonunda belgilangan vakolatli davlat organlari so'rovi bundan mustasno.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">5.</span> Foydalanuvchining huquqlari
              </h2>
              <p className="font-bold text-slate-900">5.1. Foydalanuvchi quyidagi huquqlarga ega:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>O'z shaxsiy ma'lumotlarini ko'rish va profil orqali ularni tahrirlash;</li>
                <li>Hisob qaydnomasini va shaxsiy ma'lumotlarini butunlay o'chirishni talab qilish (5 ish kuni ichida amalga oshiriladi).</li>
              </ul>
            </section>
          </>
        ) : activeLang === 'en' ? (
          /* ================= ENGLISH ================= */
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">1.</span> General Provisions
              </h2>
              <p>
                <strong className="text-slate-900">1.1.</strong> This Privacy Policy governs the collection, processing, and security of personal data on BoshlaUp (<a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>).
              </p>
              <p>
                <strong className="text-slate-900">1.2.</strong> Developed in accordance with the Law of the Republic of Uzbekistan "On Personal Data" No. ZRU-547.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> Data Collected
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>User profile details: Name/nickname, Telegram username or ID;</li>
                <li>Startup project materials submitted by founders;</li>
                <li>Technical logs, cookies, and IP addresses to prevent abuse and bot attacks.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> Purpose of Processing
              </h2>
              <p>
                Data is processed exclusively to deliver platform services, notify founders and testers via Telegram, and maintain system integrity. We never sell personal data to third parties.
              </p>
            </section>
          </>
        ) : (
          /* ================= RUSSIAN ================= */
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">1.</span> Общие положения
              </h2>
              <p>
                <strong className="text-slate-900">1.1.</strong> Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок сбора, хранения, систематизации, использования и защиты персональных данных пользователей интернет-платформы BoshlaUp (<a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>).
              </p>
              <p>
                <strong className="text-slate-900">1.2.</strong> Настоящая Политика разработана в строгом соответствии с <strong className="text-slate-900">Законом Республики Узбекистан «О персональных данных» № ЗРУ-547 от 02.07.2019 г.</strong> и иными нормативно-правовыми актами Республики Узбекистан.
              </p>
              <p>
                <strong className="text-slate-900">1.3.</strong> Использование Платформы, регистрация учетной записи или отправка данных через веб-формы сайта означает безоговорочное согласие Пользователя с настоящей Политикой.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">2.</span> Состав собираемых персональных данных
              </h2>
              <p className="font-bold text-slate-900">2.1. Данные, предоставляемые Пользователем самостоятельно при регистрации или публикации Проекта:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Имя, фамилия или публичный псевдоним (никнейм);</li>
                <li>Контактные сведения: адрес электронной почты (Email), имя пользователя или ID в Telegram;</li>
                <li>Сведения о Проекте: название, описание, ссылки на сайт, логотипы и скриншоты;</li>
                <li>Тексты комментариев, отзывов и оценки (апвоуты).</li>
              </ul>

              <p className="font-bold text-slate-900 pt-2">2.2. Технические данные, собираемые автоматически:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>IP-адрес, тип и версия интернет-браузера, операционная система;</li>
                <li>Файлы cookie (куки) и параметры сессии для корректной работы сайта и защиты от ботов.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">3.</span> Цели обработки персональных данных
              </h2>
              <p className="font-bold text-slate-900">3.1. Администрация осуществляет обработку данных исключительно в целях:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Идентификации Пользователя и предоставления доступа к функционалу Платформы;</li>
                <li>Публикации карточек стартапов и обеспечения коммуникации между Фаундерами и Тестировщиками;</li>
                <li>Обеспечения информационной безопасности и предотвращения накруток;</li>
                <li>Направления сервисных уведомлений через Telegram-бота.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">4.</span> Защита данных и передача третьим лицам
              </h2>
              <p>
                <strong className="text-slate-900">4.1.</strong> Администрация не продает и не передает персональные данные Пользователей третьим лицам, за исключением случаев, предусмотренных законодательством Республики Узбекистан.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="text-[#FF5A1F]">5.</span> Права Пользователя
              </h2>
              <p>
                Пользователь вправе в любое время редактировать свои данные в профиле либо направить запрос на полное удаление аккаунта и данных на почту info@boshlaup.uz.
              </p>
            </section>
          </>
        )}

        {/* Section: Contacts */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">6.</span>{' '}
            {activeLang === 'uz'
              ? 'Aloqa va so‘rovlar'
              : activeLang === 'en'
              ? 'Contact & Inquiries'
              : 'Контакты и запросы'}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900 w-1/3">
                    {activeLang === 'uz' ? 'Elektron pochta:' : activeLang === 'en' ? 'Email:' : 'Электронная почта:'}
                  </td>
                  <td className="p-3 sm:p-4">
                    <a href="mailto:info@boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>info@boshlaup.uz</span>
                    </a>
                  </td>
                </tr>
                <tr>
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
