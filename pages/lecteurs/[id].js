import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LecteurDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, mutate } = useSWR(
    id ? `/api/lecteurs/${id}` : null,
    fetcher
  );

  const { data: empruntsData } = useSWR('/api/emprunts', fetcher);

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lecteur ?')) {
      try {
        const response = await fetch(`/api/lecteurs/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Lecteur supprimé avec succès');
          router.push('/lecteurs');
        } else {
          toast.error('Erreur lors de la suppression');
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement du lecteur" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const lecteur = data.data;
  const empruntsLecteur = empruntsData?.data?.filter(emprunt => emprunt.lecteur_id?._id === lecteur._id) || [];
  const empruntsActifs = empruntsLecteur.filter(emprunt => !emprunt.date_retour);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/lecteurs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux lecteurs
        </Link>
        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lecteur.nom}</h1>
            <p className="mt-2 text-gray-600">{lecteur.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du lecteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Nom</h3>
              <p className="text-gray-600">{lecteur.nom}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">{lecteur.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Date d'inscription</h3>
              <p className="text-gray-600">
                {new Date(lecteur.date_inscription).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Emprunts actifs</h3>
              <p className="text-gray-600">{empruntsActifs.length} livre(s)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Gérez ce lecteur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href={`/lecteurs/${lecteur._id}/edit`}>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Modifier le lecteur
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer le lecteur
            </Button>
          </CardContent>
        </Card>
      </div>

      {empruntsLecteur.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              Historique des emprunts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {empruntsLecteur.map((emprunt) => (
                <div key={emprunt._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{emprunt.livre_id?.titre}</h4>
                      <p className="text-sm text-gray-600">
                        Emprunté le {new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')}
                      </p>
                      {emprunt.date_retour && (
                        <p className="text-sm text-gray-600">
                          Retourné le {new Date(emprunt.date_retour).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <Badge variant={emprunt.date_retour ? "secondary" : "default"}>
                      {emprunt.date_retour ? 'Retourné' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}