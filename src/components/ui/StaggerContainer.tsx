'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    initialDelay?: number;
    once?: boolean;
    threshold?: number;
}

export const staggerContainer = (staggerDelay = 0.1, initialDelay = 0) => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
        },
    },
});

export const fadeUpItem = (distance = 28) => ({
    hidden: { opacity: 0, y: distance },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        },
    },
});

export const fadeItem = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export default function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
    initialDelay = 0,
    once = true,
    threshold = 0.1,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, amount: threshold });

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={staggerContainer(staggerDelay, initialDelay)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
        >
            {children}
        </motion.div>
    );
}
