'use client';
import Link from 'next/link';
import { FaPlay, FaInfoCircle, FaStar, FaDownload } from 'react-icons/fa';

interface HeroProps {
  movie: any;
}

export default function HeroSection({ movie }: HeroProps) {
  if (!movie) {
    return (
      <div className="relative w-full min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-[#1a1b1e] via-[#202124] to-[#202124] pt-20">
        <div className="text-center px-4 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#4285F4]/15 border border-[#4285F4]/30 text-[#4285F4] px-4 py-1.5 rounded-full text-xs font-semibold mb-4 backdrop-blur-md">
            <span>✨ Welcome to NetMirror</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            Stream Endless Movies & Shows
          </h1>
          <p className="text-[#9aa0a6] text-base mb-8">
            High quality streaming, instant downloads, and seamless cross-device entertainment.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/movies"
              className="bg-[#4285F4] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#3367D6] transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <FaPlay size={13} /> Browse Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-start overflow-hidden">
      {/* Background with Ambient Glow */}
      <div className="absolute inset-0 z-0">
        {movie.thumbnail ? (
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-full h-full object-cover object-top scale-105 filter brightness-90 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1c23] via-[#202124] to-black" />
        )}
        {/* Cinematic Multi-layered Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#202124] via-[#202124]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#202124] via-[#202124]/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#202124]/90 to-transparent" />
      </div>

      {/* Content Billboard */}
      <div className="relative z-10 px-6 md:px-14 max-w-2xl pt-24 pb-12">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="bg-[#4285F4] text-white font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Featured
          </span>
          {movie.type === 'series' && (
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
              TV Series
            </span>
          )}
          {movie.rating && (
            <span className="flex items-center gap-1 bg-[#303134]/80 backdrop-blur-md border border-[#3c4043] text-amber-400 font-semibold text-xs px-2.5 py-1 rounded-full">
              <FaStar size={11} /> {movie.rating}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight drop-shadow-md">
          {movie.title}
        </h1>

        <div className="flex items-center flex-wrap gap-3 mb-5 text-xs text-[#9aa0a6] font-medium">
          {movie.year && <span className="text-white bg-[#303134] px-2.5 py-0.5 rounded-md">{movie.year}</span>}
          {movie.genre && <span className="border border-[#3c4043] px-2.5 py-0.5 rounded-md text-[#e8eaed]">{movie.genre}</span>}
          {movie.duration && <span>{movie.duration}</span>}
          <span className="text-emerald-400 font-bold">Ultra HD 4K</span>
        </div>

        <p className="text-[#c4c7c5] text-sm md:text-base mb-8 line-clamp-3 leading-relaxed drop-shadow">
          {movie.description || 'Dive into this gripping cinematic experience. Stream in crystal clear high definition or download to watch anytime.'}
        </p>

        <div className="flex items-center gap-3.5">
          <Link
            href={`/watch/${movie.id}`}
            className="flex items-center gap-2.5 bg-[#4285F4] text-white font-bold px-7 py-3.5 rounded-full hover:bg-[#3367D6] transition-all shadow-xl shadow-blue-500/25 text-sm"
          >
            <FaPlay size={13} className="ml-0.5" />
            Watch Now
          </Link>
          <Link
            href={`/watch/${movie.id}`}
            className="flex items-center gap-2 bg-[#303134]/80 backdrop-blur-md text-[#e8eaed] border border-[#3c4043] font-semibold px-6 py-3.5 rounded-full hover:bg-[#3c4043] transition-all text-sm"
          >
            <FaInfoCircle size={15} />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
