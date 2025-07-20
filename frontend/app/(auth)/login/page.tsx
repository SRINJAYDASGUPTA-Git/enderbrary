'use client';

import { Eye, EyeClosed } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import OAuthSignInButton from "@/components/OAuthSignInButton";
import { useUser } from "@/providers/UserContext";
import Loader from "@/components/Loader";
import { Session } from "@/types";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('/api/v1/auth/login', { email, password });
      const data = res.data;

      if (res.status === 200) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        await refreshUser();
        window.location.replace('/');
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) return;
        const sessionData = await res.json();
        setSession(sessionData as Session);
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (session?.user) {
      // Optional redirect logic here
    }
  }, [session]);

  if (loading) return <Loader subtitle="Logging in..." />;

  return (
      <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto mt-20 p-8 bg-white border border-gray-200 shadow-md rounded-2xl space-y-6 font-sans"
      >
        <h2 className="text-3xl font-display font-bold text-center text-purple-600">
          Login
        </h2>

        {/* --- OAuth Buttons --- */}
        <div className="flex gap-4 justify-center items-center flex-col md:flex-row">
          <OAuthSignInButton provider="google" />
          <OAuthSignInButton provider="github" />
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                className="mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 p-2"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                  type={showPassword ? 'text' : 'password'}
                  className="mt-1 block w-full rounded-md bg-purple-50 border border-purple-200 placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 p-2 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-600"
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md font-display font-semibold transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-purple-600 hover:underline font-display font-medium">
              Register here
            </a>
          </p>
        </div>
      </form>
  );
}
