import React, { useMemo } from 'react';
import { useIncome } from '../../contexts/IncomeContext';
import { useExpense } from '../../contexts/ExpenseContext';
import { useGoal } from '../../contexts/GoalContext';
import { useInvestment } from '../../contexts/InvestmentContext';
import { useBudget } from '../../contexts/BudgetContext';
import { generateInsights } from '../../utils/insights';
import { formatINR } from '../../utils/currency';
import { TrendingUp, TrendingDown, Wallet, Lightbulb, AlertTriangle, Target, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

ChartJS.register(ArcElement, Tooltip, Legend);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

export function Dashboard() {
  const { incomes } = useIncome();
  const { expenses } = useExpense();
  const { goals } = useGoal();
  const { investments } = useInvestment();
  const { budgets } = useBudget();

  const insights = useMemo(() => generateInsights(incomes, expenses, goals), [incomes, expenses, goals]);

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0);
  const invProfitLoss = totalCurrentValue - totalInvested;
  const invReturnPercent = totalInvested === 0 ? 0 : (invProfitLoss / totalInvested) * 100;

  const currentMonthBudget = budgets[0]?.amount || 0;
  const budgetUsagePercent = currentMonthBudget === 0 ? 0 : (insights.totalExpense / currentMonthBudget) * 100;

  const expenseCategories = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date);
    const now = new Date();
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    }
    return acc;
  }, {});

  const chartColors = ['#818cf8', '#22d3ee', '#10b981', '#a78bfa', '#fb7185', '#fbbf24', '#34d399', '#6366f1'];

  const chartData = {
    labels: Object.keys(expenseCategories),
    datasets: [{
      data: Object.values(expenseCategories),
      backgroundColor: chartColors,
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const chartOptions = {
    cutout: '72%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { size: 12, family: 'Inter' }, boxWidth: 10, padding: 16 },
      },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 12,
      },
    },
  };

  const budgetBarColor = budgetUsagePercent >= 100 ? '#f43f5e' : budgetUsagePercent >= 80 ? '#f59e0b' : '#6366f1';

  return (
    <div className="page-container">
      <PageHeader
        title="Financial Overview"
        subtitle={`Welcome back — here's your money snapshot`}
      />

      {/* Smart Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-primary-500/20 bg-gradient-to-r from-primary-500/10 via-violet-500/5 to-transparent p-5">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-2.5 bg-primary-500/20 rounded-xl flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-primary-400 animate-pulse-slow" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">Smart Insight</p>
              <p className="text-slate-300 text-sm leading-relaxed">{insights.suggestion}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="Income This Month"
            value={formatINR(insights.totalIncome)}
            icon={TrendingUp}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10"
            valueColor="text-emerald-400"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Expenses This Month"
            value={formatINR(insights.totalExpense)}
            icon={TrendingDown}
            iconColor="text-rose-400"
            iconBg="bg-rose-500/10"
            valueColor="text-rose-400"
            trend={insights.expenseTrend !== 0 ? { value: insights.expenseTrend, label: 'vs last month' } : undefined}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            label="Net Savings"
            value={formatINR(insights.netSavings)}
            icon={Wallet}
            iconColor="text-primary-400"
            iconBg="bg-primary-500/10"
            valueColor={insights.netSavings >= 0 ? 'text-white' : 'text-rose-400'}
          />
        </motion.div>
      </motion.div>

      {/* Charts + Cards Row */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Expense Breakdown Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-base font-semibold text-white">Expense Breakdown</h3>
                <p className="text-xs text-slate-600 mt-0.5">Current month by category</p>
              </div>
              <Badge color="slate">This Month</Badge>
            </div>
            {Object.keys(expenseCategories).length > 0 ? (
              <div className="relative h-56 flex justify-center items-center">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-600 font-medium">Top</span>
                  <span className="text-sm font-bold text-white">{insights.highestCategory || '—'}</span>
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-slate-600 gap-2">
                <BarChart3 className="w-10 h-10 opacity-20" />
                <p className="text-sm">No expense data this month</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-5">
          {/* Budget Card */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-white">Monthly Budget</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentMonthBudget > 0
                    ? `${formatINR(insights.totalExpense)} of ${formatINR(currentMonthBudget)}`
                    : 'No budget set'}
                </p>
              </div>
              {budgetUsagePercent >= 80 && (
                <Badge color={budgetUsagePercent >= 100 ? 'rose' : 'amber'} dot>
                  {budgetUsagePercent >= 100 ? 'Exceeded' : 'Warning'}
                </Badge>
              )}
            </div>

            {currentMonthBudget > 0 ? (
              <>
                <div className="progress-track h-2.5 mb-3">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: budgetBarColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{budgetUsagePercent.toFixed(1)}% used</span>
                  <span className="text-slate-600">{formatINR(Math.max(0, currentMonthBudget - insights.totalExpense))} left</span>
                </div>
                {budgetUsagePercent >= 80 && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {budgetUsagePercent >= 100 ? 'Budget limit exceeded!' : `${budgetUsagePercent.toFixed(0)}% of budget used`}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-600">Set a budget in the Expenses section.</p>
            )}
          </Card>

          {/* Investments Summary */}
          <Card className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white">Portfolio</h3>
              <Badge color={invProfitLoss >= 0 ? 'emerald' : 'rose'}>
                {invProfitLoss >= 0 ? '+' : ''}{invReturnPercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Invested</span>
                <span className="text-sm font-medium text-slate-300">{formatINR(totalInvested)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Current Value</span>
                <span className="text-sm font-bold text-white">{formatINR(totalCurrentValue)}</span>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">P&L</span>
                <span className={`text-sm font-bold ${invProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {invProfitLoss >= 0 ? '+' : ''}{formatINR(invProfitLoss)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Goals Summary */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-primary-400" />
              <h3 className="font-display text-base font-semibold text-white">Active Goals</h3>
              <Badge color="primary" className="ml-auto">{goals.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.slice(0, 3).map((goal) => {
                const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                return (
                  <div key={goal.id} className="glass-inset p-4">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm font-semibold text-slate-200 truncate">{goal.name}</p>
                      <span className="text-xs font-bold text-primary-400 ml-2 flex-shrink-0">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="progress-track h-1.5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.9, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{formatINR(goal.savedAmount)} / {formatINR(goal.targetAmount)}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
