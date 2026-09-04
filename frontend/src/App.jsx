import { useState } from 'react';
import Groupes from './components/Groupes';
import Enfants from './components/Enfants';
import Presences from './components/Presences';
import Paiements from './components/Paiements';

function App() {
  const [groupeSelectionne, setGroupeSelectionne] = useState(null);
  const [onglet, setOnglet] = useState('groupes');

  const btnStyle = (actif) => ({
    padding: '10px 15px', backgroundColor: actif ? '#007bff' : '#e9ecef',
    color: actif ? 'white' : 'black', border: 'none', borderRadius: '5px',
    cursor: actif ? 'default' : 'pointer', fontWeight: 'bold', marginRight: '5px'
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>🏛️ Gestion Association</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setOnglet('groupes')} style={btnStyle(onglet === 'groupes')}>Groupes</button>
        <button onClick={() => setOnglet('enfants')} disabled={!groupeSelectionne} style={btnStyle(onglet === 'enfants')}>Enfants</button>
        <button onClick={() => setOnglet('presences')} disabled={!groupeSelectionne} style={btnStyle(onglet === 'presences')}>Présences</button>
        <button onClick={() => setOnglet('paiements')} disabled={!groupeSelectionne} style={btnStyle(onglet === 'paiements')}>Paiements</button>
      </div>

      {onglet === 'groupes' ? (
        <Groupes onGroupeSelect={(id) => { setGroupeSelectionne(id); setOnglet('enfants'); }} />
      ) : (
        <div>
          <button onClick={() => { setGroupeSelectionne(null); setOnglet('groupes'); }} style={{ marginBottom: '15px', cursor: 'pointer' }}>
            ← Retour à la liste des groupes
          </button>
          {onglet === 'enfants' && <Enfants groupeId={groupeSelectionne} />}
          {onglet === 'presences' && <Presences groupeId={groupeSelectionne} />}
          {onglet === 'paiements' && <Paiements groupeId={groupeSelectionne} />}
        </div>
      )}
    </div>
  );
}
export default App;