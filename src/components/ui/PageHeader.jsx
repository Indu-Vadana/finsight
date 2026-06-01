'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function PageHeader({ title, subtitle, action, className }) {
  return (
    <motion.header
      className={twMerge(clsx('mb-8', className))}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text-primary leading-tight mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 mt-1">{action}</div>
        )}
      </div>
    </motion.header>
  );
}
