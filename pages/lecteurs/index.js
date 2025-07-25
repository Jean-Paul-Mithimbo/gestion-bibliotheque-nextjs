import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import DownloadReports from '../../components/DownloadReports';

const fetcher = (url) => fetch(url).then((res) => res.json());

const LecteurCard = ({ lecteur, onDelete }) => {
  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lecteur ?')) {
      await onDelete(lecteur._id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{lecteur.nom}</CardTitle>
        <CardDescription>{lecteur.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Inscrit le {new Date(lecteur.date_inscription).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/lecteurs/${lecteur._id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
          <Link href={`/lecteurs/${lecteur._id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function LecteursPage() {
  const { data, error, mutate } = useSWR('/api/lecteurs', fetcher);
  const [search, setSearch] = useState('');

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/lecteurs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement des lecteurs" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const lecteurs = data.data || [];
  const lecteursFiltres = lecteurs.filter(lecteur =>
    lecteur.nom.toLowerCase().includes(search.toLowerCase()) ||
    lecteur.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecteurs</h1>
          <p className="mt-2 text-gray-600">
            Gérez les lecteurs de votre bibliothèque
          </p>
          <DownloadReports reports={['lecteurs']} />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            placeholder="Rechercher un lecteur ou un email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ minWidth: 220 }}
          />
          <Link href="/lecteurs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau lecteur
            </Button>
          </Link>
        </div>
      </div>

      {lecteursFiltres.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun lecteur trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par ajouter votre premier lecteur
              </p>
              <Link href="/lecteurs/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un lecteur
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lecteursFiltres.map((lecteur) => (
            <LecteurCard
              key={lecteur._id}
              lecteur={lecteur}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}