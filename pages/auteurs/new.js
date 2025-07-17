import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { ErrorMessage } from '@/components/ui/error';

export default function NewAuteurPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    nationalite: '',
    date_naissance: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auteurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/auteurs');
      } else {
        setError(result.error || 'Erreur lors de la création de l\'auteur');
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'auteur');
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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href="/auteurs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux auteurs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Nouvel auteur
        </h1>
        <p className="mt-2 text-gray-600">
          Ajoutez un nouvel auteur à la base de données
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de l'auteur</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer un nouvel auteur
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
                {loading ? 'Création...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer l'auteur
                  </>
                )}
              </Button>
              <Link href="/auteurs">
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