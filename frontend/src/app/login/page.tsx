import Link from 'next/link';

export default function Login() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-white dark:bg-black bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#525252_1px,transparent_1px)]">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur p-8 rounded-xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">AI Tutor Login</h1>
        <div className="space-y-4">
          <Link href="/teacher" className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Login as Teacher
          </Link>
          <Link href="/student" className="block w-full text-center bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Login as Student
          </Link>
        </div>
      </div>
    </div>
  );
}
