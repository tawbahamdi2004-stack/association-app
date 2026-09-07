import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [enfants, setEnfants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [form, setForm] = useState({ enfant: '', groupe: '', periode: '', montant: '', modePaiement: 'especes' });
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/paiements`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/enfants`, { headers: getHeaders() }).then(r => r.json()),
      fetch(`${API_URL}/api/groupes`, { headers: getHeaders() }).then(r => r.json())
    ]).then(([p, e, g]) => {
      setPaiements(p);
      setEnfants(e);
      setGroupes(g);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/paiements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form)
    });
    const data = await res.json();
    navigate(`/recu/${data._id}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>💰 Gestion des Paiements</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>Nouveau Paiement</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <select value={form.enfant} onChange={e => setForm({...form, enfant: e.target.value})} required style={selectStyle}>
            <option value="">Enfant</option>
            {enfants.map(e => <option key={e._id} value={e._id}>{e.prenom} {e.nom}</option>)}
          </select>
          <select value={form.groupe} onChange={e => setForm({...form, groupe: e.target.value})} required style={selectStyle}>
            <option value="">Groupe</option>
            {groupes.map(g => <option key={g._id} value={g._id}>{g.nom}</option>)}
          </select>
          <input placeholder="Période (ex: Septembre 2026)" value={form.periode} onChange={e => setForm({...form, periode: e.target.value})} required style={inputStyle} />
          <input type="number" placeholder="Montant (DT)" value={form.montant} onChange={e => setForm({...form, montant: e.target.value})} required style={inputStyle} />
          <select value={form.modePaiement} onChange={e => setForm({...form, modePaiement: e.target.value})} style={selectStyle}>
            <option value="especes">Espèces</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Enregistrer et générer reçu
        </button>
      </form>

      <h2>Historique des paiements</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={thStyle}>Enfant</th>
            <th style={thStyle}>Groupe</th>
            <th style={thStyle}>Période</th>
            <th style={thStyle}>Montant</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Reçu</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map(p => (
            <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{p.enfant?.prenom} {p.enfant?.nom}</td>
              <td style={tdStyle}>{p.groupe?.nom}</td>
              <td style={tdStyle}>{p.periode}</td>
              <td style={tdStyle}>{p.montant} DT</td>
              <td style={tdStyle}>{new Date(p.datePaiement).toLocaleDateString()}</td>
              <td style={tdStyle}>
                <button onClick={() => navigate(`/recu/${p._id}`)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { padding: '8px', border: '1px solid #ddd', borderRadius: '5px' };
const selectStyle = { padding: '8px', border: '1px solid #ddd', borderRadius: '5px' };
const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };