/**
 * Short legal/safety copy for fitness estimates — aligns with Play / App Store health disclosures.
 */
export default function HealthDisclaimer({ className = '' }) {
  return (
    <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
      FitLocal offers educational fitness estimates only (for example BMI, TDEE, and VO₂ field tests).
      It is not a medical device and does not diagnose, treat, or prevent any disease or condition.
      Always consult a qualified health professional before changing diet, exercise, or medication.
    </p>
  );
}
