import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function Groupes() {
  const [groupes, setGroupes] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', activite: '', dateDebut: '', dateFin: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/groupes`, { headers: getHeaders() })
      .then(res => res.json())
      .then(setGroupes);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/groupes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form)
    });
    setForm({ nom: '', description: '', activite: '', dateDebut: '', dateFin: '' });
    const res = await fetch(`${API_URL}/api/groupes`, { headers: getHeaders() });
    setGroupes(await res.json());
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>← Retour</button>
      <h1>👥 Gestion des Groupes</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
        <h3>Nouveau Groupe</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required style={inputStyle} />
          <input placeholder="Activité (ex: Football)" value={form.activite} onChange={e => setForm({...form, activite: e.target.value})} style={inputStyle} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
          <input type="date" value={form.dateDebut} onChange={e => setForm({...form, dateDebut: e.target.value})} required style={inputStyle} />
          <input type="date" value={form.dateFin} onChange={e => setForm({...form, dateFin: e.target.value})} required style={inputStyle} />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Créer le groupe
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {groupes.map(g => (
          <div key={g._id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer' }} onClick={() => navigate(`/groupes/${g._id}`)}>
            <h3>{g.nom}</h3>
            <p><strong>Activité:</strong> {g.activite}</p>
            <p><strong>Période:</strong> {new Date(g.dateDebut).toLocaleDateString()} - {new Date(g.dateFin).toLocaleDateString()}</p>
            <p><strong>Statut:</strong> {g.statut}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { padding: '8px', border: '1px solid #ddd', borderRadius: '5px' };