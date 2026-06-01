'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,          // { value: number, label: string }
  iconColor = 'text-primary-400',
  iconBg = 'bg-primary-500/10',
  valueColor = 'text-slate-900 dark:text-white',
  className,
  delay = 0,
}) {
  const trendPositive = trend?.value > 0;
  const trendNeutral = trend?.value === 0;

  return (
    <motion.div
      className={twMerge(clsx('glass-card p-5 flex flex-col gap-3', className))}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={twMerge(clsx('p-2 rounded-lg', iconBg))}>
            <Icon className={twMerge(clsx('w-4 h-4', iconColor))} />
          </div>
        )}
      </div>

      <p className={twMerge(clsx('text-2xl font-bold font-display tracking-tight', valueColor))}>
        {value}
      </p>

      {trend && (
        <div className="flex items-center gap-1.5">
          {trendNeutral ? (
            <Minus className="w-3.5 h-3.5 text-slate-500" />
          ) : trendPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={clsx(
            'text-xs font-medium',
            trendNeutral ? 'text-slate-500' : trendPositive ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {trendPositive ? '+' : ''}{trend.value?.toFixed(1)}%
          </span>
          {trend.label && (
            <span className="text-xs text-slate-600">{trend.label}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
