'use client';
import { useState, useEffect } from 'react';
import { FaLock, FaKey } from 'react-icons/fa';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPassword?: string;
  storageKey?: string;
  title?: string;
}

export default function AdminGuard({
  children,
  requiredPassword = 'admin@3433',
  storageKey = 'netmirror_admin_auth',
  title = 'Portal Lock',
}: AdminGuardProps) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem(storageKey);
    if (isAuth === 'true') {
      setAuthorized(true);
    }
    setChecked(true);
  }, [storageKey]);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (password === requiredPassword) {
      sessionStorage.setItem(storageKey, 'true');
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!checked) return null;

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center px-4">
        <div className="bg-[#303134] border border-[#3c4043] p-8 rounded-2xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#4285F4]/20 text-[#4285F4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4285F4]/40">
              <FaLock size={24} />
            </div>
            <h1 className="text-white text-2xl font-bold">{title}</h1>
            <p className="text-[#9aa0a6] text-sm mt-1">
              Please enter the secret password to continue.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa0a6]" />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
                required
                className="w-full bg-[#202124] border border-[#3c4043] text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#4285F4] placeholder-[#555]"
              />
            </div>

            {error && (
              <p className="text-[#EA4335] text-xs text-center font-medium">
                Incorrect password! Access denied.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#4285F4] text-white font-semibold py-3 rounded-xl hover:bg-[#3367D6] transition-colors shadow-md"
            >
              Unlock Access
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-xs text-[#9aa0a6] hover:text-white transition-colors">
              ← Return to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
