'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  Sparkles,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  ShieldCheck,
  BarChart3,
  Zap,
  Wallet,
  Clock,
} from 'lucide-react';

/* ─── Floating widget definitions ─────────────────────────────────────────── */
const floatingWidgets = [
  {
    icon: TrendingUp,
    label: '₹2.4L saved',
    sub: 'this year',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
    position: { top: '18%', left: '5%' },
    delay: 0.6,
    duration: 5.5,
  },
  {
    icon: Sparkles,
    label: 'Smart insights',
    sub: 'AI powered',
    color: 'text-primary-400',
    border: 'border-primary-500/20',
    bg: 'bg-primary-500/8',
    position: { top: '52%', left: '3%' },
    delay: 1.0,
    duration: 6.5,
  },
  {
    icon: Target,
    label: '3 goals on track',
    sub: '92% progress',
    color: 'text-accent-400',
    border: 'border-accent-500/20',
    bg: 'bg-accent-500/8',
    position: { top: '76%', left: '7%' },
    delay: 1.4,
    duration: 7,
  },
  {
    icon: BarChart3,
    label: 'Portfolio +18%',
    sub: 'past 6 months',
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/8',
    position: { top: '30%', right: '5%' },
    delay: 0.8,
    duration: 6,
  },
  {
    icon: ShieldCheck,
    label: 'Budget safe',
    sub: '64% used',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/8',
    position: { top: '62%', right: '4%' },
    delay: 1.2,
    duration: 5,
  },
  {
    icon: PiggyBank,
    label: '₹8k / month',
    sub: 'savings target',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/8',
    position: { top: '82%', right: '8%' },
    delay: 1.6,
    duration: 6.8,
  },
  {
    icon: Wallet,
    label: 'Net worth ↑',
    sub: '₹4.2L total',
    color: 'text-primary-300',
    border: 'border-primary-500/20',
    bg: 'bg-primary-500/8',
    position: { top: '8%', right: '18%' },
    delay: 0.9,
    duration: 7.5,
  },
  {
    icon: Zap,
    label: 'Auto tracking',
    sub: 'real-time sync',
    color: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/8',
    position: { top: '88%', left: '28%' },
    delay: 1.7,
    duration: 5.8,
  },
  {
    icon: Clock,
    label: '5 min setup',
    sub: 'get started fast',
    color: 'text-slate-400',
    border: 'border-slate-500/20',
    bg: 'bg-slate-500/8',
    position: { top: '10%', left: '22%' },
    delay: 1.1,
    duration: 6.2,
  },
  {
    icon: TrendingDown,
    label: '₹12k expenses',
    sub: 'down 8% vs last mo',
    color: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/8',
    position: { top: '42%', right: '2%' },
    delay: 1.9,
    duration: 5.3,
  },
];

/* ─── Wiggle animation variants ───────────────────────────────────────────── */
function wiggleAnimation(duration = 6) {
  return {
    y: [0, -10, 4, -7, 0],
    x: [0, 4, -3, 2, 0],
    rotate: [0, 1.5, -1, 1, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatType: 'mirror',
    },
  };
}

/* ─── Single floating widget ──────────────────────────────────────────────── */
function FloatingWidget({ icon: Icon, label, sub, color, border, bg, position, delay, duration }) {
  return (
    <motion.div
      className={`absolute hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl
        backdrop-blur-md border ${border} ${bg} shadow-lg cursor-default select-none`}
      style={{ ...position, zIndex: 5 }}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{
        opacity: 0.85,
        scale: 1,
        y: [0, -10, 4, -7, 0],
        x: [0, 4, -3, 2, 0],
        rotate: [0, 1.5, -1, 1, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale:   { delay, duration: 0.6, type: 'spring', stiffness: 200 },
        y:       { delay, duration, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
        x:       { delay: delay + 0.3, duration: duration * 1.1, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
        rotate:  { delay: delay + 0.1, duration: duration * 0.9, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
      }}
      whileHover={{ opacity: 1, scale: 1.06, transition: { duration: 0.2 } }}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none mb-0.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-500 leading-none">{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ─── Cursor-reactive gradient ────────────────────────────────────────────── */
function CursorGradient() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.8 });

  const gradientX = useTransform(springX, [0, 1], ['0%', '100%']);
  const gradientY = useTransform(springY, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Primary cursor-following radial glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) =>
              `radial-gradient(700px circle at ${x * 100}% ${y * 100}%, rgba(99,102,241,0.13) 0%, rgba(139,92,246,0.07) 35%, transparent 65%)`
          ),
        }}
      />
      {/* Secondary softer glow offset */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) =>
              `radial-gradient(500px circle at ${(1 - x) * 100}% ${(1 - y) * 100}%, rgba(6,182,212,0.07) 0%, transparent 60%)`
          ),
        }}
      />
    </>
  );
}

/* ─── Main Login component ────────────────────────────────────────────────── */
export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: 14 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4 relative overflow-hidden">

      {/* ── Cursor-reactive gradient ── */}
      <CursorGradient />

      {/* ── Static ambient glows ── */}
      <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[10%]  w-[400px] h-[400px] bg-accent-500/6  rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%]  left-[40%]  w-[300px] h-[300px] bg-violet-500/5  rounded-full blur-3xl pointer-events-none" />

      {/* ── Floating wiggling widgets ── */}
      {floatingWidgets.map((widget, i) => (
        <FloatingWidget key={i} {...widget} />
      ))}

      {/* ── Login Card ── */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="gradient-border p-px">
          <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-2xl rounded-[calc(1rem-1px)] p-8">

            {/* Logo block */}
            <motion.div
              className="text-center mb-8"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 blur-xl opacity-40 -z-10" />
                </div>
              </motion.div>

              <motion.h1 variants={itemVariants} className="font-display text-3xl font-bold gradient-text mb-2">
                FinSight
              </motion.h1>
              <motion.p variants={itemVariants} className="text-slate-500 text-sm">
                {isLogin ? 'Welcome back — your finances await' : 'Create your smart finance account'}
              </motion.p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-3.5 rounded-xl overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Toggle */}
            <motion.div
              className="mt-6 text-center text-sm text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
