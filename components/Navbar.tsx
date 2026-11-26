'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaBell, FaSearch, FaChevronDown, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, userData } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    router.push('/login');
    toast.success('Logged out');
  }

  const isAdmin = userData?.role === 'admin' || userData?.role === 'superadmin';
  const isSuperAdmin = userData?.role === 'superadmin';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#202124]/95 backdrop-blur-md border-[#3c4043]'
          : 'bg-gradient-to-b from-[#202124]/90 to-transparent border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-10 py-3.5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
            <span className="text-[#4285F4]">N</span>
            <span className="text-[#EA4335]">e</span>
            <span className="text-[#FBBC05]">t</span>
            <span className="text-[#4285F4]">M</span>
            <span className="text-[#34A853]">i</span>
            <span className="text-[#EA4335]">r</span>
            <span className="text-[#4285F4]">r</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#34A853]">r</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-[#303134] text-[#e8eaed] transition-colors font-medium">Home</Link>
            <Link href="/movies" className="px-3 py-1.5 rounded-full hover:bg-[#303134] text-[#9aa0a6] hover:text-[#e8eaed] transition-colors font-medium">Movies</Link>
            <Link href="/my-list" className="px-3 py-1.5 rounded-full hover:bg-[#303134] text-[#9aa0a6] hover:text-[#e8eaed] transition-colors font-medium">Library</Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-[#4285F4] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#3367D6] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                ⚙️ Admin
              </Link>
            )}
            {isSuperAdmin && (
              <Link
                href="/superadmin"
                className="bg-[#303134] text-[#FBBC05] border border-[#FBBC05]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:bg-[#3c4043] transition-colors flex items-center gap-1.5"
              >
                👑 Super Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="p-2.5 rounded-full hover:bg-[#303134] text-[#e8eaed] transition-colors"
          >
            <FaSearch size={16} />
          </Link>
          <button className="p-2.5 rounded-full hover:bg-[#303134] text-[#e8eaed] transition-colors">
            <FaBell size={16} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#4285F4] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#34A853] flex items-center justify-center font-bold text-white text-xs shadow">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 bg-[#303134] border border-[#3c4043] rounded-2xl py-2 w-56 shadow-2xl z-50">
                <div className="px-4 py-3 border-b border-[#3c4043]">
                  <p className="text-sm font-semibold text-white">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-[#9aa0a6] truncate">{user?.email}</p>
                </div>
                <Link
                  href="/my-list"
                  className="block px-4 py-2.5 text-sm text-[#e8eaed] hover:bg-[#3c4043] transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  Watch History
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2.5 text-sm text-[#4285F4] font-medium hover:bg-[#3c4043] transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link
                    href="/superadmin"
                    className="block px-4 py-2.5 text-sm text-[#FBBC05] font-medium hover:bg-[#3c4043] transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    👑 Super Admin
                  </Link>
                )}
                <div className="border-t border-[#3c4043] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-[#EA4335] hover:bg-[#3c4043] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
