'use client';
import MovieCard from './MovieCard';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface MovieRowProps {
  title: string;
  movies: any[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (rowRef.current) {
      const amount = dir === 'left' ? -380 : 380;
      rowRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  }

  if (!movies?.length) return null;

  return (
    <div className="mb-10 px-4 md:px-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-xl md:text-2xl tracking-tight flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-[#4285F4] rounded-full inline-block" />
          {title}
        </h2>
        <span className="text-xs text-[#9aa0a6] font-medium hidden sm:inline">
          {movies.length} title{movies.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="relative group">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#202124]/90 backdrop-blur-md border border-[#3c4043] text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#303134] hover:scale-110 shadow-xl -ml-3"
        >
          <FaChevronLeft size={13} />
        </button>

        {/* Horizontal Carousel */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}
        >
          {movies.map((m: any) => (
            <div key={m.id} className="flex-none w-52 md:w-64">
              <MovieCard
                id={m.id}
                title={m.title}
                thumbnail={m.thumbnail}
                genre={m.genre}
                year={m.year}
                rating={m.rating}
                type={m.type}
                downloadable={m.downloadable}
                videoUrl={m.videoUrl}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#202124]/90 backdrop-blur-md border border-[#3c4043] text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#303134] hover:scale-110 shadow-xl -mr-3"
        >
          <FaChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
