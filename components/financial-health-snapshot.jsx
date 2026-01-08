/**
 * Financial Health Snapshot
 * Top section showing real-time financial health indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useFinancial } from '@/lib/financialContext';

export default function FinancialHealthSnapshot() {
  const { financialState, projections, riskScore, stressLevel } = useFinancial();

  const monthEndBalance = projections[projections.length - 1]?.balance || financialState.currentBalance;
  const balanceChange = monthEndBalance - financialState.currentBalance;
  const percentChange = ((balanceChange / financialState.currentBalance) * 100).toFixed(1);

  // Calculate buffer status
  const bufferPercentage = (financialState.currentBalance / financialState.emergencyBuffer) * 100;
  const bufferStatus = bufferPercentage >= 150 ? 'excellent' : bufferPercentage >= 100 ? 'good' : bufferPercentage >= 50 ? 'low' : 'critical';

  const getStressColor = () => {
    switch (stressLevel?.level) {
      case 'low':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'moderate':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'elevated':
        return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'high':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30';
      default:
        return 'from-gray-500/20 to-gray-500/20 border-gray-500/30';
    }
  };

  const getStressIcon = () => {
    switch (stressLevel?.level) {
      case 'low':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'moderate':
        return <Shield className="w-6 h-6 text-blue-500" />;
      case 'elevated':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case 'high':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Shield className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">Financial Health Snapshot</h2>
        <p className="text-muted-foreground">
          Live view of your current financial state
        </p>
      </motion.div>

      {/* Main Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 glassmorphism card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </p>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">₹</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-title">
                  ₹{financialState.currentBalance.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Today</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Month-End Projected Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 glassmorphism card-hover border-2 border-teal-500/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Month-End Projected
                </p>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center animate-pulse-glow">
                  {balanceChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-white" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-title">
                  ₹{Math.round(monthEndBalance).toLocaleString()}
                </p>
                <p className={`text-sm font-medium mt-1 ${balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {balanceChange >= 0 ? '+' : ''}₹{Math.abs(Math.round(balanceChange)).toLocaleString()} ({percentChange}%)
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Emergency Buffer Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 glassmorphism card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Emergency Buffer
                </p>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  bufferStatus === 'excellent' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  bufferStatus === 'good' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  bufferStatus === 'low' ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                  'bg-gradient-to-br from-red-500 to-red-600'
                }`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {Math.round(bufferPercentage)}%
                </p>
                <p className={`text-sm font-medium mt-1 ${
                  bufferStatus === 'excellent' ? 'text-green-500' :
                  bufferStatus === 'good' ? 'text-blue-500' :
                  bufferStatus === 'low' ? 'text-amber-500' :
                  'text-red-500'
                }`}>
                  {bufferStatus === 'excellent' ? 'Excellent' :
                   bufferStatus === 'good' ? 'Healthy' :
                   bufferStatus === 'low' ? 'Low' : 'Critical'} 
                  {' '}(₹{financialState.emergencyBuffer.toLocaleString()} target)
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Financial Stress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`p-6 glassmorphism card-hover border-2 bg-gradient-to-br ${getStressColor()}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Financial Stress
                </p>
                <div className="w-10 h-10 rounded-lg bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  {getStressIcon()}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold flex items-center gap-2">
                  {stressLevel?.emoji} {stressLevel?.level ? stressLevel.level.charAt(0).toUpperCase() + stressLevel.level.slice(1) : 'Loading...'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stressLevel?.description || 'Calculating...'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Risk Score Detail */}
      {riskScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 glassmorphism">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Risk Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive health assessment
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold gradient-title">
                    {riskScore.score}
                  </p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Balance Adequacy</p>
                  <p className="text-xl font-bold">{riskScore.breakdown.balanceAdequacy}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Income Stability</p>
                  <p className="text-xl font-bold">{riskScore.breakdown.incomeStability}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expense Predictability</p>
                  <p className="text-xl font-bold">{riskScore.breakdown.expensePredictability}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Safety Margin</p>
                  <p className="text-xl font-bold">{riskScore.breakdown.safetyMargin}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
