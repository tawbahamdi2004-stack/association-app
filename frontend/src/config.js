// URL du backend Render (production)
export const API_URL = 'https://association-app-backend.onrender.com';

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};