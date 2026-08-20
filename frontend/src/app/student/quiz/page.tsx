import { supabase } from '@/lib/supabase';

export default async function QuizPage() {
  const { data: scoresData } = await supabase
    .from('scores')
    .select(`
      id,
      score,
      completed_at,
      quizzes (
        topic,
        subject
      )
    `)
    .order('completed_at', { ascending: false });

  const quizHistory = (scoresData && scoresData.length > 0)
    ? scoresData.map((item: any) => ({
        subject: item.quizzes?.subject || item.quizzes?.topic || 'General Knowledge',
        score: item.score,
        date: new Date(item.completed_at).toISOString().split('T')[0],
      }))
    : [
        { subject: 'Math', score: 60, date: '2023-10-01' },
        { subject: 'Physics', score: 70, date: '2023-10-05' },
      ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Quiz History (Supabase)</h1>
      <div className="space-y-3 mt-4">
        {quizHistory.map((quiz: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 text-lg">{quiz.subject}</div>
              <div className="text-sm text-gray-500">{quiz.date}</div>
            </div>
            <div className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {quiz.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
