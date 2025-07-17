import '@/app/globals.css';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/sonner';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
}