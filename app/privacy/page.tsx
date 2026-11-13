import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, Send, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | BoshlaUp',
  description: 'Политика конфиденциальности и порядок обработки персональных данных платформы BoshlaUp в соответствии с Законом Республики Узбекистан «О персональных данных» № ЗРУ-547.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>На главную</span>
      </Link>

      <div className="rounded-3xl bg-[#18181B] p-6 sm:p-10 text-white mb-10 border-[3px] border-[#FF5A1F]/60 shadow-xl shadow-orange-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#FF5A1F]/30 via-orange-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] text-xs font-bold mb-3 border border-[#FF5A1F]/30">
            <Lock className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Защита персональных данных (ЗРУ-547)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            Политика конфиденциальности
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            Порядок сбора, обработки и защиты информации пользователей BoshlaUp (https://boshlaup.uz)
          </p>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            Дата вступления в силу: 13 ноября 2026 г. • Республика Узбекистан
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Section 1 */}
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
            <strong className="text-slate-900">1.3.</strong> Использование Платформы, регистрация учетной записи или отправка данных через веб-формы сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональных данных.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">2.</span> Состав собираемых персональных данных
          </h2>
          <p className="font-bold text-slate-900">2.1. Данные, предоставляемые Пользователем самостоятельно при регистрации, заполнении профиля или публикации карточки Стартапа:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Имя, фамилия или публичный псевдоним (никнейм);</li>
            <li>Контактные сведения: адрес электронной почты (Email), имя пользователя (username) или прямая ссылка на аккаунт в мессенджере Telegram;</li>
            <li>Сведения о Проекте: название, краткое и полное описание, ссылки на веб-сайты и репозитории, визуальные материалы (логотипы, скриншоты) и добровольно указанные показатели проекта;</li>
            <li>Тексты комментариев, отзывов, сообщений и оценок (апвоутов), оставленных на Платформе.</li>
          </ul>

          <p className="font-bold text-slate-900 pt-2">2.2. Технические данные, собираемые автоматически в процессе использования сайта:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>IP-адрес устройства Пользователя, тип и версия интернет-браузера, тип устройства и операционной системы;</li>
            <li>Файлы cookie (куки), параметры сессии и обезличенные данные аналитики посещаемости (время на сайте, просмотренные страницы, действия с элементами интерфейса) для обеспечения корректной работы сайта и защиты от автоматических накруток.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">3.</span> Цели обработки персональных данных
          </h2>
          <p className="font-bold text-slate-900">3.1. Администрация осуществляет сбор и обработку персональных данных исключительно в следующих законных целях:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Идентификация Пользователя и предоставление доступа к личному кабинету и функциональным возможностям Платформы;</li>
            <li>Публикация карточек стартапов и обеспечение возможности прямой коммуникации между Фаундерами, Тестировщиками и Инвесторами;</li>
            <li>Обеспечение информационной безопасности, предотвращение спама, мошенничества и искусственной накрутки рейтингов;</li>
            <li>Направление сервисных и информационных уведомлений (о статусе модерации проекта, новых комментариях, ответах на отзывы, еженедельных дайджестах Платформы);</li>
            <li>Анализ пользовательского опыта, исправление технических ошибок и улучшение качества работы Платформы.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">4.</span> Публичность данных и передача третьим лицам
          </h2>
          <p>
            <strong className="text-slate-900">4.1.</strong> Пользователь осознает и соглашается с тем, что сведения, размещенные им в публичной карточке Проекта и открытом профиле (имя/никнейм автора, название и описание стартапа, ссылка на продукт и контактный Telegram для связи, указанный в карточке), становятся общедоступными для всех посетителей Платформы.
          </p>
          <p className="font-bold text-slate-900">4.2. Администрация не продает, не обменивает и не передает непубличные персональные данные Пользователей (закрытый адрес электронной почты, технические логи) третьим лицам, за исключением следующих случаев:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Наличие прямого и явного согласия самого Пользователя на такие действия;</li>
            <li>Использование проверенных технических подрядчиков (хостинг-провайдеров, систем аутентификации и облачной инфраструктуры), обеспечивающих бесперебойную работу Платформы при условии соблюдения ими режима конфиденциальности;</li>
            <li>Поступление официального мотивированного запроса от уполномоченных государственных органов Республики Узбекистан в порядке и на основаниях, установленных законодательством.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">5.</span> Меры по защите и сроки хранения данных
          </h2>
          <p>
            <strong className="text-slate-900">5.1.</strong> Администрация принимает необходимые правовые, организационные и технические меры для защиты персональных данных Пользователей от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования и распространения (применение защищенного протокола шифрования HTTPS, хэширование паролей, разграничение прав доступа к базам данных).
          </p>
          <p>
            <strong className="text-slate-900">5.2.</strong> Персональные данные хранятся в течение всего срока действия учетной записи Пользователя на Платформе либо до момента отзыва Пользователем согласия на их обработку.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">6.</span> Права Пользователя
          </h2>
          <p className="font-bold text-slate-900">6.1. В соответствии с законодательством Республики Узбекистан Пользователь имеет право:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Получать информацию о наличии у Администрации его персональных данных и ознакомляться с ними;</li>
            <li>Самостоятельно редактировать, дополнять или актуализировать свои персональные данные через настройки личного кабинета;</li>
            <li>Требовать блокирования или полного удаления своей учетной записи, опубликованных Проектов и персональных данных путем направления запроса на электронную почту Администрации <a href="mailto:info@boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">info@boshlaup.uz</a>. Удаление данных производится в течение 5 (пяти) рабочих дней с момента подтверждения запроса.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">7.</span> Использование файлов Cookie
          </h2>
          <p>
            <strong className="text-slate-900">7.1.</strong> Платформа использует файлы cookie для поддержания активной сессии авторизации, запоминания выбранного языка интерфейса (RU/UZ/EN) и корректного учета голосов (апвоутов).
          </p>
          <p>
            <strong className="text-slate-900">7.2.</strong> Пользователь может в любой момент ограничить или отключить сохранение файлов cookie в настройках своего интернет-браузера, однако это может привести к некорректной работе отдельных функций Платформы.
          </p>
        </section>

        {/* Section 8: Contacts */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">8.</span> Заключительные положения и контакты
          </h2>
          <p>
            <strong className="text-slate-900">8.1.</strong> Актуальная версия настоящей Политики круглосуточно находится в свободном доступе в сети Интернет по адресу:{' '}
            <a href="https://boshlaup.uz/privacy" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz/privacy</a>.
          </p>
          <p>
            <strong className="text-slate-900">8.2.</strong> По всем вопросам, предложениям или запросам, связанным с обработкой и защитой персональных данных, Пользователь может обратиться к Администрации:
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-200 mt-2">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900 w-1/3">Электронная почта:</td>
                  <td className="p-3 sm:p-4">
                    <a href="mailto:info@boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>info@boshlaup.uz</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Telegram-поддержка:</td>
                  <td className="p-3 sm:p-4">
                    <a href="https://t.me/boshlaup_admin" target="_blank" rel="noopener noreferrer" className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5">
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
