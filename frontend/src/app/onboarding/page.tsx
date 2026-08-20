"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Student Fields
  const [grade, setGrade] = useState("10th");
  const [studentId, setStudentId] = useState("");
  const [advisor, setAdvisor] = useState("");
  
  // Teacher Fields
  const [department, setDepartment] = useState("Science");
  const [title, setTitle] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Fetch user's role from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setRole(profile.role);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");

      const updateData = role === "student" 
        ? { grade, custom_student_id: studentId, advisor }
        : { department, title };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session.user.id);

      if (updateError) throw new Error(updateError.message);

      // Route to respective dashboard
      if (role === "student") {
        router.push("/student/profile");
      } else {
        router.push("/teacher");
      }

    } catch (err: any) {
      console.warn("Update failed. Note: Ensure these columns exist in the Supabase 'profiles' table.");
      setError(err.message || "Failed to save profile details");
      
      // For demonstration purposes, if it fails due to missing columns, we still route them forward
      if (err.message && err.message.includes("Could not find the column")) {
         setTimeout(() => {
            router.push(role === "student" ? "/student/profile" : "/teacher");
         }, 1500);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md mx-auto mt-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-zinc-950/10 border border-white/50 dark:border-zinc-800/80 relative overflow-hidden"
      >
        {/* Glow Accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-zinc-100 mb-2 relative z-10">
          Complete Profile
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 relative z-10">
          Just a few more details to set up your {role} dashboard.
        </p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-md">
            {error}
            <br />
            <span className="text-xs opacity-80 mt-1 block">Redirecting to dashboard anyway...</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {role === "student" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100 appearance-none"
                >
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Student ID (Optional)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
                  placeholder="STU-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Advisor (Optional)</label>
                <input
                  type="text"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
                  placeholder="Dr. Smith"
                />
              </div>
            </>
          )}

          {role === "teacher" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100 appearance-none"
                >
                  <option value="Science">Science</option>
                  <option value="Math">Mathematics</option>
                  <option value="English">English / Literature</option>
                  <option value="History">History</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100 placeholder-slate-400"
                  placeholder="Head of Physics"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {saving ? "Saving..." : "Go to Dashboard"}
          </button>
        </form>
        
      </motion.div>
    </div>
  );
}
