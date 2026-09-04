const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  periode: {
    debut: { type: Date, required: true },
    fin: { type: Date, required: true }
  }
}, { timestamps: true }); // ajoute createdAt / updatedAt automatiquement

module.exports = mongoose.model('Groupe', groupeSchema);