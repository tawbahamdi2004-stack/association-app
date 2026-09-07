import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function EnfantDetail() {
  const { id } = useParams();
  const [enfant, setEnfant] = useState(null);
  const [affectations, setAffectations] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [presences, setPresences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/enfants/${id}`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/paiements?enfantId=${id}`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/presences?enfantId=${id}`, { headers: getHeaders() }).then(r => r.json())
    ]).then(([enfantData, paiementsData, presencesData]) => {
      setEnfant(enfantData.enfant);
      setAffectations(enfantData.affectations);
      setPaiements(paiementsData);
      setPresences(presencesData);
    });
  }, [id]);

  if (!enfant) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/enfants')} style={{ marginBottom: '20px' }}>← Retour</button>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
        <h1>{enfant.prenom} {enfant.nom}</h1>
        <p> {enfant.telephone}</p>
        <p>📅 Inscrit le: {new Date(enfant.dateInscription).toLocaleDateString()}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>👥 Groupes</h2>
        {affectations.length === 0 ? <p>Aucun groupe</p> : (
          <ul>
            {affectations.map(a => (
              <li key={a._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <strong>{a.groupe.nom}</strong> ({a.groupe.activite})<br />
                Du {new Date(a.dateDebut).toLocaleDateString()} au {new Date(a.dateFin).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>💰 Historique Paiements</h2>
        {paiements.length === 0 ? <p>Aucun paiement</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={thStyle}>Période</th>
                <th style={thStyle}>Groupe</th>
                <th style={thStyle}>Montant</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Reçu</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map(p => (
                <tr key={p._id}>
                  <td style={tdStyle}>{p.periode}</td>
                  <td style={tdStyle}>{p.groupe?.nom}</td>
                  <td style={tdStyle}>{p.montant} DT</td>
                  <td style={tdStyle}>{p.statut === 'paye' ? '✅' : '❌'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => navigate(`/recu/${p._id}`)} style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h2>📅 Historique Présences</h2>
        {presences.length === 0 ? <p>Aucune présence</p> : (
          <ul>
            {presences.map(p => (
              <li key={p._id} style={{ padding: '5px' }}>
                {new Date(p.date).toLocaleDateString()} - {p.groupe?.nom}: {p.present ? '✅ Présent' : '❌ Absent'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };