'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  apiGetComments, apiPostComment, apiVoteComment, apiDeleteComment,
  type CommentItem,
} from '@/lib/api/comments';

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

interface Props { slug: string; }

const CommentSection = ({ slug }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const PAGE_SIZE = 10;

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    const res = await apiGetComments(slug, p, PAGE_SIZE, user?.id as any);
    setComments(p === 0 ? res.comments : prev => [...prev, ...res.comments]);
    setTotal(res.total);
    setPage(p);
    setLoading(false);
  }, [slug, user]);

  useEffect(() => { load(0); }, [load]);

  async function handleSubmit() {
    if (!text.trim() || !user) return;
    setSubmitting(true);
    try {
      const c = await apiPostComment(slug, text.trim(), isSpoiler);
      if (c) { setComments(prev => [c, ...prev]); setTotal(t => t + 1); }
      setText(''); setIsSpoiler(false);
    } catch { /* silent */ }
    setSubmitting(false);
  }

  async function handleVote(id: number, voteType: 'up' | 'down') {
    if (!user) return;
    const updated = await apiVoteComment(id, voteType);
    if (!updated) return;
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote } : c
    ));
  }

  async function handleDelete(id: number) {
    if (!user) return;
    const ok = await apiDeleteComment(id);
    if (ok) { setComments(prev => prev.filter(c => c.id !== id)); setTotal(t => t - 1); }
  }

  return (
    <section className="bg-gray-100 dark:bg-[#191b24]/60 px-4 py-6 lg:px-1 lg:py-0 rounded-2xl transition-colors duration-300">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💬</span>
          <span>Bình luận ({total})</span>
        </h3>
        <div className="flex border border-gray-300 dark:border-white/20 rounded-lg p-0.5 text-sm">
          <button type="button" className="bg-white text-black px-3 py-1 rounded-md font-medium">Bình luận</button>
          <button type="button" className="text-gray-800 dark:text-white px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition">Đánh giá</button>
        </div>
      </div>

      {user ? (
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={user.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name ?? 'U')}`} alt="Avatar"
              className="w-11 h-11 rounded-full border-2 border-white/20 object-cover bg-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Bình luận với tên</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
            </div>
          </div>
          <div className="bg-gray-200 dark:bg-white/5 rounded-xl p-2 border border-transparent focus-within:border-gray-400 dark:focus-within:border-white/20 transition-all">
            <div className="relative">
              <textarea
                className="w-full bg-transparent text-gray-900 dark:text-white p-3 outline-none resize-none text-sm placeholder-gray-500"
                rows={3} placeholder="Viết bình luận..." maxLength={1000}
                value={text} onChange={e => setText(e.target.value)}
              />
              <span className="absolute top-2 right-2 text-[11px] text-gray-500">{text.length} / 1000</span>
            </div>
            <div className="flex items-center justify-between px-2 pb-1 flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setIsSpoiler(v => !v)}>
                <div className={`w-8 h-5 rounded-full relative flex items-center p-0.5 transition-colors ${isSpoiler ? 'bg-yellow-500/60' : 'border border-gray-400 dark:border-white/30'}`}>
                  <div className={`w-3 h-3 rounded-full transition-transform ${isSpoiler ? 'translate-x-3 bg-white' : 'bg-gray-500 dark:bg-white/50'}`} />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Tiết lộ?</span>
              </label>
              <button type="button" onClick={handleSubmit} disabled={submitting || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                {submitting ? 'Đang gửi...' : <><span>Gửi</span><span>➤</span></>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a href="/login" className="text-blue-500 hover:underline">Đăng nhập</a> để bình luận.
        </p>
      )}

      {loading && comments.length === 0 ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-white/10 rounded w-1/4" />
              <div className="h-10 bg-gray-300 dark:bg-white/10 rounded" />
            </div>
          </div>
        ))}</div>
      ) : comments.length === 0 ? (
        <div className="bg-black/20 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-gray-400">
          <span className="text-4xl opacity-50">💭</span>
          <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-white/5 last:border-0">
              <img src={c.userAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.userName)}`} alt={c.userName}
                className="w-9 h-9 rounded-full border border-gray-300 dark:border-white/20 object-cover bg-gray-800 shrink-0 self-start" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{c.userName}</span>
                  <span className="text-xs text-gray-400">{formatRelative(c.createdAt)}</span>
                  {c.isSpoiler && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-1.5 rounded">Spoiler</span>}
                </div>
                <p className={`text-sm text-gray-700 dark:text-gray-300 break-words mb-2 ${c.isSpoiler ? 'blur-sm hover:blur-none transition-all cursor-pointer' : ''}`}>
                  {c.content}
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5 bg-gray-200 dark:bg-white/5 rounded-lg p-0.5">
                    <button type="button" onClick={() => handleVote(c.id, 'up')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${c.userVote === 'up' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                      ▲ {c.upvotes}
                    </button>
                    <button type="button" onClick={() => handleVote(c.id, 'down')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${c.userVote === 'down' ? 'text-red-500' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                      ▼ {c.downvotes}
                    </button>
                  </div>
                  {(user?.id === c.userId || user?.roles?.includes('ROLE_ADMIN')) && (
                    <button type="button" onClick={() => handleDelete(c.id)}
                      className="ml-auto text-xs text-gray-400 hover:text-red-500 px-2 py-0.5 rounded transition">
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {comments.length < total && (
            <button type="button" onClick={() => load(page + 1)} disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/5 transition disabled:opacity-50">
              {loading ? 'Đang tải...' : `Xem thêm ${total - comments.length} bình luận`}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
