import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Loading, LoadingCard } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

const fetcher = (url) => fetch(url).then((res) => res.json());

const LivreCard = ({ livre, onDelete }) => {
  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      await onDelete(livre._id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{livre.titre}</CardTitle>
            <CardDescription className="mt-1">
              par {livre.auteur_id?.nom || 'Auteur inconnu'}
            </CardDescription>
          </div>
          <Badge variant={livre.disponible ? "default" : "secondary"}>
            {livre.disponible ? 'Disponible' : 'Emprunté'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Publié le {new Date(livre.date_publication).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/livres/${livre._id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
          <Link href={`/livres/${livre._id}/edit`}>
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

export default function LivresPage() {
  const { data, error, mutate } = useSWR('/api/livres', fetcher);
  const [filter, setFilter] = useState('all');

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/livres/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement des livres" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const livres = data.data || [];
  const livresFiltres = filter === 'all' 
    ? livres 
    : livres.filter(livre => livre.disponible === (filter === 'disponible'));

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Livres</h1>
          <p className="mt-2 text-gray-600">
            Gérez la collection de livres de votre bibliothèque
          </p>
        </div>
        <Link href="/livres/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau livre
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tous ({livres.length})
        </Button>
        <Button
          variant={filter === 'disponible' ? 'default' : 'outline'}
          onClick={() => setFilter('disponible')}
        >
          Disponibles ({livres.filter(l => l.disponible).length})
        </Button>
        <Button
          variant={filter === 'emprunte' ? 'default' : 'outline'}
          onClick={() => setFilter('emprunte')}
        >
          Empruntés ({livres.filter(l => !l.disponible).length})
        </Button>
      </div>

      {livresFiltres.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun livre trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "Commencez par ajouter votre premier livre"
                  : `Aucun livre ${filter === 'disponible' ? 'disponible' : 'emprunté'} pour le moment`
                }
              </p>
              {filter === 'all' && (
                <Link href="/livres/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un livre
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {livresFiltres.map((livre) => (
            <LivreCard
              key={livre._id}
              livre={livre}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}