import { useLocale, useTranslations } from 'next-intl';

export default function CGVPage() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-cream min-h-screen">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto">
                    {t('salesTerms')}
                </h1>
            </div>

            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <section className="mb-10">
                        <h2>{isFr ? '1. Objet' : '1. Purpose'}</h2>
                        <p>
                            {isFr
                                ? 'Les présentes conditions générales de vente (CGV) définissent les droits et obligations des parties dans le cadre de la vente des produits proposés par Sutra Vedic sur son site sutravedic.com.'
                                : 'These General Terms and Conditions of Sale (CGV) define the rights and obligations of the parties in connection with the sale of products offered by Sutra Vedic on its website sutravedic.com.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Produits' : '2. Products'}</h2>
                        <p>
                            {isFr
                                ? 'Les produits proposés sont ceux figurant sur le site au jour de la consultation. Chaque produit est accompagné d’un descriptif établi par Sutra Vedic. Nos produits sont des compléments et huiles ayurvédiques.'
                                : 'The products offered are those appearing on the site on the day of consultation. Each product is accompanied by a description established by Sutra Vedic. The products are Ayurvedic supplements and oils.'}
                        </p>
                        <p><strong>{isFr ? 'Avertissement :' : 'Warning:'}</strong> {isFr ? 'Nos produits ne sont pas des médicaments et ne doivent pas remplacer un avis médical professionnel.' : 'Our products are not medicines and should not replace professional medical advice.'}</p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Prix' : '3. Prices'}</h2>
                        <p>
                            {isFr
                                ? 'Les prix sont indiqués en Euros (€) toutes taxes comprises (TTC). Sutra Vedic se réserve le droit de modifier ses prix à tout moment.'
                                : 'Prices are indicated in Euros (€) including all taxes (TTC). Sutra Vedic reserves the right to modify its prices at any time.'}
                            , it being understood that the price appearing on the site on the day of the order will be the only one applicable to the Buyer.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '4. Commande et Paiement' : '4. Ordering and Payment'}</h2>
                        <p>
                            {isFr
                                ? 'Le client passe commande via la boutique en ligne. Le règlement s\'effectue par carte bancaire via des plateformes sécurisées (Stripe/Razorpay). L\'ordre est confirmé à la réception du paiement.'
                                : 'The customer places an order via the online store. Payment is made by credit card via secure platforms (Stripe/Razorpay). The order is confirmed upon receipt of payment.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '5. Livraison' : '5. Delivery'}</h2>
                        <p>
                            {isFr
                                ? 'Les livraisons sont faites à l’adresse indiquée dans le bon de commande. Les délais de livraison sont donnés à titre indicatif. Les frais de port sont calculés en fonction de la destination et du poids de la commande.'
                                : 'Deliveries are made to the address indicated in the order form. Delivery times are given as an indication. Shipping costs are calculated according to the destination and the weight of the order.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '6. Droit de rétractation' : '6. Right of Withdrawal'}</h2>
                        <p>
                            {isFr
                                ? 'Conformément à la loi, l’Acheteur dispose d’un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation sans avoir à justifier ses motifs ni à payer de pénalités. Pour plus de détails, consultez notre Politique de retour.'
                                : 'In accordance with the law, the Buyer has a period of 14 days from receipt of the products to exercise their right of withdrawal without having to justify their reasons or pay penalties. For more details, see our '}<strong>{isFr ? 'Politique de retour' : 'Return Policy'}</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
