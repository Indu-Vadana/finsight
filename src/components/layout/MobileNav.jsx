'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ReceiptText, Target, TrendingUp, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Home' },
  { path: '/income',      icon: Wallet,           label: 'Income' },
  { path: '/expenses',    icon: ReceiptText,      label: 'Spend' },
  { path: '/goals',       icon: Target,           label: 'Goals' },
  { path: '/investments', icon: TrendingUp,       label: 'Invest' },
  { path: '/planner',     icon: Calculator,       label: 'Plan' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/[0.65] dark:bg-dark-800/80 backdrop-blur-2xl border-t border-white/[0.75] dark:border-white/[0.06] z-50 pb-safe">
      <div className="flex justify-around items-center px-2 py-1">
        {navItems.map((item) => {
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 min-w-[52px]"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-primary-500/15 rounded-xl border border-primary-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <item.icon
                className={`relative w-5 h-5 z-10 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-600'}`}
              />
              <span
                className={`relative text-[10px] font-semibold z-10 transition-colors ${isActive ? 'text-primary-300' : 'text-slate-600'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
