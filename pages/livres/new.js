import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NewLivrePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    auteur_id: '',
    date_publication: '',
  });

  const { data: auteursData, error: auteursError } = useSWR('/api/auteurs', fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/livres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/livres');
      } else {
        setError(result.error || 'Erreur lors de la création du livre');
      }
    } catch (err) {
      setError('Erreur lors de la création du livre');
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

  if (auteursError) return <ErrorMessage message="Erreur lors du chargement des auteurs" />;
  if (!auteursData) return <Loading />;

  const auteurs = auteursData.data || [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/livres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux livres
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Nouveau livre
        </h1>
        <p className="mt-2 text-gray-600">
          Ajoutez un nouveau livre à la collection
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du livre</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouveau livre
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => handleChange('titre', e.target.value)}
                placeholder="Entrez le titre du livre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="auteur">Auteur *</Label>
              <Select value={formData.auteur_id} onValueChange={(value) => handleChange('auteur_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un auteur" />
                </SelectTrigger>
                <SelectContent>
                  {auteurs.map((auteur) => (
                    <SelectItem key={auteur._id} value={auteur._id}>
                      {auteur.nom} ({auteur.nationalite})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_publication">Date de publication *</Label>
              <Input
                id="date_publication"
                type="date"
                value={formData.date_publication}
                onChange={(e) => handleChange('date_publication', e.target.value)}
                required
              />
            </div>

            {error && (
              <ErrorMessage message={error} />
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le livre
                  </>
                )}
              </Button>
              <Link href="/livres">
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