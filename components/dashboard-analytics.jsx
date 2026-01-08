"use client";

import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/lib/financialContext";

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f97316", "#ef4444", "#a78bfa"];

export default function DashboardAnalytics() {
  const { financialState, projections, simulateWhatIf, whatIfProjections, riskScore, recommendations } = useFinancial();
  const [spendAmount, setSpendAmount] = useState(0);
  const [impact, setImpact] = useState(null);

  const lineData = useMemo(() => {
    return projections.map((p) => ({ date: p.date, balance: p.balance }));
  }, [projections]);

  const pieData = useMemo(() => {
    const vars = financialState.variableExpenses || [];
    return vars.map((v) => ({ name: v.name, value: v.amount }));
  }, [financialState.variableExpenses]);

  const barData = useMemo(() => {
    const fixed = financialState.fixedExpenses || [];
    return fixed.map((f) => ({ name: f.name, amount: f.amount }));
  }, [financialState.fixedExpenses]);

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
        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Spending Breakdown</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} fill="#8884d8">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6">
          <h4 className="text-md font-semibold mb-4">Fixed Expenses</h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
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
