import './site.css';
import './opening.css';
import './native-motion.css';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const metadata = {
  metadataBase: new URL('https://nook-notch-beta.vercel.app'),
  title: 'Nook — Seu dia. No seu notch.',
  description: 'Música, arquivos, cotas e agentes de IA no seu notch. Experimente todas as funcionalidades e baixe a beta pública para macOS ou Windows.',
  icons: { icon: basePath + '/nook.svg' },
  openGraph: { title: 'Nook — Seu dia. No seu notch.', description: 'Experimente o notch. Música, agentes de IA, arquivos e ferramentas do dia a dia para Mac e Windows.', type: 'website', locale: 'pt_BR' },
};
export default function Layout({ children }) { return <html lang="pt-BR"><body className="concept-c scroll-story" data-scroll-story="">{children}</body></html>; }
