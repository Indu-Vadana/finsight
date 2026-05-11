import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { AnimatePresence, motion } from 'framer-motion';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="px-4 md:px-8 py-6 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
