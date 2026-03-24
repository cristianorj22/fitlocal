import { useState } from 'react';
import { AlertTriangle, Trash2, X, ChevronRight } from 'lucide-react';
import { useI18n } from '../contexts/LocaleContext.jsx';

const STEPS = ['warn', 'confirm', 'type'];

export default function DeleteAccountDialog({ onClose, onConfirm }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');

  const REQUIRED = 'DELETE';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        className="relative w-full max-w-sm bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <span id="delete-dialog-title" className="font-semibold text-foreground">
              {t('deleteDialog.title')}
            </span>
          </div>
          <button
            type="button"
            aria-label={t('deleteDialog.close')}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-1.5 px-5 pt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-red-500' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className="p-5 space-y-4">
          {step === 0 && (
            <>
              <div
                id="delete-dialog-desc"
                aria-live="assertive"
                className="flex gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-foreground space-y-1">
                  <p className="font-semibold text-red-400">{t('deleteDialog.permanent')}</p>
                  <p>{t('deleteDialog.intro')}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['item1', 'item2', 'item3', 'item4', 'item5'].map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {t(`deleteDialog.${k}`)}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">{t('deleteDialog.foot')}</p>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm text-foreground">{t('deleteDialog.sure')}</p>
              <div className="bg-muted rounded-2xl p-4 text-sm text-muted-foreground space-y-2 border border-border">
                <p>{t('deleteDialog.noBackup')}</p>
                <p>{t('deleteDialog.photosLost')}</p>
                <p>{t('deleteDialog.onboardingAgain')}</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-foreground">
                {t('deleteDialog.typePrefix')} <span className="font-bold text-red-400">{REQUIRED}</span>
              </p>
              <input
                autoFocus
                type="text"
                autoCapitalize="characters"
                value={typed}
                onChange={(e) => setTyped(e.target.value.toUpperCase())}
                placeholder={t('deleteDialog.typePlaceholder')}
                className="w-full min-h-[44px] bg-muted border border-border focus:border-red-500 focus:ring-2 focus:ring-red-500/30 rounded-xl px-4 py-3 text-foreground text-sm outline-none transition-colors"
              />
            </>
          )}
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl bg-muted text-foreground text-sm font-medium border border-border">
            {t('deleteDialog.cancel')}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex-1 py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {t('deleteDialog.cont')} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={typed !== REQUIRED}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
                typed === REQUIRED ? 'bg-red-600 text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {t('deleteDialog.deleteEverything')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
