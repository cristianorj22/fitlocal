import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Dumbbell, TrendingUp, User, ChevronLeft } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const ROOT_TABS = ['/', '/workout', '/progress', '/profile'];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const historyStack = useRef([location.pathname]);

  // Track history stack for true back navigation
  useEffect(() => {
    const stack = historyStack.current;
    const last = stack[stack.length - 1];
    if (last !== location.pathname) {
      historyStack.current = [...stack, location.pathname];
    }
  }, [location.pathname]);

  const isRootTab = ROOT_TABS.includes(location.pathname);

  const handleBack = () => {
    const stack = historyStack.current;
    if (stack.length > 1) {
      historyStack.current = stack.slice(0, -1);
      navigate(stack[stack.length - 2]);
    } else {
      navigate(-1);
    }
  };

  // Android hardware back button
  useEffect(() => {
    const onPopState = (e) => {
      const stack = historyStack.current;
      if (stack.length > 1) {
        e.preventDefault();
        handleBack();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>

      {/* Back button header — only shown on non-root screens */}
      {!isRootTab && (
        <div className="flex items-center px-4 py-3 border-b border-gray-800 bg-gray-950/95 backdrop-blur z-40">
          <button onClick={handleBack}
            className="flex items-center gap-1 text-emerald-400 text-sm font-medium py-1 pr-2">
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="h-full overflow-y-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
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