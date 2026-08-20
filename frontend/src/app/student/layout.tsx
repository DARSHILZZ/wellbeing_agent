import Link from 'next/link';
import { User, BarChart, MessageSquare, ClipboardList } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto p-6 gap-6 relative z-10 w-full">
      <aside className="w-64 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-zinc-800 h-fit p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-zinc-100">Student Portal</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
            <User className="w-5 h-5 text-indigo-100" />
            Profile
          </Link>
          <Link href="/student/performance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:bg-slate-200/50 hover:scale-[1.02] active:scale-95">
            <BarChart className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Performance
          </Link>
          <Link href="/student/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:bg-slate-200/50 hover:scale-[1.02] active:scale-95">
            <MessageSquare className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Socratic Tutor
          </Link>
          <Link href="/student/quiz" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:bg-slate-200/50 hover:scale-[1.02] active:scale-95">
            <ClipboardList className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            Quiz History
          </Link>
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
