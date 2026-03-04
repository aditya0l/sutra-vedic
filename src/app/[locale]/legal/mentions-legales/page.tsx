import { useLocale, useTranslations } from 'next-intl';

export default function LegalNoticePage() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-cream min-h-screen">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto">
                    {t('legalNotice')}
                </h1>
            </div>

            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <section className="mb-10">
                        <h2>{isFr ? '1. Édition du site' : '1. Site Edition'}</h2>
                        <p>
                            {isFr
                                ? 'En vertu de l\'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l\'économie numérique, il est précisé aux utilisateurs du site sutravedic.fr l\'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :'
                                : 'In accordance with Article 6 of Law No. 2004-575 of June 21, 2004, regarding confidence in the digital economy, users of the website sutravedic.fr are informed of the identity of the various stakeholders involved in its creation and monitoring:'}
                        </p>
                        <ul>
                            <li><strong>{isFr ? 'Propriétaire :' : 'Owner:'}</strong> Sutra Vedic SARL - contact@sutravedic.fr</li>
                            <li><strong>{isFr ? 'Responsable de la publication :' : 'Publication Manager:'}</strong> Sutra Vedic Team</li>
                            <li><strong>{isFr ? 'Hébergeur :' : 'Hosting Provider:'}</strong> Vercel Inc. - 440 N Barranca Ave #4133, Covina, CA 91723</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Propriété intellectuelle' : '2. Intellectual Property'}</h2>
                        <p>
                            {isFr
                                ? 'Sutra Vedic est propriétaire des droits de propriété intellectuelle ou détient les droits d’usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logos, icônes, sons et logiciels.'
                                : 'Sutra Vedic owns the intellectual property rights or holds the usage rights for all elements accessible on the website, including texts, images, graphics, logos, icons, sounds, and software.'}
                        </p>
                        <p>
                            {isFr
                                ? 'Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Sutra Vedic.'
                                : 'Any reproduction, representation, modification, publication, or adaptation of all or part of the elements of the site, regardless of the means or process used, is prohibited, except with prior written authorization from Sutra Vedic.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Limitations de responsabilité' : '3. Limitation of Liability'}</h2>
                        <p>
                            {isFr
                                ? 'Sutra Vedic ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site. Sutra Vedic décline toute responsabilité quant à l’utilisation qui pourrait être faite des informations et contenus présents sur sutravedic.fr.'
                                : 'Sutra Vedic cannot be held liable for direct or indirect damage caused to the user\'s equipment when accessing the site. Sutra Vedic declines all responsibility for the use that may be made of the information and content present on sutravedic.fr.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>4. Management of Personal Data</h2>
                        <p>
                            The use of the sutravedic.fr site may involve the collection of personal data.
                            For more information, please consult our <strong>Privacy Policy</strong> and <strong>Data Protection</strong> page.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
