# Vite to Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate FinSight from React + Vite SPA to Next.js 15 App Router while preserving all functionality.

**Architecture:** Use Next.js App Router with route groups: `(auth)` for login, `(protected)` for all authed pages. All components are client components (`"use client"`) since the entire app sits behind Firebase Auth. Replace `react-router-dom` with Next.js file-based routing and `next/navigation` hooks.

**Tech Stack:** Next.js 15, React 19, Firebase Auth + Firestore, Tailwind CSS 3, Framer Motion, Chart.js 4

---

## File Map

**Create:**
- `src/app/layout.jsx` — root HTML shell + Providers wrapper
- `src/app/providers.jsx` — client component wrapping all 6 context providers
- `src/app/globals.css` — copy of src/index.css (moved here for Next.js import)
- `src/app/(auth)/login/page.jsx` — login page shell
- `src/app/(protected)/layout.jsx` — auth guard + Layout wrapper for all protected routes
- `src/app/(protected)/page.jsx` — dashboard page
- `src/app/(protected)/income/page.jsx`
- `src/app/(protected)/expenses/page.jsx`
- `src/app/(protected)/goals/page.jsx`
- `src/app/(protected)/investments/page.jsx`
- `src/app/(protected)/planner/page.jsx`
- `next.config.mjs` — Next.js config

**Modify:**
- `package.json` — remove vite/react-router-dom, add next
- `tailwind.config.js` — remove `./index.html` from content paths
- `eslint.config.js` — remove vite-specific plugin
- `src/firebase/config.js` — `VITE_` → `NEXT_PUBLIC_` env prefix
- `.env` — rename all keys
- `.env.example` — rename all keys
- `src/contexts/AuthContext.jsx` — add `"use client"`, expose `loading` in value
- `src/contexts/BudgetContext.jsx` — add `"use client"`
- `src/contexts/ExpenseContext.jsx` — add `"use client"`
- `src/contexts/GoalContext.jsx` — add `"use client"`
- `src/contexts/IncomeContext.jsx` — add `"use client"`
- `src/contexts/InvestmentContext.jsx` — add `"use client"`
- `src/components/ui/*.jsx` (9 files) — add `"use client"`
- `src/components/layout/Layout.jsx` — `"use client"`, `Outlet`→`{children}`, router→next/navigation
- `src/components/layout/Sidebar.jsx` — `"use client"`, NavLink→Link, useLocation→usePathname
- `src/components/layout/MobileNav.jsx` — `"use client"`, NavLink→Link, useLocation→usePathname
- `src/modules/auth/Login.jsx` — `"use client"`, add redirect useEffect
- `src/modules/dashboard/Dashboard.jsx` — add `"use client"`
- `src/modules/expenses/Expenses.jsx` — add `"use client"`
- `src/modules/income/Income.jsx` — add `"use client"`
- `src/modules/goals/Goals.jsx` — add `"use client"`
- `src/modules/investments/Investments.jsx` — add `"use client"`
- `src/modules/planner/Planner.jsx` — add `"use client"`

**Delete:**
- `vite.config.js`
- `index.html`
- `src/App.jsx`
- `src/main.jsx`
- `src/App.css`
- `src/index.css` (content moved to `src/app/globals.css`)

---

## Task 1: Swap Dependencies + Next.js Config

**Files:**
- Modify: `package.json`
- Create: `next.config.mjs`
- Modify: `tailwind.config.js`
- Modify: `eslint.config.js`

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "finsight",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "autoprefixer": "^10.5.0",
    "chart.js": "^4.5.1",
    "clsx": "^2.1.1",
    "firebase": "^12.12.1",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.14.0",
    "next": "^15.3.3",
    "postcss": "^8.5.13",
    "react": "^19.2.5",
    "react-chartjs-2": "^5.3.1",
    "react-dom": "^19.2.5",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^3.4.19"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "globals": "^17.5.0"
  }
}
```

- [ ] **Step 2: Create next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {}
export default nextConfig
```

