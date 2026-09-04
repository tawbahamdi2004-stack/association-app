import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Paiements({ groupeId }) {
  const [paiements, setPaiements] = useState([]);
  const [montant, setMontant] = useState('');
  const [periode, setPeriode] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => { if (groupeId) chargerPaiements(); }, [groupeId]);

  const chargerPaiements = async () => {
    const res = await fetch(`${API_URL}/api/paiements?groupeId=${groupeId}`);
    setPaiements(await res.json());
  };

  const ajouterPaiement = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/api/paiements`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupe: groupeId, montant, periode, description })
    });
    setMontant(''); setPeriode(''); setDescription('');
    chargerPaiements();
  };

  return (
    <div>
      <h3>💰 Paiements</h3>
      <form onSubmit={ajouterPaiement} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" placeholder="Montant (€)" value={montant} onChange={e => setMontant(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Période (ex: Octobre 2023)" value={periode} onChange={e => setPeriode(e.target.value)} required style={{ padding: '8px' }} />
        <input placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '8px' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ajouter le paiement</button>
      </form>
      <ul>
        {paiements.map(p => (
          <li key={p._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>{p.periode}</strong> : {p.montant} € 
            {p.description && <em> - {p.description}</em>} 
            <span style={{ float: 'right', color: '#666', fontSize: '0.9em' }}>{new Date(p.datePaiement).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}