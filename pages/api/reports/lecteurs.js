import dbConnect from '../../../lib/mongodb';
import Lecteur from '../../../lib/models/Lecteur';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    await dbConnect();
    const lecteurs = await Lecteur.find({});

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=lecteurs.pdf');

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
        .text('Liste des Lecteurs', 0, 30, { align: 'center' });
    doc.moveDown(2);

    // Tableau simple
    const tableTop = 90;
    const col1 = 50, col2 = 200, col3 = 400;
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Nom', col1, tableTop);
    doc.text('Email', col2, tableTop);
    doc.text('Téléphone', col3, tableTop);
    doc.moveTo(40, tableTop + 18).lineTo(doc.page.width - 40, tableTop + 18).strokeColor('#bbb').lineWidth(1).stroke();
    doc.font('Helvetica').fontSize(11);

    let y = tableTop + 26;
    lecteurs.forEach((lecteur) => {
        doc.text(lecteur.nom, col1, y, { width: 140 });
        doc.text(lecteur.email, col2, y, { width: 180 });
        doc.text(lecteur.telephone || '', col3, y, { width: 100 });
        y += 20;
        doc.moveTo(40, y - 2).lineTo(doc.page.width - 40, y - 2).strokeColor('#eee').lineWidth(0.5).stroke();
    });

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