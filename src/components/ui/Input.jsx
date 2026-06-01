'use client';

import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function Input({ label, className, id: externalId, error, ...props }) {
  const autoId = useId();
  const id = externalId || autoId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={twMerge(clsx(
          'form-input',
          error && 'border-rose-500/60 focus:border-rose-500',
          className
        ))}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
