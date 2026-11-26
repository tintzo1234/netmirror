'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getAllMovies } from '@/lib/firestore';
import { FaSearch } from 'react-icons/fa';

export default function SearchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) getAllMovies().then(setMovies);
  }, [user]);

  const results =
    query.length > 1
      ? movies.filter(
          (m) =>
            m.title?.toLowerCase().includes(query.toLowerCase()) ||
            m.genre?.toLowerCase().includes(query.toLowerCase())
        )
      : [];

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
        <div className="relative max-w-xl mb-8">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]" />
          <input
            type="text"
            placeholder="Search movies, series, genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-[#333] text-white pl-12 pr-4 py-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#808080]"
          />
        </div>
        {query.length > 1 ? (
          results.length > 0 ? (
            <div>
              <p className="text-[#808080] text-sm mb-4">
                {results.length} result(s) for &quot;{query}&quot;
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((m) => (
                  <MovieCard
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    thumbnail={m.thumbnail}
                    genre={m.genre}
                    year={m.year}
                    type={m.type}
                    downloadable={m.downloadable}
                    videoUrl={m.videoUrl}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-[#808080]">
              No results for &quot;{query}&quot;
            </div>
          )
        ) : (
          <div className="text-center py-24 text-[#808080]">Type to search...</div>
        )}
      </div>
    </div>
  );
}
