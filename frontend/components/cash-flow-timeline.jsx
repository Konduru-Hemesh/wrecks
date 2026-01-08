/**
 * Cash Flow Timeline
 * Visual day-by-day projection of money flow with risk zones
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useFinancial } from '@/lib/financialContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function CashFlowTimeline() {
  const { financialState, projections, whatIfProjections, whatIfScenario } = useFinancial();

  const displayProjections = whatIfScenario ? whatIfProjections : projections;
  const hasRiskZones = displayProjections.some(p => p.isRiskZone);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-xl">
          <p className="text-sm font-semibold mb-2">Day {data.day}</p>
          <div className="space-y-1 text-xs">
            <p className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-bold gradient-title">₹{Math.round(data.balance).toLocaleString()}</span>
            </p>
            {data.income > 0 && (
              <p className="flex items-center justify-between gap-4">
                <span className="text-green-500">+ Income:</span>
                <span className="font-semibold text-green-500">₹{data.income.toLocaleString()}</span>
              </p>
            )}
            {data.fixedExpenses > 0 && (
              <p className="flex items-center justify-between gap-4">
                <span className="text-red-500">- Fixed:</span>
                <span className="font-semibold text-red-500">₹{data.fixedExpenses.toLocaleString()}</span>
              </p>
            )}
            {data.variableExpenses > 0 && (
              <p className="flex items-center justify-between gap-4">
                <span className="text-amber-500">- Variable:</span>
                <span className="font-semibold text-amber-500">₹{Math.round(data.variableExpenses).toLocaleString()}</span>
              </p>
            )}
            {data.hypotheticalSpend > 0 && (
              <p className="flex items-center justify-between gap-4">
                <span className="text-purple-500">- What-if:</span>
                <span className="font-semibold text-purple-500">₹{data.hypotheticalSpend.toLocaleString()}</span>
              </p>
            )}
            {data.isRiskZone && (
              <p className="text-red-500 font-semibold mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Risk Zone
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate statistics
  const minBalance = Math.min(...displayProjections.map(p => p.balance));
  const maxBalance = Math.max(...displayProjections.map(p => p.balance));
  const avgBalance = displayProjections.reduce((sum, p) => sum + p.balance, 0) / displayProjections.length;
  const trend = displayProjections[displayProjections.length - 1]?.balance > displayProjections[0]?.balance;

  return (
    <div className="space-y-6">
      {/* Title and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold mb-2">Cash Flow Timeline</h2>
          <p className="text-muted-foreground">
            Day-by-day projection of your balance
            {whatIfScenario && (
              <span className="ml-2 text-purple-500 font-medium">
                (What-If: ₹{whatIfScenario.amount.toLocaleString()})
              </span>
            )}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Min</p>
            <p className="text-lg font-bold">₹{Math.round(minBalance).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Avg</p>
            <p className="text-lg font-bold">₹{Math.round(avgBalance).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Max</p>
            <p className="text-lg font-bold">₹{Math.round(maxBalance).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 glassmorphism">
          <div className="space-y-4">
            {/* Trend Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {trend ? (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm font-medium text-green-500">Trending Up</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-sm font-medium text-red-500">Trending Down</span>
                  </>
                )}
              </div>

              {hasRiskZones && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500 font-medium">Risk zones detected</span>
                </div>
              )}
            </div>

            {/* Main Chart */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={displayProjections}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Emergency buffer line */}
                  <ReferenceLine
                    y={financialState.emergencyBuffer}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    label={{
                      value: "Emergency Buffer",
                      fill: "#f59e0b",
                      fontSize: 12,
                      position: "right",
                    }}
                  />

                  {/* Balance area */}
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    fill="url(#balanceGradient)"
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (payload.isRiskZone) {
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#ef4444"
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }
                      if (payload.income > 0) {
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill="#22c55e"
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }
                      if (payload.hypotheticalSpend > 0) {
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill="#a855f7"
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Income Injection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-muted-foreground">Risk Zone</span>
              </div>
              {whatIfScenario && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-muted-foreground">What-If Spend</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 border-t-2 border-dashed border-amber-500"></div>
                <span className="text-xs text-muted-foreground">Emergency Buffer</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
