'use client';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, Loader2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function SocraticTutor({ onSentimentUpdate }: { onSentimentUpdate?: (sentiment: string) => void }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const ws = useRef<WebSocket | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        let active = true;
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/api/v1/chat/ws/socratic';
        const websocket = new WebSocket(wsUrl);
        ws.current = websocket;

        websocket.onmessage = (event) => {
            if (!active) return;
            try {
                const res = JSON.parse(event.data);
                
                if (res.error) {
                    const errorMsg = { role: 'ai', content: res.error };
                    setMessages((prev) => [...prev, errorMsg]);
                    setLoading(false);
                    return;
                }

                const aiMsg = { 
                    role: 'ai', 
                    content: res.socratic_response, 
                    citations: res.citations 
                };
                setMessages((prev) => [...prev, aiMsg]);
                
                if (onSentimentUpdate && res.wellbeing_sentiment) {
                    onSentimentUpdate(res.wellbeing_sentiment);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message", error);
            } finally {
                setLoading(false);
            }
        };

        websocket.onerror = (error) => {
            if (!active) return;
            console.error("WebSocket Error", error);
            const errorMsg = { role: 'ai', content: "Lost connection to the tutor. Please try again." };
            setMessages((prev) => [...prev, errorMsg]);
            setLoading(false);
        };

        return () => {
            active = false;
            websocket.close();
        };
    }, [onSentimentUpdate]);

    const handleSend = () => {
        if (!input.trim() || !ws.current) return;
        
        const userMsg = { role: 'user', content: input };
        
        // Save current history before appending the new message
        const chatHistory = [...messages];
        
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            ws.current.send(JSON.stringify({
                query: input,
                student_id: 'student-123',
                chat_history: chatHistory
            }));
        } catch (error) {
            console.error(error);
            const errorMsg = { role: 'ai', content: "I'm having trouble connecting right now. Could you try asking again?" };
            setMessages((prev) => [...prev, errorMsg]);
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm border-zinc-100 overflow-hidden flex flex-col h-[550px]">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Socratic Tutor</CardTitle>
                    <p className="text-sm text-zinc-500 font-normal mt-0.5">I guide you to answers using textbook sources.</p>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col relative overflow-hidden bg-white">
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                            <Sparkles className="w-8 h-8 mb-3 opacity-50 text-blue-400" />
                            <p>Ask a physics question to start.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-zinc-100/80 text-zinc-900 rounded-bl-sm border border-zinc-200/50'}`}>
                                {msg.content}
                            </div>
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-2 text-xs flex flex-wrap gap-2 max-w-[85%]">
                                    {msg.citations.map((cite: any, idx: number) => (
                                        <Badge key={idx} className="bg-blue-50 text-blue-700 border-blue-100 font-medium px-2.5 py-1">
                                            <BookOpen className="w-3 h-3 mr-1.5" />
                                            {cite.source}, Ch {cite.chapter} (pg {cite.page})
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-2 text-zinc-500 text-sm bg-zinc-50 border border-zinc-100 px-4 py-2.5 rounded-full w-fit">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            Consulting textbook sources...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2">
                    <Input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="What's confusing you?"
                        className="flex-1 bg-zinc-50/50 border-zinc-200 focus-visible:ring-blue-500"
                        disabled={loading}
                    />
                    <Button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 rounded-full shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

