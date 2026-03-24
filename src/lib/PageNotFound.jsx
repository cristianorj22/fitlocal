import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useI18n } from '@/contexts/LocaleContext.jsx';

export default function PageNotFound() {
  const location = useLocation();
  const { t } = useI18n();
  const pageName = location.pathname.replace(/^\//, '') || '/';

  const { data: authData, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAuthenticated: true };
      } catch {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-7xl font-light text-muted-foreground">404</h1>
            <div className="h-0.5 w-16 bg-border mx-auto" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-medium">{t('notFound.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">{t('notFound.body', { path: pageName })}</p>
          </div>

          {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
            <div className="mt-8 p-4 bg-muted rounded-lg border border-border text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t('notFound.adminTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('notFound.adminBody')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('notFound.goHome')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
