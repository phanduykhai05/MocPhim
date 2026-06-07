export const CommentSection = () => {
  return (
    <div className="px-0 lg:px-10 py-8 mt-4">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>💬</span> Bình luận
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.95-5.95 3.03-2.496a1.5 1.5 0 0 1 2.122 2.122l-3.03 2.496M11.42 15.17 8.39 12.14" />
          </svg>
        </div>
        <div>
          <p className="text-white font-medium mb-1">Tính năng đang phát triển</p>
          <p className="text-sm text-gray-500">Hệ thống bình luận sẽ được ra mắt trong thời gian tới.</p>
        </div>
      </div>
    </div>
  );
};
