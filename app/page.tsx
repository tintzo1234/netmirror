'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import { getAllMovies } from '@/lib/firestore';
import Link from 'next/link';
import { FaFilm, FaTv, FaFire, FaCompass } from 'react-icons/fa';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllMovies().then((m) => {
        setMovies(m);
        setFetching(false);
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#9aa0a6] text-sm font-medium">Loading NetMirror...</span>
        </div>
      </div>
    );
  }

  const featured = movies[0] || null;
  const moviesList = movies.filter((m) => m.type !== 'series');
  const seriesList = movies.filter((m) => m.type === 'series');

  return (
    <div className="min-h-screen bg-[#202124] text-[#e8eaed]">
      <Navbar />

      {/* Hero Showcase */}
      <HeroSection movie={featured} />

      {/* Floating Category Bar */}
      <div className="px-6 md:px-10 py-4 -mt-6 relative z-20">
        <div className="flex items-center gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' } as any}>
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#4285F4] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-md shrink-0"
          >
            <FaFire size={12} /> Trending
          </Link>
          <Link
            href="/movies"
            className="flex items-center gap-2 bg-[#303134] hover:bg-[#3c4043] border border-[#3c4043] text-[#e8eaed] px-5 py-2 rounded-full text-xs font-semibold transition-colors shrink-0"
          >
            <FaFilm size={12} className="text-[#34A853]" /> Movies
          </Link>
          <Link
            href="/movies"
            className="flex items-center gap-2 bg-[#303134] hover:bg-[#3c4043] border border-[#3c4043] text-[#e8eaed] px-5 py-2 rounded-full text-xs font-semibold transition-colors shrink-0"
          >
            <FaTv size={12} className="text-[#FBBC05]" /> TV Series
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 bg-[#303134] hover:bg-[#3c4043] border border-[#3c4043] text-[#e8eaed] px-5 py-2 rounded-full text-xs font-semibold transition-colors shrink-0"
          >
            <FaCompass size={12} className="text-[#EA4335]" /> Discover
          </Link>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="relative z-10 pt-4 pb-16">
        {fetching ? (
          <div className="px-10 py-12">
            <div className="w-48 h-6 bg-[#303134] rounded-lg shimmer mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-video bg-[#303134] rounded-2xl shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <MovieRow title="Recently Added" movies={movies.slice(0, 10)} />
            {moviesList.length > 0 && <MovieRow title="Popular Movies" movies={moviesList} />}
            {seriesList.length > 0 && <MovieRow title="Binge-Worthy TV Series" movies={seriesList} />}

            {movies.length === 0 && (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 rounded-full bg-[#303134] border border-[#3c4043] flex items-center justify-center mx-auto mb-4 text-[#4285F4]">
                  <FaFilm size={24} />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No content published yet</h3>
                <p className="text-[#9aa0a6] text-sm mb-6 max-w-sm mx-auto">
                  Go to the Admin Panel to upload your first movie or series episode with instant streaming!
                </p>
                <Link
                  href="/admin"
                  className="bg-[#4285F4] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#3367D6] transition-colors text-sm shadow-lg shadow-blue-500/25"
                >
                  Go to Admin Panel
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
