'use client';

import { motion } from 'framer-motion';

interface TimelineStepProps {
  step: number;
  label: string;
  delay?: number;
}

export function TimelineStep({ step, label, delay = 0 }: TimelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className="flex items-start gap-4 rounded-[2rem] border border-slate-800/90 bg-slate-950/80 p-6 shadow-soft"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-sky-300 text-lg font-semibold">
        {step}
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Step {step}</p>
        <p className="mt-2 text-base font-semibold text-white">{label}</p>
      </div>
    </motion.div>
  );
}
