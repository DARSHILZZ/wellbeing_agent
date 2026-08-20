import Link from 'next/link';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-64 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Menu</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/student/profile" className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">Profile</Link>
          <Link href="/student/performance" className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">Performance</Link>
          <Link href="/student/chat" className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">Socratic Tutor</Link>
          <Link href="/student/quiz" className="px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-700">Quiz History</Link>
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
