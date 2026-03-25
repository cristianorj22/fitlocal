import { Volume2, VolumeX, Vibrate } from 'lucide-react';
import { useI18n } from '../contexts/LocaleContext.jsx';
import { useSaveProfile } from '../lib/queries';
import { hapticLight } from '../lib/haptics';
import { audioTick } from '../lib/audio';
import { toast } from '@/components/ui/use-toast';

export default function SensoryPreferences({ profile, setProfile }) {
  const { t } = useI18n();
  const saveProfile = useSaveProfile();

  const toggle = (key) => {
    const current = profile[key] !== false; // default true
    const updated = { ...profile, [key]: !current };
    setProfile(updated);
    saveProfile.mutate(updated, {
      onSuccess: () => {
        toast({ title: t('profile.savedPrefs') });
        // Give immediate feedback with the new setting
        if (key === 'hapticsEnabled' && !current) hapticLight();
        if (key === 'soundEnabled' && !current) audioTick();
      },
    });
  };

  const soundOn = profile.soundEnabled !== false;
  const hapticsOn = profile.hapticsEnabled !== false;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">{t('profile.preferences')}</h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${soundOn ? 'bg-emerald-500/20' : 'bg-muted'}`}>
            {soundOn
              ? <Volume2 className="w-4 h-4 text-emerald-400" />
              : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('profile.soundEnabled')}</p>
            <p className="text-xs text-muted-foreground">
              {soundOn ? t('profile.soundOn') : t('profile.soundOff')}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={soundOn}
          aria-label={t('profile.soundEnabled')}
          onClick={() => toggle('soundEnabled')}
          className={`relative w-12 h-6 rounded-full transition-colors ${soundOn ? 'bg-emerald-500' : 'bg-muted border border-border'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${soundOn ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${hapticsOn ? 'bg-emerald-500/20' : 'bg-muted'}`}>
            <Vibrate className={`w-4 h-4 ${hapticsOn ? 'text-emerald-400' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('profile.hapticsEnabled')}</p>
            <p className="text-xs text-muted-foreground">
              {hapticsOn ? t('profile.hapticsOn') : t('profile.hapticsOff')}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={hapticsOn}
          aria-label={t('profile.hapticsEnabled')}
          onClick={() => toggle('hapticsEnabled')}
          className={`relative w-12 h-6 rounded-full transition-colors ${hapticsOn ? 'bg-emerald-500' : 'bg-muted border border-border'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${hapticsOn ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
    </div>
  );
}