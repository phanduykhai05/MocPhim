"use client";
import React, { useState, useEffect } from 'react';
import TopicCard from '@/app/(default)/phimmoi/components/Topics/components/TopicCard';
import { fetchCategories } from '@/lib/api/movie';
import { Highlighter } from "@/components/ui/highlighter"

// Palette màu cho card thể loại
const TOPIC_COLORS = [
  'rgb(85, 146, 65)',
  'rgb(144, 103, 129)',
  'rgb(100, 66, 89)',
  'rgb(45, 45, 75)',
  'rgb(155, 99, 75)',
  'rgb(107, 62, 125)',
  'rgb(130, 104, 135)',
  'rgb(148, 72, 112)',
  'rgb(66, 122, 138)',
  'rgb(180, 80, 60)',
  'rgb(60, 100, 160)',
  'rgb(120, 140, 50)',
  'rgb(90, 60, 140)',
  'rgb(170, 100, 40)',
  'rgb(50, 120, 100)',
  'rgb(140, 60, 80)',
];

const TopicGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const [topics, setTopics] = useState<{ id: string; name: string; color: string; href: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((data) => {
      setTopics(
        data.filter((cat) => cat.slug !== 'phim-18').map((cat, i) => ({
          id: cat.slug,
          name: cat.name,
          color: TOPIC_COLORS[i % TOPIC_COLORS.length],
          href: `/the-loai/${cat.slug}`,
        }))
      );
      setLoading(false);
    });
  }, []);

  const initialDisplayCount = 7;
  const visibleTopics = showAll ? topics : topics.slice(0, initialDisplayCount);
  const remainingCount = topics.length - initialDisplayCount;

  return (
    <section className="w-full max-w-[1900px] mx-auto px-4 md:px-[50px] py-0 relative z-10 overflow-hidden md:mt-[-80px] z-30 mt-[-50px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] 3xl:px-[80px] 4xl:px-[120px] mb-5">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-[2rem] font-semibold text-gray-900 dark:text-white drop-shadow-[0_2px_1px_rgba(0,0,0,0.3)]">
          <Highlighter action="underline" iterations={1} animationDuration={1000}>{`Bạn đang quan tâm gì?`}</Highlighter>
        </h2>
      </div>

      <div className="
        flex flex-nowrap overflow-x-auto gap-4 pb-4
        md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 md:overflow-visible md:pb-0
        scrollbar-hide
      ">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] md:w-auto min-h-[110px] md:min-h-[140px] rounded-tl-[1.25rem] rounded-br-[2.5rem] bg-white/10 animate-pulse"
              />
            ))
          : visibleTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                name={topic.name}
                color={topic.color}
                href={topic.href}
              />
            ))}

        {!loading && !showAll && remainingCount > 0 && (
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
