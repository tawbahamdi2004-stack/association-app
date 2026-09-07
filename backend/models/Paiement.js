const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  enfant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant', required: true },
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
  periode: { type: String, required: true }, // ex: "Septembre 2026"
  montant: { type: Number, required: true },
  datePaiement: { type: Date, default: Date.now },
  statut: { type: String, enum: ['paye', 'en_attente', 'annule'], default: 'paye' },
  numeroRecu: { type: String, unique: true },
  modePaiement: { type: String, enum: ['especes', 'virement', 'cheque'], default: 'especes' }
}, { timestamps: true });

module.exports = mongoose.model('Paiement', paiementSchema);