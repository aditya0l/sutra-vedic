'use client';

import { useLocale } from 'next-intl';

export default function TermsPage() {
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
                    {isFr ? 'Conditions Générales de Vente' : 'Terms & Conditions'}
                </h1>
            </div>
            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-lg">
                    <p className="text-sm text-charcoal-light mb-8">{isFr ? 'Dernière mise à jour : Février 2025' : 'Last updated: February 2025'}</p>

                    <h2 className="font-serif text-xl text-forest-dark">{isFr ? '1. Objet' : '1. Purpose'}</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        {isFr
                            ? 'Les présentes conditions générales régissent les ventes de produits par Sutra Vedic via son site internet. Toute commande implique l\'acceptation sans réserve de ces conditions.'
                            : 'These general conditions govern the sale of products by Sutra Vedic through its website. Any order implies unreserved acceptance of these conditions.'}
                    </p>

                    <h2 className="font-serif text-xl text-forest-dark">{isFr ? '2. Produits' : '2. Products'}</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        {isFr
                            ? 'Les produits proposés sont décrits avec la plus grande précision. Les photographies sont non contractuelles. En cas de rupture de stock, nous vous informerons dans les plus brefs délais.'
                            : 'Products offered are described with the greatest precision. Photographs are non-contractual. In case of out of stock, we will inform you as soon as possible.'}
                    </p>

                    <h2 className="font-serif text-xl text-forest-dark">{isFr ? '3. Prix et Paiement' : '3. Pricing & Payment'}</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        {isFr
                            ? 'Les prix sont indiqués en euros TTC. Le paiement est sécurisé via Stripe. Nous acceptons les cartes Visa, Mastercard et American Express.'
                            : 'Prices are shown in euros including tax. Payment is secured via Stripe. We accept Visa, Mastercard, and American Express cards.'}
                    </p>

                    <h2 className="font-serif text-xl text-forest-dark">{isFr ? '4. Livraison' : '4. Delivery'}</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        {isFr
                            ? 'La livraison est gratuite pour toute commande supérieure à 50€. Les délais de livraison sont de 3 à 7 jours ouvrés en France métropolitaine.'
                            : 'Delivery is free for orders over €50. Delivery times are 3 to 7 business days in metropolitan France.'}
                    </p>

                    <h2 className="font-serif text-xl text-forest-dark">{isFr ? '5. Retours et Remboursements' : '5. Returns & Refunds'}</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        {isFr
                            ? 'Vous disposez de 30 jours après réception pour retourner un produit. Le produit doit être non ouvert et dans son emballage d\'origine. Le remboursement sera effectué dans les 14 jours suivant la réception du retour.'
                            : 'You have 30 days after receipt to return a product. The product must be unopened and in its original packaging. Refund will be made within 14 days of receiving the return.'}
                    </p>

                    <h2 className="font-serif text-xl text-forest-dark">6. Contact</h2>
                    <p className="text-charcoal-light text-sm leading-relaxed">
                        Sutra Vedic — contact@sutravedic.fr
                    </p>
                </div>
            </div>
        </div>
    );
}
