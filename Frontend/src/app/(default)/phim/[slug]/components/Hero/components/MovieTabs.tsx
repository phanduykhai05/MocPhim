"use client"
import React, { useState } from 'react';

export const MovieTabs = () => {
  const [activeTab, setActiveTab] = useState('episodes');
  const tabs = [
    { id: 'episodes', label: 'Tập phim' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'casts', label: 'Diễn viên' },
    { id: 'soundtrack', label: 'Soundtrack' },
    { id: 'suggestion', label: 'Đề xuất' },
  ];

  return (
    <div className="flex overflow-x-auto border-b border-white/10 hide-scrollbar px-6 lg:px-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`whitespace-nowrap px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
            activeTab === tab.id
              ? 'border-[#f472b6] text-white opacity-100'
              : 'border-transparent text-gray-400 hover:text-white opacity-80 hover:opacity-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};