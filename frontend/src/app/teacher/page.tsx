import TiltedCard from '@/components/TiltedCard';
import { supabase } from '@/lib/supabase';

export default async function TeacherDashboard() {
  const { data: studentsData } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      avatar_url,
      weakness_flags (
        topic,
        level
      ),
      scores (
        score
      )
    `)
    .eq('role', 'student');

  const weakStudents = (studentsData && studentsData.length > 0)
    ? studentsData.map((s: any) => {
        const weakSubjects = s.weakness_flags?.map((w: any) => w.topic) || ['Math'];
        const avgScore = s.scores?.length
          ? Math.round(s.scores.reduce((acc: number, item: any) => acc + Number(item.score), 0) / s.scores.length)
          : 68;

        return {
          id: s.id,
          name: s.full_name,
          location: 'Supabase DB',
          institution: s.email || 'Enrolled Student',
          weakSubjects: weakSubjects.length > 0 ? weakSubjects : ['General'],
          score: avgScore,
          avatar: s.avatar_url || 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=300&h=300&auto=format&fit=crop',
        };
      })
    : [
        {
          id: '1',
          name: 'Alex Johnson',
          location: 'Supabase Cloud DB',
          institution: 'Springfield High',
          weakSubjects: ['Math', 'Physics'],
          score: 65,
          avatar: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=300&h=300&auto=format&fit=crop',
        },
        {
          id: '2',
          name: 'Maria Garcia',
          location: 'Supabase Cloud DB',
          institution: 'Austin Valley',
          weakSubjects: ['Chemistry'],
          score: 70,
          avatar: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=300&h=300&auto=format&fit=crop',
        },
      ];

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Teacher Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Weak Students (Supabase Connected)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
        {weakStudents.map((student: any) => (
          <TiltedCard
            key={student.id}
            imageSrc={student.avatar}
            altText={student.name}
            captionText={student.location}
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="300px"
            imageWidth="300px"
            rotateAmplitude={12}
            scaleOnHover={1.05}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="flex flex-col justify-end p-6 w-[300px] h-[300px] rounded-[15px] bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{student.name}</h3>
                <p className="text-gray-200 text-sm mb-2 drop-shadow-md">{student.institution}</p>
                <div className="bg-red-500/80 text-white rounded px-2 py-1 text-xs mb-2 w-fit shadow">
                  Weak: {Array.isArray(student.weakSubjects) ? student.weakSubjects.join(', ') : student.weakSubjects}
                </div>
                <p className="text-white font-mono bg-black/60 w-fit px-2 py-1 rounded text-sm border border-white/20 shadow">
                  Score: {student.score}
                </p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
