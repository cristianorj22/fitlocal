import { useState } from 'react';
import { AlertTriangle, Trash2, X, ChevronRight } from 'lucide-react';

const STEPS = ['warn', 'confirm', 'type'];

export default function DeleteAccountDialog({ onClose, onConfirm }) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');

  const REQUIRED = 'DELETE';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-semibold">Delete All Data</span>
          </div>
          <button aria-label="Close dialog" onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-800 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-5 pt-4">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-red-500' : 'bg-gray-800'}`} />
          ))}
        </div>

        {/* Step content */}
        <div className="p-5 space-y-4">
          {step === 0 && (
            <>
              <div className="flex gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300 space-y-1">
                  <p className="font-semibold text-red-300">This action is permanent.</p>
                  <p>All your data stored on this device will be erased:</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                {['Profile & body metrics', 'Workout history & plans', 'Weight log & progress charts', 'Progress photos', 'Check-in streaks'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-600">Data is stored locally only. It cannot be recovered after deletion.</p>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm text-gray-300">Are you sure you want to permanently delete all your fitness data from this device?</p>
              <div className="bg-gray-800 rounded-2xl p-4 text-sm text-gray-400 space-y-2">
                <p>✗ No backup will be created</p>
                <p>✗ Progress photos will be lost</p>
                <p>✗ You will need to complete onboarding again</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-300">
                To confirm, type <span className="font-bold text-red-400">{REQUIRED}</span> in the field below.
              </p>
              <input
                autoFocus
                type="text"
                autoCapitalize="characters"
                value={typed}
                onChange={(e) => setTyped(e.target.value.toUpperCase())}
                placeholder="Type DELETE to confirm"
                className="w-full min-h-[44px] bg-gray-800 border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              />
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-800 text-gray-300 text-sm font-medium">
            Cancel
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)}
              className="flex-1 py-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center justify-center gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onConfirm}
              disabled={typed !== REQUIRED}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${typed === REQUIRED ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>
              Delete Everything
            </button>
          )}
        </div>
      </div>
    </div>
  );
}