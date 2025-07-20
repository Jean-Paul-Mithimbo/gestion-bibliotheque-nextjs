import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NewEmpruntPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    lecteur_id: '',
    livre_id: '',
  });

  const { data: lecteursData, error: lecteursError } = useSWR('/api/lecteurs', fetcher);
  const { data: livresData, error: livresError } = useSWR('/api/livres', fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/emprunts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/emprunts');
      } else {
        setError(result.error || 'Erreur lors de la création de l\'emprunt');
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'emprunt');
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

  if (lecteursError || livresError) {
    return <ErrorMessage message="Erreur lors du chargement des données" />;
  }
  if (!lecteursData || !livresData) return <Loading />;

  const lecteurs = lecteursData.data || [];
  const livres = livresData.data || [];
  const livresDisponibles = livres.filter(livre => livre.disponible);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/emprunts" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux emprunts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Nouvel emprunt
        </h1>
        <p className="mt-2 text-gray-600">
          Créez un nouvel emprunt de livre
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l'emprunt</CardTitle>
          <CardDescription>
            Sélectionnez le lecteur et le livre à emprunter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lecteur">Lecteur *</Label>
              <Select value={formData.lecteur_id} onValueChange={(value) => handleChange('lecteur_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un lecteur" />
                </SelectTrigger>
                <SelectContent>
                  {lecteurs.map((lecteur) => (
                    <SelectItem key={lecteur._id} value={lecteur._id}>
                      {lecteur.nom} ({lecteur.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="livre">Livre disponible *</Label>
              <Select value={formData.livre_id} onValueChange={(value) => handleChange('livre_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un livre" />
                </SelectTrigger>
                <SelectContent>
                  {livresDisponibles.map((livre) => (
                    <SelectItem key={livre._id} value={livre._id}>
                      {livre.titre} - {Array.isArray(livre.auteur_ids) ? livre.auteur_ids.map(a => a.nom).join(', ') : (livre.auteur_id?.nom || 'Auteur inconnu')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {livresDisponibles.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-yellow-800">
                  Aucun livre disponible pour l'emprunt. Tous les livres sont actuellement empruntés.
                </p>
              </div>
            )}

            {error && (
              <ErrorMessage message={error} />
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || livresDisponibles.length === 0}
              >
                {loading ? 'Création...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer l'emprunt
                  </>
                )}
              </Button>
              <Link href="/emprunts">
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