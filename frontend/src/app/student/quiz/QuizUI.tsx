"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizRecord {
  subject: string;
  score: number;
  date: string;
}

interface QuizUIProps {
  quizHistory: QuizRecord[];
}

export default function QuizUI({ quizHistory }: QuizUIProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Dynamically get unique subjects for the filter pills
  const subjects = useMemo(() => {
    const unique = new Set(quizHistory.map(q => q.subject));
    return ["All", ...Array.from(unique)];
  }, [quizHistory]);

  // Filter the table data based on active subject
  const filteredHistory = useMemo(() => {
    if (activeFilter === "All") return quizHistory;
    return quizHistory.filter(q => q.subject === activeFilter);
  }, [quizHistory, activeFilter]);

  // Helper to color-code scores
  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-200/50";
    if (score >= 65) return "bg-blue-500/10 text-blue-600 border-blue-200/50";
    return "bg-amber-500/10 text-amber-600 border-amber-200/50";
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Quiz History</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Review your past performance across all subjects.</p>
      </motion.div>

      {/* Filter & Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full flex flex-col"
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveFilter(subject)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === subject
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50 border-y border-slate-200 dark:border-zinc-800">
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Subject</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300">Date Completed</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-zinc-300 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((quiz, index) => (
                    <motion.tr 
                      key={`${quiz.subject}-${quiz.date}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-slate-100 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-800 dark:text-zinc-200">{quiz.subject}</td>
                      <td className="p-4 text-slate-500 dark:text-zinc-400 text-sm">{quiz.date}</td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getScoreBadge(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr className="border-b border-slate-100 dark:border-zinc-800/50">
                    <td colSpan={3} className="p-8 text-center text-slate-500 dark:text-zinc-400">
                      No quizzes found for {activeFilter}.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
