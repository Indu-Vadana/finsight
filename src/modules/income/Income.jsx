'use client';
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { useIncome } from '../../contexts/IncomeContext';
import { formatINR } from '../../utils/currency';
import { Plus, Trash2, Wallet, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Salary', 'Freelance', 'Hustle', 'Part-time', 'Business', 'Other'];
const MODES = ['Cash', 'UPI', 'Bank Transfer', 'Online'];

const categoryColors = {
  Salary: 'emerald', Freelance: 'primary', Hustle: 'violet',
  'Part-time': 'accent', Business: 'amber', Other: 'slate',
};

export function Income() {
  const { incomes, addIncome, removeIncome } = useIncome();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    mode: MODES[0],
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthIncomes = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const currentMonthTotal = currentMonthIncomes.reduce((sum, item) => sum + Number(item.amount), 0);

  const prevMonthTotal = incomes
    .filter((i) => {
      const d = new Date(i.date);
      const prev = currentMonth === 0 ? 11 : currentMonth - 1;
      const yr = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getMonth() === prev && d.getFullYear() === yr;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const trend = prevMonthTotal > 0
    ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addIncome({ ...formData, amount: Number(formData.amount) });
      setFormData({ ...formData, amount: '' });
    } catch (error) {
      console.error('Failed to add income', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Income" subtitle="Track and manage your earnings" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="This Month's Income"
          value={formatINR(currentMonthTotal)}
          icon={Wallet}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          valueColor="text-emerald-400"
          trend={trend !== null ? { value: trend, label: 'vs last month' } : undefined}
          delay={0.05}
        />
        <StatCard
          label="Total Entries"
          value={incomes.length}
          icon={ArrowUpRight}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          delay={0.12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-primary-500/15 rounded-lg">
                <Plus className="w-4 h-4 text-primary-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Add Income</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Amount (₹)"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />

              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>

              <Select
                label="Mode"
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                {MODES.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </Select>

              <Input
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <Button type="submit" className="w-full" disabled={loading} size="md">
                {loading ? 'Adding...' : 'Add Income Entry'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Entries List */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-emerald-500/15 rounded-lg">
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Recent Entries</h2>
              {incomes.length > 0 && (
                <Badge color="emerald" className="ml-auto">{incomes.length} total</Badge>
              )}
            </div>

            {incomes.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="No income entries yet"
                description="Add your first income entry to start tracking your earnings."
              />
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Date', 'Category', 'Mode', 'Amount', ''].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <AnimatePresence initial={false}>
                    <tbody>
                      {incomes.map((income, i) => (
                        <motion.tr
                          key={income.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12, height: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-3 px-3 text-xs text-slate-500">
                            {new Date(income.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="py-3 px-3">
                            <Badge color={categoryColors[income.category] || 'slate'}>
                              {income.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-500">{income.mode}</td>
                          <td className="py-3 px-3 text-right text-sm font-bold text-emerald-400">
                            +{formatINR(income.amount)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <motion.button
                              onClick={() => removeIncome(income.id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all p-1 rounded-lg hover:bg-rose-500/10"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </AnimatePresence>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
