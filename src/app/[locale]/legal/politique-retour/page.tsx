import { useLocale, useTranslations } from 'next-intl';

export default function ReturnPolicyPage() {
    const t = useTranslations('footer');
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="bg-cream min-h-screen">
            <div className="bg-gradient-to-br from-forest-dark to-forest py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto">
                    {t('returnPolicy')}
                </h1>
            </div>

            <div className="container-premium py-12">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-cream-dark/10 max-w-4xl mx-auto prose prose-headings:font-serif prose-headings:text-forest-dark prose-p:text-charcoal-light prose-p:leading-relaxed">
                    <section className="mb-10">
                        <h2>{isFr ? '1. Retours' : '1. Returns'}</h2>
                        <p>
                            {isFr
                                ? 'Vous disposez d\'un délai de 14 jours après réception de votre commande pour nous retourner un produit. Pour être éligible, l\'article doit être inutilisé, dans son emballage d\'origine et dans le même état que vous l\'avez reçu.'
                                : 'You have a period of 14 days after receipt of your order to return a product that does not suit you. To be eligible for a return, your item must be unused, in its original packaging, and in the same condition as you received it.'}
                        </p>
                        <p><strong>{isFr ? 'Note :' : 'Note:'}</strong> {isFr ? 'Pour des raisons d\'hygiène, les flacons ouverts ou descellés ne peuvent pas être retournés.' : 'For hygiene reasons, bottles that have been opened or unsealed cannot be returned.'}</p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '2. Processus de remboursement' : '2. Refund Process'}</h2>
                        <p>
                            {isFr
                                ? 'Une fois votre retour reçu et inspecté, nous vous enverrons un e-mail de confirmation. Si approuvé, votre remboursement sera traité sur votre méthode de paiement originale sous 7 à 10 jours.'
                                : 'Once we have received and inspected your return, we will send you an email to notify you that we have received it. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 7 to 10 days.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '3. Frais d’expédition' : '3. Shipping Costs'}</h2>
                        <p>
                            {isFr
                                ? 'Les frais de retour sont à votre charge. Ils ne sont pas remboursables.'
                                : 'You will be responsible for paying your own shipping costs for returning your item. Shipping costs are non-refundable.'}
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2>{isFr ? '4. Articles endommagés' : '4. Damaged Items'}</h2>
                        <p>
                            {isFr
                                ? 'Si vous recevez un produit endommagé ou défectueux, veuillez nous contacter immédiatement à contact@sutravedic.fr avec des photos.'
                                : 'If you receive a damaged or defective product, please contact us immediately at contact@sutravedic.fr with photos of the product.'}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
