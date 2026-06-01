'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) {
  const base = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none overflow-hidden select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-glow-sm hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-slate-100 dark:bg-dark-700/80 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-dark-600/80 hover:border-slate-300 dark:hover:border-white/[0.14] disabled:opacity-50',
    danger:
      'bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:shadow-glow disabled:opacity-50',
    ghost:
      'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-700/60 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50',
    accent:
      'bg-gradient-to-r from-accent-500 to-accent-400 text-dark-900 font-bold hover:shadow-glow-accent disabled:opacity-50',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };

  return (
    <motion.button
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
