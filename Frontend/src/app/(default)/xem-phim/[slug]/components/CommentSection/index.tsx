const CommentSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-[#191b24]/60 px-0 py-6 lg:px-1 lg:py-0 rounded-2xl transition-colors duration-300">
      <div className="flex items-center gap-4 px-4 lg:px-0 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <span>💬</span>
          <span>Bình luận (0)</span>
        </h3>
        <div className="flex border border-gray-300 dark:border-white/20 rounded-lg p-0.5 text-sm">
          <button type="button" className="bg-white text-black px-3 py-1 rounded-md font-medium">
            Bình luận
          </button>
          <button type="button" className="text-gray-800 dark:text-white px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 transition">
            Đánh giá
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <img
            src="/images/avatars/default.png"
            alt="Avatar"
            className="w-11 h-11 rounded-full border-2 border-white/20 object-cover bg-gray-800"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Bình luận với tên</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">PHAN DUY KHAI</span>
          </div>
        </div>

        <div className="bg-gray-200 dark:bg-white/5 rounded-xl p-2 border border-transparent focus-within:border-gray-400 dark:focus-within:border-white/20 transition-all">
          <div className="relative">
            <textarea
              className="w-full bg-transparent text-gray-900 dark:text-white p-3 outline-none resize-none text-sm placeholder-gray-500"
              rows={3}
              placeholder="Viết bình luận..."
              maxLength={1000}
            />
            <span className="absolute top-2 right-2 text-[11px] text-gray-500 dark:text-gray-400">0 / 1000</span>
          </div>

          <div className="flex items-center justify-between px-2 pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="w-8 h-5 border border-gray-400 dark:border-white/30 rounded-full relative flex items-center p-0.5">
                  <div className="w-3 h-3 bg-gray-500 dark:bg-white/50 rounded-full" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Tiết lộ?</span>
              </label>
              <button type="button" className="text-xs text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition">
                GIF
              </button>
            </div>
            <button
              type="button"
              className="bg-white/10 text-gray-400 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed"
            >
              <span>Gửi</span>
              <span>➤</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 mx-4 lg:mx-0 bg-black/20 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 text-gray-400">
        <span className="text-4xl opacity-50">💭</span>
        <p>Chưa có bình luận nào</p>
      </div>
    </section>
  );
};

export default CommentSection;
