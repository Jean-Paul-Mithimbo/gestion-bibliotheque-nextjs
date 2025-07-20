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

export default function EditAuteurPage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    nationalite: '',
    date_naissance: '',
  });

  const { data, error: fetchError, mutate } = useSWR(
    id ? `/api/auteurs/${id}` : null,
    fetcher
  );

  useEffect(() => {
    if (data?.data) {
      const auteur = data.data;
      setFormData({
        nom: auteur.nom,
        nationalite: auteur.nationalite,
        date_naissance: new Date(auteur.date_naissance).toISOString().split('T')[0],
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auteurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Auteur modifié avec succès');
        router.push(`/auteurs/${id}`);
      } else {
        setError(result.error || 'Erreur lors de la modification de l\'auteur');
      }
    } catch (err) {
      setError('Erreur lors de la modification de l\'auteur');
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

  if (fetchError) return <ErrorMessage message="Erreur lors du chargement de l'auteur" onRetry={() => mutate()} />;
  if (!data) return <Loading />;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href={`/auteurs/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux détails
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Modifier l'auteur
        </h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations de l'auteur
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l'auteur</CardTitle>
          <CardDescription>
            Modifiez les informations de l'auteur
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
                placeholder="Entrez le nom de l'auteur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalite">Nationalité *</Label>
              <Input
                id="nationalite"
                value={formData.nationalite}
                onChange={(e) => handleChange('nationalite', e.target.value)}
                placeholder="Entrez la nationalité"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_naissance">Date de naissance *</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => handleChange('date_naissance', e.target.value)}
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
                    Modifier l'auteur
                  </>
                )}
              </Button>
              <Link href={`/auteurs/${id}`}>
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