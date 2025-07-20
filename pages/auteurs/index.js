import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

const fetcher = (url) => fetch(url).then((res) => res.json());

const AuteurCard = ({ auteur, onDelete }) => {
  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
      await onDelete(auteur._id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{auteur.nom}</CardTitle>
        <CardDescription>{auteur.nationalite}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Né le {new Date(auteur.date_naissance).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/auteurs/${auteur._id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
          <Link href={`/auteurs/${auteur._id}/edit`}>
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

export default function AuteursPage() {
  const { data, error, mutate } = useSWR('/api/auteurs', fetcher);
  const [search, setSearch] = useState('');

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/auteurs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement des auteurs" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const auteurs = data.data || [];
  const auteursFiltres = auteurs.filter(auteur =>
    auteur.nom.toLowerCase().includes(search.toLowerCase()) ||
    auteur.nationalite.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auteurs</h1>
          <p className="mt-2 text-gray-600">
            Gérez les auteurs de votre bibliothèque
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            placeholder="Rechercher un auteur ou une nationalité..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ minWidth: 220 }}
          />
          <Link href="/auteurs/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel auteur
            </Button>
          </Link>
        </div>
      </div>

      {auteursFiltres.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun auteur trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par ajouter votre premier auteur
              </p>
              <Link href="/auteurs/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un auteur
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {auteursFiltres.map((auteur) => (
            <AuteurCard
              key={auteur._id}
              auteur={auteur}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}