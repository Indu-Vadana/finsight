'use client';
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { useGoal } from '../../contexts/GoalContext';
import { formatINR } from '../../utils/currency';
import { Plus, Trash2, Target, Edit2, CheckCircle2, Clock, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Goals() {
  const { goals, addGoal, updateGoal, removeGoal } = useGoal();
  const [loading, setLoading] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [updateAmount, setUpdateAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    deadline: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGoal({
        ...formData,
        targetAmount: Number(formData.targetAmount),
        savedAmount: Number(formData.savedAmount || 0),
      });
      setFormData({ name: '', targetAmount: '', savedAmount: '', deadline: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Failed to add goal', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!editingGoal || !updateAmount) return;
    setLoading(true);
    try {
      const newSavedAmount = Number(editingGoal.savedAmount) + Number(updateAmount);
      await updateGoal(editingGoal.id, { savedAmount: newSavedAmount });
      setEditingGoal(null);
      setUpdateAmount('');
    } catch (error) {
      console.error('Failed to update goal', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Savings Goals"
        subtitle="Set targets and track your progress"
      />

      {/* Stats Row */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Target className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Active</p>
                <p className="text-lg font-bold font-display text-white">{goals.length - completedGoals}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Completed</p>
                <p className="text-lg font-bold font-display text-emerald-400">{completedGoals}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Total Saved</p>
                <p className="text-lg font-bold font-display text-white">
                  {formatINR(goals.reduce((s, g) => s + Number(g.savedAmount), 0))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
              <h2 className="font-display text-base font-semibold text-white">New Goal</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Goal Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Emergency Fund"
              />
              <Input
                label="Target Amount (₹)"
                type="number"
                min="0"
                required
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                placeholder="0.00"
              />
              <Input
                label="Already Saved (₹)"
                type="number"
                min="0"
                value={formData.savedAmount}
                onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                placeholder="0.00 (optional)"
              />
              <Input
                label="Deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Goals Grid */}
        <div className="lg:col-span-2">
          {goals.length === 0 ? (
            <Card className="h-full">
              <EmptyState
                icon={Target}
                title="No goals yet"
                description="Create your first savings goal to start building wealth systematically."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {goals.map((goal, i) => {
                  const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
                  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
                  const daysLeft = calculateDaysLeft(goal.deadline);
                  const isCompleted = progress >= 100;

                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                    >
                      <Card className={`flex flex-col h-full ${isCompleted ? 'border-emerald-500/20' : ''}`}>
                        {/* Goal Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isCompleted && <Trophy className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                              <h3 className="text-sm font-bold text-white truncate">{goal.name}</h3>
                            </div>
                            <p className="text-xs text-slate-600">{formatINR(goal.targetAmount)} target</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Badge color={isCompleted ? 'emerald' : 'primary'}>
                              {progress.toFixed(0)}%
                            </Badge>
                            <motion.button
                              onClick={() => removeGoal(goal.id)}
                              className="text-slate-600 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-all"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="progress-track h-2 mb-2">
                            <motion.div
                              className={`h-full rounded-full ${isCompleted
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                : 'bg-gradient-to-r from-primary-500 to-violet-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>{formatINR(goal.savedAmount)} saved</span>
                            <span>{formatINR(remaining)} left</span>
                          </div>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-3 mb-4 flex-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Deadline passed'}</span>
                          </div>
                        </div>

                        {/* Update Progress */}
                        <AnimatePresence mode="wait">
                          {editingGoal?.id === goal.id ? (
                            <motion.form
                              key="edit-form"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              onSubmit={handleUpdateProgress}
                              className="flex gap-2 mt-auto"
                            >
                              <Input
                                type="number"
                                min="0"
                                required
                                value={updateAmount}
                                onChange={(e) => setUpdateAmount(e.target.value)}
                                placeholder="Add amount"
                              />
                              <Button type="submit" size="sm" disabled={loading}>Save</Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setEditingGoal(null)}>✕</Button>
                            </motion.form>
                          ) : (
                            <motion.div key="edit-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <Button
                                variant={isCompleted ? 'secondary' : 'secondary'}
                                className="w-full mt-auto"
                                onClick={() => setEditingGoal(goal)}
                                disabled={isCompleted}
                                size="sm"
                              >
                                {isCompleted ? (
                                  <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Goal Achieved!</>
                                ) : (
                                  <><Edit2 className="w-3.5 h-3.5 mr-1.5" />Add Progress</>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
