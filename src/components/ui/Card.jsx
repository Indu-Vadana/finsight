import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function Card({ children, className, hover = false, glow = false, ...props }) {
  const classes = twMerge(clsx(
    'glass-card p-6',
    hover && 'glass-card-hover cursor-pointer',
    glow && 'glow-primary',
    className
  ));

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
