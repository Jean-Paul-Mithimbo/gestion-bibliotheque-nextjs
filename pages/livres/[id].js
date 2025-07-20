import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LivreDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useSWR(
    id ? `/api/livres/${id}` : null,
    fetcher
  );

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        const response = await fetch(`/api/livres/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push('/livres');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement du livre" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const livre = data.data;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/livres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux livres
        </Link>
        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{livre.titre}</h1>
            <p className="mt-2 text-gray-600">
              par {livre.auteur_id?.nom || 'Auteur inconnu'}
            </p>
          </div>
          <Badge variant={livre.disponible ? "default" : "secondary"} className="text-sm">
            {livre.disponible ? 'Disponible' : 'Emprunté'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du livre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Titre</h3>
              <p className="text-gray-600">{livre.titre}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Auteurs</h3>
              <p className="text-gray-600">
                {Array.isArray(livre.auteur_ids) && livre.auteur_ids.length > 0
                  ? livre.auteur_ids.map(a => a.nom).join(', ')
                  : 'Auteur inconnu'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Date de publication</h3>
              <p className="text-gray-600">
                {new Date(livre.date_publication).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Disponibilité</h3>
              <Badge variant={livre.disponible ? "default" : "secondary"}>
                {livre.disponible ? 'Disponible' : 'Emprunté'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Gérez ce livre
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/livres/${livre._id}/edit`}>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Modifier le livre
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer le livre
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}