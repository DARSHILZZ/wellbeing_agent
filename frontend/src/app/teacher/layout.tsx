import Link from 'next/link';
import { LayoutDashboard, Users, BarChart, Settings, LogOut } from 'lucide-react';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto p-6 gap-6 relative z-10 w-full">
      <aside className="w-64 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 h-fit p-6 shadow-xl shadow-zinc-950/5 relative overflow-hidden flex flex-col">
        {/* Subtle top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-zinc-100">Teacher Portal</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/teacher" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/25 font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
            <LayoutDashboard className="w-5 h-5 text-white/90" />
            Dashboard
          </Link>
          <Link href="/teacher/students" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
            <Users className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            Students
          </Link>
          <Link href="/teacher/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
            <BarChart className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            Analytics
          </Link>
          <Link href="/teacher/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95 mb-8">
            <Settings className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            Settings
          </Link>
          
          <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-95">
              <LogOut className="w-5 h-5" />
              Log Out
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
