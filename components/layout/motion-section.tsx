'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { useIsMounted } from '@/lib/hooks/use-mounted';

export function MotionSection({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const mounted = useIsMounted();

  const reduceMotion = mounted ? shouldReduceMotion : false;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
