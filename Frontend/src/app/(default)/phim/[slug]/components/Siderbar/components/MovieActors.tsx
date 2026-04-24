import React from 'react';
import { PersonData } from '@/lib/api/movie';

interface MovieActorsProps {
  peoples: PersonData[] | null;
  profileBase: string;
  actors: string[];
}

export const MovieActors = ({ peoples, profileBase, actors }: MovieActorsProps) => {
  // Prefer peoples data (has images), fallback to plain actor names
  const hasPeoples = peoples && peoples.length > 0;
  const castList = hasPeoples
    ? peoples.filter((p) => p.known_for_department === 'Acting').slice(0, 9)
    : null;

  if (!hasPeoples && (!actors || actors.length === 0)) return null;

  return (
    <div className="mt-8">
      <h3 className="text-[1.6em] font-semibold text-white mb-4 flex items-center gap-4 min-h-[40px]">
        Diễn viên
      </h3>

      {castList ? (
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-6">
          {castList.map((person) => {
            const imageUrl = person.profile_path
              ? `${profileBase}${person.profile_path}`
              : '';
            return (
              <div key={person.tmdb_people_id} className="flex flex-col items-center text-center gap-3">
                <div className="w-[80px] h-[80px] rounded-full overflow-hidden relative bg-[#2a2d3a] flex-shrink-0">
                  {imageUrl ? (
                    <img
                      loading="lazy"
                      alt={person.name}
                      src={imageUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-500">
                      👤
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <h4 className="mb-0.5 text-sm font-medium text-white/90 hover:text-[#f472b6] transition-colors line-clamp-2 leading-tight">
                    {person.name}
                  </h4>
                  {person.character && (
                    <p className="text-xs text-gray-500 line-clamp-1">{person.character}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {actors.slice(0, 12).map((name, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-white/5 rounded text-sm text-gray-300 border border-white/10">
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};