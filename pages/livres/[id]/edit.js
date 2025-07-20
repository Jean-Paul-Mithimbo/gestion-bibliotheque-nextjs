import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditLivrePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    auteur_ids: [],
    date_publication: '',
  });
  const [selectedAuteur, setSelectedAuteur] = useState('');

  const { data, error: fetchError, mutate } = useSWR(
    id ? `/api/livres/${id}` : null,
    fetcher
  );

  const { data: auteursData, error: auteursError } = useSWR('/api/auteurs', fetcher);

  useEffect(() => {
    if (data?.data) {
      const livre = data.data;
      setFormData({
        titre: livre.titre,
        auteur_ids: Array.isArray(livre.auteur_ids) ? livre.auteur_ids.map(a => a._id) : [],
        date_publication: new Date(livre.date_publication).toISOString().split('T')[0],
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/livres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Livre modifié avec succès');
        router.push(`/livres/${id}`);
      } else {
        setError(result.error || 'Erreur lors de la modification du livre');
      }
    } catch (err) {
      setError('Erreur lors de la modification du livre');
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

  if (fetchError || auteursError) {
    return <ErrorMessage message="Erreur lors du chargement des données" onRetry={() => mutate()} />;
  }
  if (!data || !auteursData) return <Loading />;

  const auteurs = auteursData.data || [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link href={`/livres/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux détails
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Modifier le livre
        </h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations du livre
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du livre</CardTitle>
          <CardDescription>
            Modifiez les informations du livre
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
              <Label htmlFor="auteur">Auteurs *</Label>
              <Select value={selectedAuteur} onValueChange={(value) => {
                setSelectedAuteur(value);
                if (value && !formData.auteur_ids.includes(value)) {
                  handleChange('auteur_ids', [...formData.auteur_ids, value]);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un auteur à ajouter" />
                </SelectTrigger>
                <SelectContent>
                  {auteurs.filter(a => !formData.auteur_ids.includes(a._id)).map((auteur) => (
                    <SelectItem key={auteur._id} value={auteur._id}>
                      {auteur.nom} ({auteur.nationalite})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Pannier d'auteurs sélectionnés */}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.auteur_ids.map((id) => {
                  const auteur = auteurs.find(a => a._id === id);
                  if (!auteur) return null;
                  return (
                    <Badge key={id} className="flex items-center gap-1">
                      {auteur.nom}
                      <button type="button" onClick={() => handleChange('auteur_ids', formData.auteur_ids.filter(aid => aid !== id))}>
                        <X className="h-3 w-3 ml-1" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
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
                {loading ? 'Modification...' : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Modifier le livre
                  </>
                )}
              </Button>
              <Link href={`/livres/${id}`}>
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