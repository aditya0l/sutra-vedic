import { useLocale, useTranslations } from 'next-intl';

export default function DataProtectionPage() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-cream min-h-screen">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto">
                    {t('dataProtection')}
                </h1>
            </div>

            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <section className="mb-10">
                        <h2>{isFr ? '1. Notre engagement RGPD' : '1. Our Commitment to GDPR'}</h2>
                        <p>
                            {isFr
                                ? 'Sutra Vedic s\'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD). La confidentialité est un droit fondamental.'
                                : 'Sutra Vedic is committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR). Privacy is a fundamental right.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Vos droits' : '2. Your Rights'}</h2>
                        <p>{isFr ? 'En tant qu\'utilisateur, vous disposez des droits suivants :' : 'As a user, you have the following rights regarding your personal data:'}</p>
                        <ul>
                            <li><strong>{isFr ? 'Droit d\'accès :' : 'Right of access:'}</strong> {isFr ? 'Vous pouvez demander une copie de vos données.' : 'You can request a copy of the data we hold about you.'}</li>
                            <li><strong>{isFr ? 'Droit de rectification :' : 'Right to rectification:'}</strong> {isFr ? 'Vous pouvez nous demander de corriger des données inexactes.' : 'You can ask us to correct inaccurate or incomplete data.'}</li>
                            <li><strong>{isFr ? 'Droit à l\'effacement :' : 'Right to erasure:'}</strong> {isFr ? 'Vous pouvez demander la suppression de vos données.' : 'You can request the deletion of your data.'}</li>
                            <li><strong>{isFr ? 'Droit à la portabilité :' : 'Right to portability:'}</strong> {isFr ? 'Vous pouvez demander le transfert de vos données.' : 'You can request that your data be transferred.'}</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Conservation des données' : '3. Data Retention'}</h2>
                        <p>
                            {isFr
                                ? 'Nous conservons vos données uniquement le temps nécessaire à l\'exécution des commandes et à la gestion de la relation client.'
                                : 'We retain your personal data only for as long as necessary for the purposes for which it was collected.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '4. Mesures de sécurité' : '4. Security Measures'}</h2>
                        <p>
                            {isFr
                                ? 'Nous mettons en œuvre des mesures techniques pour assurer la sécurité de vos données, notamment le chiffrement.'
                                : 'We implement technical and organizational measures to ensure a level of security appropriate to the risk.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>5. Contact DPO</h2>
                        <p>
                            {isFr
                                ? 'Pour toute question, contactez notre Délégué à la Protection des Données : dpo@sutravedic.fr'
                                : 'For any questions, contact our Data Protection Officer at: dpo@sutravedic.fr'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
