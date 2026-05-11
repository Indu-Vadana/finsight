import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/ui/PageHeader';
import { formatINR } from '../../utils/currency';
import { Calculator, Calendar, Clock, PiggyBank, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Planner() {
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const calculations = useMemo(() => {
    if (!targetAmount || !targetDate) return null;
    const amount = Number(targetAmount);
    if (isNaN(amount) || amount <= 0) return null;

    const today = new Date();
    const target = new Date(targetDate);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return { error: 'Target date must be in the future' };

    const diffMonths =
      (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
    const adjustedMonths = diffMonths > 0 ? diffMonths : 1;

    return {
      days: diffDays,
      months: adjustedMonths,
      daily: amount / diffDays,
      monthly: amount / adjustedMonths,
    };
  }, [targetAmount, targetDate]);

  const resultStats = calculations && !calculations.error
    ? [
        { label: 'Days Left', value: `${calculations.days}`, icon: Calendar, color: 'text-primary-400', bg: 'bg-primary-500/10' },
        { label: 'Months Left', value: `${calculations.months}`, icon: Clock, color: 'text-accent-400', bg: 'bg-accent-500/10' },
      ]
    : [];

  return (
    <div className="page-container">
      <PageHeader
        title="Financial Planner"
        subtitle="Calculate how much you need to save to reach your target"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-primary-500/15 rounded-xl">
                <Calculator className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">Plan Your Savings</h2>
                <p className="text-xs text-slate-600">Enter your goal details below</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Input
                  label="Target Amount (₹)"
                  type="number"
                  min="0"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="How much do you want to save?"
                />
                {targetAmount && Number(targetAmount) > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs text-slate-600"
                  >
                    Target: <span className="text-primary-400 font-semibold">{formatINR(Number(targetAmount))}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <Input
                  label="Target Date"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Hint */}
              {(!targetAmount || !targetDate) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2.5 p-4 glass-inset"
                >
                  <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Fill in both fields to see your personalized savings plan — broken down by month and by day.
                  </p>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 bg-accent-500/15 rounded-xl">
                <PiggyBank className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">Your Savings Plan</h2>
                <p className="text-xs text-slate-600">Personalized breakdown</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!calculations ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex flex-col items-center justify-center h-52 text-center gap-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-xl scale-150" />
                    <div className="relative p-4 rounded-2xl bg-dark-700/60 border border-white/[0.06]">
                      <Calculator className="w-8 h-8 text-slate-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 max-w-[180px]">
                    Enter your target amount and date to see the plan
                  </p>
                </motion.div>
              ) : calculations.error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{calculations.error}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Time Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {resultStats.map((stat) => (
                      <div key={stat.label} className="glass-inset p-4 text-center">
                        <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-slate-600 font-medium mb-1">{stat.label}</p>
                        <p className="font-display text-xl font-bold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Monthly Savings */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/15 to-violet-500/10 border border-primary-500/20">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Save per month</p>
                    <motion.p
                      key={calculations.monthly}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-3xl font-bold text-white mb-1"
                    >
                      {formatINR(calculations.monthly)}
                    </motion.p>
                    <p className="text-xs text-slate-600">to reach your goal by the target date</p>
                  </div>

                  {/* Daily Savings */}
                  <div className="p-4 rounded-xl glass-inset">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 font-medium mb-1">Daily savings needed</p>
                        <motion.p
                          key={calculations.daily}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-display text-xl font-bold text-primary-400"
                        >
                          {formatINR(calculations.daily)}
                        </motion.p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 font-medium mb-1">Total target</p>
                        <p className="font-display text-xl font-bold text-slate-300">{formatINR(Number(targetAmount))}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
