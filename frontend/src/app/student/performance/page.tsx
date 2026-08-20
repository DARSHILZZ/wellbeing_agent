import { supabase } from '@/lib/supabase';

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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Performance (Supabase)</h1>
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p className="text-gray-700">
          <strong>Overall Performance:</strong>{' '}
          <span className="text-orange-600 font-semibold">{overallPerformance}</span>
        </p>
      </div>
    </div>
  );
}
