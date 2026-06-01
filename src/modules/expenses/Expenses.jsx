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
import { useExpense } from '../../contexts/ExpenseContext';
import { useBudget } from '../../contexts/BudgetContext';
import { formatINR } from '../../utils/currency';
import { Plus, Trash2, ReceiptText, Target, AlertTriangle, TrendingDown, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Education', 'Entertainment', 'Others'];

const categoryColors = {
  Food: 'amber', Travel: 'accent', Bills: 'rose', Shopping: 'violet',
  Health: 'emerald', Education: 'primary', Entertainment: 'violet', Others: 'slate',
};

export function Expenses() {
  const { expenses, addExpense, removeExpense } = useExpense();
  const { budgets, addBudget, updateBudget } = useBudget();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isSettingBudget, setIsSettingBudget] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const currentBudget = budgets[0];
  const budgetUsagePercent = currentBudget?.amount ? (currentMonthTotal / currentBudget.amount) * 100 : 0;
  const budgetBarColor = budgetUsagePercent >= 100 ? '#f43f5e' : budgetUsagePercent >= 80 ? '#f59e0b' : '#6366f1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense({ ...formData, amount: Number(formData.amount) });
      setFormData({ ...formData, amount: '', note: '' });
    } catch (error) {
      console.error('Failed to add expense', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetAmount) return;
    setLoading(true);
    try {
      if (currentBudget) {
        await updateBudget(currentBudget.id, { amount: Number(budgetAmount) });
      } else {
        await addBudget({ amount: Number(budgetAmount) });
      }
      setIsSettingBudget(false);
      setBudgetAmount('');
    } catch (error) {
      console.error('Failed to set budget', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Expenses" subtitle="Track spending and manage your budget" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Spent This Month"
          value={formatINR(currentMonthTotal)}
          icon={TrendingDown}
          iconColor="text-rose-400"
          iconBg="bg-rose-500/10"
          valueColor="text-rose-400"
          delay={0.05}
        />
        <StatCard
          label="Monthly Budget"
          value={currentBudget ? formatINR(currentBudget.amount) : 'Not Set'}
          icon={Target}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          delay={0.12}
        />
      </div>

      {/* Budget Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary-500/15 rounded-lg">
                <Target className="w-4 h-4 text-primary-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Monthly Budget</h2>
            </div>
            {!isSettingBudget && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsSettingBudget(true)}
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                {currentBudget ? 'Edit' : 'Set Budget'}
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isSettingBudget ? (
              <motion.form
                key="budget-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleBudgetSubmit}
                className="flex gap-3 items-end overflow-hidden"
              >
                <div className="flex-1">
                  <Input
                    label="Budget Amount (₹)"
                    type="number"
                    min="0"
                    required
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </div>
                <Button type="submit" disabled={loading} size="sm">Save</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsSettingBudget(false)}>Cancel</Button>
              </motion.form>
            ) : currentBudget ? (
              <motion.div
                key="budget-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Spent: <span className="text-slate-300 font-semibold">{formatINR(currentMonthTotal)}</span></span>
                  <span>Budget: <span className="text-slate-300 font-semibold">{formatINR(currentBudget.amount)}</span></span>
                </div>
                <div className="progress-track h-3 mb-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: budgetBarColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
                {budgetUsagePercent >= 80 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xs font-medium mt-2 ${budgetUsagePercent >= 100 ? 'text-rose-400' : 'text-amber-400'}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {budgetUsagePercent >= 100
                      ? 'Budget exceeded! You\'ve overspent this month.'
                      : `Warning: ${budgetUsagePercent.toFixed(1)}% of budget used.`}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.p key="budget-empty" className="text-sm text-slate-600">
                No budget set. Click "Set Budget" to track your spending limits.
              </motion.p>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-rose-500/15 rounded-lg">
                <Plus className="w-4 h-4 text-rose-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Add Expense</h2>
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

              <Input
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <Input
                label="Note (Optional)"
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="What was this for?"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Entries */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-rose-500/15 rounded-lg">
                <ReceiptText className="w-4 h-4 text-rose-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Recent Expenses</h2>
              {expenses.length > 0 && (
                <Badge color="rose" className="ml-auto">{expenses.length} total</Badge>
              )}
            </div>

            {expenses.length === 0 ? (
              <EmptyState
                icon={ReceiptText}
                title="No expenses recorded"
                description="Add your first expense entry to start tracking your spending."
              />
            ) : (
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Date', 'Category', 'Note', 'Amount', ''].map((h) => (
                        <th key={h} className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <AnimatePresence initial={false}>
                    <tbody>
                      {expenses.map((expense, i) => (
                        <motion.tr
                          key={expense.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.25, delay: i * 0.03 }}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-3 px-3 text-xs text-slate-500">
                            {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="py-3 px-3">
                            <Badge color={categoryColors[expense.category] || 'slate'}>
                              {expense.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-500 max-w-[120px] truncate">{expense.note || '—'}</td>
                          <td className="py-3 px-3 text-right text-sm font-bold text-rose-400">
                            -{formatINR(expense.amount)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <motion.button
                              onClick={() => removeExpense(expense.id)}
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
