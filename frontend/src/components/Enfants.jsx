import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Enfants({ groupeId }) {
  const [enfants, setEnfants] = useState([]);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');

  useEffect(() => { if (groupeId) chargerEnfants(); }, [groupeId]);

  const chargerEnfants = async () => {
    const res = await fetch(`${API_URL}/api/enfants?groupeId=${groupeId}`);
    setEnfants(await res.json());
  };

  const ajouterEnfant = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/enfants`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, telephone, groupe: groupeId })
    });
    setNom(''); setTelephone('');
    chargerEnfants();
  };

  const supprimerEnfant = async (id) => {
    if (confirm('Supprimer cet enfant ?')) {
      await fetch(`${API_URL}/api/enfants/${id}`, { method: 'DELETE' });
      chargerEnfants();
    }
  };

  return (
    <div>
      <h3>👶 Enfants du groupe</h3>
      <form onSubmit={ajouterEnfant} style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)} required style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>Ajouter</button>
      </form>
      <ul>
        {enfants.map(e => (
          <li key={e._id} style={{ marginBottom: '8px' }}>
            {e.nom} - {e.telephone}
            <button onClick={() => supprimerEnfant(e._id)} style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}