'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Leaf, Award, Heart, Users, Globe, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
    const locale = useLocale();
    const isFr = locale === 'fr';

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <div className="bg-gradient-to-br from-forest-dark to-forest py-24 px-4 text-center">
                <div className="container-premium">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                        {isFr ? 'Notre Histoire' : 'Our Story'}
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        {isFr
                            ? 'Depuis nos origines, nous sommes guidés par la sagesse ancestrale de l\'Ayurveda pour créer des produits naturels d\'exception.'
                            : 'Since our origins, we have been guided by the ancient wisdom of Ayurveda to create exceptional natural products.'}
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div className="container-premium py-24 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    <div className="lg:col-span-7">
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-forest/5 rounded-full text-sm text-forest font-medium mb-6 tracking-wide">
                            <Leaf className="w-4 h-4" />
                            {isFr ? 'Notre Mission' : 'Our Mission'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-8 leading-tight tracking-wide">
                            {isFr ? 'Rendre l\'Ayurveda Accessible à Tous' : 'Making Ayurveda Accessible to All'}
                        </h2>
                        <p className="text-charcoal-light leading-relaxed mb-4">
                            {isFr
                                ? 'Chez Sutra Vedic, nous croyons en la puissance de la nature pour guérir et nourrir. Nos produits sont le fruit de recherches approfondies et de formulations traditionnelles ayurvédiques, adaptées aux besoins modernes.'
                                : 'At Sutra Vedic, we believe in the power of nature to heal and nourish. Our products are the result of in-depth research and traditional Ayurvedic formulations, adapted to modern needs.'}
                        </p>
                        <p className="text-charcoal-light leading-relaxed text-lg font-light">
                            {isFr
                                ? 'Chaque produit est conçu avec le plus grand soin, en utilisant uniquement des ingrédients naturels, biologiques et issus du commerce équitable.'
                                : 'Each product is designed with the greatest care, using only natural, organic, and fair-trade ingredients.'}
                        </p>
                    </div>
                    <div className="lg:col-span-5 aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-[#FEFAE0] to-[#E8D8A0]/20 flex items-center justify-center border border-cream-dark/20 shadow-sm">
                        <span className="text-[120px] opacity-80">🌿</span>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white py-24 md:py-32">
                <div className="container-premium">
                    <h2 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark text-center mb-20 tracking-wide">
                        {isFr ? 'Nos Valeurs' : 'Our Values'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {[
                            { icon: Leaf, title: isFr ? 'Naturel & Pur' : 'Natural & Pure', desc: isFr ? 'Tous nos ingrédients sont 100% naturels, sans produits chimiques ni additifs artificiels.' : 'All our ingredients are 100% natural, without chemicals or artificial additives.' },
                            { icon: Award, title: isFr ? 'Qualité Premium' : 'Premium Quality', desc: isFr ? 'Nous ne faisons aucun compromis sur la qualité. Chaque lot est testé et certifié.' : 'We make no compromise on quality. Every batch is tested and certified.' },
                            { icon: Heart, title: isFr ? 'Bien-être Holistique' : 'Holistic Wellness', desc: isFr ? 'Nos produits traitent le corps et l\'esprit, suivant les principes holistiques de l\'Ayurveda.' : 'Our products treat body and mind, following the holistic principles of Ayurveda.' },
                            { icon: Globe, title: isFr ? 'Éco-responsable' : 'Eco-responsible', desc: isFr ? 'Emballages recyclables, approvisionnement durable et engagement pour la planète.' : 'Recyclable packaging, sustainable sourcing, and commitment to the planet.' },
                            { icon: Users, title: isFr ? 'Communauté' : 'Community', desc: isFr ? 'Nous travaillons directement avec les producteurs locaux en Inde et en France.' : 'We work directly with local producers in India and France.' },
                            { icon: ShieldCheck, title: isFr ? 'Transparence' : 'Transparency', desc: isFr ? 'Nous partageons chaque détail de nos formulations et de notre sourcing.' : 'We share every detail of our formulations and sourcing.' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="text-center p-8 rounded-[2rem] hover:bg-[#FEFAE0]/30 transition-all duration-300 border border-transparent hover:border-cream-dark/20 hover:shadow-lg hover:shadow-cream-dark/10 group">
                                <div className="w-20 h-20 rounded-[1.5rem] bg-[#FEFAE0]/50 border border-cream-dark/20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Icon className="w-8 h-8 text-[#C9A84C]" />
                                </div>
                                <h3 className="font-serif font-normal text-2xl text-forest-dark mb-4 tracking-wide">{title}</h3>
                                <p className="text-[0.9375rem] text-charcoal-light leading-relaxed font-light px-2">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
