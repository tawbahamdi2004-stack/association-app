import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 Tentative de connexion...');
    console.log('📡 URL API:', API_URL);
    console.log('📧 Email:', email);
    
    setErreur('');
    setChargement(true);
    
    try {
      const result = await login(email, motDePasse);
      console.log('✅ Connexion réussie:', result);
      navigate('/');
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      setErreur(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white text-3xl">
              ️
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-arabic">تسجيل الدخول</h1>
          <p className="text-gray-500 mt-2 font-arabic">فضاء إدارة الجمعية</p>
        </div>

        {erreur && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-arabic">
            ⚠️ {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-right"
              placeholder="admin@association.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-arabic">كلمة المرور</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-right"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={chargement}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-arabic"
          >
            {chargement ? 'جاري الاتصال...' : 'تسجيل الدخول'}
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/')} 
          className="w-full mt-4 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-arabic"
        >
          ← العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}