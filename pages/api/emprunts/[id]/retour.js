import dbConnect from '../../../../lib/mongodb';
import Emprunt from '../../../../lib/models/Emprunt';
import Livre from '../../../../lib/models/Livre';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  if (method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Trouver l'emprunt
    const emprunt = await Emprunt.findById(id);
    if (!emprunt) {
      return res.status(404).json({ success: false, error: 'Emprunt non trouvé' });
    }

    if (emprunt.date_retour) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ce livre a déjà été retourné' 
      });
    }

    // Mettre à jour l'emprunt avec la date de retour
    const empruntUpdated = await Emprunt.findByIdAndUpdate(
      id,
      { date_retour: new Date() },
      { new: true }
    ).populate('lecteur_id', 'nom email').populate('livre_id', 'titre');

    // Marquer le livre comme disponible
    await Livre.findByIdAndUpdate(emprunt.livre_id, { disponible: true });

    res.status(200).json({ success: true, data: empruntUpdated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}