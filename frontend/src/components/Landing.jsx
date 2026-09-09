import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Barre de navigation */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          🏛️ Association Manager
        </h1>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          Espace Administrateur
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Gérez votre association <br/>
          <span className="text-indigo-600">en toute simplicité</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Une plateforme tout-en-un pour gérer les enfants, les groupes, les présences et les paiements. 
          Simple, sécurisé et conçu pour vous faire gagner du temps.
        </p>
        
        <button 
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          Se connecter au Dashboard
        </button>

        {/* Cartes de fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
          {[
            { icon: '👧', title: 'Gestion des Enfants', desc: 'Fiches complètes avec historique et contacts.' },
            { icon: '📅', title: 'Présences & Groupes', desc: 'Suivi en temps réel des activités et périodes.' },
            { icon: '💰', title: 'Paiements & Reçus', desc: 'Génération automatique de reçus professionnels.' }
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
        © 2026 Association Manager. Tous droits réservés.
      </footer>
    </div>
  );
}