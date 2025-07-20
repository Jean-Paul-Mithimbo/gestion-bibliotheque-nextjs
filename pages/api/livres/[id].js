import dbConnect from '../../../lib/mongodb';
import Livre from '../../../lib/models/Livre';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const livre = await Livre.findById(id).populate('auteur_ids', 'nom nationalite');
        if (!livre) {
          return res.status(404).json({ success: false, error: 'Livre non trouvé' });
        }
        res.status(200).json({ success: true, data: livre });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const livre = await Livre.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        }).populate('auteur_ids', 'nom');
        if (!livre) {
          return res.status(404).json({ success: false, error: 'Livre non trouvé' });
        }
        res.status(200).json({ success: true, data: livre });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedLivre = await Livre.deleteOne({ _id: id });
        if (!deletedLivre) {
          return res.status(404).json({ success: false, error: 'Livre non trouvé' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}