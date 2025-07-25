import mongoose from 'mongoose';

const LivreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },
  auteur_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auteur',
    required: [true, "Au moins un auteur est requis"],
  }],
  date_publication: {
    type: Date,
    required: [true, 'La date de publication est requise'],
  },
  disponible: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Livre || mongoose.model('Livre', LivreSchema);