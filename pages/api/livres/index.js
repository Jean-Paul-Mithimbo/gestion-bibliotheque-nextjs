import dbConnect from '../../../lib/mongodb';
import Livre from '../../../lib/models/Livre';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const livres = await Livre.find({}).populate('auteur_ids', 'nom');
        res.status(200).json({ success: true, data: livres });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const livre = await Livre.create(req.body);
        await livre.populate('auteur_ids', 'nom');
        res.status(201).json({ success: true, data: livre });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}