import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useAuthz';
import AppLayout from './components/AppLayout';
import ProfileSetupModal from './components/ProfileSetupModal';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import WinnerPortalHomePage from './pages/winner/WinnerPortalHomePage';
import VerifyActivatePage from './pages/winner/VerifyActivatePage';
import ClaimFormPage from './pages/winner/ClaimFormPage';
import IdentityVerificationPage from './pages/winner/IdentityVerificationPage';
import ClaimStatusPage from './pages/winner/ClaimStatusPage';
import ConfirmationLegitimacyPage from './pages/winner/ConfirmationLegitimacyPage';
import TestimonialsPage from './pages/winner/TestimonialsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ClaimsListPage from './pages/admin/ClaimsListPage';
import ClaimDetailPage from './pages/admin/ClaimDetailPage';
import TestimonialsAdminPage from './pages/admin/TestimonialsAdminPage';
import { useEffect } from 'react';

function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (isInitializing || (adminOnly && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <AccessDeniedScreen message="Please sign in to access this page." />;
  }

  if (adminOnly && !isAdmin) {
    return <AccessDeniedScreen message="Access denied. Admin privileges required." />;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <WinnerPortalHomePage />
    </ProtectedRoute>
  ),
});

const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify',
  component: () => (
    <ProtectedRoute>
      <VerifyActivatePage />
    </ProtectedRoute>
  ),
});

const claimRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/claim',
  component: () => (
    <ProtectedRoute>
      <ClaimFormPage />
    </ProtectedRoute>
  ),
});

const identityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/identity',
  component: () => (
    <ProtectedRoute>
      <IdentityVerificationPage />
    </ProtectedRoute>
  ),
});

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/status',
  component: () => (
    <ProtectedRoute>
      <ClaimStatusPage />
    </ProtectedRoute>
  ),
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  component: () => (
    <ProtectedRoute>
      <ConfirmationLegitimacyPage />
    </ProtectedRoute>
  ),
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: () => (
    <ProtectedRoute>
      <TestimonialsPage />
    </ProtectedRoute>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute adminOnly>
      <AdminDashboardPage />
    </ProtectedRoute>
  ),
});

const adminClaimsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/claims',
  component: () => (
    <ProtectedRoute adminOnly>
      <ClaimsListPage />
    </ProtectedRoute>
  ),
});

const adminClaimDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/claims/$claimId',
  component: () => (
    <ProtectedRoute adminOnly>
      <ClaimDetailPage />
    </ProtectedRoute>
  ),
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/testimonials',
  component: () => (
    <ProtectedRoute adminOnly>
      <TestimonialsAdminPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  verifyRoute,
  claimRoute,
  identityRoute,
  statusRoute,
  confirmationRoute,
  testimonialsRoute,
  adminRoute,
  adminClaimsRoute,
  adminClaimDetailRoute,
  adminTestimonialsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
