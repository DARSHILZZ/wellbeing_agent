import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
};

export const getToken = () => {
  return Cookies.get('token');
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};
