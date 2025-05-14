
import { ExpenseState } from '@/types/expense';
import { calculateCategorySummaries } from '@/lib/expenseUtils';

// Initial state
export const initialState: ExpenseState = {
  expenses: [],
  budget: 1000,
  timeFrame: 'monthly',
  summaryData: {
    daily: { total: 0, spent: 0, remaining: 0, percentage: 0 },
    weekly: { total: 0, spent: 0, remaining: 0, percentage: 0 },
    monthly: { total: 0, spent: 0, remaining: 0, percentage: 0 },
    yearly: { total: 0, spent: 0, remaining: 0, percentage: 0 },
  },
  categorySummaries: []
};

// Initialize state with proper category summaries
export const getInitialState = (): ExpenseState => {
  return {
    ...initialState,
    categorySummaries: calculateCategorySummaries([], initialState.timeFrame)
  };
};
