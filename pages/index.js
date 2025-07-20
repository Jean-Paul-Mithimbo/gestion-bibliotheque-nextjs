import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Users, UserCheck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import DownloadReports from '../components/DownloadReports';

const fetcher = (url) => fetch(url).then((res) => res.json());

const StatCard = ({ title, value, description, icon: Icon, href, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function Home() {
  const { data: livres } = useSWR('/api/livres', fetcher);
  const { data: auteurs } = useSWR('/api/auteurs', fetcher);
  const { data: lecteurs } = useSWR('/api/lecteurs', fetcher);
  const { data: emprunts } = useSWR('/api/emprunts', fetcher);

  const livresDisponibles = livres?.data?.filter(livre => livre.disponible).length || 0;
  const empruntsActifs = emprunts?.data?.filter(emprunt => !emprunt.date_retour).length || 0;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-gray-600">
          Bienvenue dans votre système de gestion de bibliothèque
        </p>
        <DownloadReports />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Livres disponibles"
          value={livresDisponibles}
          description="Livres prêts à emprunter"
          icon={Book}
          href="/livres"
          color="blue"
        />
        <StatCard
          title="Auteurs"
          value={auteurs?.data?.length || 0}
          description="Auteurs enregistrés"
          icon={Users}
          href="/auteurs"
          color="green"
        />
        <StatCard
          title="Lecteurs"
          value={lecteurs?.data?.length || 0}
          description="Lecteurs inscrits"
          icon={UserCheck}
          href="/lecteurs"
          color="purple"
        />
        <StatCard
          title="Emprunts actifs"
          value={empruntsActifs}
          description="Livres actuellement empruntés"
          icon={RotateCcw}
          href="/emprunts"
          color="orange"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Raccourcis vers les fonctions principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/livres"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Gérer les livres
            </Link>
            <Link
              href="/emprunts"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Nouvel emprunt
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>
              Aperçu de l'activité de la bibliothèque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total des livres</span>
                <span className="text-sm font-medium">{livres?.data?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Livres empruntés</span>
                <span className="text-sm font-medium">{empruntsActifs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taux d'emprunt</span>
                <span className="text-sm font-medium">
                  {livres?.data?.length ? 
                    Math.round((empruntsActifs / livres.data.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}