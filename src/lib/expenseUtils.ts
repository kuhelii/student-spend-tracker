
import { Expense, ExpenseCategory, CategorySummary, BudgetSummary, TimeFrame } from '@/types/expense';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isAfter } from 'date-fns';

export const CATEGORY_COLORS = {
  food: { light: '#FEC6A1', dark: '#F97316' },
  transport: { light: '#D3E4FD', dark: '#0EA5E9' },
  entertainment: { light: '#E5DEFF', dark: '#8B5CF6' },
  shopping: { light: '#FFDEE2', dark: '#D946EF' },
  utilities: { light: '#F2FCE2', dark: '#65A30D' },
  other: { light: '#F1F0FB', dark: '#8E9196' },
};

export const getCategoryIcon = (category: ExpenseCategory): string => {
  switch (category) {
    case 'food': return '🍕';
    case 'transport': return '🚗';
    case 'entertainment': return '🎬';
    case 'shopping': return '🛍️';
    case 'utilities': return '💡';
    case 'other': return '📦';
  }
};

export const calculateBudgetSummary = (expenses: Expense[], budget: number, timeFrame: TimeFrame): BudgetSummary => {
  const filteredExpenses = filterExpensesByTimeFrame(expenses, timeFrame);
  const spent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  
  return {
    total: budget,
    remaining,
    spent,
    percentage: Math.min(percentage, 100) // Cap at 100%
  };
};

export const calculateCategorySummaries = (expenses: Expense[], timeFrame: TimeFrame): CategorySummary[] => {
  const filteredExpenses = filterExpensesByTimeFrame(expenses, timeFrame);
  const totalSpent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Group by category
  const categories: ExpenseCategory[] = ['food', 'transport', 'entertainment', 'shopping', 'utilities', 'other'];
  return categories.map(category => {
    const categoryExpenses = filteredExpenses.filter(expense => expense.category === category);
    const amount = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    
    return {
      category,
      amount,
      percentage,
      count: categoryExpenses.length
    };
  }).sort((a, b) => b.amount - a.amount);
};

export const filterExpensesByTimeFrame = (expenses: Expense[], timeFrame: TimeFrame): Expense[] => {
  const today = new Date();
  let startDate: Date;
  
  switch (timeFrame) {
    case 'daily':
      startDate = subDays(today, 1);
      break;
    case 'weekly':
      startDate = startOfWeek(today);
      break;
    case 'monthly':
      startDate = startOfMonth(today);
      break;
    case 'yearly':
      startDate = startOfYear(today);
      break;
    default:
      startDate = startOfMonth(today);
  }
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isAfter(expenseDate, startDate) || expenseDate.toDateString() === startDate.toDateString();
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateOptimizationTips = (expenses: Expense[], timeFrame: TimeFrame): string[] => {
  const filteredExpenses = filterExpensesByTimeFrame(expenses, timeFrame);
  const categorySummaries = calculateCategorySummaries(expenses, timeFrame);
  const totalSpent = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  
  const tips: string[] = [];
  
  // High spending category tip
  const highestCategory = categorySummaries[0];
  if (highestCategory && highestCategory.percentage > 30) {
    tips.push(`You're spending ${highestCategory.percentage.toFixed(1)}% of your budget on ${highestCategory.category}. Consider setting a specific budget for this category.`);
  }
  
  // Frequent small purchases
  const smallPurchases = filteredExpenses.filter(e => e.amount < 10);
  if (smallPurchases.length > 5) {
    tips.push(`You have ${smallPurchases.length} small purchases. These add up to ${formatCurrency(smallPurchases.reduce((t, e) => t + e.amount, 0))}. Try batching these purchases to save money.`);
  }
  
  // Food specific tip
  const foodExpenses = categorySummaries.find(c => c.category === 'food');
  if (foodExpenses && foodExpenses.percentage > 25) {
    tips.push('Your food expenses are quite high. Consider meal prepping or cooking at home more often to save money.');
  }
  
  // Entertainment specific tip
  const entertainmentExpenses = categorySummaries.find(c => c.category === 'entertainment');
  if (entertainmentExpenses && entertainmentExpenses.amount > 100) {
    tips.push('Look for free or low-cost entertainment options like student discounts, community events, or streaming service sharing with friends.');
  }
  
  // Generic tips
  tips.push('Track your daily expenses consistently for better financial awareness.');
  tips.push('Set specific saving goals to stay motivated with your budget.');
  
  return tips;
};

export const getRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const getSampleExpenses = (): Expense[] => {
  const today = new Date();
  
  return [
    {
      id: '1',
      amount: 15.50,
      category: 'food',
      description: 'Lunch at cafeteria',
      date: format(today, 'yyyy-MM-dd')
    },
    {
      id: '2',
      amount: 25.00,
      category: 'transport',
      description: 'Bus pass',
      date: format(subDays(today, 2), 'yyyy-MM-dd')
    },
    {
      id: '3',
      amount: 50.00,
      category: 'entertainment',
      description: 'Movie with friends',
      date: format(subDays(today, 5), 'yyyy-MM-dd')
    },
    {
      id: '4',
      amount: 120.00,
      category: 'shopping',
      description: 'New textbooks',
      date: format(subDays(today, 10), 'yyyy-MM-dd')
    },
    {
      id: '5',
      amount: 35.00,
      category: 'utilities',
      description: 'Phone bill',
      date: format(subDays(today, 15), 'yyyy-MM-dd')
    },
    {
      id: '6',
      amount: 8.50,
      category: 'food',
      description: 'Coffee and snack',
      date: format(subDays(today, 1), 'yyyy-MM-dd')
    },
    {
      id: '7',
      amount: 22.00,
      category: 'food',
      description: 'Groceries',
      date: format(subDays(today, 3), 'yyyy-MM-dd')
    }
  ] as Expense[];
};
