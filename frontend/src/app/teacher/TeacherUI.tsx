"use client";

import { motion } from 'framer-motion';
import TiltedCard from '@/components/TiltedCard';

interface WeakStudent {
  id: string;
  name: string;
  location: string;
  institution: string;
  weakSubjects: string[];
  score: number;
  avatar: string;
}

interface TeacherUIProps {
  weakStudents: WeakStudent[];
}

export default function TeacherUI({ weakStudents }: TeacherUIProps) {
  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-zinc-950/5 border border-zinc-200/80 dark:border-zinc-800 w-full relative overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-zinc-100">Analytics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Monitor student performance and identify areas needing attention.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full"
      >
        {weakStudents.map((student) => (
          <div key={student.id} className="relative group">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[20px] blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            
            <TiltedCard
              imageSrc={student.avatar}
              altText={student.name}
              captionText={student.location}
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex flex-col justify-end p-6 w-[300px] h-[300px] rounded-[15px] bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{student.name}</h3>
                  <p className="text-zinc-200 text-sm mb-2 drop-shadow-md">{student.institution}</p>
                  
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="bg-red-500/20 text-red-100 border border-red-500/30 rounded-full px-2 py-0.5 text-xs shadow backdrop-blur-md">
                      Weak: {Array.isArray(student.weakSubjects) ? student.weakSubjects.join(', ') : student.weakSubjects}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-white font-mono bg-black/40 backdrop-blur-md w-fit px-2 py-1 rounded text-sm border border-white/10 shadow-sm">
                      Avg Score: {student.score}%
                    </span>
                  </div>
                </div>
              }
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
