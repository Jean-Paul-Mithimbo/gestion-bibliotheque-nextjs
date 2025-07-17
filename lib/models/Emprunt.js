import mongoose from 'mongoose';

const EmpruntSchema = new mongoose.Schema({
  lecteur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecteur',
    required: [true, 'Le lecteur est requis'],
  },
  livre_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: [true, 'Le livre est requis'],
  },
  date_emprunt: {
    type: Date,
    default: Date.now,
  },
  date_retour: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Emprunt || mongoose.model('Emprunt', EmpruntSchema);