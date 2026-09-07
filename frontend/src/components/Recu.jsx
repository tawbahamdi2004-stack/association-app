import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL, getHeaders } from '../config';

export default function Recu() {
  const { id } = useParams();
  const [paiement, setPaiement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/paiements/${id}`, { headers: getHeaders() })
      .then(res => res.json())
      .then(setPaiement);
  }, [id]);

  if (!paiement) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>← Retour</button>
      
      <div style={{ border: '2px solid #000', padding: '30px', fontFamily: 'monospace' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
          <h2>ASSOCIATION</h2>
          <h3>REÇU DE PAIEMENT</h3>
        </div>
        
        <p><strong>N° Reçu:</strong> {paiement.numeroRecu}</p>
        <hr />
        <p><strong>Enfant:</strong> {paiement.enfant?.prenom} {paiement.enfant?.nom}</p>
        <p><strong>Téléphone:</strong> {paiement.enfant?.telephone}</p>
        <p><strong>Groupe:</strong> {paiement.groupe?.nom} ({paiement.groupe?.activite})</p>
        <p><strong>Période:</strong> {paiement.periode}</p>
        <p><strong>Montant payé:</strong> {paiement.montant} DT</p>
        <p><strong>Mode:</strong> {paiement.modePaiement}</p>
        <p><strong>Date:</strong> {new Date(paiement.datePaiement).toLocaleDateString()}</p>
        <p><strong>Statut:</strong> {paiement.statut === 'paye' ? '✅ PAYÉ' : '⏳ EN ATTENTE'}</p>
        
        <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '10px', borderTop: '2px solid #000' }}>
          <p>Merci pour votre paiement.</p>
        </div>
      </div>

      <button onClick={() => window.print()} style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
        🖨️ Imprimer le reçu
      </button>
    </div>
  );
}