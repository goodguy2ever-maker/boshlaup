import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200/80 bg-white py-10 text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-zinc-900 tracking-tight">
            Boshla<span className="text-[#FF5A1F]">Up</span>
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500 font-medium">Платформа запуска IT-стартапов в Узбекистане</span>
        </div>

        <div className="flex items-center gap-5 font-medium text-zinc-600">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Каталог</Link>
          <Link href="/community" className="hover:text-zinc-950 transition-colors">Сообщество</Link>
          <Link href="/submit" className="hover:text-zinc-950 transition-colors">Опубликовать</Link>
          <a
            href="https://t.me/boshlaupbot"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-950 transition-colors text-zinc-400"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
