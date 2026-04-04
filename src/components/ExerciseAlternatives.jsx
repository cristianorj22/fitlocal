import { ArrowRight } from 'lucide-react';
import { normalizeLocale } from '../lib/i18n-utils';
import { tFor } from '../lib/locale-messages';

export default function ExerciseAlternatives({ alternatives, locale }) {
  if (!alternatives || alternatives.length === 0) return null;
  const L = normalizeLocale(locale);

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="text-xs font-semibold text-emerald-400 uppercase mb-2">
        {tFor(L, 'workout.alternatives') || 'Alternatives'}
      </div>
      <div className="space-y-1.5">
        {alternatives.map((alt) => {
          const nameKey = `exerciseNames.${alt.id}`;
          const translated = tFor(L, nameKey);
          const name = (translated && translated !== nameKey) ? translated : alt.name;
          return (
            <div key={alt.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span>{name}</span>
              <span className="text-xs opacity-60">({alt.category})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}