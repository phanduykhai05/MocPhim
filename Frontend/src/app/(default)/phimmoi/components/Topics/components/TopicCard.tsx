import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TopicCardProps {
  name: string;
  color: string;
  href: string;
  isMoreBtn?: boolean;
  onClick?: () => void;
  count?: number;
}

const TopicCard = ({ name, color, href, isMoreBtn, onClick, count }: TopicCardProps) => {
  // Common Classes
  const baseClasses = "relative group flex-shrink-0 w-[160px] md:w-auto min-h-[110px] md:min-h-[140px] p-4 md:p-5 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 rounded-tl-[1.25rem] rounded-br-[2.5rem] shadow-lg";

  if (isMoreBtn) {
    return (
      <div onClick={onClick} className={`${baseClasses} flex items-center justify-center cursor-pointer`}>
        <div 
          className="absolute inset-0 z-1" 
          style={{ background: 'linear-gradient(135deg, rgba(150, 150, 180, 0.8) 0%, rgba(180, 120, 140, 0.8) 100%)' }}
        />
        <div className="relative z-10 text-center">
          <span className="text-xl md:text-2xl font-bold text-white">+{count}</span>
        </div>
      </div>
    );
  }

  return (
    <a href={href} className={`${baseClasses} bg-[#282b3a]`}>
      <div 
        className="absolute inset-0 z-1 opacity-90 transition-opacity group-hover:opacity-100" 
        style={{ backgroundColor: color }}
      />
      
      {/* Glossy Effect (Lớp bóng như ảnh mẫu) */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      {/* Inner Shadow Effect */}
      <div className="absolute inset-0 z-[3] shadow-[inset_0_-10px_20px_0px_rgba(255,255,255,0.1)] rounded-tl-[4rem] rounded-br-[2.5rem]" />

      <div className="relative z-10 h-full flex flex-col justify-end items-start gap-1">
        <h4 className="text-[1.2rem] md:text-[1.6rem] font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
          {name}
        </h4>
        <div className="flex items-center gap-1 text-[10px] md:text-sm text-white/80 group-hover:text-white transition-colors">
          <span className="whitespace-nowrap">Xem chủ đề</span>
          <ChevronRight size={14} className="md:w-4 md:h-4" />
        </div>
      </div>
    </a>
  );
};

export default TopicCard;