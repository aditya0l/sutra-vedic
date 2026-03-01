'use client';

import { useTranslations } from 'next-intl';
import { Leaf, ShieldCheck, Award, Recycle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const benefitIcons = {
    natural: Leaf,
    chemical_free: ShieldCheck,
    certified: Award,
    sustainable: Recycle,
};

const benefitKeys = ['natural', 'chemical_free', 'certified', 'sustainable'] as const;

export default function BenefitsSection() {
    const t = useTranslations('benefits');
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section ref={ref} className="section-padding bg-white">
            <div className="container-premium">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {benefitKeys.map((key, i) => {
                        const Icon = benefitIcons[key];
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.8, delay: i * 0.15, ease: EASE }}
                                className="group flex flex-col items-center text-center px-4"
                            >
                                {/* Icon */}
                                <div className="w-20 h-20 rounded-[2rem] bg-[#FEFAE0] flex items-center justify-center mb-8 group-hover:bg-[#0F2E22] group-hover:shadow-xl group-hover:shadow-[0_15px_40px_-10px_rgba(15,46,34,0.15)] transition-all duration-700 ease-out-expo">
                                    <Icon className="w-8 h-8 text-[#0F2E22] group-hover:text-white transition-all duration-700" />
                                </div>

                                <h3 className="font-serif font-bold text-xl lg:text-2xl text-[#0F2E22] mb-3 leading-snug">
                                    {t(key)}
                                </h3>
                                <p className="text-[0.9375rem] text-[#2D2D2D]/60 font-medium leading-relaxed max-w-[240px]">
                                    {t(`${key}Desc`)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
