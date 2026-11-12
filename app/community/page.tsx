'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  User
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Все', label: 'Все темы', icon: '💬' },
  { id: 'Co-founders', label: 'Поиск кофаундера', icon: '🤝' },
  { id: 'Advice', label: 'Советы фаундерам', icon: '💡' },
  { id: 'Feedback', label: 'Запрос фидбека', icon: '🎯' },
  { id: 'General', label: 'Общее обсуждение', icon: '☕' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#ff6154] text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Комьюнити фаундеров и создателей</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Обсуждения & Нетворкинг
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Задавайте вопросы, делитесь инсайтами, ищите кофаундеров и получайте фидбек
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 bg-[#ff6154] hover:bg-[#ea4e41] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Создать тему</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {CATEGORIES.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          );
        })}
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
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">Пока нет тем в этой категории</h3>
          <p className="text-slate-500 text-sm mb-4">
            Будьте первым, кто начнет обсуждение!
          </p>
          <button
            onClick={() => setShowNewPostModal(true)}
            className="text-sm font-bold text-[#ff6154] hover:underline"
          >
            + Написать первый пост
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="group block bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ff6154] border border-orange-100">
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

                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#ff6154] transition-colors mb-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1 font-semibold text-slate-700">
                      <MessageCircle className="w-4 h-4 text-slate-400" />
                      <span>{post._count?.comments || 0} ответов</span>
                    </div>
                  </div>
                </div>

                {/* Upvote Button */}
                <button
                  onClick={(e) => handleUpvote(post.id, e)}
                  className={`shrink-0 flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl border transition-all px-2 ${
                    post.hasUpvoted
                      ? 'bg-[#ff6154] text-white border-[#ff6154]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-[#ff6154] hover:bg-orange-50/50 hover:text-[#ff6154]'
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
              <h3 className="font-extrabold text-xl text-slate-900">Новая тема в комьюнити</h3>
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
                  Категория темы
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
                >
                  <option value="Advice">💡 Советы фаундерам</option>
                  <option value="Co-founders">🤝 Поиск кофаундера</option>
                  <option value="Feedback">🎯 Запрос фидбека</option>
                  <option value="General">☕ Общее обсуждение</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Заголовок темы *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="О чем хотите спросить или рассказать?"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Ваше имя или фаундер-ник *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Например, Тимур (AI Startup)"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Текст публикации *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Поделитесь подробностями, вопросом или предложением..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-[#ff6154] hover:bg-[#ea4e41] text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                >
                  {creating ? 'Создаем...' : 'Опубликовать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
