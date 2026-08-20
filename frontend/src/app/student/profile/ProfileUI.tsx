"use client";
import { motion } from 'framer-motion';

export default function ProfileUI({ profile }: { profile: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full relative overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
        <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-zinc-100">Student Profile (Supabase)</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
        <div className="p-[3px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 rounded-full shrink-0 shadow-lg shadow-indigo-500/20">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }} 
            transition={{ type: "spring", stiffness: 300 }}
            className="w-32 h-32 rounded-full bg-white dark:bg-zinc-900 text-indigo-700 dark:text-indigo-400 font-bold flex items-center justify-center text-4xl border-4 border-white dark:border-zinc-900"
          >
            {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
          </motion.div>
        </div>

          {/* Details */}
          <div className="flex-1 space-y-4 w-full">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-zinc-200 border-b border-slate-200 dark:border-zinc-800 pb-2">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Name</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Grade</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Student ID</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Advisor</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-zinc-100">{profile.advisor}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Quick Stats Bento Item */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 p-6 rounded-2xl shadow-xl shadow-zinc-950/5 w-full relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-5">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Tutor Sessions</span>
              <span className="px-3 py-1 text-sm font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20 rounded-full">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Quizzes Passed</span>
              <span className="px-3 py-1 text-sm font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 rounded-full">8/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Streak</span>
              <span className="px-3 py-1 text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 rounded-full">5 Days</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Snapshot Bento Item */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full flex-1 relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-5">Activity Snapshot</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">Mastered Kinematics</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">Chat with AI Tutor</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Yesterday</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
