import '@/app/globals.css';
import { SessionProvider } from 'next-auth/react';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import { Toaster } from '@/components/ui/sonner';
import { useRouter } from 'next/router';

const publicPages = ['/auth/signin', '/auth/signup'];

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {isPublicPage ? (
        <>
          <Component {...pageProps} />
          <Toaster />
        </>
      ) : (
        <AuthGuard>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </AuthGuard>
      )}
    </SessionProvider>
  );
}