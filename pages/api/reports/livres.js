import dbConnect from '../../../lib/mongodb';
import Livre from '../../../lib/models/Livre';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    await dbConnect();
    // Correction : populate les auteurs
    const livres = await Livre.find({}).populate('auteur_ids', 'nom');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=livres.pdf');

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
        .text('Liste des Livres', 0, 30, { align: 'center' });
    doc.moveDown(2);

    // Tableau amélioré
    const tableTop = 100;
    const col1 = 50, col2 = 220, col3 = 400, col4 = 500;
    const colWidths = [col2 - col1, col3 - col2, col4 - col3, doc.page.width - col4 - 40];
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Titre', col1, tableTop, { width: colWidths[0], align: 'left' });
    doc.text('Auteur(s)', col2, tableTop, { width: colWidths[1], align: 'left' });
    doc.text('Date publication', col3, tableTop, { width: colWidths[2], align: 'left' });
    doc.text('Disponible', col4, tableTop, { width: colWidths[3], align: 'left' });
    doc.moveTo(40, tableTop + 18).lineTo(doc.page.width - 40, tableTop + 18).strokeColor('#bbb').lineWidth(1).stroke();
    doc.font('Helvetica').fontSize(11);

    let y = tableTop + 26;
    livres.forEach((livre) => {
        doc.text(livre.titre, col1, y, { width: colWidths[0], align: 'left', ellipsis: true });
        doc.text(Array.isArray(livre.auteur_ids) ? livre.auteur_ids.map(a => a.nom).join(', ') : '', col2, y, { width: colWidths[1], align: 'left', ellipsis: true });
        doc.text(livre.date_publication ? new Date(livre.date_publication).toLocaleDateString('fr-FR') : '', col3, y, { width: colWidths[2], align: 'left' });
        doc.text(livre.disponible ? 'Oui' : 'Non', col4, y, { width: colWidths[3], align: 'left' });
        y += 20;
        if (y > doc.page.height - 60) {
            doc.addPage();
            y = tableTop;
        }
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