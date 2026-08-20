"use client";
import { motion } from 'framer-motion';

export default function ProfileUI({ profile }: { profile: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="md:col-span-2 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 w-full"
      >
        <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-zinc-100">Student Profile (Supabase)</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }} 
            transition={{ type: "spring", stiffness: 300 }}
            className="w-32 h-32 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 font-semibold flex items-center justify-center text-4xl shrink-0"
          >
            {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'AJ'}
          </motion.div>

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
          className="bg-gradient-to-br from-indigo-50/50 to-slate-50 dark:from-indigo-900/20 dark:to-zinc-900/50 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl shadow-sm w-full"
        >
          <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">AI Tutor Sessions</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Quizzes Passed</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400">8/10</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Snapshot Bento Item */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 w-full flex-1"
        >
          <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 mb-4">Activity Snapshot</h2>
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
