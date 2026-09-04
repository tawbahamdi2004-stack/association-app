import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Presences({ groupeId }) {
  const [enfants, setEnfants] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [presences, setPresences] = useState({});

  useEffect(() => {
    if (groupeId) {
      chargerEnfants();
      chargerPresences();
    }
  }, [groupeId, date]);

  const chargerEnfants = async () => {
    const res = await fetch(`${API_URL}/api/enfants?groupeId=${groupeId}`);
    const data = await res.json();
    setEnfants(data);
    const init = {};
    data.forEach(e => { init[e._id] = true; });
    setPresences(init);
  };

  const chargerPresences = async () => {
    const res = await fetch(`${API_URL}/api/presences?groupeId=${groupeId}&date=${date}`);
    const data = await res.json();
    const newPresences = { ...presences };
    data.forEach(p => { newPresences[p.enfant._id] = p.present; });
    setPresences(newPresences);
  };

  const togglePresence = (enfantId) => {
    setPresences(prev => ({ ...prev, [enfantId]: !prev[enfantId] }));
  };

  const enregistrerPresences = async () => {
    const payloadArray = Object.entries(presences).map(([enfantId, present]) => ({ enfantId, present }));
    await fetch(`${API_URL}/api/presences`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupeId, date, presences: payloadArray })
    });
    alert('✅ Présences enregistrées avec succès !');
  };

  return (
    <div>
      <h3>📋 Présences</h3>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '8px', marginBottom: '15px' }} />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {enfants.map(e => (
          <li key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>{e.nom}</span>
            <button onClick={() => togglePresence(e._id)} style={{ 
              padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer',
              backgroundColor: presences[e._id] ? '#d4edda' : '#f8d7da',
              color: presences[e._id] ? '#155724' : '#721c24'
            }}>
              {presences[e._id] ? 'Présent ✅' : 'Absent ❌'}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={enregistrerPresences} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Enregistrer les présences
      </button>
    </div>
  );
}