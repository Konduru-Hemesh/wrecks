/**
 * Financial Simulation Engine
 * Core logic for cash flow prediction, risk scoring, and financial modeling
 */

/**
 * Calculate day-by-day cash flow projection
 * @param {Object} config - Financial configuration
 * @returns {Array} Daily projections with balance, income, expenses
 */
export function simulateCashFlow(config) {
  const {
    startBalance,
    startDate,
    days = 30,
    income = [],
    fixedExpenses = [],
    variableExpenses = [],
    actualExpenses = [], // Array of actual expenses from database
    emergencyBuffer = 10000,
    hypotheticalSpend = null,
  } = config;

  const projections = [];
  let currentBalance = startBalance;
  const start = new Date(startDate);
  const startTime = start.getTime();

  // Group actual expenses by date
  const expensesByDate = {};
  actualExpenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    const dateKey = expDate.toISOString().split('T')[0];
    if (!expensesByDate[dateKey]) {
      expensesByDate[dateKey] = [];
    }
    expensesByDate[dateKey].push(exp);
  });

  for (let day = 0; day < days; day++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day);
    const dayOfMonth = currentDate.getDate();
    const dateKey = currentDate.toISOString().split('T')[0];

    // Calculate income for this day
    let dailyIncome = 0;
    income.forEach((inc) => {
      if (inc.dayOfMonth === dayOfMonth || (inc.dayOfMonth === 1 && day === 0)) {
        dailyIncome += inc.amount;
      }
    });

    // Calculate fixed expenses for this day
    let dailyFixedExpense = 0;
    fixedExpenses.forEach((exp) => {
      if (exp.dayOfMonth === dayOfMonth) {
        dailyFixedExpense += exp.amount;
      }
    });

    // Calculate actual expenses for this day
    let dailyActualExpenses = 0;
    if (expensesByDate[dateKey]) {
      dailyActualExpenses = expensesByDate[dateKey].reduce((sum, exp) => sum + exp.amount, 0);
    }

    // Estimate variable expenses (distributed across month) - only if no actual expenses
    // If we have actual expenses, we use those instead of estimated variable expenses
    const dailyVariableExpense = dailyActualExpenses > 0 
      ? 0 
      : variableExpenses.reduce((sum, exp) => sum + exp.amount, 0) / days;

    // Apply hypothetical spend if on specified day
    let hypotheticalAmount = 0;
    if (hypotheticalSpend && day === hypotheticalSpend.day) {
      hypotheticalAmount = hypotheticalSpend.amount;
    }

    // Update balance
    currentBalance += dailyIncome - dailyFixedExpense - dailyVariableExpense - dailyActualExpenses - hypotheticalAmount;

    // Determine risk level
    const riskLevel = calculateRiskLevel(currentBalance, emergencyBuffer);

    projections.push({
      day: day + 1,
      date: dateKey,
      balance: Math.round(currentBalance * 100) / 100,
      income: dailyIncome,
      fixedExpenses: dailyFixedExpense,
      variableExpenses: Math.round(dailyVariableExpense * 100) / 100,
      actualExpenses: dailyActualExpenses,
      hypotheticalSpend: hypotheticalAmount,
      riskLevel,
      isRiskZone: riskLevel === 'high' || riskLevel === 'critical',
    });
  }

  return projections;
}

/**
 * Calculate financial risk level based on current balance and buffer
 * @param {number} balance - Current balance
 * @param {number} emergencyBuffer - Required emergency buffer
 * @returns {string} Risk level: 'safe', 'moderate', 'high', 'critical'
 */
export function calculateRiskLevel(balance, emergencyBuffer) {
  // Guard against division by zero
  if (!emergencyBuffer || emergencyBuffer === 0) {
    return 'critical';
  }
  
  const bufferRatio = balance / emergencyBuffer;

  if (bufferRatio >= 2.0) return 'safe';
  if (bufferRatio >= 1.0) return 'moderate';
  if (bufferRatio >= 0.5) return 'high';
  return 'critical';
}

/**
 * Calculate comprehensive risk score (0-100)
 * @param {Object} financialState - Current financial state
 * @returns {Object} Risk score with breakdown
 */
