import React from 'react';

const fakeComments = [
  {
    id: 1,
    author: "RoX",
    tag: "RoX",
    isVerified: true,
    avatar: "/images/avatars/default.png",
    date: "2 giờ trước",
    episode: "P.1 - Tập 9",
    episodeLink: "/xem-phim/lop-hoc-cua-tae-ri.360114",
    content: "tập 10 sao ch thấy đâu nhỉ ?",
    upvotes: 24,
    downvotes: 5
  },
  {
    id: 2,
    author: "Trần Thị B",
    tag: "Member",
    isVerified: false,
    avatar: "/images/avatars/default.png",
    date: "5 giờ trước",
    episode: "P.1 - Tập 8",
    episodeLink: "/xem-phim/lop-hoc-cua-tae-ri.360114",
    content: "Phần kết hồi hơi buồn, nhưng tổng thể vẫn rất tốt. Bộ phim đáng xem!",
    upvotes: 18,
    downvotes: 2
  },
  {
    id: 3,
    author: "Lê Minh C",
    tag: "VIP",
    isVerified: true,
    avatar: "/images/avatars/default.png",
    date: "1 ngày trước",
    episode: "P.1 - Tập 7",
    episodeLink: "/xem-phim/lop-hoc-cua-tae-ri.360114",
    content: "🎬 Bộ phim này là một trong những bộ phim hay nhất mình từng xem. Chất lượng hình ảnh tuyệt vời!",
    upvotes: 45,
    downvotes: 1
  },
  {
    id: 4,
    author: "Phạm Sơn D",
    tag: "Moderator",
    isVerified: true,
    avatar: "/images/avatars/default.png",
    date: "1 ngày trước",
    episode: "P.1 - Tập 6",
    episodeLink: "/xem-phim/lop-hoc-cua-tae-ri.360114",
    content: "Spoiler alert: Tính cách của nhân vật chính thay đổi rất nhiều ở cuối phim...",
    upvotes: 12,
    downvotes: 3
  },
  {
    id: 5,
    author: "Vũ Hương E",
    tag: null,
    isVerified: false,
    avatar: "/images/avatars/default.png",
    date: "2 ngày trước",
    episode: "P.1 - Tập 5",
    episodeLink: "/xem-phim/lop-hoc-cua-tae-ri.360114",
    content: "Một bộ phim tuyệt vời! Mình yêu thích từng cảnh quay.",
    upvotes: 32,
    downvotes: 0
  }
];

