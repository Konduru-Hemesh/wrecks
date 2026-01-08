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
import { API_BASE_URL } from './apiConfig';

const FinancialContext = createContext();

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
}

export function FinancialProvider({ children }) {
  const [plannerData, setPlannerData] = useState({
    currentBalance: 52500,
    monthlyIncome: 75000,
    monthlyExpenses: 45000,
    spendingGoal: 40000,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load planner data from backend
  useEffect(() => {
    const fetchPlannerData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.user?.monthlyIncome !== undefined && 
              data.user?.currentBalance !== undefined && 
              data.user?.monthlyExpenses !== undefined && 
              data.user?.spendingGoal !== undefined) {
            setPlannerData({
              currentBalance: Number(data.user.currentBalance),
              monthlyIncome: Number(data.user.monthlyIncome),
              monthlyExpenses: Number(data.user.monthlyExpenses),
              spendingGoal: Number(data.user.spendingGoal),
            });
          }
        }
      } catch (error) {
        console.error('Error loading planner data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlannerData();
  }, []);

  // Calculate expenses breakdown based on user's monthly expenses
  // Fixed expenses (60% of total) - bills, rent, etc.
  const fixedExpensesTotal = plannerData.monthlyExpenses * 0.6;
  // Variable expenses (40% of total) - groceries, entertainment, etc.
  const variableExpensesTotal = plannerData.monthlyExpenses * 0.4;

  // Core financial state
  const [financialState, setFinancialState] = useState({
    currentBalance: plannerData.currentBalance,
    monthlyIncome: plannerData.monthlyIncome,
    monthlyExpenses: plannerData.monthlyExpenses,
    spendingGoal: plannerData.spendingGoal,
    emergencyBuffer: Math.max(plannerData.monthlyExpenses * 1.5, 30000),
    safetyBufferMultiplier: 1.5, // User-defined safety level
    income: [
      { id: 1, name: 'Salary', amount: plannerData.monthlyIncome, dayOfMonth: 1, type: 'fixed' },
    ],
    fixedExpenses: [
      { id: 1, name: 'Rent', amount: Math.round(fixedExpensesTotal * 0.5), dayOfMonth: 5, category: 'housing' },
      { id: 2, name: 'Utilities', amount: Math.round(fixedExpensesTotal * 0.2), dayOfMonth: 10, category: 'utilities' },
      { id: 3, name: 'Insurance', amount: Math.round(fixedExpensesTotal * 0.2), dayOfMonth: 1, category: 'insurance' },
      { id: 4, name: 'Other Bills', amount: Math.round(fixedExpensesTotal * 0.1), dayOfMonth: 15, category: 'bills' },
    ],
    variableExpenses: [
      { id: 1, name: 'Groceries', amount: Math.round(variableExpensesTotal * 0.35), category: 'groceries' },
      { id: 2, name: 'Transportation', amount: Math.round(variableExpensesTotal * 0.25), category: 'transportation' },
      { id: 3, name: 'Entertainment', amount: Math.round(variableExpensesTotal * 0.20), category: 'entertainment' },
      { id: 4, name: 'Dining', amount: Math.round(variableExpensesTotal * 0.15), category: 'food' },
      { id: 5, name: 'Shopping', amount: Math.round(variableExpensesTotal * 0.05), category: 'shopping' },
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

  // Update financial state when planner data changes
  useEffect(() => {
    if (isLoading) return;

    const fixedExpensesTotal = plannerData.monthlyExpenses * 0.6;
    const variableExpensesTotal = plannerData.monthlyExpenses * 0.4;
    
    // Calculate individual expenses
    const rent = Math.round(fixedExpensesTotal * 0.5);
    const utilities = Math.round(fixedExpensesTotal * 0.2);
    const insurance = Math.round(fixedExpensesTotal * 0.2);
    const otherBills = Math.round(fixedExpensesTotal * 0.1);
    
    const groceries = Math.round(variableExpensesTotal * 0.35);
    const transportation = Math.round(variableExpensesTotal * 0.25);
    const entertainment = Math.round(variableExpensesTotal * 0.20);
    const dining = Math.round(variableExpensesTotal * 0.15);
    const shopping = Math.round(variableExpensesTotal * 0.05);
    
    // Calculate total to ensure accuracy
    const calculatedTotal = rent + utilities + insurance + otherBills + 
                           groceries + transportation + entertainment + dining + shopping;
    const difference = plannerData.monthlyExpenses - calculatedTotal;
    
    // Adjust the largest variable expense to match exactly
    const adjustedDining = dining + Math.round(difference);
    
    setFinancialState(prev => {
      // Only update if values actually changed
      if (prev.currentBalance !== plannerData.currentBalance ||
          prev.monthlyIncome !== plannerData.monthlyIncome ||
          prev.monthlyExpenses !== plannerData.monthlyExpenses) {
        return {
          ...prev,
          currentBalance: plannerData.currentBalance,
          monthlyIncome: plannerData.monthlyIncome,
          monthlyExpenses: plannerData.monthlyExpenses,
          spendingGoal: plannerData.spendingGoal,
          emergencyBuffer: Math.max(plannerData.monthlyExpenses * 1.5, 30000),
          income: [
            { id: 1, name: 'Salary', amount: plannerData.monthlyIncome, dayOfMonth: 1, type: 'fixed' },
          ],
          fixedExpenses: [
            { id: 1, name: 'Rent', amount: rent, dayOfMonth: 5, category: 'housing' },
            { id: 2, name: 'Utilities', amount: utilities, dayOfMonth: 10, category: 'utilities' },
            { id: 3, name: 'Insurance', amount: insurance, dayOfMonth: 1, category: 'insurance' },
            { id: 4, name: 'Other Bills', amount: otherBills, dayOfMonth: 15, category: 'bills' },
          ],
          variableExpenses: [
            { id: 1, name: 'Groceries', amount: groceries, category: 'groceries' },
            { id: 2, name: 'Transportation', amount: transportation, category: 'transportation' },
            { id: 3, name: 'Entertainment', amount: entertainment, category: 'entertainment' },
            { id: 4, name: 'Dining', amount: adjustedDining, category: 'food' },
            { id: 5, name: 'Shopping', amount: shopping, category: 'shopping' },
          ],
        };
      }
      return prev;
    });
  }, [plannerData, isLoading]);

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

    // Calculate risk score using actual user data
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
    const { amount, day = 0, duration = 30, category = 'other' } = scenario;

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
    setWhatIfScenario({ ...scenario, category });

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
