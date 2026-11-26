'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getAllUsers, getAllWatchHistory, getAllMovies } from '@/lib/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/AdminGuard';
import { FaUsers, FaFilm, FaEye, FaClock, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function SuperAdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [tab, setTab] = useState<'users' | 'activity' | 'stats'>('users');

  useEffect(() => {
    setFetching(true);

    // Fault-tolerant user listener
    let unsubUsers: (() => void) | null = null;
    try {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const uList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(uList);
        setFetching(false);
      }, (err) => {
        console.warn('Realtime listener fallback to getAllUsers:', err);
        getAllUsers().then(setUsers).finally(() => setFetching(false));
      });
    } catch {
      getAllUsers().then(setUsers).finally(() => setFetching(false));
    }

    getAllWatchHistory().then(setHistory).catch(() => setHistory([]));
    getAllMovies().then(setMovies).catch(() => setMovies([]));

    return () => {
      if (unsubUsers) unsubUsers();
    };
  }, []);

  // Allow direct access via AdminGuard pin (admin@1234)

  const filteredUsers = users.filter((u) =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(search.toLowerCase())
  );

  function getUserHistory(uid: string) {
    return history.filter((h) => h.userId === uid).slice(0, 10);
  }

  function formatDate(ts: any) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
  }

  const totalViews = history.length;
  const mostWatched = movies
    .map((m) => ({
      ...m,
      watchCount: history.filter((h) => h.contentId === m.id).length,
    }))
    .sort((a, b) => b.watchCount - a.watchCount)
    .slice(0, 5);

  return (
    <AdminGuard requiredPassword="admin@3433" storageKey="netmirror_superadmin_auth" title="Super Admin Portal Lock">
      <div className="min-h-screen bg-[#141414]">
        <Navbar />
        <div className="pt-20 px-4 md:px-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded">
              SUPER ADMIN
            </span>
            <h1 className="text-white text-3xl font-bold">Dashboard</h1>
          </div>
          <p className="text-[#808080] text-sm">Full platform overview and user analytics</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: FaUsers, color: '#3b82f6' },
            { label: 'Total Content', value: movies.length, icon: FaFilm, color: '#E50914' },
            { label: 'Total Watches', value: totalViews, icon: FaEye, color: '#10b981' },
            {
              label: 'Active Today',
              value: history.filter((h) => {
                if (!h.watchedAt) return false;
                const d = h.watchedAt.toDate ? h.watchedAt.toDate() : new Date(h.watchedAt);
                return new Date().toDateString() === d.toDateString();
              }).length,
              icon: FaClock,
              color: '#f59e0b',
            },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1f1f1f] border border-[#333] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <stat.icon style={{ color: stat.color }} />
                </div>
                <span className="text-[#808080] text-sm">{stat.label}</span>
              </div>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#333]">
          {(['users', 'activity', 'stats'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 px-4 text-sm font-medium transition-colors capitalize border-b-2 ${
                tab === t
                  ? 'border-[#E50914] text-white'
                  : 'border-transparent text-[#808080] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div>
            <div className="relative max-w-sm mb-6">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#333] text-white pl-10 pr-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#555]"
              />
            </div>
            <div className="space-y-3">
              {fetching ? (
                <div className="text-center py-12 text-[#808080]">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-[#808080]">No users found.</div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-[#1f1f1f] border border-[#333] rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#2a2a2a] transition-colors"
                      onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center font-bold text-white">
                          {(u.name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-white font-medium">{u.name || 'No name'}</p>
                          <p className="text-[#808080] text-sm">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                          <span
                            className={`text-xs px-2 py-1 rounded font-bold ${
                              u.role === 'superadmin'
                                ? 'bg-yellow-400/20 text-yellow-400'
                                : u.role === 'admin'
                                ? 'bg-[#E50914]/20 text-[#E50914]'
                                : 'bg-[#333] text-[#808080]'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-white text-sm font-medium">
                            {getUserHistory(u.id).length} watches
                          </p>
                          <p className="text-[#808080] text-xs">watch history</p>
                        </div>
                        {expandedUser === u.id ? (
                          <FaChevronUp className="text-[#808080]" />
                        ) : (
                          <FaChevronDown className="text-[#808080]" />
                        )}
                      </div>
                    </button>
                    {expandedUser === u.id && (
                      <div className="border-t border-[#333] px-6 py-4 bg-[#161616]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-[#808080]">Email:</span>
                            <p className="text-white">{u.email}</p>
                          </div>
                          <div>
                            <span className="text-[#808080] block mb-1">Role & Permissions:</span>
                            <select
                              value={u.role || 'user'}
                              onChange={async (e) => {
                                const newRole = e.target.value;
                                const { doc, setDoc } = await import('firebase/firestore');
                                const { db } = await import('@/lib/firebase');
                                await setDoc(doc(db, 'users', u.id), { role: newRole }, { merge: true });
                                setUsers((prev) =>
                                  prev.map((userObj) =>
                                    userObj.id === u.id ? { ...userObj, role: newRole } : userObj
                                  )
                                );
                              }}
                              className="bg-[#2a2a2a] border border-[#444] text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-[#E50914] cursor-pointer"
                            >
                              <option value="user">User (Standard)</option>
                              <option value="admin">Admin (Manage Content)</option>
                              <option value="superadmin">Super Admin (Full Access)</option>
                            </select>
                          </div>
                          <div>
                            <span className="text-[#808080]">Joined:</span>
                            <p className="text-white">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[#808080]">Watches:</span>
                            <p className="text-white">{getUserHistory(u.id).length}</p>
                          </div>
                        </div>
                        <h4 className="text-[#808080] text-xs font-semibold uppercase tracking-wider mb-3">
                          Watch History (What this user watched)
                        </h4>
                        {getUserHistory(u.id).length === 0 ? (
                          <p className="text-[#555] text-sm">No watch history yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {getUserHistory(u.id).map((h: any) => (
                              <div
                                key={h.id}
                                className="flex items-center justify-between bg-[#1f1f1f] px-4 py-2 rounded"
                              >
                                <span className="text-white text-sm">{h.title}</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-xs bg-[#333] text-[#808080] px-2 py-0.5 rounded">
                                    {h.contentType}
                                  </span>
                                  <span className="text-[#808080] text-xs">
                                    {formatDate(h.watchedAt)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {tab === 'activity' && (
          <div className="bg-[#1f1f1f] border border-[#333] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#333]">
              <h2 className="text-white font-bold">Recent Watch Activity (All Users)</h2>
            </div>
            {fetching ? (
              <div className="p-8 text-center text-[#808080]">Loading...</div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center text-[#808080]">No activity recorded yet.</div>
            ) : (
              <div className="divide-y divide-[#2a2a2a]">
                {history.slice(0, 50).map((h: any) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center">
                        <FaEye className="text-[#808080]" size={12} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{h.title}</p>
                        <p className="text-[#808080] text-xs">User ID: {h.userId?.slice(0, 16)}...</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-[#333] text-[#808080] px-2 py-0.5 rounded">
                        {h.contentType}
                      </span>
                      <p className="text-[#808080] text-xs mt-1">{formatDate(h.watchedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {tab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
              <h2 className="text-white font-bold mb-4">Most Watched Movies/Shows</h2>
              {mostWatched.length === 0 ? (
                <p className="text-[#808080]">No watch data yet.</p>
              ) : (
                <div className="space-y-3">
                  {mostWatched.map((m: any, i: number) => (
                    <div key={m.id} className="flex items-center gap-4">
                      <span className="text-[#808080] font-bold w-6">{i + 1}</span>
                      {m.thumbnail && (
                        <img
                          src={m.thumbnail}
                          alt={m.title}
                          className="w-14 h-9 object-cover rounded flex-none"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{m.title}</p>
                        <p className="text-[#808080] text-xs">{m.genre || 'General'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{m.watchCount}</p>
                        <p className="text-[#808080] text-xs">views</p>
                      </div>
                      <div className="w-24 bg-[#333] rounded-full h-1.5">
                        <div
                          className="bg-[#E50914] h-1.5 rounded-full"
                          style={{
                            width: `${
                              mostWatched[0].watchCount
                                ? (m.watchCount / mostWatched[0].watchCount) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1f1f1f] border border-[#333] rounded-lg p-6">
              <h2 className="text-white font-bold mb-4">User Accounts Breakdown</h2>
              {['user', 'admin', 'superadmin'].map((role) => {
                const count = users.filter((u) => (u.role || 'user') === role).length;
                const pct = users.length ? Math.round((count / users.length) * 100) : 0;
                return (
                  <div key={role} className="flex items-center gap-4 mb-3">
                    <span className="text-[#808080] text-sm w-28 capitalize">{role}</span>
                    <div className="flex-1 bg-[#333] rounded-full h-2">
                      <div
                        className="bg-[#E50914] h-2 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminGuard>
  );
}
