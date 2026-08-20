import { supabase } from '@/lib/supabase';
import QuizUI from './QuizUI';

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
        { subject: 'Mathematics', score: 85, date: '2026-08-15' },
        { subject: 'Physics', score: 72, date: '2026-08-12' },
        { subject: 'Chemistry', score: 90, date: '2026-08-10' },
        { subject: 'Mathematics', score: 68, date: '2026-08-05' },
        { subject: 'Computer Science', score: 95, date: '2026-08-01' },
      ];

  return <QuizUI quizHistory={quizHistory} />;
}
