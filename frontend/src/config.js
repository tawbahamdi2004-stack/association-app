// On met l'URL de Render en premier choix par défaut pour la production
export const API_URL = import.meta.env.VITE_API_URL || 'https://association-app-backend.onrender.com';

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};