export const CommentSection = () => {
  return (
    <div className="px-0 lg:px-10 py-8 mt-4">
      {/* Header Comment */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>💬</span> Bình luận ({fakeComments.length})
        </h3>
        <div className="flex border border-white/20 rounded-lg p-0.5 text-sm">
          <button className="bg-white text-black px-3 py-1 rounded-md font-medium">Bình luận</button>
          <button className="text-white px-3 py-1 rounded-md hover:bg-white/10 transition">Đánh giá</button>
        </div>
      </div>

      {/* Ô nhập bình luận */}
      <div className="flex flex-col gap-4 mb-8">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img src="/images/avatars/default.png" alt="Avatar" className="w-11 h-11 rounded-full border-2 border-white/20 object-cover bg-gray-800" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Bình luận với tên</span>
            <span className="text-sm font-medium text-white">PHAN DUY KHAI</span>
          </div>
        </div>

        {/* Textarea Area */}
        <div className="bg-white/5 rounded-xl p-2 border border-transparent focus-within:border-white/20 transition-all">
          <div className="relative">
            <textarea 
              className="w-full bg-transparent text-white p-3 outline-none resize-none text-sm placeholder-gray-500" 
              rows={3} 
              placeholder="Viết bình luận..."
              maxLength={1000}
            ></textarea>
            <span className="absolute top-2 right-2 text-[11px] text-gray-500">0 / 1000</span>
          </div>

          {/* Tools & Submit */}
          <div className="flex items-center justify-between px-2 pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-4">
               {/* Spoil Toggle */}
               <label className="flex items-center gap-2 cursor-pointer select-none">
                 <div className="w-8 h-5 border border-white/30 rounded-full relative flex items-center p-0.5">
                    <div className="w-3 h-3 bg-white/50 rounded-full"></div>
                 </div>
                 <span className="text-sm text-gray-400">Tiết lộ?</span>
               </label>
               <button className="text-xs text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">GIF</button>
            </div>
            <button className="bg-white/10 text-gray-400 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed">
              Gửi <span>➤</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {fakeComments.map((comment) => (
          <div key={comment.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-b-0">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-12 h-12 rounded-full border border-white/20 object-cover bg-gray-800"
              />
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* User name with tag */}
                  <div className="flex items-center gap-2">
                    {comment.tag && (
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                        comment.tag === 'RoX' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        comment.tag === 'VIP' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' :
                        comment.tag === 'Moderator' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                        'bg-gray-500/20 border-gray-500/50 text-gray-400'
                      }`}>
                        {comment.tag}
                      </span>
                    )}
                    <span className="text-sm font-medium text-white">{comment.author}</span>
                    {comment.isVerified && (
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 640 512"
                      >
                        <path d="M0 241.1C0 161 65 96 145.1 96c38.5 0 75.4 15.3 102.6 42.5L320 210.7l72.2-72.2C419.5 111.3 456.4 96 494.9 96C575 96 640 161 640 241.1l0 29.7C640 351 575 416 494.9 416c-38.5 0-75.4-15.3-102.6-42.5L320 301.3l-72.2 72.2C220.5 400.7 183.6 416 145.1 416C65 416 0 351 0 270.9l0-29.7zM274.7 256l-72.2-72.2c-15.2-15.2-35.9-23.8-57.4-23.8C100.3 160 64 196.3 64 241.1l0 29.7c0 44.8 36.3 81.1 81.1 81.1c21.5 0 42.2-8.5 57.4-23.8L274.7 256zm90.5 0l72.2 72.2c15.2 15.2 35.9 23.8 57.4 23.8c44.8 0 81.1-36.3 81.1-81.1l0-29.7c0-44.8-36.3-81.1-81.1-81.1c-21.5 0-42.2 8.5-57.4 23.8L365.3 256z" />
                      </svg>
                    )}
                  </div>

                  {/* Time and Episode */}
                  <span className="text-xs text-gray-400">{comment.date}</span>
                  <a
                    href={comment.episodeLink}
                    className="inline-block px-2 py-0.5 rounded text-xs bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition border border-gray-600/30"
                  >
                    {comment.episode}
                  </a>
                </div>
              </div>

              {/* Comment Text */}
              <p className="text-sm text-gray-200 mb-3 break-words">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Vote Buttons */}
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                  <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition text-xs text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm11.3-395.3l112 112c4.6 4.6 5.9 11.5 3.5 17.4s-8.3 9.9-14.8 9.9l-64 0 0 96c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-96-64 0c-6.5 0-12.3-3.9-14.8-9.9s-1.1-12.9 3.5-17.4l112-112c6.2-6.2 16.4-6.2 22.6 0z" />
                    </svg>
                    <span>{comment.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition text-xs text-gray-400 hover:text-white">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 512 512"
                    >
                      <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM244.7 395.3l-112-112c-4.6-4.6-5.9-11.5-3.5-17.4s8.3-9.9 14.8-9.9l64 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 64 0c6.5 0 12.3 3.9 14.8 9.9s1.1 12.9-3.5 17.4l-112 112c-6.2 6.2-16.4 6.2-22.6 0z" />
                    </svg>
                    <span>{comment.downvotes}</span>
                  </button>
                </div>

                {/* Reply Button */}
                <button className="flex items-center gap-1 px-3 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                  >
                    <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
                  </svg>
                  Trả lời
                </button>

                {/* More Options */}
                <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition ml-auto">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 448 512"
                  >
                    <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                  </svg>
                  <span>Thêm</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};