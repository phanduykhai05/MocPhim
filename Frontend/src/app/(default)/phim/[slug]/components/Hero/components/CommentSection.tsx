import React from 'react';

export const CommentSection = () => {
  return (
    <div className="px-6 lg:px-10 py-8 mt-4">
      {/* Header Comment */}
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>💬</span> Bình luận (0)
        </h3>
        <div className="flex border border-white/20 rounded-lg p-0.5 text-sm">
          <button className="bg-white text-black px-3 py-1 rounded-md font-medium">Bình luận</button>
          <button className="text-white px-3 py-1 rounded-md hover:bg-white/10 transition">Đánh giá</button>
        </div>
      </div>

      {/* Ô nhập bình luận */}
      <div className="flex flex-col gap-4">
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

      {/* Trạng thái trống */}
      <div className="mt-8 bg-black/20 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-gray-400">
         <span className="text-4xl opacity-50">💭</span>
         <p>Chưa có bình luận nào</p>
      </div>
    </div>
  );
};