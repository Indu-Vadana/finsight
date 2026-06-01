'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      className={twMerge(clsx(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      ))}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {Icon && (
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-primary-500/10 blur-xl scale-150" />
          <div className="relative p-5 rounded-2xl bg-slate-100 dark:bg-dark-700/60 border border-slate-200 dark:border-white/[0.06]">
            <Icon className="w-10 h-10 text-slate-400 dark:text-slate-600" />
          </div>
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-600 max-w-xs mb-5">{description}</p>
      )}
      {action && action}
    </motion.div>
  );
}
