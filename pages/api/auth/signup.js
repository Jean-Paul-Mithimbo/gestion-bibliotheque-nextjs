import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Tous les champs sont requis' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Le mot de passe doit contenir au moins 6 caractères' 
    });
  }

  try {
    await dbConnect();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password,
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user.toObject();
    
    res.status(201).json({ 
      success: true, 
      data: userWithoutPassword 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
}