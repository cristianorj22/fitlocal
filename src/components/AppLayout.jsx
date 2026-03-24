import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Dumbbell, TrendingUp, User, ChevronLeft } from 'lucide-react';
import { useI18n } from '../contexts/LocaleContext.jsx';

const ROOT_TABS = ['/', '/workout', '/progress', '/profile'];

function getOwnerTab(pathname) {
  const match = ROOT_TABS.find((t) => t !== '/' && pathname.startsWith(t));
  return match ?? '/';
}

// Build initial stacks — deep-link safe: always roots the stack at the tab root
function buildInitialStacks(pathname) {
  const stacks = Object.fromEntries(ROOT_TABS.map((t) => [t, [t]]));
  const tab = getOwnerTab(pathname);
  if (pathname !== tab) stacks[tab] = [tab, pathname];
  return stacks;
}

const NavContext = createContext(null);
/** Access back-navigation from any child component */
export const useAppNav = () => useContext(NavContext);

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale } = useI18n();

  const NAV = useMemo(
    () => [
      { to: '/', icon: LayoutDashboard, label: t('nav.home') },
      { to: '/workout', icon: Dumbbell, label: t('nav.workout') },
      { to: '/progress', icon: TrendingUp, label: t('nav.progress') },
      { to: '/profile', icon: User, label: t('nav.profile') },
    ],
    [locale, t],
  );

  // Source-of-truth navigation stacks, one per tab.
  // Initialised deep-link-safe: arriving at /workout/x pre-populates ['/workout', '/workout/x']
  const tabStacks = useRef(buildInitialStacks(location.pathname));

  const currentTab = getOwnerTab(location.pathname);
  const isRootTab = ROOT_TABS.includes(location.pathname);

  // Push new paths onto the owning tab's stack
  useEffect(() => {
    const stack = tabStacks.current[currentTab];
    if (stack[stack.length - 1] !== location.pathname) {
      tabStacks.current[currentTab] = [...stack, location.pathname];
    }
  }, [location.pathname, currentTab]);

  // Switch tabs, resuming at last known position within that tab
  const handleTabPress = (tabPath) => {
    const stack = tabStacks.current[tabPath];
    navigate(stack[stack.length - 1] ?? tabPath);
  };

  // Pop our stack; use replace so browser history stays clean
  const handleBack = () => {
    const stack = tabStacks.current[currentTab];
    if (stack.length > 1) {
      tabStacks.current[currentTab] = stack.slice(0, -1);
      navigate(stack[stack.length - 2], { replace: true });
    } else {
      // Fallback: always has a safe destination (tab root)
      navigate(currentTab, { replace: true });
    }
  };

  const navCtx = { handleBack, currentTab };

  return (
    <NavContext.Provider value={navCtx}>
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Back button header — only on non-root screens */}
      {!isRootTab && (
        <div className="flex items-center px-2 py-1 border-b border-border bg-background/95 backdrop-blur z-40">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-emerald-400 text-sm font-medium min-w-[44px] min-h-[44px] px-3"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('nav.back')}
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
        key={locale}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50"
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
                currentTab === to ? 'text-emerald-500' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
    </NavContext.Provider>
  );
}