export function calculateRiskScore(financialState) {
  const {
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    emergencyBuffer,
    variableExpenseVolatility = 0.2,
  } = financialState;

  // Balance adequacy (40 points)
  const balanceScore = emergencyBuffer > 0 
    ? Math.min((currentBalance / emergencyBuffer) * 40, 40)
    : 0;

  // Income stability (30 points)
  const incomeExpenseRatio = monthlyExpenses > 0 
    ? monthlyIncome / monthlyExpenses 
    : 0;
  const incomeScore = Math.min(incomeExpenseRatio * 15, 30);

  // Expense predictability (20 points)
  const volatilityScore = Math.max(20 - variableExpenseVolatility * 100, 0);

  // Safety margin (10 points)
  const savingsRate = monthlyIncome > 0
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
    : 0;
  const marginScore = Math.min(savingsRate / 2, 10);

  const totalScore = Math.round(balanceScore + incomeScore + volatilityScore + marginScore);

  return {
    score: Math.min(totalScore, 100),
    level: totalScore >= 80 ? 'safe' : totalScore >= 60 ? 'moderate' : totalScore >= 40 ? 'high' : 'critical',
    breakdown: {
      balanceAdequacy: Math.round(balanceScore),
      incomeStability: Math.round(incomeScore),
      expensePredictability: Math.round(volatilityScore),
      safetyMargin: Math.round(marginScore),
    },
  };
}

/**
 * Calculate stress level based on financial state
 * @param {number} riskScore - Current risk score (0-100)
 * @returns {Object} Stress indicator with color and description
 */
export function calculateStressLevel(riskScore) {
  if (riskScore >= 80) {
    return {
      level: 'low',
      color: 'green',
      description: 'Your finances are healthy and stable',
      emoji: '😊',
    };
  } else if (riskScore >= 60) {
    return {
      level: 'moderate',
      color: 'blue',
      description: 'Your finances are mostly stable',
      emoji: '😐',
    };
  } else if (riskScore >= 40) {
    return {
      level: 'elevated',
      color: 'amber',
      description: 'Your finances need attention',
      emoji: '😟',
    };
  } else {
    return {
      level: 'high',
      color: 'red',
      description: 'Your finances are under stress',
      emoji: '😰',
    };
  }
}

/**
 * Generate smart financial recommendations
 * @param {Object} financialState - Current financial state
 * @param {Array} projections - Cash flow projections
 * @returns {Array} Personalized recommendations
 */
export function generateRecommendations(financialState, projections) {
  const recommendations = [];
  const {
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    emergencyBuffer,
    variableExpenses = [],
    goals = [],
  } = financialState;

  const riskScore = calculateRiskScore(financialState);
  const monthEndBalance = projections[projections.length - 1]?.balance || currentBalance;

  // Check if heading into risk zone
  const riskDays = projections.filter(p => p.isRiskZone).length;
  if (riskDays > 5) {
    recommendations.push({
      id: 'reduce-discretionary',
      type: 'spending',
      priority: 'high',
      title: 'Reduce discretionary spending',
      description: `You'll be in a risk zone for ${riskDays} days this month. Consider reducing non-essential expenses.`,
      impact: {
        balanceChange: monthlyExpenses * 0.15,
        riskReduction: 15,
      },
      confidence: 0.85,
      actions: [
        'Review entertainment and dining expenses',
        'Postpone non-urgent purchases',
        'Look for subscription services to pause',
      ],
    });
  }

  // Low balance warning
  if (currentBalance < emergencyBuffer * 1.5) {
    const shortfall = (emergencyBuffer * 1.5) - currentBalance;
    recommendations.push({
      id: 'build-buffer',
      type: 'savings',
      priority: 'high',
      title: 'Build emergency buffer',
      description: `Your current balance is below the recommended 1.5x emergency buffer. Consider saving ₹${Math.round(shortfall).toLocaleString()} more.`,
      impact: {
        balanceChange: shortfall,
        riskReduction: 20,
      },
      confidence: 0.9,
      actions: [
        'Set aside 10% of income automatically',
        'Transfer windfall income to savings',
        'Review and cut unnecessary subscriptions',
      ],
    });
  }

  // High variable expenses
  const totalVariableExpenses = variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  if (totalVariableExpenses > monthlyExpenses * 0.4) {
    recommendations.push({
      id: 'stabilize-expenses',
      type: 'spending',
      priority: 'moderate',
      title: 'Stabilize variable expenses',
      description: 'Variable expenses are high. Creating predictability helps with planning.',
      impact: {
        balanceChange: totalVariableExpenses * 0.2,
        riskReduction: 10,
      },
      confidence: 0.75,
      actions: [
        'Set weekly spending limits for categories',
        'Use fixed budget for entertainment',
        'Plan grocery shopping in advance',
      ],
    });
  }

  // Goal impact
  if (goals.length > 0 && monthEndBalance < currentBalance + (monthlyIncome - monthlyExpenses)) {
    const goalImpact = goals[0]; // Focus on first goal
    recommendations.push({
      id: 'adjust-goal-timeline',
      type: 'goals',
      priority: 'low',
      title: `Adjust "${goalImpact.name}" timeline`,
      description: 'Current spending pattern may delay your goal achievement.',
      impact: {
        balanceChange: 0,
        goalDelayDays: 14,
      },
      confidence: 0.7,
      actions: [
        'Extend goal timeline by 2 weeks',
        'Increase monthly savings by 15%',
        'Reduce goal target amount slightly',
      ],
    });
  }

  // Positive feedback
  if (riskScore.score >= 80 && monthEndBalance > currentBalance) {
    recommendations.push({
      id: 'on-track',
      type: 'positive',
      priority: 'low',
      title: 'You\'re on track!',
      description: 'Your financial health is strong. Keep up the good habits.',
      impact: {
        balanceChange: 0,
        riskReduction: 0,
      },
      confidence: 0.95,
      actions: [
        'Consider increasing goal contributions',
        'Review investment opportunities',
        'Build additional safety net',
      ],
    });
  }

  return recommendations;
}

