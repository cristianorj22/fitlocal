import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import AppLayout from './components/AppLayout';
import AppShellFallback from './components/AppShellFallback';
import { getProfile } from './lib/storage';

const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workout = lazy(() => import('./pages/Workout'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

const MainApp = () => {
  const location = useLocation();
  const profile = getProfile();
  const isPublicRoute = location.pathname === '/privacy';

  if (!profile && !isPublicRoute) {
    return (
      <Suspense fallback={<AppShellFallback />}>
        <Onboarding />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<AppShellFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <MainApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;