- [ ] **Step 3: Update tailwind.config.js content paths**

Change only the `content` array (remove `./index.html`, keep src glob, add `mdx`):

```js
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
],
```

- [ ] **Step 4: Update eslint.config.js (remove vite-specific plugin)**

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.next']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

- [ ] **Step 5: Install dependencies**

```bash
cd /Users/santhosh/Projects/finsight
npm install
```

Expected: installs `next`, removes `vite`/`react-router-dom` from node_modules.

- [ ] **Step 6: Commit**

```bash
git add package.json next.config.mjs tailwind.config.js eslint.config.js package-lock.json
git commit -m "chore: swap vite for next.js, drop react-router-dom"
```

---

## Task 2: Move CSS to App Directory

**Files:**
- Create: `src/app/globals.css`
- Delete: `src/index.css` (after copy)

- [ ] **Step 1: Copy index.css to app/globals.css**

```bash
cp /Users/santhosh/Projects/finsight/src/index.css /Users/santhosh/Projects/finsight/src/app/globals.css
```

- [ ] **Step 2: Delete src/index.css**

```bash
rm /Users/santhosh/Projects/finsight/src/index.css
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css src/index.css
git commit -m "chore: move globals css to app directory"
```

---

## Task 3: Update Firebase Env Vars

**Files:**
- Modify: `src/firebase/config.js`
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Update src/firebase/config.js**

Replace all `import.meta.env.VITE_` with `process.env.NEXT_PUBLIC_`:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
```

Note: `getAnalytics` is wrapped with `isSupported()` because Next.js runs server-side during build where browser APIs are unavailable.

- [ ] **Step 2: Rename keys in .env**

Rename every key in `.env` from `VITE_FIREBASE_*` to `NEXT_PUBLIC_FIREBASE_*`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=<your_value>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_value>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_value>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_value>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_value>
NEXT_PUBLIC_FIREBASE_APP_ID=<your_value>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your_value>
```

Keep all values unchanged — only rename the keys.

- [ ] **Step 3: Update .env.example**

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

- [ ] **Step 4: Commit**

```bash
git add src/firebase/config.js .env.example
git commit -m "chore: update firebase env vars from VITE_ to NEXT_PUBLIC_"
```

---

## Task 4: Add "use client" to All Contexts

**Files:**
- Modify: `src/contexts/AuthContext.jsx`
- Modify: `src/contexts/BudgetContext.jsx`
- Modify: `src/contexts/ExpenseContext.jsx`
- Modify: `src/contexts/GoalContext.jsx`
- Modify: `src/contexts/IncomeContext.jsx`
- Modify: `src/contexts/InvestmentContext.jsx`

- [ ] **Step 1: Update AuthContext.jsx**

Add `'use client'` as the very first line, and expose `loading` in the context value:

```jsx
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    register: authService.register,
    login: authService.login,
    logout: authService.logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
```

- [ ] **Step 2: Add "use client" to remaining context files**

Add `'use client'` as the very first line of each file (before any imports):
- `src/contexts/BudgetContext.jsx`
- `src/contexts/ExpenseContext.jsx`
- `src/contexts/GoalContext.jsx`
- `src/contexts/IncomeContext.jsx`
- `src/contexts/InvestmentContext.jsx`

No other changes needed in these files.

- [ ] **Step 3: Commit**

```bash
git add src/contexts/
git commit -m "chore: add use client directive to all context files"
```

---

## Task 5: Add "use client" to All UI Components

**Files:**
- Modify: all 9 files in `src/components/ui/`

- [ ] **Step 1: Add "use client" to each UI component**

Add `'use client'` as the very first line of each:
- `src/components/ui/AnimatedList.jsx`
- `src/components/ui/Badge.jsx`
- `src/components/ui/Button.jsx`
- `src/components/ui/Card.jsx`
- `src/components/ui/EmptyState.jsx`
- `src/components/ui/Input.jsx`
- `src/components/ui/PageHeader.jsx`
- `src/components/ui/Select.jsx`
- `src/components/ui/StatCard.jsx`

