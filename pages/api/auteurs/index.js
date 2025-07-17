import dbConnect from '../../../lib/mongodb';
import Auteur from '../../../lib/models/Auteur';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const auteurs = await Auteur.find({});
        res.status(200).json({ success: true, data: auteurs });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const auteur = await Auteur.create(req.body);
        res.status(201).json({ success: true, data: auteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}