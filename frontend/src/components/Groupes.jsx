import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Groupes({ onGroupeSelect }) {
  const [groupes, setGroupes] = useState([]);
  const [nom, setNom] = useState('');
  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');

  useEffect(() => { chargerGroupes(); }, []);

  const chargerGroupes = async () => {
    const res = await fetch(`${API_URL}/api/groupes`);
    setGroupes(await res.json());
  };

  const creerGroupe = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/groupes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, periode: { debut, fin } })
    });
    setNom(''); setDebut(''); setFin('');
    chargerGroupes();
  };

  const supprimerGroupe = async (id) => {
    if (confirm('Supprimer ce groupe et TOUTES ses données (enfants, présences, paiements) ?')) {
      await fetch(`${API_URL}/api/groupes/${id}`, { method: 'DELETE' });
      chargerGroupes();
    }
  };

  return (
    <div>
      <h2>Gestion des groupes</h2>
      <form onSubmit={creerGroupe} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input placeholder="Nom du groupe" value={nom} onChange={e => setNom(e.target.value)} required style={{ padding: '8px' }} />
        <input type="date" value={debut} onChange={e => setDebut(e.target.value)} required style={{ padding: '8px' }} />
        <input type="date" value={fin} onChange={e => setFin(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Créer</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groupes.map(g => (
          <li key={g._id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => onGroupeSelect(g._id)}>
            <strong>{g.nom}</strong> ({new Date(g.periode.debut).toLocaleDateString()} - {new Date(g.periode.fin).toLocaleDateString()})
            <button onClick={(e) => { e.stopPropagation(); supprimerGroupe(g._id); }} style={{ marginLeft: '15px', color: 'red', cursor: 'pointer' }}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}