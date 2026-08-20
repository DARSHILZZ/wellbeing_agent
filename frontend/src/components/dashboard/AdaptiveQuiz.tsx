'use client';
import { useEffect, useState } from 'react';
import { Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { fetchAdaptivePractice } from '@/lib/api';

export default function AdaptiveQuiz() {
    const [practiceData, setPracticeData] = useState<any>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    useEffect(() => {
        fetchAdaptivePractice('test-session-123').then(setPracticeData).catch(console.error);
    }, []);

    if (!practiceData) return <div className="animate-pulse bg-zinc-50 h-[300px] rounded-3xl" />;

    const question = practiceData.questions[0];

    return (
        <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm flex gap-6">
            <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Target className="w-8 h-8 opacity-50" />
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    <span>Gap Identified</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{practiceData.concept_gap}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-4">{question.text}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                    {question.options.map((opt: string, i: number) => {
                        const isSelected = selectedAnswer === opt;
                        const isCorrect = isSelected && opt === question.correct_answer;
                        
                        return (
                            <button 
                                key={i}
                                onClick={() => setSelectedAnswer(opt)}
                                className={`text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between
                                    ${isSelected 
                                        ? (isCorrect 
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                                            : 'border-red-500 bg-red-50 text-red-800')
                                        : 'border-zinc-200 hover:border-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                {opt}
                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            </button>
                        )
                    })}
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-full font-medium transition-colors">
                        Next Question
                    </button>
                </div>
            </div>
        </div>
    );
}
