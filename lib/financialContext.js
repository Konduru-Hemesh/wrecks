/**
 * Financial State Context
 * Manages global financial state and provides it to all components
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  simulateCashFlow,
  calculateRiskScore,
  calculateStressLevel,
  generateRecommendations,
  calculateGoalImpact,
  explainImpact,
} from './financialEngine';

const FinancialContext = createContext();

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
}

export function FinancialProvider({ children }) {
  // Core financial state
  const [financialState, setFinancialState] = useState({
    currentBalance: 52500,
    monthlyIncome: 75000,
    monthlyExpenses: 45000,
    emergencyBuffer: 30000,
    safetyBufferMultiplier: 1.5, // User-defined safety level
    income: [
      { id: 1, name: 'Salary', amount: 75000, dayOfMonth: 1, type: 'fixed' },
    ],
    fixedExpenses: [
      { id: 1, name: 'Rent', amount: 15000, dayOfMonth: 5, category: 'housing' },
      { id: 2, name: 'Internet', amount: 1000, dayOfMonth: 10, category: 'utilities' },
      { id: 3, name: 'Phone', amount: 500, dayOfMonth: 10, category: 'utilities' },
      { id: 4, name: 'Insurance', amount: 3000, dayOfMonth: 1, category: 'insurance' },
    ],
    variableExpenses: [
      { id: 1, name: 'Groceries', amount: 8000, category: 'groceries' },
      { id: 2, name: 'Transportation', amount: 4000, category: 'transportation' },
      { id: 3, name: 'Entertainment', amount: 5000, category: 'entertainment' },
      { id: 4, name: 'Dining', amount: 6000, category: 'food' },
      { id: 5, name: 'Shopping', amount: 3000, category: 'shopping' },
    ],
    goals: [
      {
        id: 1,
        name: 'Vacation to Goa',
        targetAmount: 50000,
        currentAmount: 15000,
        monthlyContribution: 5000,
        targetDate: '2026-06-30',
        priority: 'high',
      },
      {
        id: 2,
        name: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 30000,
        monthlyContribution: 7000,
        targetDate: '2026-12-31',
        priority: 'high',
      },
    ],
  });

  // Simulation state
  const [projections, setProjections] = useState([]);
  const [riskScore, setRiskScore] = useState(null);
  const [stressLevel, setStressLevel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // What-if simulation state
  const [whatIfScenario, setWhatIfScenario] = useState(null);
  const [whatIfProjections, setWhatIfProjections] = useState([]);

  // Calculate projections whenever financial state changes
  useEffect(() => {
    const today = new Date();
    const config = {
      startBalance: financialState.currentBalance,
      startDate: today.toISOString().split('T')[0],
      days: 30,
      income: financialState.income,
      fixedExpenses: financialState.fixedExpenses,
      variableExpenses: financialState.variableExpenses,
      emergencyBuffer: financialState.emergencyBuffer,
    };

    const newProjections = simulateCashFlow(config);
    setProjections(newProjections);

    // Calculate risk score
    const score = calculateRiskScore({
      currentBalance: financialState.currentBalance,
      monthlyIncome: financialState.monthlyIncome,
      monthlyExpenses: financialState.monthlyExpenses,
      emergencyBuffer: financialState.emergencyBuffer,
    });
    setRiskScore(score);

    // Calculate stress level
    const stress = calculateStressLevel(score.score);
    setStressLevel(stress);

    // Generate recommendations
    const recs = generateRecommendations(financialState, newProjections);
    setRecommendations(recs);
  }, [financialState]);

  // Simulate what-if scenario
  const simulateWhatIf = (scenario) => {
    const { amount, day = 0, duration = 30 } = scenario;

    const today = new Date();
    const config = {
      startBalance: financialState.currentBalance,
      startDate: today.toISOString().split('T')[0],
      days: duration,
      income: financialState.income,
      fixedExpenses: financialState.fixedExpenses,
      variableExpenses: financialState.variableExpenses,
      emergencyBuffer: financialState.emergencyBuffer,
      hypotheticalSpend: { amount, day },
    };

    const newProjections = simulateCashFlow(config);
    setWhatIfProjections(newProjections);
    setWhatIfScenario(scenario);

    // Calculate impact
    const baselineEndBalance = projections[Math.min(duration - 1, projections.length - 1)]?.balance || financialState.currentBalance;
    const whatIfEndBalance = newProjections[duration - 1]?.balance || financialState.currentBalance;
    const balanceChange = whatIfEndBalance - baselineEndBalance;

    // Calculate risk change
    const baselineRiskScore = calculateRiskScore({
      currentBalance: baselineEndBalance,
      monthlyIncome: financialState.monthlyIncome,
      monthlyExpenses: financialState.monthlyExpenses,
      emergencyBuffer: financialState.emergencyBuffer,
    });
    const whatIfRiskScore = calculateRiskScore({
      currentBalance: whatIfEndBalance,
      monthlyIncome: financialState.monthlyIncome,
      monthlyExpenses: financialState.monthlyExpenses,
      emergencyBuffer: financialState.emergencyBuffer,
    });
    const riskChange = whatIfRiskScore.score - baselineRiskScore.score;

    // Calculate stress change
    const baselineStress = calculateStressLevel(baselineRiskScore.score);
    const whatIfStress = calculateStressLevel(whatIfRiskScore.score);
    const stressChange = baselineStress.level !== whatIfStress.level ? 1 : 0;

    // Calculate goal impact
    let goalImpact = null;
    if (financialState.goals.length > 0) {
      goalImpact = calculateGoalImpact(
        financialState.goals[0],
        amount,
        financialState.currentBalance
      );
    }

    const impact = {
      balanceChange,
      monthEndBalance: whatIfEndBalance,
      riskLevelChange: riskChange,
      baselineRiskScore: baselineRiskScore.score,
      whatIfRiskScore: whatIfRiskScore.score,
      stressChange,
      baselineStress,
      whatIfStress,
      goalImpact,
      explanation: explainImpact({
        balanceChange,
        riskLevelChange: riskChange,
        stressChange,
        goalImpact,
      }),
    };

    return {
      projections: newProjections,
      impact,
    };
  };

  // Clear what-if scenario
  const clearWhatIf = () => {
    setWhatIfScenario(null);
    setWhatIfProjections([]);
  };

  // Update financial state
  const updateFinancialState = (updates) => {
    setFinancialState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Add income
  const addIncome = (income) => {
    setFinancialState((prev) => ({
      ...prev,
      income: [...prev.income, { ...income, id: Date.now() }],
      monthlyIncome: prev.monthlyIncome + income.amount,
    }));
  };

  // Add expense
  const addExpense = (expense) => {
    const isFixed = expense.type === 'fixed';
    setFinancialState((prev) => ({
      ...prev,
      [isFixed ? 'fixedExpenses' : 'variableExpenses']: [
        ...prev[isFixed ? 'fixedExpenses' : 'variableExpenses'],
        { ...expense, id: Date.now() },
      ],
      monthlyExpenses: prev.monthlyExpenses + expense.amount,
    }));
  };

  // Add goal
  const addGoal = (goal) => {
    setFinancialState((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: Date.now() }],
    }));
  };

  // Update goal
  const updateGoal = (goalId, updates) => {
    setFinancialState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
    }));
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    setFinancialState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
  };

  // Update safety buffer
  const updateSafetyBuffer = (multiplier) => {
    setFinancialState((prev) => ({
      ...prev,
      safetyBufferMultiplier: multiplier,
      emergencyBuffer: prev.monthlyExpenses * multiplier,
    }));
  };

  const value = {
    // State
    financialState,
    projections,
    riskScore,
    stressLevel,
    recommendations,
    whatIfScenario,
    whatIfProjections,

    // Actions
    updateFinancialState,
    addIncome,
    addExpense,
    addGoal,
    updateGoal,
    deleteGoal,
    updateSafetyBuffer,
    simulateWhatIf,
    clearWhatIf,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
}
