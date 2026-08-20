import { supabase } from '@/lib/supabase';
import TeacherUI from './TeacherUI';

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

  return <TeacherUI weakStudents={weakStudents} />;
}
