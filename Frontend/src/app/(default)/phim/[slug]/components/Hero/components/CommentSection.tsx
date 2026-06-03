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
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

interface Props { slug: string; }

export const CommentSection = ({ slug }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [replyText, setReplyText] = useState('');
  const PAGE_SIZE = 10;

  const load = useCallback(async (p = 0) => {
    setLoading(true);
    const res = await apiGetComments(slug, p, PAGE_SIZE, user?.id as any);
    setComments(p === 0 ? res.comments : (prev) => [...prev, ...res.comments] as any);
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

  async function handleReply() {
    if (!replyText.trim() || !user || !replyTo) return;
    setSubmitting(true);
    try {
      const c = await apiPostComment(slug, replyText.trim(), false, replyTo.id);
      if (c) {
        setComments(prev => prev.map(cm =>
          cm.id === replyTo.id ? { ...cm, replies: [...(cm.replies ?? []), c] } : cm
        ));
      }
      setReplyText(''); setReplyTo(null);
    } catch { /* silent */ }
    setSubmitting(false);
  }

  async function handleVote(id: number, voteType: 'up' | 'down') {
    if (!user) return;
    const updated = await apiVoteComment(id, voteType);
    if (!updated) return;
    setComments(prev => prev.map(c => c.id === id ? { ...c, upvotes: updated.upvotes, downvotes: updated.downvotes, userVote: updated.userVote } : c));
  }

  async function handleDelete(id: number) {
    if (!user) return;
    const ok = await apiDeleteComment(id);
    if (ok) setComments(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="px-0 lg:px-10 py-8 mt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>💬</span> Bình luận ({total})
        </h3>
        <div className="flex border border-white/20 rounded-lg p-0.5 text-sm">
          <button type="button" className="bg-white text-black px-3 py-1 rounded-md font-medium">Bình luận</button>
          <button type="button" className="text-white px-3 py-1 rounded-md hover:bg-white/10 transition">Đánh giá</button>
        </div>
      </div>

      {/* Input */}
      {user ? (
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-4">
            <img src={user.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name ?? 'U')}`} alt="Avatar"
              className="w-11 h-11 rounded-full border-2 border-white/20 object-cover bg-gray-800" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Bình luận với tên</span>
              <span className="text-sm font-medium text-white">{user.name}</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2 border border-transparent focus-within:border-white/20 transition-all">
            <div className="relative">
              <textarea
                className="w-full bg-transparent text-white p-3 outline-none resize-none text-sm placeholder-gray-500"
                rows={3} placeholder="Viết bình luận..." maxLength={1000}
                value={text} onChange={e => setText(e.target.value)}
              />
              <span className="absolute top-2 right-2 text-[11px] text-gray-500">{text.length} / 1000</span>
            </div>
            <div className="flex items-center justify-between px-2 pb-1 flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setIsSpoiler(v => !v)}>
                  <div className={`w-8 h-5 rounded-full relative flex items-center p-0.5 transition-colors ${isSpoiler ? 'bg-yellow-500/60 border-yellow-500' : 'border border-white/30'}`}>
                    <div className={`w-3 h-3 rounded-full transition-transform ${isSpoiler ? 'translate-x-3 bg-white' : 'bg-white/50'}`} />
                  </div>
                  <span className="text-sm text-gray-400">Tiết lộ?</span>
                </label>
              </div>
              <button type="button" onClick={handleSubmit} disabled={submitting || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                {submitting ? 'Đang gửi...' : <><span>Gửi</span><span>➤</span></>}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-6">
          <a href="/login" className="text-blue-400 hover:underline">Đăng nhập</a> để bình luận.
        </p>
      )}

      {/* List */}
      {loading && comments.length === 0 ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2"><div className="h-4 bg-white/10 rounded w-1/4" /><div className="h-12 bg-white/10 rounded" /></div>
          </div>
        ))}</div>
      ) : comments.length === 0 ? (
        <div className="bg-black/20 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-gray-400">
          <span className="text-4xl opacity-50">💭</span>
          <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} user={user}
              onVote={handleVote} onDelete={handleDelete}
              onReply={() => setReplyTo({ id: comment.id, name: comment.userName })}
            />
          ))}

          {/* Reply modal */}
          {replyTo && user && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setReplyTo(null)}>
              <div className="bg-[#1e2030] rounded-2xl p-5 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <p className="text-sm text-gray-400 mb-3">Trả lời <strong className="text-white">@{replyTo.name}</strong></p>
                <textarea className="w-full bg-white/5 text-white p-3 rounded-xl outline-none resize-none text-sm placeholder-gray-500 border border-white/10 focus:border-white/20"
                  rows={3} placeholder="Viết trả lời..." maxLength={1000}
                  value={replyText} onChange={e => setReplyText(e.target.value)} autoFocus />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => setReplyTo(null)} className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 transition">Huỷ</button>
                  <button type="button" onClick={handleReply} disabled={submitting || !replyText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm transition">
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Load more */}
          {comments.length < total && (
            <button type="button" onClick={() => load(page + 1)} disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition disabled:opacity-50">
              {loading ? 'Đang tải...' : `Xem thêm ${total - comments.length} bình luận`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface CardProps {
  comment: CommentItem;
  user: any;
  onVote: (id: number, type: 'up' | 'down') => void;
  onDelete: (id: number) => void;
  onReply: () => void;
}
function CommentCard({ comment, user, onVote, onDelete, onReply }: CardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = user?.id === comment.userId;
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="flex gap-4">
      <img src={comment.userAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userName)}`} alt={comment.userName}
        className="w-11 h-11 rounded-full border border-white/20 object-cover bg-gray-800 shrink-0 self-start" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-white">{comment.userName}</span>
          <span className="text-xs text-gray-500">{formatRelative(comment.createdAt)}</span>
          {comment.isSpoiler && (
            <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 rounded">Spoiler</span>
          )}
        </div>

        <p className={`text-sm text-gray-200 break-words mb-2 ${comment.isSpoiler ? 'blur-sm hover:blur-none transition-all cursor-pointer' : ''}`}>
          {comment.content}
        </p>

        <div className="flex items-center gap-1 flex-wrap">
          {/* Vote */}
          <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
            <button type="button" onClick={() => onVote(comment.id, 'up')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${comment.userVote === 'up' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm11.3-395.3l112 112c4.6 4.6 5.9 11.5 3.5 17.4s-8.3 9.9-14.8 9.9l-64 0 0 96c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-96-64 0c-6.5 0-12.3-3.9-14.8-9.9s-1.1-12.9 3.5-17.4l112-112c6.2-6.2 16.4-6.2 22.6 0z" />
              </svg>
              {comment.upvotes}
            </button>
            <button type="button" onClick={() => onVote(comment.id, 'down')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${comment.userVote === 'down' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM244.7 395.3l-112-112c-4.6-4.6-5.9-11.5-3.5-17.4s8.3-9.9 14.8-9.9l64 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 64 0c6.5 0 12.3 3.9 14.8 9.9s1.1 12.9-3.5 17.4l-112 112c-6.2 6.2-16.4 6.2-22.6 0z" />
              </svg>
              {comment.downvotes}
            </button>
          </div>

          {/* Reply */}
          {user && (
            <button type="button" onClick={onReply}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
              </svg>
              Trả lời
            </button>
          )}

          {/* Delete */}
          {(isOwner || isAdmin) && (
            <button type="button" onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition ml-auto">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
              Xóa
            </button>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            <button type="button" onClick={() => setShowReplies(v => !v)}
              className="text-xs text-blue-400 hover:text-blue-300 transition mb-2">
              {showReplies ? 'Ẩn' : `Xem ${comment.replies.length} trả lời`}
            </button>
            {showReplies && (
              <div className="space-y-3 border-l-2 border-white/10 pl-4">
                {comment.replies.map(r => (
                  <div key={r.id} className="flex gap-3">
                    <img src={r.userAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.userName)}`} alt={r.userName}
                      className="w-8 h-8 rounded-full border border-white/20 object-cover bg-gray-800 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white">{r.userName}</span>
                        <span className="text-[11px] text-gray-500">{formatRelative(r.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-300 break-words">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