No other changes needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/
git commit -m "chore: add use client to all UI components"
```

---

## Task 6: Update Layout Components (React Router → Next.js Navigation)

**Files:**
- Modify: `src/components/layout/Layout.jsx`
- Modify: `src/components/layout/Sidebar.jsx`
- Modify: `src/components/layout/MobileNav.jsx`

- [ ] **Step 1: Rewrite Layout.jsx**

```jsx
'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { AnimatePresence, motion } from 'framer-motion';

export function Layout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="px-4 md:px-8 py-6 pb-28 md:pb-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite Sidebar.jsx**

Replace the `NavLink`/`useLocation` imports with `Link`/`usePathname`. Keep all styling identical.

```jsx
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
```

- [ ] **Step 3: Rewrite MobileNav.jsx**

```jsx
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-800/80 backdrop-blur-xl border-t border-white/[0.06] z-50 pb-safe">
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: replace react-router-dom with next/navigation in layout components"
```

---

## Task 7: Update Module Components

**Files:**
- Modify: `src/modules/auth/Login.jsx`
- Modify: `src/modules/dashboard/Dashboard.jsx`
- Modify: `src/modules/expenses/Expenses.jsx`
- Modify: `src/modules/income/Income.jsx`
- Modify: `src/modules/goals/Goals.jsx`
- Modify: `src/modules/investments/Investments.jsx`
- Modify: `src/modules/planner/Planner.jsx`

- [ ] **Step 1: Add "use client" to data module components**

Add `'use client'` as the very first line of:
- `src/modules/dashboard/Dashboard.jsx`
- `src/modules/expenses/Expenses.jsx`
- `src/modules/income/Income.jsx`
- `src/modules/goals/Goals.jsx`
- `src/modules/investments/Investments.jsx`
- `src/modules/planner/Planner.jsx`

No other changes needed in these files.

- [ ] **Step 2: Update Login.jsx**

Add `'use client'` at top, add `useEffect` import, add redirect-after-auth logic. The existing `handleSubmit` function and all JSX remain unchanged.

Add these lines at the top of the file (first line):
```jsx
'use client'
```

In the React import line, add `useEffect`:
```jsx
import React, { useState, useEffect } from 'react';
```

Add these two new imports after the existing imports:
```jsx
import { useRouter } from 'next/navigation';
```

Inside the `Login` function component, after the existing state declarations, add:
```jsx
const { login, register, currentUser } = useAuth();  // add currentUser
const router = useRouter();

useEffect(() => {
  if (currentUser) {
    router.push('/');
  }
}, [currentUser, router]);
```

The existing `const { login, register } = useAuth();` line must be replaced with the line above (adding `currentUser`).

- [ ] **Step 3: Commit**

```bash
git add src/modules/
git commit -m "feat: add use client to module components, add post-auth redirect in Login"
```

---

## Task 8: Create App Directory Structure

**Files:**
- Create: `src/app/providers.jsx`
- Create: `src/app/layout.jsx`
- Create: `src/app/(protected)/layout.jsx`
- Create: `src/app/(auth)/login/page.jsx`
- Create: `src/app/(protected)/page.jsx`
- Create: `src/app/(protected)/income/page.jsx`
- Create: `src/app/(protected)/expenses/page.jsx`
- Create: `src/app/(protected)/goals/page.jsx`
- Create: `src/app/(protected)/investments/page.jsx`
- Create: `src/app/(protected)/planner/page.jsx`

- [ ] **Step 1: Create src/app/providers.jsx**

```jsx
'use client'
import { AuthProvider } from '../contexts/AuthContext';
import { IncomeProvider } from '../contexts/IncomeContext';
import { ExpenseProvider } from '../contexts/ExpenseContext';
import { GoalProvider } from '../contexts/GoalContext';
import { InvestmentProvider } from '../contexts/InvestmentContext';
import { BudgetProvider } from '../contexts/BudgetContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <IncomeProvider>
        <ExpenseProvider>
          <GoalProvider>
            <InvestmentProvider>
              <BudgetProvider>
                {children}
              </BudgetProvider>
            </InvestmentProvider>
          </GoalProvider>
        </ExpenseProvider>
      </IncomeProvider>
    </AuthProvider>
  );
}
```

