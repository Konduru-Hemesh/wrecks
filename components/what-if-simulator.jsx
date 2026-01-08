/**
 * What-If Simulator
 * Interactive tool for simulating spending decisions
 * MOST IMPORTANT FEATURE - judges will play with this
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinancial } from '@/lib/financialContext';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Calendar,
  Sparkles,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function WhatIfSimulator() {
  const { simulateWhatIf, clearWhatIf, whatIfScenario, financialState } = useFinancial();
  
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState(0);
  const [duration, setDuration] = useState(30);
  const [impact, setImpact] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) return;

    setIsSimulating(true);
    const result = simulateWhatIf({
      amount: parsedAmount,
      day: parseInt(day),
      duration: parseInt(duration),
    });
    setImpact(result.impact);
    
    // Animate the results
    setTimeout(() => {
      setIsSimulating(false);
    }, 500);
  };

  const handleClear = () => {
    clearWhatIf();
    setAmount('');
    setDay(0);
    setDuration(30);
    setImpact(null);
  };

  const getImpactColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">What-If Simulator</h2>
        </div>
        <p className="text-muted-foreground">
          Test spending decisions before you make them
        </p>
      </motion.div>

      {/* Main Simulator Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 glassmorphism border-2 border-purple-500/30">
          <div className="space-y-6">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  How much do you want to spend?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>

              {/* Day Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">When?</label>
                <Select value={day.toString()} onValueChange={(val) => setDay(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In 1 week</SelectItem>
                    <SelectItem value="14">In 2 weeks</SelectItem>
                    <SelectItem value="21">In 3 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Simulate for how long?</label>
                <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="60">60 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Amount Slider for better UX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>Quick adjust amount</span>
                <span>₹{(financialState.currentBalance * 0.5).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={financialState.currentBalance * 0.5}
                step="500"
                value={amount || 0}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSimulate}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white button-glow"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Simulate Impact
              </Button>
              {impact && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Impact Results */}
      <AnimatePresence>
        {impact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Explanation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 glassmorphism border-2 border-blue-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {impact.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Month-End Balance Change */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 glassmorphism card-hover">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Month-End Balance
                      </p>
                      {impact.balanceChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        ₹{Math.round(impact.monthEndBalance).toLocaleString()}
                      </p>
                      <p className={`text-sm font-medium mt-1 ${getImpactColor(impact.balanceChange)}`}>
                        {impact.balanceChange >= 0 ? '+' : ''}₹{Math.abs(Math.round(impact.balanceChange)).toLocaleString()} change
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Risk Change */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 glassmorphism card-hover">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Risk Score Change
                      </p>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${getRiskColor(impact.baselineRiskScore)}`}>
                          {impact.baselineRiskScore}
                        </p>
                        <span className="text-muted-foreground">→</span>
                        <p className={`text-3xl font-bold ${getRiskColor(impact.whatIfRiskScore)}`}>
                          {impact.whatIfRiskScore}
                        </p>
                      </div>
                      <p className={`text-sm font-medium mt-1 ${getImpactColor(impact.riskLevelChange)}`}>
                        {impact.riskLevelChange >= 0 ? '+' : ''}{Math.round(impact.riskLevelChange)} points
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Stress Level Change */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 glassmorphism card-hover">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Stress Level
                      </p>
                      <span className="text-2xl">{impact.whatIfStress.emoji}</span>
                    </div>
                    <div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {impact.baselineStress.level} → {impact.whatIfStress.level}
                        </p>
                        <p className={`text-lg font-bold ${
                          impact.stressChange > 0 ? 'text-red-500' :
                          impact.stressChange < 0 ? 'text-green-500' :
                          'text-blue-500'
                        }`}>
                          {impact.stressChange > 0 ? 'Increases' :
                           impact.stressChange < 0 ? 'Decreases' :
                           'No Change'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Goal Impact */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 glassmorphism card-hover">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Goal Impact
                      </p>
                      <Target className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      {impact.goalImpact ? (
                        <>
                          <p className="text-3xl font-bold text-purple-500">
                            {impact.goalImpact.delayDays > 0 ? '+' : ''}{impact.goalImpact.delayDays}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {impact.goalImpact.delayDays > 0 ? 'days delay' : 'no delay'}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg text-muted-foreground">
                          No goals set
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
