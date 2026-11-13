import { Language } from './i18n';

/**
 * Localizes startup development stage
 */
export function localizeStage(stage: string | null | undefined, lang: Language): string {
  if (!stage) return '';
  const s = stage.trim().toLowerCase();

  if (s.includes('иде') || s.includes('idea') || s.includes("g'oya")) {
    if (lang === 'uz') return "Faqat g'oya";
    if (lang === 'en') return 'Idea Only';
    return 'Только идея';
  }

  if (s.includes('mvp') || s.includes('прототип') || s.includes('prototip') || s.includes('prototype')) {
    if (lang === 'uz') return '🛠 MVP / Prototip';
    if (lang === 'en') return '🛠 MVP / Prototype';
    return '🛠 MVP / Прототип';
  }

  if (s.includes('продаж') || s.includes('sales') || s.includes('sotuv') || s.includes('traction')) {
    if (lang === 'uz') return '📈 Dastlabki sotuvlar';
    if (lang === 'en') return '📈 Early Sales';
    return '📈 Первые продажи';
  }

  return stage;
}

/**
 * Localizes Uzbekistan region/city
 */
export function localizeRegion(region: string | null | undefined, lang: Language): string {
  if (!region) return '';
  const r = region.trim();

  const map: Record<string, { uz: string; en: string; ru: string }> = {
    'Ташкент': { uz: 'Toshkent', en: 'Tashkent', ru: 'Ташкент' },
    'Toshkent': { uz: 'Toshkent', en: 'Tashkent', ru: 'Ташкент' },
    'Tashkent': { uz: 'Toshkent', en: 'Tashkent', ru: 'Ташкент' },
    'Самарканд': { uz: 'Samarqand', en: 'Samarkand', ru: 'Самарканд' },
    'Бухара': { uz: 'Buxoro', en: 'Bukhara', ru: 'Бухара' },
    'Фергана': { uz: "Farg'ona", en: 'Fergana', ru: 'Фергана' },
    'Андижан': { uz: 'Andijon', en: 'Andijan', ru: 'Андижан' },
    'Наманган': { uz: 'Namangan', en: 'Namangan', ru: 'Наманган' },
    'Хорезм': { uz: 'Xorazm', en: 'Khorezm', ru: 'Хорезм' },
    'Кашкадарья': { uz: 'Qashqadaryo', en: 'Kashkadarya', ru: 'Кашкадарья' },
    'Сурхандарья': { uz: 'Surxondaryo', en: 'Surkhandarya', ru: 'Сурхандарья' },
    'Джизак': { uz: 'Jizzax', en: 'Jizzakh', ru: 'Джизак' },
    'Сырдарья': { uz: 'Sirdaryo', en: 'Syrdarya', ru: 'Сырдарья' },
    'Навои': { uz: 'Navoiy', en: 'Navoi', ru: 'Навои' },
    'Каракалпакстан': { uz: "Qoraqalpog'iston", en: 'Karakalpakstan', ru: 'Каракалпакстан' },
    'Узбекистан': { uz: "Butun O'zbekiston", en: 'All Uzbekistan', ru: 'Весь Узбекистан' },
    'Весь Узбекистан': { uz: "Butun O'zbekiston", en: 'All Uzbekistan', ru: 'Весь Узбекистан' },
    'Global': { uz: 'Global', en: 'Global', ru: 'Global / Весь мир' },
    'Global / Весь мир': { uz: 'Global', en: 'Global', ru: 'Global / Весь мир' },
  };

  return map[r]?.[lang] || r;
}

/**
 * Localizes industry category
 */
export function localizeCategory(category: string | null | undefined, lang: Language): string {
  if (!category) return '';
  const c = category.trim();

  const map: Record<string, { uz: string; en: string; ru: string }> = {
    'AI': { uz: "AI & Sun'iy intellekt", en: 'AI & ML', ru: 'AI & ИИ' },
    'AI & ИИ': { uz: "AI & Sun'iy intellekt", en: 'AI & ML', ru: 'AI & ИИ' },
    'FinTech': { uz: 'FinTech', en: 'FinTech', ru: 'FinTech' },
    'EdTech': { uz: 'EdTech', en: 'EdTech', ru: 'EdTech' },
    'E-commerce': { uz: 'E-commerce', en: 'E-commerce', ru: 'E-commerce' },
    'SaaS': { uz: 'SaaS & B2B', en: 'SaaS & B2B', ru: 'SaaS & B2B' },
    'SaaS & B2B': { uz: 'SaaS & B2B', en: 'SaaS & B2B', ru: 'SaaS & B2B' },
    'PropTech': { uz: 'PropTech & Qurilish', en: 'PropTech & Construction', ru: 'PropTech & Стройка' },
    'PropTech & Стройка': { uz: 'PropTech & Qurilish', en: 'PropTech & Construction', ru: 'PropTech & Стройка' },
    'Логистика': { uz: 'Logistika & Avto', en: 'Logistics & Auto', ru: 'Логистика & Авто' },
    'Логистика & Авто': { uz: 'Logistika & Avto', en: 'Logistics & Auto', ru: 'Логистика & Авто' },
    'AgriTech': { uz: 'AgriTech', en: 'AgriTech', ru: 'AgriTech' },
    'HealthTech': { uz: 'HealthTech & Tibbiyot', en: 'HealthTech', ru: 'HealthTech & Здоровье' },
    'Услуги': { uz: 'Xizmatlar & Servislar', en: 'Services', ru: 'Услуги & Сервисы' },
    'Услуги & Сервисы': { uz: 'Xizmatlar & Servislar', en: 'Services', ru: 'Услуги & Сервисы' },
    'Игры': { uz: "O'yinlar", en: 'Gaming & Entertainment', ru: 'Игры & Развлечения' },
    'Игры & Развлечения': { uz: "O'yinlar", en: 'Gaming & Entertainment', ru: 'Игры & Развлечения' },
    'Социальные': { uz: 'Ijtimoiy loyihalar', en: 'Social', ru: 'Социальные' },
    'Другое': { uz: 'Boshqa', en: 'Other', ru: 'Другое' },
  };

  return map[c]?.[lang] || c;
}

/**
 * Localizes founder need tag
 */
export function localizeNeed(need: string | null | undefined, lang: Language): string {
  if (!need) return '';
  const n = need.trim();

  const map: Record<string, { uz: string; en: string; ru: string }> = {
    'Ищу тестеров': { uz: 'Testerlar qidiryapman', en: 'Looking for Testers', ru: 'Ищу тестеров' },
    'Нужен фидбек': { uz: 'Fikr-mulohaza kerak', en: 'Need Feedback', ru: 'Нужен фидбек' },
    'Ищу кофаундера': { uz: 'Hamasoschi qidiryapman', en: 'Looking for Co-founder', ru: 'Ищу кофаундера' },
    'Ищу инвестиции': { uz: 'Investitsiya qidiryapman', en: 'Seeking Investment', ru: 'Ищу инвестиции' },
  };

  return map[n]?.[lang] || n;
}
