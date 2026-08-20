'use client';
import { Home, Users, Settings, BookOpen, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNav() {
    const pathname = usePathname();
    
    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'People', href: '#', icon: Users },
        { name: 'Practice', href: '#', icon: BookOpen },
        { name: 'Settings', href: '#', icon: Settings },
    ];

    return (
        <aside className="w-full bg-white h-full flex flex-col pt-6">
            <div className="flex flex-col items-center mb-8 px-4">
                <div className="font-extrabold text-2xl tracking-tighter mb-8">
                    EduWell
                </div>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <UserCircle2 className="w-12 h-12" />
                    </div>
                    <div className="font-bold text-zinc-900">Marsh Mello</div>
                    <div className="text-xs text-zinc-400 mt-1">nvc10b.2022@gmail.com</div>
                </div>
            </div>

            <nav className="flex flex-col gap-1 px-4 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.name} 
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-zinc-50 text-zinc-900 border-l-2 border-zinc-900' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                        >
                            <Icon className="w-5 h-5 text-zinc-400" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
