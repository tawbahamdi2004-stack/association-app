import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function GroupeDetail() {
  const { id } = useParams();
  const [groupe, setGroupe] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [enfants, setEnfants] = useState([]);
  const [enfantSelectionne, setEnfantSelectionne] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/groupes/${id}`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/enfants`, { headers: getHeaders() }).then(r => r.json())
    ]).then(([groupeData, enfantsData]) => {
      setGroupe(groupeData.groupe);
      setAffectations(groupeData.affectations);
      setEnfants(enfantsData);
    });
  }, [id]);

  const affecterEnfant = async () => {
    if (!enfantSelectionne) return;
    await fetch(`${API_URL}/api/affectations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        enfant: enfantSelectionne,
        groupe: id,
        dateDebut: groupe.dateDebut,
        dateFin: groupe.dateFin
      })
    });
    setEnfantSelectionne('');
    const res = await fetch(`${API_URL}/api/groupes/${id}`, { headers: getHeaders() });
    const data = await res.json();
    setAffectations(data.affectations);
  };

  if (!groupe) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/groupes')} style={{ marginBottom: '20px' }}>← Retour</button>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
        <h1>{groupe.nom}</h1>
        <p><strong>Activité:</strong> {groupe.activite}</p>
        <p><strong>Période:</strong> {new Date(groupe.dateDebut).toLocaleDateString()} - {new Date(groupe.dateFin).toLocaleDateString()}</p>
        <p><strong>Nombre d'enfants:</strong> {affectations.length}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>Affecter un enfant</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={enfantSelectionne} onChange={e => setEnfantSelectionne(e.target.value)} style={{ flex: 1, padding: '8px' }}>
            <option value="">Sélectionner un enfant</option>
            {enfants.map(e => (
              <option key={e._id} value={e._id}>{e.prenom} {e.nom}</option>
            ))}
          </select>
          <button onClick={affecterEnfant} style={{ padding: '8px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Affecter
          </button>
        </div>
      </div>

      <h2>Enfants du groupe</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Prénom</th>
            <th style={thStyle}>Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {affectations.map(a => (
            <tr key={a._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{a.enfant.nom}</td>
              <td style={tdStyle}>{a.enfant.prenom}</td>
              <td style={tdStyle}>{a.enfant.telephone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };