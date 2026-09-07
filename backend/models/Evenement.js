const mongoose = require('mongoose');

const evenementSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  lieu: String,
  type: { type: String, enum: ['reunion', 'sortie', 'competition', 'autre'], default: 'autre' }
}, { timestamps: true });

module.exports = mongoose.model('Evenement', evenementSchema);