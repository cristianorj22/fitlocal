/**
 * Shared form input primitives — mobile-optimised, 44px tap targets,
 * high-contrast focus rings, correct keyboard types.
 */

export function AppInput({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full min-h-[44px] bg-gray-800 border border-gray-700 rounded-xl
        px-4 py-3 text-white text-[15px] leading-tight outline-none
        focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
        transition-colors placeholder:text-gray-600
        ${className}
      `}
      {...props}
    />
  );
}

// AppSelect kept for non-mobile fallback but BottomSheetSelect is preferred
export function AppSelect({ children, className = '', ...props }) {
  return (
    <div className="relative">
      <select
        className={`
          w-full min-h-[44px] appearance-none bg-gray-800 border border-gray-700
          rounded-xl px-4 py-3 text-white text-[15px] leading-tight outline-none
          focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30
          transition-colors pr-10
          ${className}
        `}
        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        {...props}
      >
        {children}
      </select>
      {/* Custom chevron */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </span>
    </div>
  );
}