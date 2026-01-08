'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useFinancial } from '@/lib/financialContext';
import { useTransactions } from '@/lib/useTransactions';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Home, UtensilsCrossed } from 'lucide-react';

const COLORS = {
  housing: '#3b82f6',
  utilities: '#10b981',
  insurance: '#f59e0b',
  bills: '#ef4444',
  groceries: '#8b5cf6',
  transportation: '#06b6d4',
  entertainment: '#ec4899',
  food: '#f97316',
  shopping: '#6366f1',
  healthcare: '#ef4444',
  education: '#fbbf24',
  personal: '#6b7280',
  travel: '#14b8a6',
  gifts: '#f43f5e',
  'other-expense': '#6b7280',
  other: '#6b7280',
};

export default function EnhancedAnalytics() {
  const { financialState, projections, whatIfScenario } = useFinancial();
  const { transactions, categoryTotals, totalSpending, getCurrentMonthTransactions } = useTransactions();

  // Use real transaction data instead of mock data
  const currentMonthTransactions = getCurrentMonthTransactions();
  const actualTotalSpending = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Prepare expense category data from real transactions
  const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
    value: amount,
    category: category,
    type: 'Transaction',
  }));

  // Add What-If expense if exists
  if (whatIfScenario && whatIfScenario.amount && whatIfScenario.category) {
    categoryData.push({
      name: `What-If: ${whatIfScenario.category.charAt(0).toUpperCase() + whatIfScenario.category.slice(1)}`,
      value: whatIfScenario.amount,
      category: whatIfScenario.category,
      type: 'What-If',
    });
  }

  // Merge category totals with what-if if exists
  const mergedCategoryTotals = { ...categoryTotals };
  if (whatIfScenario && whatIfScenario.amount && whatIfScenario.category) {
    mergedCategoryTotals[whatIfScenario.category] = 
      (mergedCategoryTotals[whatIfScenario.category] || 0) + whatIfScenario.amount;
  }

  const pieChartData = Object.entries(mergedCategoryTotals).map(([category, value]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: Math.round(value),
    fill: COLORS[category] || '#6b7280',
  }));

  // Income vs Expenses comparison (using actual spending)
  const incomeVsExpenses = [
    {
      name: 'Income',
      amount: financialState.monthlyIncome,
      type: 'income',
    },
    {
      name: 'Expenses',
      amount: actualTotalSpending || 0,
      type: 'expense',
    },
    {
      name: 'Savings',
      amount: financialState.monthlyIncome - (actualTotalSpending || 0),
      type: 'savings',
    },
  ];

  // Monthly trend data (using projections)
  const monthlyTrend = projections.map((proj, index) => ({
    day: `Day ${proj.day}`,
    balance: Math.round(proj.balance),
    income: proj.income,
    expenses: Math.round(proj.fixedExpenses + proj.variableExpenses),
  }));

  // Fixed vs Variable expenses (using actual transactions)
  // Categorize transactions as fixed or variable based on category
  const fixedCategories = ['housing', 'utilities', 'insurance', 'bills'];
  const fixedTotal = currentMonthTransactions
    .filter(t => fixedCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const variableTotal = currentMonthTransactions
    .filter(t => !fixedCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseTypeData = [
    { name: 'Fixed Expenses', value: Math.round(fixedTotal), color: '#3b82f6' },
    { name: 'Variable Expenses', value: Math.round(variableTotal), color: '#10b981' },
  ];

  // Top expenses (including what-if if exists)
  const totalExpensesForPercentage = whatIfScenario && whatIfScenario.amount 
    ? (actualTotalSpending || 0) + whatIfScenario.amount 
    : (actualTotalSpending || 0);
  
  const topExpenses = [...categoryData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      amount: Math.round(item.value),
      percentage: totalExpensesForPercentage > 0 ? ((item.value / totalExpensesForPercentage) * 100).toFixed(1) : '0',
      type: item.type,
    }));

  const savingsRate = financialState.monthlyIncome > 0 
    ? ((financialState.monthlyIncome - (actualTotalSpending || 0)) / financialState.monthlyIncome * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{financialState.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{(actualTotalSpending || 0).toLocaleString()}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className={`text-2xl font-bold ${
                financialState.monthlyIncome - (actualTotalSpending || 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                ₹{Math.abs(financialState.monthlyIncome - (actualTotalSpending || 0)).toLocaleString()}
              </p>
            </div>
            {financialState.monthlyIncome - (actualTotalSpending || 0) >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className={`text-2xl font-bold ${
                parseFloat(savingsRate) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {savingsRate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Income vs Expenses Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount">
                  {incomeVsExpenses.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.type === 'income' ? '#10b981' :
                        entry.type === 'expense' ? '#ef4444' :
                        '#3b82f6'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Monthly Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">30-Day Balance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Fixed vs Variable Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fixed vs Variable Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="value" fill="#3b82f6">
                  {expenseTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Top Expenses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top 5 Expenses</h3>
          <div className="space-y-3">
            {topExpenses.map((expense, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  expense.type === 'What-If' 
                    ? 'bg-purple-500/10 border border-purple-500/30' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    expense.type === 'What-If'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-teal-500 to-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.percentage}% of total expenses
                      {expense.type === 'What-If' && (
                        <span className="ml-2 text-purple-500 font-medium">(Simulated)</span>
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold">₹{expense.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
