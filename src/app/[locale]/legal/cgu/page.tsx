import { useLocale, useTranslations } from 'next-intl';

export default function CGUPage() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-cream min-h-screen">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto">
                    {t('termsOfUse')}
                </h1>
            </div>

            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <section className="mb-10">
                        <h2>{isFr ? '1. Acceptation des conditions' : '1. Acceptance of Terms'}</h2>
                        <p>
                            {isFr
                                ? 'En accédant au site sutravedic.fr, vous acceptez de respecter ces conditions d\'utilisation. Si vous refusez, veuillez quitter le site.'
                                : 'By accessing and using sutravedic.fr, you agree to comply with and be bound by these Terms of Use.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Accès au site' : '2. Site Access'}</h2>
                        <p>
                            {isFr
                                ? 'L\'accès au site est gratuit. Sutra Vedic s\'efforce de maintenir un accès de qualité mais ne peut être tenu responsable d\'une interruption de service.'
                                : 'Access to the site is free. Sutra Vedic strives to provide quality access, but cannot be held responsible for any service interruption.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Responsabilité de l\'utilisateur' : '3. User Responsibility'}</h2>
                        <p>
                            {isFr
                                ? 'L\'utilisateur est responsable du maintien de la confidentialité de ses identifiants. Toute activité sous votre compte relève de votre responsabilité.'
                                : 'The user is responsible for keeping their credentials confidential. Any activity under your account is your responsibility.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '4. Exactitude du contenu' : '4. Content Accuracy'}</h2>
                        <p>
                            {isFr
                                ? 'Sutra Vedic met tout en œuvre pour que les informations soient exactes, mais ne garantit pas l\'exhaustivité de tous les contenus.'
                                : 'Sutra Vedic makes every effort to ensure information is accurate, but does not guarantee the completeness of all contents.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '5. Liens externes' : '5. External Links'}</h2>
                        <p>
                            {isFr
                                ? 'Le site peut contenir des liens vers des sites tiers. Sutra Vedic n\'est pas responsable du contenu de ces sites externes.'
                                : 'The site may contain links to third-party websites. Sutra Vedic is not responsible for the content of these external sites.'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
