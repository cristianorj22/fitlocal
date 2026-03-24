import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, TrendingUp, User } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-50">
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