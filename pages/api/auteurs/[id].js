import dbConnect from '../../../lib/mongodb';
import Auteur from '../../../lib/models/Auteur';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const auteur = await Auteur.findById(id);
        if (!auteur) {
          return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
        }
        res.status(200).json({ success: true, data: auteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const auteur = await Auteur.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!auteur) {
          return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
        }
        res.status(200).json({ success: true, data: auteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedAuteur = await Auteur.deleteOne({ _id: id });
        if (!deletedAuteur) {
          return res.status(404).json({ success: false, error: 'Auteur non trouvé' });
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