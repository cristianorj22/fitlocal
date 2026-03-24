import { useI18n } from '../contexts/LocaleContext.jsx';

export default function PrivacyPolicy() {
  const { t } = useI18n();
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@fitlocal.app';
  const updatedAt = '2026-03-24';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-5 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{t('privacyPage.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('privacyPage.lastUpdated')}: {updatedAt}
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.overview')}</h2>
          <p className="text-muted-foreground">{t('privacyPage.overviewText')}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.health')}</h2>
          <p className="text-muted-foreground">{t('privacyPage.healthText')}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.dataWe')}</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>{t('privacyPage.dataLi1')}</li>
            <li>{t('privacyPage.dataLi2')}</li>
            <li>{t('privacyPage.dataLi3')}</li>
          </ul>
          <p className="text-muted-foreground text-sm pt-2">{t('privacyPage.dataFoot')}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.storage')}</h2>
          <p className="text-muted-foreground">{t('privacyPage.storageText')}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.deletion')}</h2>
          <p className="text-muted-foreground">
            {t('privacyPage.deletionText')}{' '}
            <span className="font-medium text-foreground">{t('privacyPage.deletionBold')}</span>{' '}
            {t('privacyPage.deletionText2')}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">{t('privacyPage.contact')}</h2>
          <p className="text-muted-foreground">
            {t('privacyPage.contactText')}{' '}
            <a className="text-emerald-500 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
