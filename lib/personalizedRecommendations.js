/**
 * Personalized Recommendations Engine
 * Analyzes real spending patterns and provides humorous, actionable advice
 */

/**
 * Generate personalized recommendations based on actual spending data
 * @param {Object} params - User financial data
 * @returns {Array} Personalized recommendations with humor
 */
export function generatePersonalizedRecommendations({
  monthlyIncome,
  transactions = [],
  goals = [],
  currentBalance,
  emergencyBuffer,
}) {
  const recommendations = [];

  if (!transactions || transactions.length === 0) {
    return [{
      id: 'no-data',
      type: 'info',
      priority: 'low',
      title: 'Start Tracking Your Expenses!',
      description: 'We need some spending data to give you personalized recommendations. Start adding transactions to see insights!',
      impact: { balanceChange: 0, riskReduction: 0 },
      confidence: 1.0,
      actions: ['Add your first transaction', 'Track expenses for a week', 'See personalized insights'],
      humor: 'Even the best financial advisor needs data! 📊',
    }];
  }

  // Calculate spending statistics
  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalSpending / transactions.length;
  const remainingSavings = monthlyIncome - totalSpending;
  const savingsRate = monthlyIncome > 0 ? (remainingSavings / monthlyIncome) * 100 : 0;

  // Category-wise spending analysis
  const categorySpending = {};
  const categoryCount = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'other-expense';
    categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  // Calculate percentages
  const categoryPercentages = {};
  Object.keys(categorySpending).forEach(category => {
    categoryPercentages[category] = (categorySpending[category] / totalSpending) * 100;
  });

  // Identify top spending categories
  const sortedCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Lifestyle categories that are often non-essential
  const lifestyleCategories = ['food', 'entertainment', 'shopping', 'dining', 'canteen'];
  const lifestyleSpending = Object.entries(categorySpending)
    .filter(([cat]) => lifestyleCategories.includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0);

  const lifestylePercentage = (lifestyleSpending / totalSpending) * 100;

  // 1. High lifestyle spending recommendation
  if (lifestyleSpending > 0 && lifestylePercentage > 30) {
    const topLifestyleCategory = Object.entries(categorySpending)
      .filter(([cat]) => lifestyleCategories.includes(cat))
      .sort((a, b) => b[1] - a[1])[0];

    if (topLifestyleCategory) {
      const [category, amount] = topLifestyleCategory;
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
      const weeklySpending = amount / 4; // Rough estimate
      const potentialSavings = amount * 0.3; // 30% reduction
      const monthlySavings = potentialSavings;
      const yearlySavings = monthlySavings * 12;

      let humor = '';
      let explanation = '';
      
      if (category === 'food' || category === 'dining' || category === 'canteen') {
        humor = `🍔 Your wallet thinks the ${category === 'canteen' ? 'canteen' : 'restaurant'} is your second home!`;
        explanation = `You're spending ₹${Math.round(amount).toLocaleString()} on ${category === 'canteen' ? 'canteen food' : 'dining out'} this month. That's about ₹${Math.round(weeklySpending).toLocaleString()} per week!`;
      } else if (category === 'entertainment') {
        humor = `🎬 Your entertainment budget is having more fun than you are!`;
        explanation = `₹${Math.round(amount).toLocaleString()} on entertainment is quite the party! That's ${categoryCount[category] || 0} transactions this month.`;
      } else if (category === 'shopping') {
        humor = `🛍️ Your shopping cart is doing more traveling than you!`;
        explanation = `₹${Math.round(amount).toLocaleString()} on shopping? Your closet must be very happy, but your savings account might be feeling left out.`;
      } else {
        humor = `💰 Your ${categoryName.toLowerCase()} spending is making waves!`;
        explanation = `You've spent ₹${Math.round(amount).toLocaleString()} on ${categoryName.toLowerCase()} this month.`;
      }

      recommendations.push({
        id: `reduce-${category}`,
        type: 'spending',
        priority: lifestylePercentage > 50 ? 'high' : 'moderate',
        title: `Cut Back on ${categoryName}`,
        description: `${humor} ${explanation} By reducing this by just 30%, you could save ₹${Math.round(monthlySavings).toLocaleString()} monthly (that's ₹${Math.round(yearlySavings).toLocaleString()} per year!). Small changes today = big savings tomorrow! 🎯`,
        impact: {
          balanceChange: monthlySavings,
          riskReduction: lifestylePercentage > 50 ? 20 : 10,
          category: category,
          currentSpending: amount,
          potentialSavings: monthlySavings,
        },
        confidence: 0.85,
        actions: [
          category === 'food' || category === 'dining' || category === 'canteen' 
            ? `Pack lunch 3 days a week instead of eating out (saves ~₹${Math.round(weeklySpending * 0.6).toLocaleString()}/week)`
            : `Set a monthly limit of ₹${Math.round(amount * 0.7).toLocaleString()} for ${categoryName.toLowerCase()}`,
          `Track every ${categoryName.toLowerCase()} expense for a week to see where it's going`,
          `Try a "no-spend" day once a week for ${categoryName.toLowerCase()}`,
        ],
        humor: humor,
        category: category,
        currentAmount: amount,
        savingsPotential: monthlySavings,
      });
    }
  }

  // 2. Frequent small purchases
  const smallPurchases = transactions.filter(t => t.amount < 500 && lifestyleCategories.includes(t.category || ''));
  const smallPurchaseTotal = smallPurchases.reduce((sum, t) => sum + t.amount, 0);
  
  if (smallPurchases.length > 10 && smallPurchaseTotal > monthlyIncome * 0.1) {
    const avgSmallPurchase = smallPurchaseTotal / smallPurchases.length;
    const potentialSavings = smallPurchaseTotal * 0.4; // 40% reduction
    
    recommendations.push({
      id: 'reduce-small-purchases',
      type: 'spending',
      priority: 'moderate',
      title: 'Those "Small" Purchases Add Up! 💸',
      description: `You've made ${smallPurchases.length} small purchases (under ₹500) totaling ₹${Math.round(smallPurchaseTotal).toLocaleString()} this month. That's like buying a nice dinner every week... but you're doing it ${Math.round(smallPurchases.length / 4)} times! 😅 Cutting back by 40% could save you ₹${Math.round(potentialSavings).toLocaleString()} monthly. Remember: a ₹200 coffee 5 times a week = ₹4,000/month!`,
      impact: {
        balanceChange: potentialSavings,
        riskReduction: 15,
      },
      confidence: 0.8,
      actions: [
        `Use the 24-hour rule: wait a day before buying anything under ₹500`,
        `Track all small purchases for a week - you might be surprised!`,
        `Set a weekly "small purchase" budget of ₹${Math.round(smallPurchaseTotal * 0.6 / 4).toLocaleString()}`,
      ],
      humor: 'Death by a thousand small purchases! 💀💰',
      currentAmount: smallPurchaseTotal,
      savingsPotential: potentialSavings,
    });
  }

  // 3. Low savings rate
  if (savingsRate < 20 && monthlyIncome > 0) {
    const targetSavings = monthlyIncome * 0.2;
    const shortfall = targetSavings - remainingSavings;
    
    recommendations.push({
      id: 'increase-savings',
      type: 'savings',
      priority: savingsRate < 10 ? 'high' : 'moderate',
      title: savingsRate < 10 ? 'Your Savings Need a Hug! 🤗' : 'Boost Your Savings Game! 💪',
      description: `You're currently saving ${savingsRate.toFixed(1)}% of your income (₹${Math.round(remainingSavings).toLocaleString()}). The goal is 20%! That means you need to find ₹${Math.round(shortfall).toLocaleString()} more per month. Don't worry - we've got your back! 🎯`,
      impact: {
        balanceChange: shortfall,
        riskReduction: 25,
      },
      confidence: 0.9,
      actions: [
        `Review the top spending categories above - reducing just one by 20% could get you there!`,
        `Set up automatic savings: transfer ₹${Math.round(monthlyIncome * 0.1).toLocaleString()} on payday`,
        `Use the "save first, spend later" rule - treat savings like a bill`,
      ],
      humor: savingsRate < 10 ? 'Your savings account is sending you a "wish you were here" postcard! 📮' : 'Your savings are doing okay, but they could be doing great! 🚀',
      currentSavingsRate: savingsRate,
      targetSavings: targetSavings,
    });
  }

  // 4. Goal impact analysis
  if (goals.length > 0 && remainingSavings < 0) {
    const primaryGoal = goals[0];
    const monthlyNeeded = primaryGoal.monthlyContribution;
    const shortfall = monthlyNeeded - remainingSavings;
    
    recommendations.push({
      id: 'goal-shortfall',
      type: 'goals',
      priority: 'high',
      title: `Your "${primaryGoal.name}" Goal Needs Attention! 🎯`,
      description: `You need ₹${Math.round(monthlyNeeded).toLocaleString()} monthly for your goal, but you're currently saving ₹${Math.round(remainingSavings).toLocaleString()}. That's a gap of ₹${Math.round(shortfall).toLocaleString()}! Your goal is probably wondering where you went. 😅 Let's get back on track!`,
      impact: {
        balanceChange: shortfall,
        riskReduction: 0,
        goalDelayDays: Math.ceil((shortfall / monthlyNeeded) * 30),
      },
      confidence: 0.95,
      actions: [
        `Reduce lifestyle spending by ₹${Math.round(shortfall * 0.6).toLocaleString()} to cover most of the gap`,
        `Increase income or find additional ₹${Math.round(shortfall).toLocaleString()} through side income`,
        `Temporarily adjust goal timeline if needed, but don't give up!`,
      ],
      humor: 'Your goal is like a plant - it needs consistent watering (money) to grow! 🌱💰',
      goal: primaryGoal,
      shortfall: shortfall,
    });
  }

  // 5. Emergency buffer check
  if (currentBalance < emergencyBuffer) {
    const shortfall = emergencyBuffer - currentBalance;
    
    recommendations.push({
      id: 'emergency-buffer',
      type: 'savings',
      priority: 'high',
      title: 'Build Your Safety Net! 🛡️',
      description: `Your emergency buffer should be ₹${Math.round(emergencyBuffer).toLocaleString()}, but you're at ₹${Math.round(currentBalance).toLocaleString()}. You're ₹${Math.round(shortfall).toLocaleString()} short! Think of it as your financial superhero cape - you'll be glad you have it when life throws curveballs! 🦸`,
      impact: {
        balanceChange: shortfall,
        riskReduction: 30,
      },
      confidence: 0.95,
      actions: [
        `Aim to save ₹${Math.round(shortfall / 6).toLocaleString()} monthly for 6 months`,
        `Cut one major expense category by 20% to accelerate building the buffer`,
        `Set up automatic transfer to emergency fund on payday`,
      ],
      humor: 'Your emergency fund is like an umbrella - you only realize you need it when it starts raining! ☔',
      currentBalance: currentBalance,
      targetBuffer: emergencyBuffer,
    });
  }

  // 6. Positive reinforcement
  if (savingsRate >= 20 && remainingSavings > 0 && recommendations.length === 0) {
    recommendations.push({
      id: 'doing-great',
      type: 'positive',
      priority: 'low',
      title: 'You\'re Crushing It! 🎉',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income (₹${Math.round(remainingSavings).toLocaleString()})! That's fantastic! Keep up the great work, financial superstar! ⭐`,
      impact: {
        balanceChange: 0,
        riskReduction: 0,
      },
      confidence: 1.0,
      actions: [
        'Consider increasing your goal contributions',
        'Review investment opportunities',
        'Keep tracking to maintain these good habits!',
      ],
      humor: 'You\'re the financial equivalent of a superhero! 🦸💰',
    });
  }

  return recommendations;
}
