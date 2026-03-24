export default function PrivacyPolicy() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@fitlocal.app';
  const updatedAt = '2026-03-24';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-5 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {updatedAt}</p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-muted-foreground">
            FitLocal stores user fitness information locally to provide app features such as profile setup,
            workout progress, and progress photos. We do not require account login for core usage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Health and fitness information</h2>
          <p className="text-muted-foreground">
            FitLocal provides educational estimates and planning tools only (for example BMI, energy expenditure,
            and VO₂ estimates from user-entered test data). The app is not a medical device and does not provide
            medical advice, diagnosis, or treatment. Always consult a qualified health professional for medical decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Data We Process</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Profile data (name, age, weight, height, goal, training days).</li>
            <li>Check-in history and weight log entries.</li>
            <li>Progress photos and optional notes.</li>
          </ul>
          <p className="text-muted-foreground text-sm pt-2">
            Use these bullets as the basis for your Google Play Data safety declarations. If the distributed build
            sends additional data to servers (for example through an app platform or SDK), describe that collection
            separately in Play Console to match the live product behaviour.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Storage and Retention</h2>
          <p className="text-muted-foreground">
            Data is stored on-device/in-browser using local storage and IndexedDB. Photos and weight history
            are persisted in IndexedDB for reliability and capacity. Data remains until the user deletes it.
            No account is required for core features described here; data is not uploaded by this app code path alone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Data Deletion</h2>
          <p className="text-muted-foreground">
            Users can delete all locally stored app data from the Profile screen using the
            <span className="font-medium text-foreground"> Delete All Data </span>
            action.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            For privacy requests or support, contact:
            {' '}
            <a className="text-emerald-500 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
