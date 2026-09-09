import { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '../config';

export default function Presences() {
  const [groupes, setGroupes] = useState([]);
  const [groupeId, setGroupeId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [enfants, setEnfants] = useState([]);
  const [presences, setPresences] = useState({});
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/groupes`, { headers: getHeaders() })
      .then(res => res.json())
      .then(setGroupes);
  }, []);

  useEffect(() => {
    if (groupeId) {
      setErreur('');
      Promise.all([
        fetch(`${API_URL}/api/presences/enfants/${groupeId}`, { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API_URL}/api/presences?groupeId=${groupeId}&date=${date}`, { headers: getHeaders() }).then(r => r.json())
      ]).then(([enfantsData, presencesData]) => {
        setEnfants(enfantsData);
        const init = {};
        enfantsData.forEach(e => { init[e._id] = true; });
        presencesData.forEach(p => { init[p.enfant._id] = p.present; });
        setPresences(init);
      });
    }
  }, [groupeId, date]);

  const togglePresence = (enfantId) => {
    setPresences(prev => ({ ...prev, [enfantId]: !prev[enfantId] }));
  };

  const enregistrer = async () => {
    setErreur('');
    const payloadArray = Object.entries(presences).map(([enfantId, present]) => ({ enfantId, present }));
    
    const res = await fetch(`${API_URL}/api/presences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ groupeId, date, presences: payloadArray })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      setErreur(data.message);
      return;
    }
    
    alert('✅ Présences enregistrées !');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📅 Gestion des Présences</h1>
      
      {erreur && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '15px' }}>❌ {erreur}</div>}
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select value={groupeId} onChange={e => setGroupeId(e.target.value)} style={{ flex: 1, padding: '10px' }}>
          <option value="">Sélectionner un groupe</option>
          {groupes.map(g => (
            <option key={g._id} value={g._id}>{g.nom} - {g.activite}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '10px' }} />
      </div>

      {groupeId && (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {enfants.map(e => (
              <li key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
                <span><strong>{e.prenom} {e.nom}</strong></span>
                <button onClick={() => togglePresence(e._id)} style={{ 
                  padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer',
                  backgroundColor: presences[e._id] ? '#d4edda' : '#f8d7da',
                  color: presences[e._id] ? '#155724' : '#721c24'
                }}>
                  {presences[e._id] ? '✅ Présent' : '❌ Absent'}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={enregistrer} style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
            Enregistrer les présences
          </button>
        </>
      )}
    </div>
  );
}