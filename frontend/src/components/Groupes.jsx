import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Groupes() {
  const [groupes, setGroupes] = useState([]);
  const [nom, setNom] = useState('');
  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // Charger la liste des groupes au démarrage
  useEffect(() => {
    chargerGroupes();
  }, []);

  const chargerGroupes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/groupes`);
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setGroupes(data);
    } catch (err) {
      setErreur('Impossible de charger les groupes');
    } finally {
      setChargement(false);
    }
  };

  const creerGroupe = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      const res = await fetch(`${API_URL}/api/groupes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom,
          periode: { debut, fin }
        })
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const nouveauGroupe = await res.json();
      setGroupes([nouveauGroupe, ...groupes]); // ajoute en haut de la liste
      setNom('');
      setDebut('');
      setFin('');
    } catch (err) {
      setErreur('Impossible de créer le groupe');
    }
  };

  const supprimerGroupe = async (id) => {
    if (!confirm('Supprimer ce groupe ?')) return;
    try {
      const res = await fetch(`${API_URL}/api/groupes/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      setGroupes(groupes.filter((g) => g._id !== id));
    } catch (err) {
      setErreur('Impossible de supprimer le groupe');
    }
  };

  return (
    <div>
      <h2>Gestion des groupes</h2>

      <form onSubmit={creerGroupe}>
        <input
          type="text"
          placeholder="Nom du groupe"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="date"
          value={debut}
          onChange={(e) => setDebut(e.target.value)}
          required
        />
        <input
          type="date"
          value={fin}
          onChange={(e) => setFin(e.target.value)}
          required
        />
        <button type="submit">Créer le groupe</button>
      </form>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {groupes.map((groupe) => (
            <li key={groupe._id}>
              <strong>{groupe.nom}</strong> — du{' '}
              {new Date(groupe.periode.debut).toLocaleDateString()} au{' '}
              {new Date(groupe.periode.fin).toLocaleDateString()}
              <button onClick={() => supprimerGroupe(groupe._id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Groupes;