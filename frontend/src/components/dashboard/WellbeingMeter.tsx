'use client';
import { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Globe, Users, CheckCircle2, RotateCcw, ChevronRight, Play } from 'lucide-react';
import { fetchStudentStats } from '@/lib/api';

export default function WellbeingMeter() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchStudentStats('test-session-123').then(setStats).catch(console.error);
    }, []);

    if (!stats) return <div className="animate-pulse flex flex-col gap-4">
        <div className="h-10 bg-white/10 rounded-lg w-full" />
        <div className="h-24 bg-white/10 rounded-lg w-full" />
    </div>;

    return (
        <div className="flex flex-col text-sm text-zinc-300">
            <div className="flex justify-between items-center mb-6">
                <span className="text-zinc-400">You're currently at</span>
                <button className="w-6 h-6 bg-white/10 rounded hover:bg-white/20 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-white text-lg font-bold leading-tight mb-6">
                {stats.streak_days} days on path Novice to Master through Practice
            </h3>

            {/* Daily check-in widget */}
            <div className="bg-[#3A3A3A] rounded-xl p-4 flex items-center justify-between mb-8 cursor-pointer hover:bg-[#444]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs text-zinc-400">today's check-in</div>
                        <div className="text-white font-medium">Have you practiced today?</div>
                    </div>
                </div>
                <div className="flex items-center text-orange-400 text-xs font-bold gap-1">
                    <span>🔥 1</span>
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>

            {/* List items */}
            <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-8">
                <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-zinc-200 group-hover:text-white transition-colors">Mastery Level</span>
                    </div>
                    <span className="text-zinc-400">{stats.mastery_percentage}%</span>
                </div>

                <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-zinc-200 group-hover:text-white transition-colors">Cognitive State</span>
                    </div>
                    <span className="text-zinc-400 capitalize">{stats.cognitive_load_state}</span>
                </div>
                
                <div className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-zinc-200 group-hover:text-white transition-colors">Activities completed</span>
                    </div>
                    <span className="text-zinc-400">0 of 10</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                    <RotateCcw className="w-3 h-3" />
                    <span>Past paths</span>
                </div>
                <ChevronRight className="w-3 h-3" />
            </div>

            {/* Suggested activities */}
            <div>
                <div className="flex justify-between items-center mb-3 text-xs">
                    <span className="text-zinc-400">Suggested activities</span>
                    <button><RotateCcw className="w-3 h-3 text-zinc-500 hover:text-zinc-300" /></button>
                </div>
                <h4 className="text-white text-base font-bold mb-4">Give it a shot</h4>

                <div className="flex flex-col gap-3">
                    <div className="bg-[#3A3A3A] p-4 rounded-xl flex justify-between items-center hover:bg-[#444] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                <Play className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Review</div>
                                <div className="text-white font-medium text-sm">Newton's Laws</div>
                            </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
                            Start
                        </button>
                    </div>
                    
                    <div className="bg-[#3A3A3A] p-4 rounded-xl flex justify-between items-center hover:bg-[#444] transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Practice</div>
                                <div className="text-white font-medium text-sm">Kinematics Quiz</div>
                            </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors">
                            Start
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
