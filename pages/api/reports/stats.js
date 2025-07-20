import dbConnect from '../../../lib/mongodb';
import Livre from '../../../lib/models/Livre';
import Lecteur from '../../../lib/models/Lecteur';
import Emprunt from '../../../lib/models/Emprunt';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    await dbConnect();
    const nbLivres = await Livre.countDocuments();
    const nbLecteurs = await Lecteur.countDocuments();
    const nbEmprunts = await Emprunt.countDocuments();

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=stats.pdf');

    // Logo discret (optionnel)
    try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 40, 20, { width: 40 });
        }
    } catch (e) { }

    // Titre centré
    doc
        .font('Helvetica-Bold')
        .fontSize(20)
        .fillColor('black')
        .text('Statistiques de la Bibliothèque', 0, 30, { align: 'center' });
    doc.moveDown(2);

    // Stats listées simplement
    doc.font('Helvetica-Bold').fontSize(13).fillColor('black');
    doc.text(`Nombre total de livres :`, 60, 100, { continued: true });
    doc.font('Helvetica').text(` ${nbLivres}`);
    doc.font('Helvetica-Bold').text(`Nombre total de lecteurs :`, 60, 130, { continued: true });
    doc.font('Helvetica').text(` ${nbLecteurs}`);
    doc.font('Helvetica-Bold').text(`Nombre total d'emprunts :`, 60, 160, { continued: true });
    doc.font('Helvetica').text(` ${nbEmprunts}`);

    // Pied de page
    doc.font('Helvetica').fontSize(9).fillColor('gray');
    doc.text(
        `Généré le ${new Date().toLocaleDateString()} - Gestion Bibliothèque Next.js`,
        40,
        doc.page.height - 40,
        { align: 'center', width: doc.page.width - 80 }
    );

    doc.end();
    doc.pipe(res);
} 