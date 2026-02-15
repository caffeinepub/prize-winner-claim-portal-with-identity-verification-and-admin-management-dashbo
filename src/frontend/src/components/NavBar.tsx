import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useAuthz';
import LoginButton from './LoginButton';
import { Button } from './ui/button';
import { Menu, X, Award, Shield } from 'lucide-react';
import { useState } from 'react';

export default function NavBar() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <button onClick={() => navigate({ to: '/' })} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              Prize Claim Portal
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Button variant="ghost" onClick={() => navigate({ to: '/verify' })}>
                  Verify Prize
                </Button>
                <Button variant="ghost" onClick={() => navigate({ to: '/claim' })}>
                  Submit Claim
                </Button>
                <Button variant="ghost" onClick={() => navigate({ to: '/status' })}>
                  Claim Status
                </Button>
                <Button variant="ghost" onClick={() => navigate({ to: '/testimonials' })}>
                  Testimonials
                </Button>
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate({ to: '/admin' })} className="gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                )}
              </>
            )}
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LoginButton />
            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && isAuthenticated && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate({ to: '/verify' });
                setMobileMenuOpen(false);
              }}
            >
              Verify Prize
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate({ to: '/claim' });
                setMobileMenuOpen(false);
              }}
            >
              Submit Claim
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate({ to: '/status' });
                setMobileMenuOpen(false);
              }}
            >
              Claim Status
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate({ to: '/testimonials' });
                setMobileMenuOpen(false);
              }}
            >
              Testimonials
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate({ to: '/admin' });
                  setMobileMenuOpen(false);
                }}
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
