import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard`, { headers: getHeaders() })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>️ Dashboard - {user?.nom}</h1>
        <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Déconnexion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#007bff', color: 'white', borderRadius: '10px' }}>
          <h3>👧 Enfants</h3>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{data.totalEnfants}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#28a745', color: 'white', borderRadius: '10px' }}>
          <h3>👥 Groupes</h3>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{data.totalGroupes}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#ffc107', color: 'black', borderRadius: '10px' }}>
          <h3>💰 Total Paiements</h3>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{data.totalPaiements} DT</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#dc3545', color: 'white', borderRadius: '10px' }}>
          <h3>⏳ En Attente</h3>
          <p style={{ fontSize: '2em', margin: '10px 0' }}>{data.paiementsEnAttente} DT</p>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/enfants')} style={btnStyle}>👧 Enfants</button>
        <button onClick={() => navigate('/groupes')} style={btnStyle}>👥 Groupes</button>
        <button onClick={() => navigate('/presences')} style={btnStyle}>📅 Présences</button>
        <button onClick={() => navigate('/paiements')} style={btnStyle}>💰 Paiements</button>
      </nav>

      <h2>Groupes Actifs</h2>
      <ul>
        {data.groupesActifs.map(g => (
          <li key={g._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{g.nom}</strong> - {g.activite}
          </li>
        ))}
      </ul>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};