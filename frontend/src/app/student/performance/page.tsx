import { supabase } from '@/lib/supabase';
import PerformanceUI from './PerformanceUI';

export default async function PerformancePage() {
  const { data: scores } = await supabase
    .from('scores')
    .select('score');

  let overallPerformance = 'Needs Improvement';
  if (scores && scores.length > 0) {
    const avgScore = scores.reduce((acc, curr) => acc + Number(curr.score), 0) / scores.length;
    if (avgScore >= 80) overallPerformance = 'Excellent';
    else if (avgScore >= 70) overallPerformance = 'Good Standing';
    else overallPerformance = 'Needs Improvement';
  }

  return <PerformanceUI scores={scores} overallPerformance={overallPerformance} />;
}
