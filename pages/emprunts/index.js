import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RotateCcw, Filter } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then((res) => res.json());

const EmpruntCard = ({ emprunt, onReturn }) => {
  const [loading, setLoading] = useState(false);
  
  const handleReturn = async () => {
    if (confirm('Confirmer le retour de ce livre ?')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/emprunts/${emprunt._id}/retour`, {
          method: 'PUT',
        });
        const result = await response.json();
        if (result.success) {
          onReturn();
          toast.success('Livre retourné avec succès');
        } else {
          toast.error(result.error || 'Erreur lors du retour');
        }
      } catch (error) {
        toast.error('Erreur lors du retour du livre');
      } finally {
        setLoading(false);
      }
    }
  };

  const isActif = !emprunt.date_retour;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{emprunt.livre_id?.titre}</CardTitle>
            <CardDescription className="mt-1">
              Emprunté par {emprunt.lecteur_id?.nom} ({emprunt.lecteur_id?.email})
            </CardDescription>
          </div>
          <Badge variant={isActif ? "default" : "secondary"}>
            {isActif ? 'En cours' : 'Retourné'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date d'emprunt:</span>
            <span>{new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')}</span>
          </div>
          {emprunt.date_retour && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date de retour:</span>
              <span>{new Date(emprunt.date_retour).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
        {isActif && (
          <Button 
            size="sm" 
            onClick={handleReturn}
            disabled={loading}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {loading ? 'Retour en cours...' : 'Marquer comme retourné'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function EmpruntsPage() {
  const { data, error, mutate } = useSWR('/api/emprunts', fetcher);
  const [filter, setFilter] = useState('all');

  const handleReturn = () => {
    mutate();
  };

  if (error) return <ErrorMessage message="Erreur lors du chargement des emprunts" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  const emprunts = data.data || [];
  const empruntsFiltres = filter === 'all' 
    ? emprunts 
    : emprunts.filter(emprunt => filter === 'actif' ? !emprunt.date_retour : emprunt.date_retour);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emprunts</h1>
          <p className="mt-2 text-gray-600">
            Gérez les emprunts de votre bibliothèque
          </p>
        </div>
        <Link href="/emprunts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel emprunt
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Tous ({emprunts.length})
        </Button>
        <Button
          variant={filter === 'actif' ? 'default' : 'outline'}
          onClick={() => setFilter('actif')}
        >
          En cours ({emprunts.filter(e => !e.date_retour).length})
        </Button>
        <Button
          variant={filter === 'retourne' ? 'default' : 'outline'}
          onClick={() => setFilter('retourne')}
        >
          Retournés ({emprunts.filter(e => e.date_retour).length})
        </Button>
      </div>

      {empruntsFiltres.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun emprunt trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "Commencez par créer votre premier emprunt"
                  : `Aucun emprunt ${filter === 'actif' ? 'en cours' : 'retourné'} pour le moment`
                }
              </p>
              {filter === 'all' && (
                <Link href="/emprunts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un emprunt
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {empruntsFiltres.map((emprunt) => (
            <EmpruntCard
              key={emprunt._id}
              emprunt={emprunt}
              onReturn={handleReturn}
            />
          ))}
        </div>
      )}
    </div>
  );
}