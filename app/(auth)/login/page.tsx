'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await login(email, password);
      // Ensure user document exists in Firestore on every login
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        name: cred.user.displayName || email.split('@')[0],
      }, { merge: true });

      router.push('/');
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          'url(https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3bb461e6e6c6/18bb6035-be59-4249-9ebe-8d84ca2f2c3c/IN-en-20231218-popsignuptwoweeks-perspective_alpha_website_large.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">
        <div className="px-8 md:px-16 py-6">
          <span className="text-[#E50914] text-2xl font-black">NETMIRROR</span>
        </div>
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-black/80 backdrop-blur-sm p-8 md:p-12 rounded-md w-full max-w-md">
            <h1 className="text-white text-3xl font-bold mb-8">Sign In</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#333] text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#808080]"
              />
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#333] text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#808080] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white"
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E50914] text-white font-bold py-4 rounded hover:bg-[#c40812] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-[#808080] text-sm hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <p className="mt-8 text-[#808080] text-center">
              New to NetMirror?{' '}
              <Link href="/register" className="text-white hover:underline font-medium">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
