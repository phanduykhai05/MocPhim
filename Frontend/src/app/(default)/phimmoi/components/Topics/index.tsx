"use client";
import React, { useState } from 'react';
import TopicCard from '@/app/(default)/phimmoi/components/Topics/components/TopicCard';
import { TOPICS_DATA } from './data';
import { Highlighter } from "@/components/ui/highlighter"

const TopicGrid = () => {
  const [showAll, setShowAll] = useState(false);
  
  // Trên mobile (cuộn ngang) chúng ta hiện hết hoặc 1 phần tùy ý
  // Ở đây mình giữ logic hiện 4 cái đầu + More cho đồng bộ
  const initialDisplayCount = 4;
  const visibleTopics = showAll ? TOPICS_DATA : TOPICS_DATA.slice(0, initialDisplayCount);
  const remainingCount = TOPICS_DATA.length - initialDisplayCount;

  return (
    <section className="w-full max-w-[1900px] mx-auto px-4 md:px-[50px] py-0 relative z-10 overflow-hidden md:mt-[-80px] z-30 mt-[-50px]">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-[2rem] font-semibold text-white drop-shadow-[0_2px_1px_rgba(0,0,0,0.3)]">
          <Highlighter action="underline" iterations={1} animationDuration={1000}>{`Bạn đang quan tâm gì?`}</Highlighter>
        </h2>
      </div>

      {/* - Mobile: flex và cho phép cuộn ngang (overflow-x-auto)
          - Desktop (md): quay lại grid 4-8 cột
          - scrollbar-hide: class tùy chỉnh để ẩn thanh cuộn xấu xí
      */}
      <div className="
        flex flex-nowrap overflow-x-auto gap-4 pb-4
        md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 md:overflow-visible md:pb-0
        scrollbar-hide
      ">
        {visibleTopics.map((topic) => (
          <TopicCard 
            key={topic.id} 
            name={topic.name} 
            color={topic.color} 
            href={topic.href} 
          />
        ))}

        {!showAll && remainingCount > 0 && (
          <TopicCard 
            isMoreBtn 
            count={remainingCount} 
            name="" color="" href="" 
            onClick={() => setShowAll(true)} 
          />
        )}
      </div>
    </section>
  );
};

export default TopicGrid;