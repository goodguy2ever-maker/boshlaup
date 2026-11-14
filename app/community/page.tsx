'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  ChevronUp,
  Plus,
  Users,
  Sparkles,
  Search,
  MessageCircle,
  HelpCircle,
  TrendingUp,
  User,
  Lightbulb,
  Target,
  Coffee,
  X
} from 'lucide-react';

export default function CommunityPage() {
  const { t, lang } = useApp();
  const comm = (t as any).community || {};

  const CATEGORIES = [
    { id: 'Все', label: comm.tabs?.all || 'Все темы', icon: MessageSquare },
    { id: 'Co-founders', label: comm.tabs?.cofounder || 'Поиск кофаундера', icon: Users },
    { id: 'Advice', label: comm.tabs?.advice || 'Советы фаундерам', icon: Lightbulb },
    { id: 'Feedback', label: comm.tabs?.feedback || 'Запрос фидбека', icon: Target },
    { id: 'General', label: comm.tabs?.general || 'Общее обсуждение', icon: Coffee },
  ];
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Advice');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const url = selectedCategory === 'Все'
          ? '/api/community'
          : `/api/community?category=${selectedCategory}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [selectedCategory]);

  const handleUpvote = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1, hasUpvoted: true } : p));

    try {
      await fetch(`/api/community/${postId}/upvote`, { method: 'POST' });
    } catch {
      // rollback if needed
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author, category }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setPosts([ { ...newPost, _count: { comments: 0 } }, ...posts]);
        setTitle('');
        setContent('');
        setAuthor('');
        setShowNewPostModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q) ||
      post.author?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF5A1F] text-xs font-bold mb-2 border border-orange-100">
            <Users className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>{comm.badge || 'Комьюнити фаундеров и создателей'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {comm.title || 'Обсуждения & Нетворкинг'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {comm.subtitle || 'Задавайте вопросы, делитесь инсайтами, ищите кофаундеров и получайте фидбек'}
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{comm.createTopic || 'Создать тему'}</span>
        </button>
      </div>

      {/* Filter Bar (Identical form to Catalog FilterBar) */}
      <div className="space-y-3 mb-6">
        {/* Row 1: Unified Segmented Navigation in white card container */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-1.5 rounded-2xl border-2 border-orange-200/80 hover:border-[#FF5A1F]/60 shadow-2xs hover:shadow-md hover:shadow-orange-500/5 transition-all">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => {
              const isSelected = selectedCategory === c.id;
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Unified Command Bar (Search + Count) */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-orange-200/80 hover:border-[#FF5A1F]/60 shadow-2xs hover:shadow-md hover:shadow-orange-500/5 transition-all flex items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={comm.searchPlaceholder || 'Поиск по темам, вопросам или авторам...'}
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl shrink-0">
            {comm.topicsCount || 'Тем:'} <span className="font-bold text-slate-900">{filteredPosts.length}</span>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">
            {searchQuery
              ? (lang === 'uz' ? 'Qidiruv bo‘yicha hech narsa topilmadi' : lang === 'en' ? 'Nothing found for your search' : 'Ничего не найдено по вашему запросу')
              : (lang === 'uz' ? 'Ushbu toifada hali mavzular yo‘q' : lang === 'en' ? 'No topics in this category yet' : 'Пока нет тем в этой категории')}
          </h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchQuery
              ? (lang === 'uz' ? 'Qidiruv so‘zini o‘zgartirib ko‘ring' : lang === 'en' ? 'Try changing your search terms' : 'Попробуйте изменить формулировку поиска')
              : (lang === 'uz' ? 'Birinchi bo‘lib muhokama boshlang!' : lang === 'en' ? 'Be the first to start a discussion!' : 'Будьте первым, кто начнет обсуждение!')}
          </p>
          <button
            onClick={() => {
              if (searchQuery) setSearchQuery('');
              else setShowNewPostModal(true);
            }}
            className="text-sm font-bold text-[#FF5A1F] hover:underline"
          >
            {searchQuery
              ? (lang === 'uz' ? 'Qidiruvni tozalash' : lang === 'en' ? 'Clear search' : 'Очистить поиск')
              : (lang === 'uz' ? '+ Birinchi postni yozish' : lang === 'en' ? '+ Write first post' : '+ Написать первый пост')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="group block bg-white rounded-2xl p-5 border-2 border-slate-200/90 hover:border-[#FF5A1F] hover:shadow-xl hover:shadow-orange-500/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5A1F] border border-orange-100">
                      {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {post.author}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#FF5A1F] transition-colors mb-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <span>
                        {post._count?.comments || 0}{' '}
                        {lang === 'uz' ? 'ta fikr' : lang === 'en' ? 'answers' : 'ответов'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={(e) => handleUpvote(post.id, e)}
                  className={`shrink-0 flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl border transition-all px-2 ${
                    post.hasUpvoted
                      ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:bg-orange-50/50 hover:text-[#FF5A1F]'
                  }`}
                >
                  <ChevronUp className="w-4 h-4 stroke-[3]" />
                  <span className="text-xs font-bold">{post.upvotes}</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-xl text-slate-900">
                {lang === 'uz' ? 'Yangi muhokama mavzusi' : lang === 'en' ? 'New Community Topic' : 'Новая тема в комьюнити'}
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lang === 'uz' ? 'Mavzu toifasi' : lang === 'en' ? 'Topic Category' : 'Категория темы'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F]"
                >
                  <option value="Advice">{comm.tabs?.advice || 'Советы фаундерам'}</option>
                  <option value="Co-founders">{comm.tabs?.cofounder || 'Поиск кофаундера'}</option>
                  <option value="Feedback">{comm.tabs?.feedback || 'Запрос фидбека'}</option>
                  <option value="General">{comm.tabs?.general || 'Общее обсуждение'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lang === 'uz' ? 'Mavzu sarlavhasi *' : lang === 'en' ? 'Topic Title *' : 'Заголовок темы *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    lang === 'uz'
                      ? 'Nima haqida so‘ramoqchi yoki aytmoqchisiz?'
                      : lang === 'en'
                      ? 'What do you want to ask or share?'
                      : 'О чем хотите спросить или рассказать?'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lang === 'uz' ? 'Ismingiz yoki asoschi taxallusi *' : lang === 'en' ? 'Your Name or Founder Handle *' : 'Ваше имя или фаундер-ник *'}
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder={
                    lang === 'uz'
                      ? 'Masalan, Timur (AI Startup)'
                      : lang === 'en'
                      ? 'e.g., Alex (FinTech Founder)'
                      : 'Например, Тимур (AI Startup)'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  {lang === 'uz' ? 'Mavzu matni *' : lang === 'en' ? 'Topic Details *' : 'Текст публикации *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    lang === 'uz'
                      ? 'Tafsilotlar, savol yoki taklifingizni yozing...'
                      : lang === 'en'
                      ? 'Share your details, question, or proposal...'
                      : 'Поделитесь подробностями, вопросом или предложением...'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {lang === 'uz' ? 'Bekor qilish' : lang === 'en' ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {creating
                    ? (lang === 'uz' ? 'Yaratilmoqda...' : lang === 'en' ? 'Posting...' : 'Создаем...')
                    : (lang === 'uz' ? 'Chop etish' : lang === 'en' ? 'Publish' : 'Опубликовать')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
