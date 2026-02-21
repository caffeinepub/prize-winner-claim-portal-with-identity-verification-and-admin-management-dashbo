import { useInternetIdentity } from '../hooks/useInternetIdentity';
import NavBar from './NavBar';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'meta-lottery-portal';

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 meta-bg-pattern -z-10" />
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-0">{children}</main>
      <footer className="border-t bg-card/80 backdrop-blur-sm mt-auto relative z-0">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Meta Lottery Portal. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
