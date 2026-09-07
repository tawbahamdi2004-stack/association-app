const mongoose = require('mongoose');

const affectationSchema = new mongoose.Schema({
  enfant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant', required: true },
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: { type: String, enum: ['actif', 'termine'], default: 'actif' }
}, { timestamps: true });

module.exports = mongoose.model('Affectation', affectationSchema);