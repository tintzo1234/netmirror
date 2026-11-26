'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getAllMovies } from '@/lib/firestore';

export default function MoviesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [genre, setGenre] = useState('');
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) getAllMovies().then((m) => { setMovies(m); setFetching(false); });
  }, [user]);

  const genres = Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)));
  const filtered = movies.filter((m) => {
    const typeMatch =
      filter === 'all' ||
      (filter === 'movie' ? m.type !== 'series' : m.type === 'series');
    const genreMatch = !genre || m.genre === genre;
    return typeMatch && genreMatch;
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-[#E50914] text-4xl font-black animate-pulse">NETMIRROR</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="pt-24 px-4 md:px-12">
        <h1 className="text-white text-3xl font-bold mb-6">Browse All</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(['all', 'movie', 'series'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === t
                  ? 'bg-[#E50914] text-white'
                  : 'bg-[#333] text-[#b3b3b3] hover:bg-[#444]'
              }`}
            >
              {t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'Series'}
            </button>
          ))}
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(genre === g ? '' : g)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                genre === g
                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]'
                  : 'bg-[#333] text-[#b3b3b3] hover:bg-[#444]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Grid */}
        {fetching ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-video rounded shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[#808080]">No content found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((m) => (
              <MovieCard
                key={m.id}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
