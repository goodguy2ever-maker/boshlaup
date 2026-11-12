'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronUp,
  MessageCircle,
  User,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  // New comment state
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/community/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          setUpvotes(data.upvotes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPost();
  }, [id]);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    setHasUpvoted(true);
    setUpvotes(prev => prev + 1);

    try {
      await fetch(`/api/community/${id}/upvote`, { method: 'POST' });
    } catch {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/community/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setPost((prev: any) => ({
          ...prev,
          comments: [...(prev.comments || []), newComment],
        }));
        setAuthor('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#ff6154] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium text-sm">Загружаем обсуждение...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Тема не найдена</h2>
        <Link href="/community" className="text-[#ff6154] font-semibold hover:underline">
          Вернуться в комьюнити
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/community');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Назад</span>
      </button>

      {/* Main Post Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ff6154] border border-orange-100">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {post.author}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">
              {new Date(post.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>

          {/* Upvote button */}
          <button
            onClick={handleUpvote}
            disabled={hasUpvoted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              hasUpvoted
                ? 'bg-[#ff6154] text-white border-[#ff6154]'
                : 'bg-white border-slate-200 text-slate-700 hover:border-[#ff6154] hover:bg-orange-50/50'
            }`}
          >
            <ChevronUp className="w-4 h-4 stroke-[3]" />
            <span>{upvotes}</span>
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
          {post.title}
        </h1>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
          {post.content}
        </p>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-slate-400" />
          <span>Ответы ({post.comments?.length || 0})</span>
        </h2>

        {/* Add comment form */}
        <form onSubmit={handleAddComment} className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="mb-3">
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ваше имя / стартап..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
            />
          </div>
          <div className="mb-3">
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Напишите ответ или совет автору..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6154]/20 focus:border-[#ff6154]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingComment}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#ff6154] hover:bg-[#ea4e41] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? 'Отправляем...' : 'Ответить'}</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment: any) => (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-slate-400 text-xs">
              Пока ответов нет. Будьте первым!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
