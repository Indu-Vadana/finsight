import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { useInvestment } from '../../contexts/InvestmentContext';
import { formatINR } from '../../utils/currency';
import { Plus, Trash2, TrendingUp, TrendingDown, Edit2, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = ['Stock', 'Mutual Fund', 'Crypto', 'Gold', 'FD', 'Other'];

const typeColors = {
  'Stock': 'primary',
  'Mutual Fund': 'accent',
  'Crypto': 'violet',
  'Gold': 'amber',
  'FD': 'emerald',
  'Other': 'slate',
};

export function Investments() {
  const { investments, addInvestment, updateInvestment, removeInvestment } = useInvestment();
  const [loading, setLoading] = useState(false);
  const [editingInv, setEditingInv] = useState(null);
  const [updateValue, setUpdateValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: TYPES[0],
    investedAmount: '',
    currentValue: '',
  });

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0);
  const totalProfitLoss = totalCurrent - totalInvested;
  const totalReturnPercent = totalInvested === 0 ? 0 : (totalProfitLoss / totalInvested) * 100;
  const isPositiveTotal = totalProfitLoss >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addInvestment({
        ...formData,
        investedAmount: Number(formData.investedAmount),
        currentValue: Number(formData.currentValue),
      });
      setFormData({ name: '', type: TYPES[0], investedAmount: '', currentValue: '' });
    } catch (error) {
      console.error('Failed to add investment', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateValue = async (e) => {
    e.preventDefault();
    if (!editingInv || !updateValue) return;
    setLoading(true);
    try {
      await updateInvestment(editingInv.id, { currentValue: Number(updateValue) });
      setEditingInv(null);
      setUpdateValue('');
    } catch (error) {
      console.error('Failed to update investment value', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Portfolio" subtitle="Track your investments and returns" />

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Invested"
          value={formatINR(totalInvested)}
          icon={PieChart}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          delay={0.05}
        />
        <StatCard
          label="Current Value"
          value={formatINR(totalCurrent)}
          icon={TrendingUp}
          iconColor="text-accent-400"
          iconBg="bg-accent-500/10"
          delay={0.1}
        />
        <StatCard
          label="Total Returns"
          value={`${isPositiveTotal ? '+' : ''}${formatINR(totalProfitLoss)}`}
          icon={isPositiveTotal ? TrendingUp : TrendingDown}
          iconColor={isPositiveTotal ? 'text-emerald-400' : 'text-rose-400'}
          iconBg={isPositiveTotal ? 'bg-emerald-500/10' : 'bg-rose-500/10'}
          valueColor={isPositiveTotal ? 'text-emerald-400' : 'text-rose-400'}
          trend={totalInvested > 0 ? { value: totalReturnPercent, label: 'overall return' } : undefined}
          delay={0.15}
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
              <h2 className="font-display text-base font-semibold text-white">Add Investment</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Investment Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apple Stock"
              />

              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>

              <Input
                label="Invested Amount (₹)"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.investedAmount}
                onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                placeholder="0.00"
              />

              <Input
                label="Current Value (₹)"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                placeholder="0.00"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add to Portfolio'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Portfolio Breakdown */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-1.5 bg-accent-500/15 rounded-lg">
                <TrendingUp className="w-4 h-4 text-accent-400" />
              </div>
              <h2 className="font-display text-base font-semibold text-white">Portfolio Breakdown</h2>
              {investments.length > 0 && (
                <Badge color="accent" className="ml-auto">{investments.length} holdings</Badge>
              )}
            </div>

            {investments.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No investments tracked"
                description="Add your first investment to build and track your portfolio."
              />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {investments.map((inv, i) => {
                    const profitLoss = inv.currentValue - inv.investedAmount;
                    const returnPercent = inv.investedAmount === 0 ? 0 : (profitLoss / inv.investedAmount) * 100;
                    const isPositive = profitLoss >= 0;

                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="glass-inset p-4 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-sm text-white truncate">{inv.name}</h3>
                              <Badge color={typeColors[inv.type] || 'slate'}>{inv.type}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-[11px] text-slate-600 font-medium">Invested</p>
                                <p className="text-sm font-semibold text-slate-300">{formatINR(inv.investedAmount)}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-slate-600 font-medium">Current Value</p>
                                <p className="text-sm font-bold text-white">{formatINR(inv.currentValue)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Returns + Actions */}
                          <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                            <div className="text-right">
                              <p className="text-[11px] text-slate-600 font-medium">Returns</p>
                              <p className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isPositive
                                  ? <TrendingUp className="w-3.5 h-3.5" />
                                  : <TrendingDown className="w-3.5 h-3.5" />}
                                {isPositive ? '+' : ''}{returnPercent.toFixed(2)}%
                              </p>
                              <p className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isPositive ? '+' : ''}{formatINR(profitLoss)}
                              </p>
                            </div>

                            <AnimatePresence mode="wait">
                              {editingInv?.id === inv.id ? (
                                <motion.form
                                  key="edit"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  onSubmit={handleUpdateValue}
                                  className="flex gap-1.5 items-center"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    type="number"
                                    min="0"
                                    required
                                    value={updateValue}
                                    onChange={(e) => setUpdateValue(e.target.value)}
                                    className="w-28 text-sm"
                                    placeholder="New val"
                                  />
                                  <Button type="submit" size="xs" disabled={loading}>Save</Button>
                                  <Button type="button" variant="ghost" size="xs" onClick={() => setEditingInv(null)}>✕</Button>
                                </motion.form>
                              ) : (
                                <motion.div key="btns" className="flex gap-1.5">
                                  <motion.button
                                    onClick={() => { setEditingInv(inv); setUpdateValue(String(inv.currentValue)); }}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                                    whileTap={{ scale: 0.9 }}
                                    title="Update current value"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => removeInvestment(inv.id)}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                    whileTap={{ scale: 0.9 }}
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
