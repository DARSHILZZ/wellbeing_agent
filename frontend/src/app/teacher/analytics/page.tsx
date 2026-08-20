"use client";

import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-6xl p-8 flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Class Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Macro-level insights into your classroom's performance.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Class Average Score</h3>
          <p className="text-4xl font-bold text-slate-800 dark:text-zinc-100 mt-2">84%</p>
          <p className="text-sm font-medium text-emerald-500 mt-2">+2% from last week</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active AI Sessions</h3>
          <p className="text-4xl font-bold text-slate-800 dark:text-zinc-100 mt-2">12</p>
          <p className="text-sm font-medium text-slate-500 mt-2">Students currently studying</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-500" />
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Quizzes Taken</h3>
          <p className="text-4xl font-bold text-slate-800 dark:text-zinc-100 mt-2">156</p>
          <p className="text-sm font-medium text-emerald-500 mt-2">This month</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full min-h-[300px] flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed border-slate-300 dark:border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-400 dark:text-zinc-500 text-2xl">📈</span>
          </div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">[ Placeholder for Performance Trend Chart ]</p>
        </div>
      </motion.div>
    </div>
  );
}
