import dbConnect from '../../../lib/mongodb';
import Emprunt from '../../../lib/models/Emprunt';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    await dbConnect();
    // Correction : populate sur livre_id et lecteur_id, et auteurs
    const emprunts = await Emprunt.find({})
        .populate({
            path: 'livre_id',
            populate: { path: 'auteur_ids', select: 'nom' }
        })
        .populate('lecteur_id');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=emprunts.pdf');

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
        .text('Liste des Emprunts', 0, 30, { align: 'center' });
    doc.moveDown(2);

    // Tableau amélioré
    const tableTop = 100;
    const col1 = 50, col2 = 180, col3 = 320, col4 = 420, col5 = 520;
    const colWidths = [col2 - col1, col3 - col2, col4 - col3, col5 - col4, doc.page.width - col5 - 40];
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Livre', col1, tableTop, { width: colWidths[0], align: 'left' });
    doc.text('Auteur(s)', col2, tableTop, { width: colWidths[1], align: 'left' });
    doc.text('Lecteur', col3, tableTop, { width: colWidths[2], align: 'left' });
    doc.text('Date Emprunt', col4, tableTop, { width: colWidths[3], align: 'left' });
    doc.text('Date Retour', col5, tableTop, { width: colWidths[4], align: 'left' });
    doc.moveTo(40, tableTop + 18).lineTo(doc.page.width - 40, tableTop + 18).strokeColor('#bbb').lineWidth(1).stroke();
    doc.font('Helvetica').fontSize(11);

    let y = tableTop + 26;
    emprunts.forEach((e) => {
        doc.text(e.livre_id?.titre || '', col1, y, { width: colWidths[0], align: 'left', ellipsis: true });
        doc.text(Array.isArray(e.livre_id?.auteur_ids) ? e.livre_id.auteur_ids.map(a => a.nom).join(', ') : '', col2, y, { width: colWidths[1], align: 'left', ellipsis: true });
        doc.text(e.lecteur_id?.nom || '', col3, y, { width: colWidths[2], align: 'left', ellipsis: true });
        doc.text(e.date_emprunt ? new Date(e.date_emprunt).toLocaleDateString('fr-FR') : '', col4, y, { width: colWidths[3], align: 'left' });
        doc.text(e.date_retour ? new Date(e.date_retour).toLocaleDateString('fr-FR') : '', col5, y, { width: colWidths[4], align: 'left' });
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