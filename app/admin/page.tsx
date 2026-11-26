'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getAllMovies, deleteMovie } from '@/lib/firestore';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaFilm, FaTv, FaEye } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllMovies().then((m) => {
        setMovies(m);
        setFetching(false);
      });
    }
  }, [user]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success('Deleted successfully');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-[#E50914] text-4xl font-black animate-pulse">NETMIRROR</div>
      </div>
    );
  }

  const movieCount = movies.filter((m) => m.type !== 'series').length;
  const seriesCount = movies.filter((m) => m.type === 'series').length;
  const totalViews = movies.reduce((a, m) => a + (m.views || 0), 0);

  return (
    <AdminGuard requiredPassword="admin@3433" storageKey="netmirror_admin_auth" title="Admin Portal Lock">
      <div className="min-h-screen bg-[#141414]">
        <Navbar />
        <div className="pt-20 px-4 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
              <p className="text-[#808080] text-sm mt-1">Manage your content library</p>
            </div>
            <Link
              href="/admin/add-movie"
              className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 rounded font-medium hover:bg-[#c40812] transition-colors"
            >
              <FaPlus />
              Add Content
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Content', value: movies.length, icon: FaFilm, color: '#E50914' },
              { label: 'Movies', value: movieCount, icon: FaFilm, color: '#3b82f6' },
              { label: 'Series', value: seriesCount, icon: FaTv, color: '#8b5cf6' },
              { label: 'Total Views', value: totalViews, icon: FaEye, color: '#10b981' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#1f1f1f] border border-[#333] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon style={{ color: stat.color }} />
                  <span className="text-[#808080] text-sm">{stat.label}</span>
                </div>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/admin/add-movie"
              className="bg-[#1f1f1f] border border-[#333] hover:border-[#E50914] p-6 rounded-lg transition-colors"
            >
              <FaFilm className="text-[#E50914] text-2xl mb-3" />
              <h3 className="text-white font-bold mb-1">Add Movie</h3>
              <p className="text-[#808080] text-sm">Upload a new movie</p>
            </Link>
            <Link
              href="/admin/add-movie"
              className="bg-[#1f1f1f] border border-[#333] hover:border-[#E50914] p-6 rounded-lg transition-colors"
            >
              <FaTv className="text-[#E50914] text-2xl mb-3" />
              <h3 className="text-white font-bold mb-1">Add TV Series</h3>
              <p className="text-[#808080] text-sm">Upload a series with episodes</p>
            </Link>
            <Link
              href="/admin/add-episode"
              className="bg-[#1f1f1f] border border-[#333] hover:border-[#E50914] p-6 rounded-lg transition-colors"
            >
              <FaPlus className="text-[#E50914] text-2xl mb-3" />
              <h3 className="text-white font-bold mb-1">Add Episode</h3>
              <p className="text-[#808080] text-sm">Add episode to existing series</p>
            </Link>
          </div>

          {/* Content Table */}
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-[#333]">
              <h2 className="text-white font-bold">All Content ({movies.length})</h2>
            </div>
            {fetching ? (
              <div className="p-8 text-center text-[#808080]">Loading...</div>
            ) : movies.length === 0 ? (
              <div className="p-12 text-center">
                <FaFilm className="text-[#333] text-4xl mx-auto mb-4" />
                <p className="text-[#808080]">No content yet. Add your first movie or series!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#808080] border-b border-[#333]">
                      <th className="text-left px-6 py-3">Title</th>
                      <th className="text-left px-6 py-3">Type</th>
                      <th className="text-left px-6 py-3">Genre</th>
                      <th className="text-left px-6 py-3">Year</th>
                      <th className="text-left px-6 py-3">Download</th>
                      <th className="text-left px-6 py-3">Views</th>
                      <th className="text-left px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {m.thumbnail && (
                              <img
                                src={m.thumbnail}
                                alt={m.title}
                                className="w-10 h-7 object-cover rounded"
                              />
                            )}
                            <span className="text-white font-medium">{m.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              m.type === 'series'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {m.type === 'series' ? 'SERIES' : 'MOVIE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#808080]">{m.genre || '—'}</td>
                        <td className="px-6 py-4 text-[#808080]">{m.year || '—'}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium ${
                              m.downloadable ? 'text-green-400' : 'text-[#808080]'
                            }`}
                          >
                            {m.downloadable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#808080]">{m.views || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/edit/${m.id}`}
                              className="p-2 hover:bg-[#333] rounded transition-colors text-[#808080] hover:text-white"
                            >
                              <FaEdit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(m.id, m.title)}
                              disabled={deleting === m.id}
                              className="p-2 hover:bg-[#333] rounded transition-colors text-[#808080] hover:text-[#E50914] disabled:opacity-50"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
