import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { toast } from 'sonner';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditLecteurPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });

  const { data, error: fetchError, mutate } = useSWR(
    id ? `/api/lecteurs/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (data?.data) {
      const lecteur = data.data;
      setFormData({
        nom: lecteur.nom,
        email: lecteur.email,
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lecteurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Lecteur modifié avec succès');
        router.push(`/lecteurs/${id}`);
      } else {
        setError(result.error || 'Erreur lors de la modification du lecteur');
      }
    } catch (err) {
      setError('Erreur lors de la modification du lecteur');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (fetchError) return <ErrorMessage message="Erreur lors du chargement du lecteur" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href={`/lecteurs/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux détails
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Modifier le lecteur
        </h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations du lecteur
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du lecteur</CardTitle>
          <CardDescription>
            Modifiez les informations du lecteur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Entrez le nom du lecteur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Entrez l'email du lecteur"
                required
              />
            </div>

            {error && (
              <ErrorMessage message={error} />
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Modification...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Modifier le lecteur
                  </>
                )}
              </Button>
              <Link href={`/lecteurs/${id}`}>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}