import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Book } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AuteurDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useSWR(
    id ? `/api/auteurs/${id}` : null,
    fetcher
  );

  const { data: livresData } = useSWR('/api/livres', fetcher);

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur ?')) {
      try {
        const response = await fetch(`/api/auteurs/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Auteur supprimé avec succès');
          router.push('/auteurs');
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement de l'auteur" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const auteur = data.data;
  const livresAuteur = livresData?.data?.filter(livre => livre.auteur_id?._id === auteur._id) || [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/auteurs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux auteurs
        </Link>
        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{auteur.nom}</h1>
            <p className="mt-2 text-gray-600">{auteur.nationalite}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'auteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Nom</h3>
              <p className="text-gray-600">{auteur.nom}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Nationalité</h3>
              <p className="text-gray-600">{auteur.nationalite}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Date de naissance</h3>
              <p className="text-gray-600">
                {new Date(auteur.date_naissance).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Nombre de livres</h3>
              <p className="text-gray-600">{livresAuteur.length} livre(s)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Gérez cet auteur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/auteurs/${auteur._id}/edit`}>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Modifier l'auteur
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer l'auteur
            </Button>
          </CardContent>
        </Card>
      </div>

      {livresAuteur.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Livres de cet auteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {livresAuteur.map((livre) => (
                <div key={livre._id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{livre.titre}</h4>
                  <p className="text-sm text-gray-600">
                    Publié le {new Date(livre.date_publication).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      livre.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {livre.disponible ? 'Disponible' : 'Emprunté'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}