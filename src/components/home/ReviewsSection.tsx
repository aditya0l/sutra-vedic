'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { productsApi } from '@/lib/api';
import { getLocalizedValue } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Review } from '@/types';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Fallback hardcoded reviews shown before DB is seeded
const FALLBACK: Review[] = [
    { id: 'r1', userName: 'Aarav Sharma', rating: 5, comment: { fr: "Le combo de Shesha est magique pour mes douleurs de dos après le sport. Très efficace !", en: "Shesha's combo is magic for my back pain after sports. Very effective!" }, date: '2025-01-15', verified: true },
    { id: 'r2', userName: 'Priya Patel', rating: 5, comment: { fr: "L'huile Kairbossom est très agréable, on sent la qualité des ingrédients Kairali.", en: 'Kairbossom oil is very pleasant, you can feel the quality of Kairali ingredients.' }, date: '2025-02-03', verified: true },
    { id: 'r3', userName: 'Rohan Gupta', rating: 5, comment: { fr: "L'huile de cannabis Medicann m'aide énormément au quotidien. Le goût menthe est un vrai plus.", en: 'Medicann cannabis oil helps me a lot daily. The mint taste is a real plus.' }, date: '2025-02-14', verified: true },
];

export default function ReviewsSection() {
    const t = useTranslations('reviews');
    const locale = useLocale();
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.08 });
    const [reviews, setReviews] = useState<Review[]>(FALLBACK);

    useEffect(() => {
        // Fetch the first product's reviews for the homepage
        productsApi.getReviews('shesha-ayurveda-pain-combo')
            .catch(() => null)
            .then(r => { if (r && r.length > 0) setReviews(r.slice(0, 3)); });
    }, []);

    return (
        <section ref={ref} className="section-padding bg-white">
            <div className="container-premium">

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-24 lg:mb-32">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="text-4xl md:text-5xl font-serif font-normal text-[#0F2E22] mb-6"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
                        className="text-lg text-[#2D2D2D]/70 max-w-2xl leading-relaxed font-light"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                            className="group bg-[#FEFAE0]/30 rounded-[2.5rem] p-12 lg:p-14 border border-[#F4EDCC]/40 hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(15,46,34,0.08)] transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center"
                        >
                            <Quote className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-[#C9A84C]/5 group-hover:text-[#C9A84C]/10 transition-colors duration-700 pointer-events-none" />

                            <div className="flex items-center justify-center gap-1.5 mb-8 relative z-10">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'}`} />
                                ))}
                            </div>

                            <p className="text-[#2D2D2D]/80 text-[0.875rem] leading-[1.8] font-light mb-10 flex-1 italic relative z-10 px-4">
                                &ldquo;{getLocalizedValue(review.comment as { fr: string; en: string }, locale)}&rdquo;
                            </p>

                            <div className="flex flex-col items-center pt-8 mt-auto border-t border-cream-dark/30 w-full relative z-10">
                                <p className="font-serif font-normal text-xl text-[#0F2E22] tracking-wide mb-2">{review.userName}</p>
                                {review.verified && (
                                    <p className="text-[0.65rem] text-[#C9A84C] font-medium uppercase tracking-[0.2em]">
                                        {locale === 'fr' ? 'Achat vérifié' : 'Verified Purchase'}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
