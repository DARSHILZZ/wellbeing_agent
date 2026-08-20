"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StudentsPage() {
  const mockStudents = [
    { id: 1, name: "Alex Johnson", grade: "10th", status: "Needs Attention", lastActive: "2 hours ago" },
    { id: 2, name: "Maria Garcia", grade: "11th", status: "On Track", lastActive: "Yesterday" },
    { id: 3, name: "David Chen", grade: "10th", status: "On Track", lastActive: "Just now" },
    { id: 4, name: "Sarah Connor", grade: "12th", status: "Needs Attention", lastActive: "3 days ago" },
  ];

  return (
    <div className="w-full max-w-6xl p-8 flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Student Directory</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage and monitor all students enrolled in your classes.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Name</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Grade</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Last Active</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-100 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-zinc-200">{student.name}</td>
                  <td className="p-4 text-slate-600 dark:text-zinc-400">{student.grade}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      student.status === 'On Track' 
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50' 
                        : 'bg-red-500/10 text-red-600 border-red-200/50'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{student.lastActive}</td>
                  <td className="p-4">
                    <Link 
                      href={`/teacher/students/${student.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
