"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { setToken, setUserProfile } from "@/lib/auth";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local"
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate strictly with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Invalid email or password.");
      }

      if (!authData.user) {
        throw new Error("Authentication failed. User not found.");
      }

      // Save access token if session exists
      if (authData.session?.access_token) {
        setToken(authData.session.access_token);
      }

      // 2. Fetch user's profile and role from Supabase DB ('profiles' table)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name, email')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.warn("Could not query profiles table:", profileError.message);
      }

      const role = (profile?.role || authData.user.user_metadata?.role || 'student') as 'student' | 'teacher';

      setUserProfile({
        id: authData.user.id,
        email: authData.user.email || email,
        role: role,
        full_name: profile?.full_name || authData.user.user_metadata?.full_name || email.split('@')[0],
      });

      // 3. Dynamic role-based redirection
      if (role === 'teacher') {
        router.push("/teacher");
      } else {
        router.push("/student/profile");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in with Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="relative z-10 w-full max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-zinc-950/10 border border-white/50 dark:border-zinc-800/80 relative overflow-hidden"
      >
        {/* Glow Accent */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-zinc-100 mb-8 relative z-10">
          Welcome Back
        </h2>
        
        {!configured && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 p-4 rounded-xl mb-6 text-xs text-center leading-relaxed">
            <span className="font-semibold block mb-1">⚡ Setup Required</span>
            Set your Supabase credentials in <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-800 dark:text-amber-200">frontend/.env.local</code> to log in with Supabase.
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-md">
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Authenticating with Supabase..." : "Log In with Supabase"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-zinc-400 relative z-10">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}


