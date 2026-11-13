import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Mail, Send, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Пользовательское соглашение (Публичная оферта) | BoshlaUp',
  description: 'Пользовательское соглашение и публичная оферта платформы BoshlaUp (boshlaup.uz) в соответствии с законодательством Республики Узбекистан.',
};

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Официальный юридический документ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            Пользовательское соглашение
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            Публичная оферта интернет-платформы BoshlaUp (https://boshlaup.uz)
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
            <span className="text-[#FF5A1F]">1.</span> Термины и общие положения
          </h2>
          <p>
            <strong className="text-slate-900">1.1. Платформа (Администрация)</strong> — Интернет-ресурс BoshlaUp, расположенный в сети Интернет по адресу{' '}
            <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>, администрируемый владельцем доменного имени{' '}
            <strong className="text-slate-900">Nazarov Dilshodbek Farhodjon o‘g‘li</strong>.
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

        {/* Section 2 */}
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
            <strong className="text-slate-900">2.3.</strong> Базовый функционал Платформы предоставляется Пользователям на безвозмездной основе по принципу «как есть» (as is). В случае введения дополнительных платных сервисов (приоритетное размещение, закрепление публикаций, расширенная аналитика и др.) условия их предоставления регулируются отдельными тарифами, публикуемыми на сайте.
          </p>
        </section>

        {/* Section 3 */}
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

        {/* Section 4 */}
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

        {/* Section 5 */}
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
          <p>
            <strong className="text-slate-900">5.3.</strong> Платформа содержит гиперссылки на внешние веб-сайты и сервисы третьих лиц. Администрация не контролирует такие ресурсы и не несет ответственности за их доступность, содержание и политику безопасности.
          </p>
        </section>

        {/* Section 6 */}
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

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">7.</span> Порядок разрешения споров и заключительные положения
          </h2>
          <p>
            <strong className="text-slate-900">7.1.</strong> В случае обнаружения нарушения авторских прав или размещения недостоверной информации правообладатель вправе направить мотивированное обращение Администрации по контактам, указанным в разделе 8. Обращения рассматриваются в срок до 5 (пяти) рабочих дней.
          </p>
          <p>
            <strong className="text-slate-900">7.2.</strong> Все споры и разногласия между Сторонами разрешаются путем переговоров. При недостижении согласия спор подлежит рассмотрению в судебном порядке в соответствии с действующим законодательством Республики Узбекистан.
          </p>
          <p>
            <strong className="text-slate-900">7.3.</strong> Администрация вправе в одностороннем порядке вносить изменения в настоящее Соглашение. Новая редакция вступает в силу с момента ее размещения на сайте https://boshlaup.uz.
          </p>
        </section>

        {/* Section 8: Contacts */}
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="text-[#FF5A1F]">8.</span> Реквизиты и контакты Администрации
          </h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900 w-1/3">Наименование ресурса:</td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-800">Платформа BoshlaUp</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Владелец / Администратор:</td>
                  <td className="p-3 sm:p-4 text-slate-700">Nazarov Dilshodbek Farhodjon o‘g‘li</td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Официальный веб-сайт:</td>
                  <td className="p-3 sm:p-4">
                    <a href="https://boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline">https://boshlaup.uz</a>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-bold text-slate-900">Электронная почта:</td>
                  <td className="p-3 sm:p-4">
                    <a href="mailto:info@boshlaup.uz" className="text-[#FF5A1F] font-semibold hover:underline flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>info@boshlaup.uz</span>
                    </a>
                  </td>
                </tr>
                <tr className="bg-slate-50/60">
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
