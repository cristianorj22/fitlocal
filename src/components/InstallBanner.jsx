import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { isInstallable, onInstallabilityChange, triggerInstall } from '../lib/installPrompt';
import { useI18n } from '../contexts/LocaleContext.jsx';

const DISMISSED_KEY = 'fitlocal_install_dismissed';

export default function InstallBanner() {
  const { locale } = useI18n();
  const isPt = locale?.startsWith('pt');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Already installable when component mounts?
    if (isInstallable()) setVisible(true);

    const unsub = onInstallabilityChange((installable) => {
      if (!localStorage.getItem(DISMISSED_KEY)) setVisible(installable);
    });
    return unsub;
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  };

  const install = async () => {
    const accepted = await triggerInstall();
    if (accepted) setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-sm">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Download className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {isPt ? 'Instalar FitLocal' : 'Install FitLocal'}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {isPt ? 'Acesso rápido no ecrã inicial' : 'Quick access from your home screen'}
        </p>
      </div>
      <button
        type="button"
        onClick={install}
        className="px-3 py-2 min-h-[36px] bg-emerald-500 text-white text-xs font-semibold rounded-xl flex-shrink-0"
      >
        {isPt ? 'Instalar' : 'Install'}
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-muted-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}