import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Loading } from '@/components/ui/loading';

const AuthGuard = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Encore en cours de chargement

    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return children;
};

export default AuthGuard;