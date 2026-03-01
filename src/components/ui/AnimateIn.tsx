'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

interface AnimateInProps {
    children: React.ReactNode;
    className?: string;
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    threshold?: number;
}

const getInitial = (direction: Direction, distance: number) => {
    switch (direction) {
        case 'up': return { opacity: 0, y: distance };
        case 'down': return { opacity: 0, y: -distance };
        case 'left': return { opacity: 0, x: -distance };
        case 'right': return { opacity: 0, x: distance };
        case 'fade': return { opacity: 0 };
    }
};

const getAnimate = (direction: Direction) => {
    switch (direction) {
        case 'left':
        case 'right': return { opacity: 1, x: 0 };
        case 'fade': return { opacity: 1 };
        default: return { opacity: 1, y: 0 };
    }
};

export default function AnimateIn({
    children,
    className,
    direction = 'up',
    delay = 0,
    duration = 0.65,
    distance = 28,
    once = true,
    threshold = 0.15,
}: AnimateInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, amount: threshold });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={getInitial(direction, distance)}
            animate={isInView ? getAnimate(direction) : getInitial(direction, distance)}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1], // premium cubic-bezier
            }}
        >
            {children}
        </motion.div>
    );
}
