"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScoreData {
  score: number;
  subject?: string;
}

interface PerformanceUIProps {
  scores: ScoreData[];
  overallPerformance: string;
}

export default function PerformanceUI({ scores, overallPerformance }: PerformanceUIProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Dynamically get unique subjects for the filter pills
  const subjects = useMemo(() => {
    const unique = new Set(scores.map(s => s.subject).filter(Boolean));
    return ["All", ...Array.from(unique)] as string[];
  }, [scores]);

  // Filter and map into a format Recharts understands { name: 'Test 1', score: 85 }
  const chartData = useMemo(() => {
    let filtered = scores;
    if (activeFilter !== "All") {
      filtered = scores.filter(s => s.subject === activeFilter);
    }
    
    return filtered.map((item, index) => ({
      name: `Test ${index + 1}`,
      score: Number(item.score)
    }));
  }, [scores, activeFilter]);

  // Determine accent color based on performance
  const isExcellent = overallPerformance === 'Excellent';
  const isGood = overallPerformance === 'Good Standing';
  const accentColor = isExcellent ? '#10b981' : isGood ? '#3b82f6' : '#f59e0b'; // Emerald, Blue, Amber
  const gradientId = "colorScore";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 right-0 h-1`} style={{ backgroundColor: accentColor }} />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Performance Trends</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Track your learning progress over time.</p>
          </div>
          <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Overall Standing</p>
            <p className="text-xl font-bold mt-1" style={{ color: accentColor }}>
              {overallPerformance}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full min-h-[400px] flex flex-col"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">Score History</h2>
          
          {/* Subject Filters */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveFilter(subject)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === subject
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', height: 350, minHeight: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-zinc-800" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fill: '#64748b' }} 
                axisLine={false} 
                tickLine={false} 
                dx={-10}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 1)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: '#1e293b'
                }}
                itemStyle={{ color: accentColor, fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke={accentColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
