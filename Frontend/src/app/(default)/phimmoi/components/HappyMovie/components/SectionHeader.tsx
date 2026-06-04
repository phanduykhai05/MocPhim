import React from 'react';

interface HeaderProps {
  title: string;
  slug: string;
  href?: string;
}

export default function SectionHeader({ title, slug, href }: HeaderProps) {
  return (
    <div className="flex items-center justify-start gap-4 relative min-h-[44px] mb-5">
      <h2 className="text-2xl sm:text-[2rem] leading-tight font-semibold m-0 text-gray-900 dark:text-white drop-shadow-md">
        {title}
      </h2>
      <div className="ml-auto sm:ml-0">
        <a
          href={href ?? `/c/${slug}`}
          className="flex items-center gap-1.5 text-sm sm:text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span>Xem thêm</span>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}