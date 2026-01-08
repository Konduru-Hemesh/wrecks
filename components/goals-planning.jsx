/**
 * Goals & Future Planning
 * Track short and long-term financial goals with live progress
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useFinancial } from '@/lib/financialContext';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function GoalsPlanning() {
  const { financialState, addGoal, updateGoal, deleteGoal } = useFinancial();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    monthlyContribution: '',
    targetDate: '',
    priority: 'medium',
  });

  const handleAddGoal = (e) => {
    e.preventDefault();
    
    if (!goalForm.name || !goalForm.targetAmount || !goalForm.monthlyContribution || !goalForm.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addGoal({
      name: goalForm.name,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      monthlyContribution: parseFloat(goalForm.monthlyContribution),
      targetDate: goalForm.targetDate,
      priority: goalForm.priority,
    });

    toast.success('Goal added successfully!');
    setGoalForm({
      name: '',
      targetAmount: '',
      currentAmount: '',
      monthlyContribution: '',
      targetDate: '',
      priority: 'medium',
    });
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (goalId, goalName) => {
    deleteGoal(goalId);
    toast.success(`Deleted goal: ${goalName}`);
  };

  const calculateGoalProgress = (goal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsNeeded = Math.ceil(remaining / goal.monthlyContribution);
    
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const monthsRemaining = Math.max(0, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24 * 30)));
    
    const onTrack = monthsNeeded <= monthsRemaining;

    return {
      progress: Math.min(progress, 100),
      remaining,
      monthsNeeded,
      monthsRemaining,
      onTrack,
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-red-600';
      case 'medium':
        return 'from-amber-500 to-amber-600';
      case 'low':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Goals & Future Planning</h2>
          </div>
          <p className="text-muted-foreground">
            Track your progress and see how decisions affect your goals
          </p>
        </div>
        <Button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </motion.div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 glassmorphism border-2 border-green-500/30">
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Goal Name *</label>
                    <Input
                      placeholder="e.g., Vacation, Emergency Fund, New Laptop"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={goalForm.targetAmount}
                        onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                        className="pl-7"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={goalForm.currentAmount}
                        onChange={(e) => setGoalForm({ ...goalForm, currentAmount: e.target.value })}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Contribution *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={goalForm.monthlyContribution}
                        onChange={(e) => setGoalForm({ ...goalForm, monthlyContribution: e.target.value })}
                        className="pl-7"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Date *</label>
                    <Input
                      type="date"
                      value={goalForm.targetDate}
                      onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={goalForm.priority}
                      onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddGoal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-4">
        {financialState.goals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 glassmorphism text-center">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Setting financial goals helps you stay motivated and make better spending decisions
              </p>
              <Button
                onClick={() => setShowAddGoal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </Card>
          </motion.div>
        ) : (
          financialState.goals.map((goal, index) => {
            const stats = calculateGoalProgress(goal);
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 glassmorphism card-hover">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPriorityColor(goal.priority)} flex items-center justify-center flex-shrink-0`}>
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold">{goal.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              goal.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                              goal.priority === 'medium' ? 'bg-amber-500/20 text-amber-500' :
                              'bg-blue-500/20 text-blue-500'
                            }`}>
                              {goal.priority} priority
                            </span>
                            {stats.onTrack ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                On Track
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Needs Attention
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Target: ₹{goal.targetAmount.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              By: {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              ₹{goal.monthlyContribution.toLocaleString()}/month
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id, goal.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          ₹{goal.currentAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                        </span>
                        <span className="font-bold text-green-500">
                          {Math.round(stats.progress)}%
                        </span>
                      </div>
                      <Progress value={stats.progress} className="h-3" />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                        <p className="text-lg font-bold">₹{stats.remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Months Needed</p>
                        <p className="text-lg font-bold">{stats.monthsNeeded}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Time Left</p>
                        <p className="text-lg font-bold">{stats.monthsRemaining} months</p>
                      </div>
                    </div>

                    {/* Insight */}
                    {!stats.onTrack && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                        <p className="text-sm text-amber-600 dark:text-amber-400 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>
                            To reach this goal on time, consider increasing your monthly contribution to ₹
                            {Math.ceil(stats.remaining / stats.monthsRemaining).toLocaleString()} or extending your target date.
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
