'use client';
import { useState } from 'react';
import { BookOpen, Send, Loader2 } from 'lucide-react';
import { chatSocratic } from '@/lib/api';

export default function SocraticTutor() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatSocratic(input, 'test-session-123');
            const aiMsg = { 
                role: 'ai', 
                content: res.socratic_response, 
                citations: res.citations 
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-50/50 border border-zinc-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Socratic Tutor</h3>
                    <p className="text-sm text-zinc-500">I'll guide you to the answer, but I won't give it to you.</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-100 rounded-2xl p-4 flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                            <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                            <p>Ask a physics question to start.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-zinc-100 text-zinc-900 rounded-bl-sm'}`}>
                                {msg.content}
                            </div>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-2 text-xs text-zinc-500 flex flex-col gap-1 border border-zinc-100 p-2 rounded-lg bg-white shadow-sm w-fit max-w-[85%]">
                                    <div className="font-semibold flex items-center gap-1 text-blue-600">
                                        <BookOpen className="w-3 h-3" /> Citation: {msg.citations[0].source} (p.{msg.citations[0].page})
                                    </div>
                                    <div className="italic text-zinc-400">"{msg.citations[0].snippet}"</div>
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Thinking...
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-4 py-2 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="What's on your mind?"
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button 
                        onClick={handleSend}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        disabled={loading || !input.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