- [ ] **Step 2: Create src/app/layout.jsx**

```jsx
import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'FinSight',
  description: 'Personal Finance Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create src/app/(protected)/layout.jsx**

```jsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/layout/Layout';

export default function ProtectedLayout({ children }) {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <Layout>{children}</Layout>;
}
```

- [ ] **Step 4: Create src/app/(auth)/login/page.jsx**

```jsx
import { Login } from '../../../modules/auth/Login';

export default function LoginPage() {
  return <Login />;
}
```

- [ ] **Step 5: Create src/app/(protected)/page.jsx**

```jsx
import { Dashboard } from '../../modules/dashboard/Dashboard';

export default function DashboardPage() {
  return <Dashboard />;
}
```

- [ ] **Step 6: Create src/app/(protected)/income/page.jsx**

```jsx
import { Income } from '../../../modules/income/Income';

export default function IncomePage() {
  return <Income />;
}
```

- [ ] **Step 7: Create src/app/(protected)/expenses/page.jsx**

```jsx
import { Expenses } from '../../../modules/expenses/Expenses';

export default function ExpensesPage() {
  return <Expenses />;
}
```

- [ ] **Step 8: Create src/app/(protected)/goals/page.jsx**

```jsx
import { Goals } from '../../../modules/goals/Goals';

export default function GoalsPage() {
  return <Goals />;
}
```

- [ ] **Step 9: Create src/app/(protected)/investments/page.jsx**

```jsx
import { Investments } from '../../../modules/investments/Investments';

export default function InvestmentsPage() {
  return <Investments />;
}
```

- [ ] **Step 10: Create src/app/(protected)/planner/page.jsx**

```jsx
import { Planner } from '../../../modules/planner/Planner';

export default function PlannerPage() {
  return <Planner />;
}
```

- [ ] **Step 11: Commit**

```bash
git add src/app/
git commit -m "feat: add next.js app directory with route groups, providers, and page shells"
```

---

## Task 9: Delete Old Vite Files

**Files:** Delete the 5 Vite-specific files that no longer serve a purpose.

- [ ] **Step 1: Delete old entry files and Vite config**

```bash
rm /Users/santhosh/Projects/finsight/vite.config.js
rm /Users/santhosh/Projects/finsight/index.html
rm /Users/santhosh/Projects/finsight/src/App.jsx
rm /Users/santhosh/Projects/finsight/src/main.jsx
rm /Users/santhosh/Projects/finsight/src/App.css
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd /Users/santhosh/Projects/finsight && npm run dev
```

Expected output includes:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
✓ Ready
```

Open `http://localhost:3000` in browser. Expected: redirected to `/login`. After signing in, expected: dashboard loads with sidebar, all 6 nav links functional.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove vite entry files and config"
```

---

## Self-Review Checklist

- [x] All React Router imports (`NavLink`, `Link`, `useLocation`, `useNavigate`, `BrowserRouter`, `Routes`, `Route`, `Navigate`, `Outlet`) replaced or removed
- [x] All components using hooks marked `"use client"`
- [x] `VITE_` env prefix replaced with `NEXT_PUBLIC_` everywhere
- [x] Firebase Analytics guarded with `isSupported()` for SSR safety
- [x] Login redirect handled via `useEffect` watching `currentUser`
- [x] Protected layout redirects to `/login` when not authenticated
- [x] `src/index.css` → `src/app/globals.css` (Next.js requires CSS import in app/layout.jsx)
- [x] `tailwind.config.js` content paths updated (removed `index.html`)
- [x] Route groups `(auth)` and `(protected)` don't affect URLs
- [x] `App.css` (Vite boilerplate, not used by app) deleted
