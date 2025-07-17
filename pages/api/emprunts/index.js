import dbConnect from '../../../lib/mongodb';
import Emprunt from '../../../lib/models/Emprunt';
import Livre from '../../../lib/models/Livre';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const emprunts = await Emprunt.find({})
          .populate('lecteur_id', 'nom email')
          .populate('livre_id', 'titre');
        res.status(200).json({ success: true, data: emprunts });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        // Vérifier si le livre est disponible
        const livre = await Livre.findById(req.body.livre_id);
        if (!livre || !livre.disponible) {
          return res.status(400).json({ 
            success: false, 
            error: 'Le livre n\'est pas disponible' 
          });
        }

        // Créer l'emprunt
        const emprunt = await Emprunt.create(req.body);
        
        // Marquer le livre comme non disponible
        await Livre.findByIdAndUpdate(req.body.livre_id, { disponible: false });
        
        await emprunt.populate('lecteur_id', 'nom email');
        await emprunt.populate('livre_id', 'titre');
        
        res.status(201).json({ success: true, data: emprunt });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}