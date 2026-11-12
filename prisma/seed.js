const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startupsData = [
  {
    name: "ZaminPay",
    tagline: "Умные B2B микроплатежи и сплит-чеки для кафе и ресторанов Ташкента",
    description: "ZaminPay заменяет громоздкие POS-терминалы единым динамическим QR-кодом на столах. Гости могут мгновенно разделять счет между друзьями, оплачивать через Humo, Uzcard, Payme и оставлять безналичные чаевые официантам.",
    problem: "В ресторанах Ташкента закрытие счета занимает до 15 минут в часы пик. Официанты бегают с терминалами, гости не могут удобно разделить счет на компанию, а бизнес теряет до 12% чаевых и задерживает оборачиваемость столиков.",
    solution: "Умный QR-код на каждом столе с прямой интеграцией с iiko и r_keeper. Гость сканирует камерой, выбирает свои позиции, оплачивает в один клик и оставляет чаевые. Чек моментально фискализируется.",
    targetAudience: "Владельцы ресторанов, кофеен, баров и управляющие сетей общепита в Узбекистане (рынок более 18,000 заведений).",
    websiteUrl: "https://zaminpay.uz",
    category: "FinTech",
    region: "Ташкент",
    logoUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80",
    stage: "Есть первые продажи",
    founderNeed: "Ищу инвестиции",
    firstLaunch: false,
    earlyUserOffer: "0% комиссии на эквайринг первые 6 месяцев + бесплатная интеграция с iiko для первых 20 заведений",
    hasTesterBonus: true,
    investorAsk: "$45,000",
    investorEquity: "7.5%",
    investorUseOfFunds: "50% интеграция с банками-эквайерами, 35% B2B сейлз-команда, 15% серверная инфраструктура",
    userMetrics: "28 подключенных ресторанов, 14,200 транзакций",
    mrrMetrics: "$1,850 MRR",
    telegramContact: "@zamin_founder",
    emailContact: "founder@zaminpay.uz",
    upvotes: 382,
    rating: 4.9,
    founderName: "Джамшид Рахимов",
    founderBio: "Ex-Payme Senior Backend Engineer, 7 лет в финтех-разработке",
    featured: true,
    changelogs: [
      {
        version: "v1.3",
        title: "Подключили прямую оплату через Humo и Uzcard в один тап",
        content: "Теперь гостям не нужно открывать отдельное банковское приложение — оплата проходит прямо в PWA-интерфейсе за 3 секунды.",
        date: new Date(Date.now() - 3 * 86400000)
      },
      {
        version: "v1.2",
        title: "Запустили пилот в 12 ресторанах на Ц-1 и Мирабадском районе",
        content: "Среднее время закрытия стола сократилось с 14 минут до 2.5 минут. Чаевые официантов выросли на 34%.",
        date: new Date(Date.now() - 14 * 86400000)
      }
    ],
    comments: [
      {
        author: "Сардор Умаров",
        role: "Тестер",
        tag: "Похвала",
        status: "Решено",
        content: "Тестировали вчера в кофейне на Шота Руставели. Разделили счет на четверых за 10 секунд! Очень крутой и плавный UI.",
        upvotes: 12
      },
      {
        author: "Шерзод К.",
        role: "Тестер",
        tag: "Баг",
        status: "Взято в работу",
        content: "На старых версиях Safari в iOS 15 кнопка оплаты через Click иногда смещается вправо за пределы экрана.",
        upvotes: 8
      },
      {
        author: "Анвар Бакиров",
        role: "Инвестор",
        tag: "Вопрос",
        status: "Решено",
        content: "Какая у вас средняя маржинальность с одного столика и планируете ли выходить в Самарканд в Q2?",
        upvotes: 15
      }
    ]
  },
  {
    name: "UstozAI",
    tagline: "Персональный AI-репетитор узбекского и английского языков с живым голосом",
    description: "Интерактивный голосовой бот и мобильное приложение на базе GPT-4o и локализованных речевых моделей, который обучает узбекскому языку (кириллица и латиница) и готовит к IELTS с учетом акцентов и менталитета Центральной Азии.",
    problem: "Частные репетиторы в Ташкенте и регионах стоят от $10-15 в час, что недоступно большинству молодежи. При этом стандартные приложения (Duolingo) не поддерживают узбекский язык качественно и не дают живой разговорной практики.",
    solution: "Голосовой ИИ-компаньон с поддержкой разговорных диалектов, исправлением грамматических ошибок в реальном времени, словарем сленга и подготовкой к экзаменам по 15 минут в день.",
    targetAudience: "Школьники, студенты и релоканты в Узбекистане, изучающие государственный или английский язык.",
    websiteUrl: "https://ustoz.ai",
    category: "AI",
    region: "Самарканд",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    stage: "MVP / Прототип",
    founderNeed: "Ищу тестеров",
    firstLaunch: true,
    earlyUserOffer: "1 месяц бесплатного Unlimited PRO тарифа + пожизненная скидка 50% всем, кто проведет 3 голосовых урока и оставит отзыв",
    hasTesterBonus: true,
    investorAsk: "$25,000",
    investorEquity: "6%",
    investorUseOfFunds: "60% обучение речевых моделей (ASR/TTS) для узбекского языка, 40% привлечение первых 50,000 школьников",
    userMetrics: "3,200 зарегистрированных тестеров в Telegram",
    mrrMetrics: "$420 MRR",
    telegramContact: "@ustoz_founder",
    emailContact: "hello@ustoz.ai",
    upvotes: 294,
    rating: 4.8,
    founderName: "Малика Назирова",
    founderBio: "NLP исследователь, выпускница ИТМО и Cambridge CELTA сертифицированный преподаватель",
    featured: true,
    changelogs: [
      {
        version: "v0.9-beta",
        title: "Добавили голосовой тренажер разговорных ситуаций (Базар, Аэропорт, Такси)",
        content: "Теперь бот разыгрывает ролевые игры и оценивает произношение звуков қ, ғ, ҳ.",
        date: new Date(Date.now() - 5 * 86400000)
      }
    ],
    comments: [
      {
        author: "Бобур Алимов",
        role: "Тестер",
        tag: "Идея",
        status: "Взято в работу",
        content: "Было бы здорово добавить режим состязания с друзьями на скорость перевода популярных узбекских идиом!",
        upvotes: 19
      },
      {
        author: "Елена В.",
        role: "Тестер",
        tag: "Похвала",
        status: "Новый",
        content: "Учу узбекский с нуля после переезда в Ташкент — бот объясняет лучше любого учебника. Очень живой голос!",
        upvotes: 11
      }
    ]
  },
  {
    name: "YolBollar Express",
    tagline: "Сервис попутной экспресс-доставки между городами Узбекистана за 4 часа",
    description: "Платформа объединяет водителей, ежедневно курсирующих между Ташкентом, Самаркандом, Бухарой, Ферганой и Андижаном, с отправителями документов, запчастей и коммерческих посылок.",
    problem: "Классическая почта доставляет междугородние посылки за 2-4 дня. Автовокзальные передачи через таксистов ненадежны: нет трекинга, гарантий сохранности и фиксированной цены.",
    solution: "PWA-сервис с верификацией водителей через OneID, онлайн-трекингом по GPS, безопасной сделкой (холдирование средств) и страховкой посылок до 5,000,000 сум.",
    targetAudience: "E-commerce продавцы Instagram/Uzum, малый бизнес, отправляющий образцы и документы, и обычные граждане.",
    websiteUrl: "https://yolbollar.uz",
    category: "E-commerce",
    region: "Ташкент",
    logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&auto=format&fit=crop&q=80",
    stage: "Есть первые продажи",
    founderNeed: "Ищу кофаундера",
    firstLaunch: false,
    earlyUserOffer: "3 бесплатные междугородние доставки до 5 кг при публикации честного отзыва с фотографией получения",
    hasTesterBonus: true,
    investorAsk: "$50,000",
    investorEquity: "10%",
    investorUseOfFunds: "40% приложение для водителей, 30% пункты дроп-оффа в Самарканде и Намангане, 30% маркетинг",
    userMetrics: "410 водителей на маршрутах, 1,850 успешных доставок",
    mrrMetrics: "$1,200 MRR",
    telegramContact: "@yolbollar_ceo",
    emailContact: "support@yolbollar.uz",
    upvotes: 245,
    rating: 4.7,
    founderName: "Фаррух Исмоилов",
    founderBio: "Ex-операционный директор логистической компании, 6 лет в автоперевозках",
    featured: false,
    changelogs: [
      {
        version: "v2.1",
        title: "Внедрили верификацию водителей через MyGov / OneID",
        content: "Теперь каждый водитель проходит автоматическую проверку прав и техпаспорта перед выходом на линию.",
        date: new Date(Date.now() - 7 * 86400000)
      }
    ],
    comments: [
      {
        author: "Улугбек М.",
        role: "Тестер",
        tag: "Баг",
        status: "Решено",
        content: "Не приходило SMS-уведомление получателю в Фергане, если номер оператора Humans.",
        upvotes: 7
      }
    ]
  },
  {
    name: "QurilishPro",
    tagline: "Учет стройматериалов и смет на объектах со смартфона прораба",
    description: "Простой мобильный SaaS для небольших строительных и ремонтных бригад: фотофиксация чеков со стройрынков (Урикзор, Джами), учет остатков цемента и арматуры, акты выполненных работ для заказчиков.",
    problem: "В ремонте и малоэтажном строительстве до 20% бюджета теряется из-за хаотичных чеков, отсутствия учета закупленных материалов и недоверия между заказчиком и подрядчиком.",
    solution: "Telegram-бот + мобильный веб-дашборд. Прораб фотографирует накладную на рынке, OCR распознает позиции, списывает бюджет со сметы и отправляет красивый PDF-отчет заказчику.",
    targetAudience: "Частные прорабы, ремонтные студии, дизайнеры интерьеров и частные застройщики Узбекистана.",
    websiteUrl: "https://qurilish.pro",
    category: "SaaS",
    region: "Бухара",
    logoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80",
    stage: "MVP / Прототип",
    founderNeed: "Нужен фидбек",
    firstLaunch: true,
    earlyUserOffer: "Бесплатный безлимитный доступ на 1 год для строительных бригад до 10 человек за участие в 30-минутном интервью",
    hasTesterBonus: true,
    investorAsk: "$30,000",
    investorEquity: "8%",
    investorUseOfFunds: "70% улучшение OCR для рукописных чеков стройрынков, 30% прямые продажи",
    userMetrics: "45 активных бригад, $180,000 учтенных смет",
    mrrMetrics: "$380 MRR",
    telegramContact: "@qurilish_founder",
    emailContact: "pro@qurilish.pro",
    upvotes: 198,
    rating: 4.8,
    founderName: "Отабек Закиров",
    founderBio: "Инженер-строитель + Fullstack разработчик, 5 лет опыта управления строительными объектами",
    featured: false,
    changelogs: [
      {
        version: "v1.1",
        title: "Обучили AI распознавать рукописные накладные с рынка Урикзор",
        content: "Точность распознавания позиций на узбекском и русском языках достигла 88%.",
        date: new Date(Date.now() - 9 * 86400000)
      }
    ],
    comments: [
      {
        author: "Рустам Х.",
        role: "Тестер",
        tag: "Идея",
        status: "Взято в работу",
        content: "Сделайте выгрузку в Excel для бухгалтеров, очень нужно для налоговой отчетности!",
        upvotes: 14
      }
    ]
  },
  {
    name: "CodeMed UZ",
    tagline: "Электронная регистратура и Telegram-бот для частных клиник",
    description: "Компактная CRM для медицинских центров и стоматологий: онлайн-запись пациентов через Telegram WebApp, напоминания о визитах, электронная медицинская карта и учет повторных приемов.",
    problem: "Клиники теряют до 30% записей из-за неявившихся пациентов, а администраторы тратят часы на ручные телефонные звонки для подтверждения визитов.",
    solution: "Умный Telegram-бот с расписанием врачей, автоматическими SMS/Push напоминаниями за 2 часа до приема и интеграцией с кассой.",
    targetAudience: "Стоматологии, диагностические центры и косметологические клиники Ташкента и областных центров.",
    websiteUrl: "https://codemed.uz",
    category: "EdTech", // or HealthTech
    region: "Ташкент",
    logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
    stage: "Есть первые продажи",
    founderNeed: "Ищу инвестиции",
    firstLaunch: false,
    earlyUserOffer: "Бесплатное внедрение и настройка Telegram-бота для клиники + 2 месяца работы без абонентской платы",
    hasTesterBonus: true,
    investorAsk: "$40,000",
    investorEquity: "9%",
    investorUseOfFunds: "50% мобильное приложение для врачей, 30% маркетинг в медицинских сообществах, 20% сертификация данных",
    userMetrics: "16 клиник, 8,600 записанных пациентов",
    mrrMetrics: "$1,100 MRR",
    telegramContact: "@codemed_lead",
    emailContact: "contact@codemed.uz",
    upvotes: 172,
    rating: 4.9,
    founderName: "Шахло Мирзаева",
    founderBio: "Врач-биоинформатик и IT-предприниматель",
    featured: false,
    changelogs: [
      {
        version: "v1.4",
        title: "Добавили Telegram WebApp с выбором свободного времени врача в календаре",
        content: "Пациентам больше не нужно писать текст администратору — запись оформляется за 3 клика.",
        date: new Date(Date.now() - 12 * 86400000)
      }
    ],
    comments: [
      {
        author: "Доктор Камилов",
        role: "Тестер",
        tag: "Похвала",
        status: "Решено",
        content: "Количество опозданий и неявок в нашей клинике снизилось в два раза за первый же месяц!",
        upvotes: 16
      }
    ]
  },
  {
    name: "BazarGo B2B",
    tagline: "Оптовый маркетплейс свежих фруктов и овощей от фермеров без посредников",
    description: "Прямая связь между фермерскими хозяйствами Ферганской долины и Сурхандарьи с супермаркетами, ресторанами и экспортерами Ташкента. Гарантия качества, прозрачные цены и групповые поставки.",
    problem: "До 4 перекупщиков между дехканином и прилавком приводят к завышению цен в 2.5 раза и порче до 18% скоропортящейся продукции в пути.",
    solution: "Платформа с предзаказами на урожай, контролем качества на отгрузке и консолидированной логистикой рефрижераторами.",
    targetAudience: "Фермеры, оптовые покупатели, ресторанные холдинги и сети супермаркетов (Korzinka, Havas, Makro).",
    websiteUrl: "https://bazargo.uz",
    category: "E-commerce",
    region: "Фергана",
    logoUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80",
    stage: "Только идея",
    founderNeed: "Ищу кофаундера",
    firstLaunch: true,
    earlyUserOffer: "Бесплатное размещение первых 5 лотов продукции + приоритетное продвижение среди закупщиков Ташкента",
    hasTesterBonus: true,
    investorAsk: "$20,000",
    investorEquity: "12%",
    investorUseOfFunds: "Разработка базового MVP и онбординг первых 30 фермеров Ферганы",
    userMetrics: "12 подтвержденных фермеров, 6 ресторанов-партнеров",
    mrrMetrics: "$0 (Pre-revenue)",
    telegramContact: "@bazargo_founder",
    emailContact: "agri@bazargo.uz",
    upvotes: 148,
    rating: 4.6,
    founderName: "Акмал Расулов",
    founderBio: "Семья фермеров в 3-м поколении + выпускник Westminster University in Tashkent",
    featured: false,
    changelogs: [
      {
        version: "v0.1",
        title: "Опубликовали концепт и собрали первые 18 заявок от ресторанов",
        content: "Подтвердили спрос на прямые поставки клубники и томатов из Кувы.",
        date: new Date(Date.now() - 15 * 86400000)
      }
    ],
    comments: [
      {
        author: "Бахтияр С.",
        role: "Тестер",
        tag: "Вопрос",
        status: "Новый",
        content: "Как будете решать вопрос с возвратом некондиционной партии при доставке?",
        upvotes: 9
      }
    ]
  },
  {
    name: "Orom Sleep",
    tagline: "Умный трекер сна с национальными мелодиями и звуками природы Чимгана",
    description: "Мобильное приложение для релаксации, медитации и глубокого сна: аутентичные звуки природы урочища Чимган, шум горной реки Чарвак, тихие мелодии дутара и найя, дыхательные практики и трекинг фаз сна.",
    problem: "У 68% жителей мегаполисов есть проблемы с засыпанием из-за стресса, но западные приложения (Calm, Headspace) стоят дорого ($70/год) и не учитывают культурные и звуковые предпочтения жителей региона.",
    solution: "Локализованное приложение на узбекском и русском языках с эксклюзивными студийными записями природы гор Узбекистана и традиционных инструментов.",
    targetAudience: "Офисные сотрудники, студенты и все, кто борется с бессонницей и хронической усталостью.",
    websiteUrl: "https://oromsleep.uz",
    category: "Социальные",
    region: "Ташкент",
    logoUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=160&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80",
    stage: "MVP / Прототип",
    founderNeed: "Ищу тестеров",
    firstLaunch: true,
    earlyUserOffer: "Вечный бесплатный доступ ко всем аудиодорожкам за установку бета-версии в TestFlight и 1 развернутый отзыв",
    hasTesterBonus: true,
    investorAsk: "$15,000",
    investorEquity: "5%",
    investorUseOfFunds: "Студийная запись 40 новых треков и релиз в App Store / Google Play",
    userMetrics: "850 активных слушателей в день",
    mrrMetrics: "$150 MRR",
    telegramContact: "@orom_dev",
    emailContact: "sleep@orom.uz",
    upvotes: 135,
    rating: 4.9,
    founderName: "Камила Юсупова",
    founderBio: "Саунд-дизайнер и UI/UX проектировщик мобильных продуктов",
    featured: false,
    changelogs: [
      {
        version: "v0.8",
        title: "Записали 10 ночных звуковых дорожек в ущелье Бельдерсай",
        content: "Звук горного ветра, ночных сверчков и шелеста арчи в binaural 3D-аудио формате.",
        date: new Date(Date.now() - 4 * 86400000)
      }
    ],
    comments: [
      {
        author: "Наргиза А.",
        role: "Тестер",
        tag: "Похвала",
        status: "Решено",
        content: "Звук найя и горной реки — это невероятное успокоение после рабочего дня за компьютером. Спасибо за такой продукт!",
        upvotes: 21
      }
    ]
  }
];

async function main() {
  console.log('Resetting database...');
  await prisma.startupComment.deleteMany({});
  await prisma.changelog.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.startup.deleteMany({});

  console.log('Seeding Uzbekistan & Central Asia startups...');
  for (const s of startupsData) {
    const { comments, changelogs, ...startupFields } = s;
    const created = await prisma.startup.create({
      data: {
        ...startupFields,
        commentCount: comments ? comments.length : 0,
      },
    });

    if (changelogs && changelogs.length > 0) {
      for (const ch of changelogs) {
        await prisma.changelog.create({
          data: {
            ...ch,
            startupId: created.id,
          },
        });
      }
    }

    if (comments && comments.length > 0) {
      for (const cm of comments) {
        await prisma.startupComment.create({
          data: {
            ...cm,
            startupId: created.id,
          },
        });
      }
    }
  }

  console.log('Database seeded with 7 high-quality Central Asia startups!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
