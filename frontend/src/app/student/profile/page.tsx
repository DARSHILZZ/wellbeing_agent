import { supabase } from '@/lib/supabase';
import ProfileUI from './ProfileUI';

export default async function ProfilePage() {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .limit(1)
    .maybeSingle();

  const profile = profileData
    ? {
        name: profileData.full_name,
        grade: '10th',
        email: profileData.email,
        id: profileData.id ? `STU-${profileData.id.slice(0, 5).toUpperCase()}` : 'STU-9842',
        advisor: 'Dr. Emily Chen',
      }
    : {
        name: 'Alex Johnson',
        grade: '10th',
        email: 'alex@springfield.edu',
        id: 'STU-9842',
        advisor: 'Dr. Emily Chen',
      };

  return <ProfileUI profile={profile} />;
}
