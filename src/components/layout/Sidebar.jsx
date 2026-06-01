'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ReceiptText, Target, TrendingUp, Calculator, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/income',      icon: Wallet,           label: 'Income' },
  { path: '/expenses',    icon: ReceiptText,      label: 'Expenses' },
  { path: '/goals',       icon: Target,           label: 'Goals' },
  { path: '/investments', icon: TrendingUp,       label: 'Investments' },
  { path: '/planner',     icon: Calculator,       label: 'Planner' },
];

export function Sidebar() {
  const { logout, currentUser } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-dark-800/70 backdrop-blur-xl border-r border-white/[0.06] z-40">
      {/* Logo */}
      <div className="p-6 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2.5"
        >
          <div className="p-1.5 bg-primary-500/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary-400" />
          </div>
          <h1 className="font-display text-xl font-bold gradient-text-primary tracking-tight">
            FinSight
          </h1>
        </motion.div>
      </div>

      {/* Nav Section Label */}
      <div className="px-5 mb-2">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Navigation</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="group relative block"
            >
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {/* Active sliding pill */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-violet-500/10 rounded-xl border border-primary-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>

                <div className={`relative flex items-center gap-3 z-10 ${isActive ? 'text-primary-300' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  <span className={`font-medium text-sm ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    />
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="p-3 border-t border-white/[0.05] space-y-2">
        {currentUser && (
          <div className="px-3 py-2 rounded-xl bg-dark-750/80 border border-white/[0.05]">
            <p className="text-xs text-slate-600 font-medium truncate">{currentUser.email}</p>
          </div>
        )}
        <motion.button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 text-sm font-medium"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}
