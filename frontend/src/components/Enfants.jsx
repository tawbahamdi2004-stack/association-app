import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function Enfants() {
  const [enfants, setEnfants] = useState([]);
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', dateNaissance: '', adresse: '' });
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/enfants`, { headers: getHeaders() })
      .then(res => res.json())
      .then(setEnfants);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces('');
    
    const res = await fetch(`${API_URL}/api/enfants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      setErreur(data.message);
      return;
    }
    
    setSucces(`${data.prenom} ${data.nom} ajouté avec succès !`);
    setForm({ nom: '', prenom: '', telephone: '', dateNaissance: '', adresse: '' });
    
    const resList = await fetch(`${API_URL}/api/enfants`, { headers: getHeaders() });
    setEnfants(await resList.json());
  };

  const supprimer = async (id) => {
    if (confirm('Supprimer cet enfant ?')) {
      await fetch(`${API_URL}/api/enfants/${id}`, { method: 'DELETE', headers: getHeaders() });
      setEnfants(enfants.filter(e => e._id !== id));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>← Retour</button>
      <h1>👧 Gestion des Enfants</h1>
      
      {erreur && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}> {erreur}</div>}
      {succes && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '15px' }}>✅ {succes}</div>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>Nouvel Enfant</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required style={inputStyle} />
          <input placeholder="Prénom" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required style={inputStyle} />
          <input placeholder="Téléphone" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} required style={inputStyle} />
          <input type="date" value={form.dateNaissance} onChange={e => setForm({...form, dateNaissance: e.target.value})} style={inputStyle} />
          <input placeholder="Adresse" value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Ajouter l'enfant
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Prénom</th>
            <th style={thStyle}>Téléphone</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enfants.map(e => (
            <tr key={e._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{e.nom}</td>
              <td style={tdStyle}>{e.prenom}</td>
              <td style={tdStyle}>{e.telephone}</td>
              <td style={tdStyle}>
                <button onClick={() => navigate(`/enfants/${e._id}`)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Voir
                </button>
                <button onClick={() => supprimer(e._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Supprimer
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
const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };