import Link from 'next/link';
import { useRouter } from 'next/router';
import { Book, Users, UserCheck, RotateCcw, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const router = useRouter();
  
  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Livres', href: '/livres', icon: Book },
    { name: 'Auteurs', href: '/auteurs', icon: Users },
    { name: 'Lecteurs', href: '/lecteurs', icon: UserCheck },
    { name: 'Emprunts', href: '/emprunts', icon: RotateCcw },
  ];

  const isActive = (path) => {
    if (path === '/') return router.pathname === path;
    return router.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Book className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Bibliothèque
                </span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 Système de gestion de bibliothèque. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;