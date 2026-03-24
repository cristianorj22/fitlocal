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

function getOwnerTab(pathname) {
  // Return which root tab "owns" the current path
  const match = ROOT_TABS.find((t) => t !== '/' && pathname.startsWith(t));
  return match ?? '/';
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Per-tab isolated history stacks: { '/': ['/'], '/workout': ['/workout'], ... }
  const tabStacks = useRef(
    Object.fromEntries(ROOT_TABS.map((t) => [t, [t]]))
  );

  const currentTab = getOwnerTab(location.pathname);
  const isRootTab = ROOT_TABS.includes(location.pathname);

  // Keep tab stacks updated as location changes
  useEffect(() => {
    const stack = tabStacks.current[currentTab];
    const last = stack[stack.length - 1];
    if (last !== location.pathname) {
      tabStacks.current[currentTab] = [...stack, location.pathname];
    }
  }, [location.pathname, currentTab]);

  // Navigate to last position within a tab when switching tabs
  const handleTabPress = (tabPath) => {
    const stack = tabStacks.current[tabPath];
    const destination = stack[stack.length - 1] ?? tabPath;
    navigate(destination);
  };

  const handleBack = () => {
    const stack = tabStacks.current[currentTab];
    if (stack.length > 1) {
      tabStacks.current[currentTab] = stack.slice(0, -1);
      navigate(stack[stack.length - 2]);
    } else {
      navigate(-1);
    }
  };

  // Android hardware back — reference tabStacks ref directly to avoid stale closure
  useEffect(() => {
    const onPopState = () => {
      const tab = getOwnerTab(window.location.pathname);
      const stack = tabStacks.current[tab];
      if (stack && stack.length > 1) {
        tabStacks.current[tab] = stack.slice(0, -1);
        navigate(stack[stack.length - 2]);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen bg-gray-950 text-white flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Back button header — only on non-root screens */}
      {!isRootTab && (
        <div className="flex items-center px-2 py-1 border-b border-gray-800 bg-gray-950/95 backdrop-blur z-40">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-emerald-400 text-sm font-medium min-w-[44px] min-h-[44px] px-3"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}

      <main
        className="flex-1 overflow-hidden"
        style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
      >
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

      <nav
        className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-50"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <div className="flex max-w-lg mx-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <button
              key={to}
              aria-label={label}
              aria-current={currentTab === to ? 'page' : undefined}
              onClick={() => handleTabPress(to)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors min-h-[56px] ${
                currentTab === to ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}