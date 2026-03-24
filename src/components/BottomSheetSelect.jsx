import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Mobile-friendly select that opens as a bottom sheet.
 * API mirrors <select>: value, onChange, options=[{value, label}], placeholder
 */
export default function BottomSheetSelect({ value, onChange, options = [], placeholder = 'Select…', label, id }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  // Prevent body scroll while sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSelect = (val) => {
    onChange({ target: { value: val } });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label ? `${label}: ${selected?.label ?? placeholder}` : undefined}
        onClick={() => setOpen(true)}
        className="
          w-full min-h-[44px] bg-gray-800 border border-gray-700 rounded-xl
          px-4 py-3 text-[15px] text-left leading-tight outline-none
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
          transition-colors flex items-center justify-between gap-2
        "
      >
        <span className={selected ? 'text-white' : 'text-gray-600'}>
          {selected?.label ?? placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              role="listbox"
              aria-label={label ?? 'Select an option'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 rounded-t-3xl overflow-hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-700" />
              </div>

              {label && (
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-5 pt-3 pb-2">
                  {label}
                </p>
              )}

              <ul className="py-2 max-h-72 overflow-y-auto">
                {options.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className="w-full flex items-center justify-between px-5 min-h-[52px] text-[15px] text-left transition-colors hover:bg-gray-800 active:bg-gray-800"
                    >
                      <span className={value === opt.value ? 'text-emerald-400 font-semibold' : 'text-white'}>
                        {opt.label}
                      </span>
                      {value === opt.value && (
                        <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-5 pb-4 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full min-h-[44px] bg-gray-800 rounded-2xl text-gray-300 text-sm font-medium"
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