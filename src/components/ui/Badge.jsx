'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

const colorMap = {
  primary:  'bg-primary-500/10 text-primary-600 dark:text-primary-300 border-primary-500/20',
  violet:   'bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20',
  accent:   'bg-accent-500/10 text-accent-600 dark:text-accent-300 border-accent-500/20',
  emerald:  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  rose:     'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  amber:    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  slate:    'bg-slate-100 dark:bg-dark-700/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-dark-600/50',
};

export function Badge({ children, color = 'primary', className, dot = false }) {
  return (
    <span
      className={twMerge(clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorMap[color] || colorMap.primary,
        className
      ))}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
      )}
      {children}
    </span>
  );
}
