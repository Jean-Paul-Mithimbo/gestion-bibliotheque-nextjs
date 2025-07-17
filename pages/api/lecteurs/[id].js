import dbConnect from '../../../lib/mongodb';
import Lecteur from '../../../lib/models/Lecteur';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const lecteur = await Lecteur.findById(id);
        if (!lecteur) {
          return res.status(404).json({ success: false, error: 'Lecteur non trouvé' });
        }
        res.status(200).json({ success: true, data: lecteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const lecteur = await Lecteur.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!lecteur) {
          return res.status(404).json({ success: false, error: 'Lecteur non trouvé' });
        }
        res.status(200).json({ success: true, data: lecteur });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedLecteur = await Lecteur.deleteOne({ _id: id });
        if (!deletedLecteur) {
          return res.status(404).json({ success: false, error: 'Lecteur non trouvé' });
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