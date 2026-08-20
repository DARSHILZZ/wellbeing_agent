import Link from 'next/link';
import Aurora from '@/components/Aurora';

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora 
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']} 
          blend={0.5} 
          amplitude={1.0} 
          speed={0.5} 
        />
      </div>
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
