'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole, removeToken } from '@/lib/auth';
import SidebarNav from '@/components/dashboard/SidebarNav';
import WellbeingMeter from '@/components/dashboard/WellbeingMeter';
import SocraticTutor from '@/components/dashboard/SocraticTutor';
import AdaptiveQuiz from '@/components/dashboard/AdaptiveQuiz';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('Learning');
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userRole = getUserRole();
        if (!userRole) {
            router.push('/login');
        } else {
            setRole(userRole);
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    }

    return (
        <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-zinc-100">
                <SidebarNav />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-10 py-8 relative">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-4 border-b border-zinc-100">
                    <h2 className="text-2xl font-bold">Hey, {role === 'teacher' ? 'Teacher' : 'Student'}</h2>
                    <div className="flex gap-4 items-center">
                        <button className="text-zinc-500 hover:text-zinc-900">
                            {/* Notification Icon placeholder */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </button>
                        <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">
                            Logout
                        </button>
                    </div>
                </header>

                {role === 'student' ? (
                    <>
                        {/* Tabs */}
                        <div className="flex items-center gap-6 mb-8 text-sm font-medium border-b border-zinc-100 pb-2">
                            {['Learning', 'Practice', 'History'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 -mb-2.5 transition-colors ${activeTab === tab ? 'text-zinc-900 border-b-2 border-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-4xl">
                            {activeTab === 'Learning' && (
                                <div className="flex flex-col gap-8">
                                    <SocraticTutor />
                                </div>
                            )}
                            
                            {activeTab === 'Practice' && (
                                <div className="flex flex-col gap-8">
                                    <AdaptiveQuiz />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="max-w-4xl">
                        <TeacherDashboard />
                    </div>
                )}
            </main>

            {/* Right Sidebar (Dark Theme) */}
            {role === 'student' && (
                <div className="w-[340px] flex-shrink-0 bg-[#2E2E2E] text-white p-6 rounded-l-3xl shadow-2xl my-4 overflow-y-auto">
                    <WellbeingMeter />
                </div>
            )}
        </div>
    );
}
