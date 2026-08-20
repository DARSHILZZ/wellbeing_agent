"use client";

import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <div className="w-full max-w-3xl p-8 flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your classroom preferences and notifications.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full"
      >
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 mb-4">Notifications</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-700 dark:text-zinc-300">Email me when a student falls behind</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-slate-700 dark:text-zinc-300">Send weekly class summary report</span>
              </label>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-zinc-800" />

          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 mb-4">Class Management</h3>
            
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">Primary Subject Taught</label>
            <select className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 dark:text-zinc-100">
              <option>Physics</option>
              <option>Mathematics</option>
              <option>Computer Science</option>
              <option>Chemistry</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
