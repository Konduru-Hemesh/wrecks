"use client";

import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/lib/financialContext";
import { useTransactions } from "@/lib/useTransactions";

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f97316", "#ef4444", "#a78bfa"];

const CATEGORY_COLORS = {
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

export default function DashboardAnalytics() {
  const { financialState, projections, simulateWhatIf, whatIfProjections, riskScore, recommendations } = useFinancial();
  const { transactions, categoryTotals, getCurrentMonthTransactions } = useTransactions();
  const [spendAmount, setSpendAmount] = useState(0);
  const [impact, setImpact] = useState(null);

  // Cash flow projection data
  const lineData = useMemo(() => {
    return projections.map((p) => ({ 
      date: p.date, 
      balance: p.balance,
      day: p.day 
    }));
  }, [projections]);

  // Spending trend over time (based on actual transactions)
  const spendingTrendData = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions();
    // Group by date
    const dailySpending = {};
    currentMonthTransactions.forEach(transaction => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      dailySpending[date] = (dailySpending[date] || 0) + transaction.amount;
    });
    
    // Convert to array and sort by date
    return Object.entries(dailySpending)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: amount,
        fullDate: date,
      }))
      .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  }, [transactions, getCurrentMonthTransactions]);

  // Use real transaction data for pie chart
  const pieData = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions();
    const categoryTotals = currentMonthTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'other-expense';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
      value: amount,
      fill: CATEGORY_COLORS[category] || '#6b7280',
    }));
  }, [transactions, getCurrentMonthTransactions]);

  // Use real transaction data for bar chart (grouped by category)
  const barData = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions();
    const categoryTotals = currentMonthTransactions.reduce((acc, transaction) => {
      const category = transaction.category || 'other-expense';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
        amount: amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, getCurrentMonthTransactions]);

  const onSeeImpact = async () => {
    const amt = parseFloat(spendAmount) || 0;
    if (amt <= 0) return;
    const result = simulateWhatIf({ amount: amt, day: 0, duration: 30 });
    // simulateWhatIf updates context and returns impact/result
    if (result && result.impact) setImpact(result.impact);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="glassmorphism rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Cash Flow Projection (30 days)</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#06b6d4" strokeWidth={3} dot={false} />
                  {whatIfProjections && whatIfProjections.length > 0 && (
                    <Line type="monotone" dataKey={(d, idx) => (whatIfProjections[idx] ? whatIfProjections[idx].balance : null)} stroke="#fb7185" strokeWidth={2} dot={false} name="With hypothetical spend" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <div className="glassmorphism rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">Quick What-If</h3>
            <div>
              <label className="text-sm text-muted-foreground">Amount</label>
              <div className="mt-2 flex gap-2">
                <Input type="number" value={spendAmount} onChange={(e) => setSpendAmount(e.target.value)} className="pl-3" />
                <Button onClick={onSeeImpact}>See Impact</Button>
              </div>
            </div>

            {impact && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-medium">Impact Summary</div>
                <div>Balance change: ₹{Math.abs(Math.round(impact.balanceChange)).toLocaleString()}</div>
                <div>Month-end balance: ₹{Math.round(impact.monthEndBalance).toLocaleString()}</div>
                <div>Risk score change: {impact.baselineRiskScore} → {impact.whatIfRiskScore}</div>
                <div className="mt-2 text-xs">{impact.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spending Trend Over Time */}
        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Daily Spending Trend</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              {spendingTrendData.length > 0 ? (
                <LineChart data={spendingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Spending"
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No spending data yet
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Spending by Category</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              {pieData.length > 0 ? (
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} fill="#8884d8">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No category data yet
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Expenses by Category</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Recommendations</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            {recommendations && recommendations.slice(0, 4).map((r) => (
              <li key={r.id}>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs">{r.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
