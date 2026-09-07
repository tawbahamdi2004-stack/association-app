const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: { type: String, enum: ['actif', 'inactif', 'termine'], default: 'actif' },
  activite: String // ex: Football, Anglais, Dessin
}, { timestamps: true });

module.exports = mongoose.model('Groupe', groupeSchema);