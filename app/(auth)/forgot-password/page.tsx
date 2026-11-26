'use client';
import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] px-4">
      <div className="bg-[#1f1f1f] border border-[#333] p-8 rounded-md w-full max-w-md">
        <div className="mb-6">
          <span className="text-[#E50914] text-xl font-black">NETMIRROR</span>
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-[#808080] text-sm mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-green-400 text-4xl mb-4">✓</div>
            <p className="text-white mb-4">Check your email for the reset link.</p>
            <Link href="/login" className="text-[#E50914] hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#333] text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-[#E50914] placeholder-[#808080]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E50914] text-white font-bold py-4 rounded hover:bg-[#c40812] transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <Link href="/login" className="text-[#808080] text-sm hover:text-white">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
