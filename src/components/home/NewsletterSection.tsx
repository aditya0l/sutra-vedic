'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function NewsletterSection() {
    const t = useTranslations('newsletter');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            setEmail('');
            setTimeout(() => setIsSubmitted(false), 5000);
        }
    };

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-[#FEFAE0]/50 border-t border-cream-dark/20">
            <div className="container-premium">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="max-w-2xl mx-auto text-center"
                >
                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl font-serif font-normal text-forest-dark mb-6 tracking-wide">
                        {t('title')}
                    </h2>

                    <p className="text-base text-charcoal-light mb-12 font-light leading-relaxed max-w-lg mx-auto text-center">
                        {t('subtitle')}
                    </p>

                    {/* Form */}
                    {isSubmitted ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center justify-center gap-3 text-forest-dark bg-white py-4 px-8 rounded-full border border-cream-dark/20 inline-flex shadow-sm mx-auto"
                        >
                            <CheckCircle className="w-5 h-5 text-gold" />
                            <span className="text-base font-medium">{t('success')}</span>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto bg-white p-2 rounded-[2rem] shadow-sm border border-cream-dark/20 focus-within:border-gold/50 focus-within:shadow-md transition-all duration-300">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('placeholder')}
                                className="flex-1 px-6 py-3 bg-transparent border-none text-forest-dark placeholder-charcoal-light/50 focus:outline-none focus:ring-0 text-[0.9375rem] font-light w-full"
                                required
                            />
                            <button
                                type="submit"
                                className="px-[3rem] py-5 bg-forest hover:bg-forest-light text-white font-medium rounded-full transition-all duration-300 flex items-center justify-center text-center gap-3 tracking-wide text-[0.95rem] shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0 whitespace-nowrap"
                            >
                                <span>{t('subscribe')}</span>
                                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </form>
                    )}

                    <p className="text-xs text-charcoal-light/60 mt-6 tracking-wide">
                        {t('privacy')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
