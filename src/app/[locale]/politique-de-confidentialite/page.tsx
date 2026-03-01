'use client';

import { useLocale } from 'next-intl';

export default function PrivacyPage() {
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
                    {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
                </h1>
            </div>
            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <p className="text-sm text-charcoal-light mb-8">{isFr ? 'Dernière mise à jour : Février 2025' : 'Last updated: February 2025'}</p>

                    <section className="mb-10">
                        <h2>1. Introduction</h2>
                        <p>
                            {isFr
                                ? 'La protection de vos données personnelles est une priorité absolue pour Sutra Vedic. Cette politique détaille comment nous collectons, utilisons et protégeons vos informations.'
                                : 'The protection of your personal data is a top priority for Sutra Vedic. This policy details how we collect, use, and protect your information.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Collecte des Données' : '2. Data Collection'}</h2>
                        <p>
                            {isFr
                                ? 'Nous collectons les données suivantes : nom, prénom, adresse e-mail, adresse de livraison, numéro de téléphone et historique de navigation.'
                                : 'We collect the following data: first name, last name, email address, shipping address, phone number, and browsing history.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Utilisation des Données' : '3. Use of Data'}</h2>
                        <p>
                            {isFr
                                ? 'Vos données sont utilisées pour le traitement des commandes, l\'amélioration de notre service client et l\'envoi de newsletters (si vous y avez consenti).'
                                : 'Your data is used for order processing, improving our customer service, and sending newsletters (if you have consented).'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '4. Partage des Données' : '4. Data Sharing'}</h2>
                        <p>
                            {isFr
                                ? 'Nous ne vendons jamais vos données à des tiers. Vos informations ne sont partagées qu\'avec nos partenaires logistiques et de paiement pour la bonne exécution de vos commandes.'
                                : 'We never sell your data to third parties. Your information is only shared with our logistics and payment partners for the proper execution of your orders.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '5. Sécurité' : '5. Security'}</h2>
                        <p>
                            {isFr
                                ? 'Nous utilisons des certificats SSL et des méthodes de stockage sécurisées pour protéger vos données contre tout accès non autorisé.'
                                : 'We use SSL certificates and secure storage methods to protect your data from unauthorized access.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>6. Contact</h2>
                        <p>
                            {isFr
                                ? 'Pour toute question, contactez-nous à : privacy@sutravedic.fr'
                                : 'For any questions, contact us at: privacy@sutravedic.fr'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
