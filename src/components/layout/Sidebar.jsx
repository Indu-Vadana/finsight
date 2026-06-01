'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, ReceiptText, Target, TrendingUp, Calculator, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/income',      icon: Wallet,           label: 'Income' },
  { path: '/expenses',    icon: ReceiptText,      label: 'Expenses' },
  { path: '/goals',       icon: Target,           label: 'Goals' },
  { path: '/investments', icon: TrendingUp,       label: 'Investments' },
  { path: '/planner',     icon: Calculator,       label: 'Planner' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.92 }}
      className={`relative flex-shrink-0 w-[52px] h-7 rounded-full p-0.5 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
        isDark
          ? 'bg-slate-700/80 border border-slate-600/40'
          : 'bg-amber-100 border border-amber-200'
      }`}
    >
      {/* Track: sun icon left */}
      <Sun className={`absolute left-[6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-all duration-300 ${
        isDark ? 'opacity-25 text-slate-400' : 'opacity-100 text-amber-500'
      }`} />

      {/* Track: moon icon right */}
      <Moon className={`absolute right-[6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-all duration-300 ${
        isDark ? 'opacity-100 text-slate-300' : 'opacity-25 text-slate-400'
      }`} />

      {/* Sliding knob */}
      <motion.span
        className={`absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md flex items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-200' : 'bg-white'
        }`}
        animate={{ x: isDark ? 25 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark
          ? <Moon className="w-3 h-3 text-slate-700" />
          : <Sun className="w-3 h-3 text-amber-500" />
        }
      </motion.span>
    </motion.button>
  );
}

export function Sidebar() {
  const { logout, currentUser } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/95 dark:bg-dark-800/70 backdrop-blur-xl border-r border-slate-200 dark:border-white/[0.06] z-40">

      {/* Logo + Toggle */}
      <div className="p-6 pb-4 flex items-center justify-between">
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
        <ThemeToggle />
      </div>

      {/* Nav Section Label */}
      <div className="px-5 mb-2">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Navigation</span>
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

                <div className={`relative flex items-center gap-3 z-10 ${
                  isActive ? 'text-primary-300' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}>
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  <span className={`font-medium text-sm ${
                    isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                  }`}>
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
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.05] space-y-2">
        {currentUser && (
          <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-750/80 border border-slate-200 dark:border-white/[0.05]">
            <p className="text-xs text-slate-500 dark:text-slate-600 font-medium truncate">{currentUser.email}</p>
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
