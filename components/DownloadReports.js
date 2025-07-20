import React from 'react';

const ALL_REPORTS = [
    { name: 'Liste des Livres', url: '/api/reports/livres', filename: 'livres.pdf', key: 'livres' },
    { name: 'Liste des Lecteurs', url: '/api/reports/lecteurs', filename: 'lecteurs.pdf', key: 'lecteurs' },
    { name: 'Liste des Emprunts', url: '/api/reports/emprunts', filename: 'emprunts.pdf', key: 'emprunts' },
    { name: 'Statistiques', url: '/api/reports/stats', filename: 'stats.pdf', key: 'stats' },
];

function downloadReport(url, filename) {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        });
}

export default function DownloadReports({ reports = ['livres', 'lecteurs', 'emprunts', 'stats'] }) {
    const filtered = ALL_REPORTS.filter(r => reports.includes(r.key));
    return (
        <div style={{ margin: '2rem 0' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Télécharger le(s) rapport(s) PDF</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {filtered.map(r => (
                    <button
                        key={r.url}
                        onClick={() => downloadReport(r.url, r.filename)}
                        style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {r.name}
                    </button>
                ))}
            </div>
        </div>
    );
} 