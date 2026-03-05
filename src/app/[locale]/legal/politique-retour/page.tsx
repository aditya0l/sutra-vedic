'use client';
import { useLocale } from 'next-intl';
import { RefreshCw, XCircle, Clock, CreditCard, Package } from 'lucide-react';

export default function ReturnPolicyPage() {
    const locale = useLocale();
    const isFr = locale === 'fr';

    const sections = [
        {
            icon: Package,
            number: '1',
            title: isFr ? 'Définitions & Conditions de Retour' : '1. Definitions & Return Conditions',
            content: isFr ? (
                <>
                    <p className="text-[#2D2D2D]/70 leading-relaxed mb-4">
                        Un retour désigne l'action de renvoyer un produit commandé via Sutra Vedic. Les retours peuvent être demandés dans les cas suivants :
                    </p>
                    <ul className="space-y-2 mb-4">
                        {[
                            'Le produit livré ne correspond pas à votre commande.',
                            'Le produit est proche de sa date de péremption (moins de 3 mois).',
                            'Le produit a été endommagé pendant le transport (veuillez ne pas accepter tout produit dont le sceau a été altéré).',
                        ].map(item => (
                            <li key={item} className="flex items-start gap-2 text-[#2D2D2D]/70">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                        <strong>Note :</strong> Si vous recevez un produit endommagé, n'acceptez pas la livraison. Si vous constatez des dommages après ouverture du colis, vous pouvez retourner le produit pour un remboursement. Le remplacement est soumis à la disponibilité du produit ; dans le cas contraire, un remboursement sera effectué.
                    </div>
                </>
            ) : (
                <>
                    <p className="text-[#2D2D2D]/70 leading-relaxed mb-4">
                        A Return is the action of giving back a product ordered through Sutra Vedic. Returns may be requested under the following circumstances:
                    </p>
                    <ul className="space-y-2 mb-4">
                        {[
                            'The delivered product does not match your order.',
                            'The product is close to its expiration date (less than 3 months).',
                            'The product was damaged during transit (please do not accept any product with a tampered seal).',
                        ].map(item => (
                            <li key={item} className="flex items-start gap-2 text-[#2D2D2D]/70">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                        <strong>Note:</strong> If you receive a damaged product, do not accept the delivery. If you discover damage after opening the package, you may return the product for a refund. Replacement is subject to product availability; otherwise, a refund will be processed.
                    </div>
                </>
            ),
        },
        {
            icon: XCircle,
            number: '2',
            title: isFr ? 'Politique d\'annulation' : '2. Cancellation Policy',
            content: isFr ? (
                <div className="space-y-3 text-[#2D2D2D]/70 leading-relaxed">
                    <p><strong className="text-[#0F2E22]">Annulation par le client :</strong> Les commandes peuvent être annulées avant expédition. Si le client reçoit un produit incorrect, endommagé ou proche de sa date de péremption, il peut initier le processus de remboursement.</p>
                    <p><strong className="text-[#0F2E22]">Annulation par Sutra Vedic :</strong> Sutra Vedic se réserve le droit d'annuler des commandes en cas d'indisponibilité du produit, d'erreurs de prix ou de commandes en vrac destinées à la revente. Aucuns frais d'annulation ne s'appliquent si la commande est annulée conformément aux termes de cette politique.</p>
                </div>
            ) : (
                <div className="space-y-3 text-[#2D2D2D]/70 leading-relaxed">
                    <p><strong className="text-[#0F2E22]">Customer Cancellation:</strong> Orders can be cancelled before they are shipped. If the customer receives the wrong, damaged, or near-expiration product, they can initiate the refund process.</p>
                    <p><strong className="text-[#0F2E22]">Sutra Vedic Cancellation:</strong> Sutra Vedic reserves the right to cancel orders due to product unavailability, pricing errors, or bulk orders intended for resale. No cancellation charges apply if the order is cancelled per the terms of this policy.</p>
                </div>
            ),
        },
        {
            icon: RefreshCw,
            number: '3',
            title: isFr ? 'Processus de retour' : '3. Return Process',
            content: isFr ? (
                <div className="space-y-4 text-[#2D2D2D]/70 leading-relaxed">
                    <p>Pour initier un retour, veuillez contacter : <a href="mailto:contact@sutravedic.fr" className="text-[#C9A84C] font-medium hover:underline">contact@sutravedic.fr</a></p>
                    <p>Notre équipe vérifiera votre demande dans les <strong>72 heures</strong>. Si la demande est valide, nous organiserons le retour du produit. Veuillez emballer le produit dans son emballage d'origine. Les remboursements seront traités dans les <strong>30 jours</strong> suivant la réception du produit retourné.</p>
                    <div className="bg-[#FEFAE0] border border-cream-dark/30 rounded-xl p-4">
                        <p className="font-semibold text-[#0F2E22] text-sm mb-2">Conditions de retour :</p>
                        <ul className="space-y-1.5 text-sm">
                            {[
                                'Les commandes incorrectes ne donnent pas droit à un retour.',
                                'Le numéro de lot du produit doit correspondre à la facture.',
                                'Les changements de prescription ne donnent pas droit à un retour.',
                                'Les retours doivent inclure l\'emballage original, les étiquettes de prix, les labels et le code-barres.',
                                'Les produits partiellement utilisés ne sont pas éligibles au retour ; seuls les articles non ouverts sont acceptés.',
                            ].map(c => <li key={c} className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#0F2E22]/40 shrink-0" />{c}</li>)}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 text-[#2D2D2D]/70 leading-relaxed">
                    <p>To initiate a return, please contact: <a href="mailto:contact@sutravedic.fr" className="text-[#C9A84C] font-medium hover:underline">contact@sutravedic.fr</a></p>
                    <p>Our customer care team will verify your claim within <strong>72 hours</strong>. If the claim is valid, we will arrange for the return of the product. Please pack the product in its original manufacturer's packaging. Refunds will be processed within <strong>30 days</strong> of the product's return.</p>
                    <div className="bg-[#FEFAE0] border border-cream-dark/30 rounded-xl p-4">
                        <p className="font-semibold text-[#0F2E22] text-sm mb-2">Return Conditions:</p>
                        <ul className="space-y-1.5 text-sm">
                            {[
                                'Incorrect orders do not qualify for a return.',
                                'The product\'s batch number must match the invoice.',
                                'Changes in prescription do not qualify for a return.',
                                'Returns must include the original packaging, price tags, labels, and barcode.',
                                'Partially used products do not qualify for return; only unopened items are eligible.',
                            ].map(c => <li key={c} className="flex items-start gap-2"><span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#0F2E22]/40 shrink-0" />{c}</li>)}
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            icon: CreditCard,
            number: '5',
            title: isFr ? 'Processus de remboursement' : '5. Refund Process',
            content: (
                <div className="space-y-3 text-[#2D2D2D]/70 leading-relaxed">
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <CreditCard className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900 text-sm">{isFr ? 'Paiements en ligne' : 'Online Payments'}</p>
                            <p className="text-green-800 text-sm mt-1">{isFr ? 'Les remboursements seront crédités sur le moyen de paiement original ou le portefeuille.' : 'Refunds will be credited to the original payment method or wallet.'}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold text-blue-900 text-sm">{isFr ? 'Paiement à la livraison' : 'Cash on Delivery'}</p>
                            <p className="text-blue-800 text-sm mt-1">{isFr ? 'Les remboursements seront virés sur le compte bancaire du client.' : 'Refunds will be transferred to the customer\'s bank account.'}</p>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#FEFAE0]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#0F2E22] to-[#1a4a37] py-24 px-4 text-center">
                <span className="text-[0.65rem] font-medium tracking-[0.2em] text-[#C9A84C] uppercase mb-4 block">Sutra Vedic</span>
                <h1 className="text-4xl md:text-5xl font-serif font-normal text-white max-w-3xl mx-auto leading-tight tracking-wide mb-4">
                    {isFr ? 'Politique de Retour & Remboursement' : 'Return & Refund Policy'}
                </h1>
                <p className="text-white/50 text-base font-light max-w-xl mx-auto">
                    {isFr ? 'Votre satisfaction est notre priorité.' : 'Your satisfaction is our priority.'}
                </p>
            </div>

            {/* Contact banner */}
            <div className="bg-[#0F2E22]/5 border-b border-[#C9A84C]/20 py-4 px-4 text-center">
                <p className="text-sm text-[#2D2D2D]/60">
                    {isFr ? 'Pour toute question : ' : 'For any questions: '}
                    <a href="mailto:contact@sutravedic.fr" className="text-[#C9A84C] font-medium hover:underline">contact@sutravedic.fr</a>
                </p>
            </div>

            {/* Sections */}
            <div className="container-premium py-16 max-w-4xl mx-auto">
                <div className="space-y-8">
                    {sections.map((section) => (
                        <div key={section.number} className="bg-white rounded-3xl border border-cream-dark/10 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 px-8 py-6 border-b border-cream-dark/10 bg-[#FEFAE0]/30">
                                <div className="w-10 h-10 rounded-xl bg-[#0F2E22] flex items-center justify-center shrink-0">
                                    <section.icon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="font-serif text-xl font-normal text-[#0F2E22] tracking-wide">{section.title}</h2>
                            </div>
                            <div className="px-8 py-6">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Last updated */}
                <p className="text-center text-xs text-[#2D2D2D]/30 mt-12 tracking-wide">
                    {isFr ? 'Dernière mise à jour : Mars 2025' : 'Last updated: March 2025'}
                </p>
            </div>
        </div>
    );
}
