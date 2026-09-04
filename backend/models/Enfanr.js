const mongoose = require('mongoose');
const enfantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true }
}, { timestamps: true });
module.exports = mongoose.model('Enfant', enfantSchema);