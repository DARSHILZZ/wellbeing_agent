import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuizUI from "@/app/student/quiz/QuizUI";
import { supabase } from "@/lib/supabase";

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Wait for the params object according to Next.js 15+ patterns
  const resolvedParams = await params;
  const studentId = resolvedParams.id;

  // In the future, you would use studentId to fetch the specific student's quiz history:
  // const { data } = await supabase.from('scores').select('...').eq('student_id', studentId);
  
  // For now, we will provide a high-quality mock array so the UI can be tested
  const mockQuizHistory = [
    { subject: 'Mathematics', score: 92, date: '2026-08-18' },
    { subject: 'Physics', score: 75, date: '2026-08-15' },
    { subject: 'Mathematics', score: 88, date: '2026-08-10' },
    { subject: 'Computer Science', score: 95, date: '2026-08-05' },
    { subject: 'Chemistry', score: 62, date: '2026-08-01' },
  ];

  return (
    <div className="w-full max-w-6xl p-8 flex flex-col gap-6">
      <Link 
        href="/teacher/students"
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>
      
      {/* We reuse the exact same QuizUI component we built for the student! */}
      <QuizUI quizHistory={mockQuizHistory} />
    </div>
  );
}
