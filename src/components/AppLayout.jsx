import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, TrendingUp, User } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const TAB_ORDER = ['/', '/workout', '/progress', '/profile'];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Android hardware back button: navigate to previous tab, not system back
  useEffect(() => {
    const handleBack = (e) => {
      const idx = TAB_ORDER.indexOf(location.pathname);
      if (idx > 0) {
        e.preventDefault();
        navigate(TAB_ORDER[idx - 1]);
      }
      // idx === 0 (home) or unknown path → allow default browser/system behavior
    };
    window.addEventListener('popstate', handleBack);
    return () => window.removeEventListener('popstate', handleBack);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
        <div className="flex max-w-lg mx-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${isActive ? 'text-emerald-400' : 'text-gray-500'}`
              }
            >
              <Icon className="w-6 h-6" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}