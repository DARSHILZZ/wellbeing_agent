import { supabase } from '@/lib/supabase';
import PerformanceUI from './PerformanceUI';

export default async function PerformancePage() {
  const { data: scoresData } = await supabase
    .from('scores')
    .select(`
      score,
      quizzes (
        subject
      )
    `);

  // Map Supabase data or use rich mock fallback
  const scores = (scoresData && scoresData.length > 0)
    ? scoresData.map((item: any) => ({
        score: item.score,
        subject: item.quizzes?.subject || 'General Knowledge',
      }))
    : [
        { score: 65, subject: 'Mathematics' }, { score: 68, subject: 'Mathematics' }, 
        { score: 75, subject: 'Mathematics' }, { score: 72, subject: 'Mathematics' }, 
        { score: 80, subject: 'Mathematics' }, { score: 85, subject: 'Mathematics' },
        { score: 80, subject: 'Physics' }, { score: 82, subject: 'Physics' },
        { score: 78, subject: 'Physics' }, { score: 85, subject: 'Physics' },
      ];

  let overallPerformance = 'Needs Improvement';
  if (scores && scores.length > 0) {
    const avgScore = scores.reduce((acc, curr) => acc + Number(curr.score), 0) / scores.length;
    if (avgScore >= 80) overallPerformance = 'Excellent';
    else if (avgScore >= 70) overallPerformance = 'Good Standing';
    else overallPerformance = 'Needs Improvement';
  }

  return <PerformanceUI scores={scores} overallPerformance={overallPerformance} />;
}
