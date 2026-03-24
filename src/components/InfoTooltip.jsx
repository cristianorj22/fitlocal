import { useState } from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={(e) => { e.preventDefault(); setShow((s) => !s); }}
        className="flex items-center justify-center w-[44px] h-[44px] -mx-[13px] text-gray-600 hover:text-gray-400 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 py-2 z-50 shadow-xl leading-relaxed">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
        </span>
      )}
    </span>
  );
}