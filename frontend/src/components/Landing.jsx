import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 font-arabic">
      {/* Barre de navigation */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo de l'association */}
          
            <img src={logo} alt="شعار الجمعية" className="w-12 h-12 rounded-full shadow-lg" />
          <h1 className="text-2xl font-bold text-emerald-700">
            جمعية النور
          </h1>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          فضاء الإدارة
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          إدارة جمعيتكم <br/>
          <span className="text-emerald-600">بكل سهولة واحترافية</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mb-10 leading-relaxed">
          منصة متكاملة لإدارة الأطفال، المجموعات، الحضور والمدفوعات. 
          بسيطة، آمنة ومصممة لتوفير وقتكم وجهدكم.
        </p>
        
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-emerald-600 text-white text-lg rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30"
        >
          الدخول إلى لوحة التحكم
        </button>

        {/* Cartes de fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
          {[
            { icon: '👧', title: 'إدارة الأطفال', desc: 'بطاقات كاملة مع السجل التاريخي ومعلومات الاتصال.' },
            { icon: '', title: 'الحضور والمجموعات', desc: 'متابعة في الوقت الفعلي للأنشطة والفترات.' },
            { icon: '', title: 'المدفوعات والإيصالات', desc: 'إنشاء تلقائي لإيصالات احترافية.' }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center p-6 text-gray-500 text-sm">
        © 2026 جمعية النور. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}