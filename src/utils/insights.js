export const generateInsights = (incomes, expenses, goals) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter current month data
  const currentMonthIncomes = incomes.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const previousMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const isPrevMonth = currentMonth === 0 
      ? d.getMonth() === 11 && d.getFullYear() === currentYear - 1
      : d.getMonth() === currentMonth - 1 && d.getFullYear() === currentYear;
    return isPrevMonth;
  });

  const totalIncome = currentMonthIncomes.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = currentMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const prevTotalExpense = previousMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  
  const netSavings = totalIncome - totalExpense;

  // Highest expense category
  const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  let highestCategory = null;
  let highestAmount = 0;
  for (const [category, amount] of Object.entries(categoryTotals)) {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = category;
    }
  }

  // Goal feasibility and auto-suggestions
  let suggestion = null;
  
  // Find the most urgent or highest priority goal that is not completed
  const activeGoals = goals.filter(g => Number(g.savedAmount) < Number(g.targetAmount));
  
  if (activeGoals.length > 0) {
    const primaryGoal = activeGoals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
    
    const remainingAmount = Number(primaryGoal.targetAmount) - Number(primaryGoal.savedAmount);
    const deadlineDate = new Date(primaryGoal.deadline);
    const monthsLeft = (deadlineDate.getFullYear() - currentYear) * 12 + (deadlineDate.getMonth() - currentMonth);
    
    const requiredMonthlySaving = monthsLeft > 0 ? remainingAmount / monthsLeft : remainingAmount;

    if (netSavings < requiredMonthlySaving) {
      const deficit = requiredMonthlySaving - netSavings;
      
      if (highestCategory) {
        // Suggest reducing the highest expense
        const reductionAmount = Math.min(deficit, highestAmount * 0.5); // Don't suggest reducing more than 50% of the category
        suggestion = `Reduce ${highestCategory} expenses by ₹${Math.ceil(reductionAmount)}/month to reach your '${primaryGoal.name}' goal.`;
      } else {
        suggestion = `You need to save ₹${Math.ceil(deficit)} more per month to reach your '${primaryGoal.name}' goal.`;
      }
    } else {
      suggestion = `You are on track to reach your '${primaryGoal.name}' goal! Keep it up.`;
    }
  } else if (highestCategory) {
     suggestion = `Your highest spending this month is on ${highestCategory}.`;
  } else {
     suggestion = `Add your income and expenses to get smart insights.`;
  }

  return {
    totalIncome,
    totalExpense,
    prevTotalExpense,
    netSavings,
    highestCategory,
    highestCategoryAmount: highestAmount,
    suggestion,
    expenseTrend: prevTotalExpense === 0 ? 0 : ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100
  };
};
