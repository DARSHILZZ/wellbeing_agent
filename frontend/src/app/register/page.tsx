"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local"
      );
      return;
    }

    setLoading(true);
    
    try {
      // 1. Register with Supabase Auth including metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Registration failed.");

      // 2. Ensure profile exists in profiles table
      const { error: profileError } = await supabase.from('profiles').upsert([
        {
          id: authData.user.id,
          full_name: fullName,
          email: email,
          role: role,
        }
      ]);

      if (profileError) {
        console.warn("Profile table update warning:", profileError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);

    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError(
          "Connection failed: Please set valid NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local and restart Next.js server."
        );
      } else {
        setError(err.message || "Failed to register");
      }
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
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-zinc-100 mb-8 relative z-10">
          Create Account
        </h2>
        
        {!configured && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 p-4 rounded-xl mb-6 text-xs text-center leading-relaxed">
            <span className="font-semibold block mb-1">⚡ Setup Required</span>
            Set your Supabase credentials in <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-800 dark:text-amber-200">frontend/.env.local</code> to create accounts.
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-md">
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-md">
            Registration successful! Redirecting to login...
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-5 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
              placeholder="Alex Johnson"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  role === 'student' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : 'bg-white/50 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  role === 'teacher' 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/25' 
                    : 'bg-white/50 dark:bg-zinc-950/50 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900'
                }`}
              >
                Teacher
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-zinc-400 relative z-10">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