/**
 * Calculate impact of hypothetical spending on goals
 * @param {Object} goal - Goal configuration
 * @param {number} hypotheticalSpend - Amount to spend
 * @param {number} currentBalance - Current balance
 * @returns {Object} Goal impact analysis
 */
export function calculateGoalImpact(goal, hypotheticalSpend, currentBalance) {
  const {
    targetAmount,
    currentAmount = 0,
    monthlyContribution,
    targetDate,
  } = goal;

  const remaining = targetAmount - currentAmount;
  const monthsToGoal = Math.ceil(remaining / monthlyContribution);
  
  // Calculate impact of spending
  const newBalance = currentBalance - hypotheticalSpend;
  const impactOnContribution = hypotheticalSpend > monthlyContribution ? hypotheticalSpend - monthlyContribution : 0;
  
  let delayDays = 0;
  if (impactOnContribution > 0) {
    const missedMonths = Math.ceil(impactOnContribution / monthlyContribution);
    delayDays = missedMonths * 30;
  }

  const originalDate = new Date(targetDate);
  const newDate = new Date(originalDate);
  newDate.setDate(newDate.getDate() + delayDays);

  return {
    delayDays,
    originalDate: originalDate.toISOString().split('T')[0],
    newDate: newDate.toISOString().split('T')[0],
    impactMessage: delayDays > 0 
      ? `This decision delays your goal by ${delayDays} days`
      : 'This decision does not significantly impact your goal',
  };
}

/**
 * Generate human-friendly explanation of financial impact
 * @param {Object} impact - Impact data
 * @returns {string} Natural language explanation
 */
export function explainImpact(impact) {
  const {
    balanceChange,
    riskLevelChange,
    goalImpact,
    stressChange,
  } = impact;

  let explanation = '';

  // Balance impact
  if (Math.abs(balanceChange) > 0) {
    const changeStr = balanceChange < 0 ? 'decrease' : 'increase';
    explanation += `Your balance will ${changeStr} by ₹${Math.abs(Math.round(balanceChange)).toLocaleString()}. `;
  }

  // Risk impact
  if (riskLevelChange) {
    if (riskLevelChange > 0) {
      explanation += 'This increases your financial risk. ';
    } else if (riskLevelChange < 0) {
      explanation += 'This improves your financial stability. ';
    }
  }

  // Stress impact
  if (stressChange) {
    if (stressChange > 0) {
      explanation += 'Your financial stress will increase. ';
    } else if (stressChange < 0) {
      explanation += 'Your financial stress will decrease. ';
    }
  }

  // Goal impact
  if (goalImpact && goalImpact.delayDays > 0) {
    explanation += goalImpact.impactMessage + '. ';
  }

  return explanation || 'This decision has minimal impact on your finances.';
}
