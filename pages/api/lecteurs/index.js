import dbConnect from '../../../lib/mongodb';
import Lecteur from '../../../lib/models/Lecteur';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const lecteurs = await Lecteur.find({});
        res.status(200).json({ success: true, data: lecteurs });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const lecteur = await Lecteur.create(req.body);
        res.status(201).json({ success: true, data: lecteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}