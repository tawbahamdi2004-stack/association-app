const mongoose = require('mongoose');
const paiementSchema = new mongoose.Schema({
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
  enfant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant' }, // Optionnel (paiement global ou individuel)
  montant: { type: Number, required: true },
  periode: { type: String, required: true }, // ex: "Octobre 2023"
  description: { type: String },
  datePaiement: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('Paiement', paiementSchema);