const mongoose = require('mongoose');

const enfantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  dateNaissance: { type: Date },
  dateInscription: { type: Date, default: Date.now },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  adresse: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Enfant', enfantSchema);