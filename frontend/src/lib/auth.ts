import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface UserProfile {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  full_name?: string;
}

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
};

export const getToken = () => {
  return Cookies.get('token');
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const setUserProfile = (profile: UserProfile) => {
  Cookies.set('user_profile', JSON.stringify(profile), { expires: 7 });
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }
};

export const getUserProfile = (): UserProfile | null => {
  const profileCookie = Cookies.get('user_profile');
  if (profileCookie) {
    try {
      return JSON.parse(profileCookie);
    } catch {
      // fallback to localStorage if parse fails
    }
  }

  if (typeof window !== 'undefined') {
    const localProfile = localStorage.getItem('user_profile');
    if (localProfile) {
      try {
        return JSON.parse(localProfile);
      } catch {
        return null;
      }
    }
  }

  return null;
};

export const removeUserProfile = () => {
  Cookies.remove('user_profile');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_profile');
  }
};

export const logout = () => {
  removeToken();
  removeUserProfile();
};

export const getUserRole = (): 'student' | 'teacher' | null => {
  // First, check stored profile
  const profile = getUserProfile();
  if (profile?.role) {
    return profile.role;
  }

  // Second, check decoded token
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.role || decoded.user_metadata?.role || decoded.app_metadata?.role;
    if (role === 'student' || role === 'teacher') {
      return role;
    }
    return null;
  } catch (error) {
    return null;
  }
};

