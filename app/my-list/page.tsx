'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getUserWatchHistory } from '@/lib/firestore';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FaPlay, FaClock } from 'react-icons/fa';

export default function MyListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getUserWatchHistory(user.uid).then((h) => {
        setHistory(h);
        setFetching(false);
      });
    }
  }, [user]);

  function formatDate(ts: any) {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

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
        <div className="flex items-center gap-3 mb-8">
          <FaClock className="text-[#E50914]" />
          <h1 className="text-white text-3xl font-bold">Watch History</h1>
        </div>
        {fetching ? (
          <div className="text-[#808080]">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-24 text-[#808080]">
            <FaClock className="text-[#333] text-5xl mx-auto mb-4" />
            <p className="text-xl mb-2">No watch history yet</p>
            <Link href="/" className="text-[#E50914] hover:underline">
              Browse content
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h: any) => (
              <Link
                key={h.id}
                href={`/watch/${h.contentId}`}
                className="flex items-center gap-4 bg-[#1f1f1f] border border-[#333] hover:border-[#E50914] p-4 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#E50914]/20 flex items-center justify-center group-hover:bg-[#E50914]/40 transition-colors">
                  <FaPlay className="text-[#E50914]" size={12} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{h.title}</p>
                  <p className="text-[#808080] text-sm">{formatDate(h.watchedAt)}</p>
                </div>
                <span className="text-xs bg-[#333] text-[#808080] px-2 py-1 rounded capitalize">
                  {h.contentType}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
