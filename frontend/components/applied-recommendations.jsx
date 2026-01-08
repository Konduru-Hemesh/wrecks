/**
 * Applied Recommendations Display
 * Shows recommendations that have been applied and their impact
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useFinancial } from '@/lib/financialContext';
import { CheckCircle, TrendingUp, Target, Sparkles } from 'lucide-react';

export default function AppliedRecommendations() {
  const { appliedRecommendations } = useFinancial();

  if (!appliedRecommendations || appliedRecommendations.length === 0) {
    return null;
  }

  const totalPotentialSavings = appliedRecommendations.reduce(
    (sum, rec) => sum + (rec.impact?.balanceChange || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-6 glassmorphism border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Applied Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Track your progress on these financial improvements
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {appliedRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-border"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <h4 className="font-semibold">{rec.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  {rec.impact?.balanceChange > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-semibold">
                        Potential savings: ₹{Math.round(rec.impact.balanceChange).toLocaleString()}/month
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPotentialSavings > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Total Potential Monthly Savings</span>
              </div>
              <span className="text-2xl font-bold text-green-500">
                ₹{Math.round(totalPotentialSavings).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              That's ₹{Math.round(totalPotentialSavings * 12).toLocaleString()} per year! 🎉
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
