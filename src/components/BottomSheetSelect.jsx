import {
  useState, useEffect, useRef, useCallback, useId,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Mobile-friendly select that opens as a bottom sheet.
 * API mirrors <select>: value, onChange, options=[{value, label}], placeholder
 */
export default function BottomSheetSelect({
  value, onChange, options = [], placeholder = 'Select…', label, id,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const listboxId = useId();
  const titleId = useId();

  const selected = options.find((o) => o.value === value);

  const closeSheet = useCallback(() => {
    setOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }, []);

  // Prevent body scroll while sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeSheet]);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => {
      const first = document.getElementById(listboxId)?.querySelector('button[role="option"]');
      first?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [open, listboxId]);

  const handleSelect = (val) => {
    try {
      if (typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)) {
        navigator.vibrate?.(12);
      }
    } catch {
      /* ignored */
    }
    onChange({ target: { value: val } });
    closeSheet();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label ? `${label}: ${selected?.label ?? placeholder}` : undefined}
        onClick={() => setOpen(true)}
        className="
          w-full min-h-[44px] bg-card border border-border rounded-xl
          px-4 py-3 text-[15px] text-left leading-tight outline-none
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
          transition-colors flex items-center justify-between gap-2
        "
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected?.label ?? placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-muted-foreground shrink-0">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={closeSheet}
              aria-hidden="true"
            />

            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby={label ? titleId : undefined}
              aria-label={label ? undefined : 'Select an option'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl overflow-hidden shadow-lg outline-none"
              style={{
                paddingBottom: 'env(safe-area-inset-bottom)',
                paddingLeft:   'env(safe-area-inset-left)',
                paddingRight:  'env(safe-area-inset-right)',
              }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted" aria-hidden="true" />
              </div>

              {label && (
                <p id={titleId} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 pt-3 pb-2">
                  {label}
                </p>
              )}

              <ul id={listboxId} role="listbox" aria-label={label ?? 'Options'} className="py-2 max-h-72 overflow-y-auto">
                {options.map((opt) => (
                  <li key={opt.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="w-full flex items-center justify-between px-5 min-h-[52px] text-[15px] text-left transition-colors hover:bg-muted active:bg-muted text-foreground"
                    >
                      <span className={value === opt.value ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
                        {opt.label}
                      </span>
                      {value === opt.value && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-5 pb-4 pt-2">
                <button
                  type="button"
                  onClick={closeSheet}
                  className="w-full min-h-[44px] bg-muted rounded-2xl text-muted-foreground text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}