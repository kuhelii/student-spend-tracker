
export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'utilities' 
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface BudgetSummary {
  total: number;
  remaining: number;
  spent: number;
  percentage: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ExpenseState {
  expenses: Expense[];
  budget: number;
  timeFrame: TimeFrame;
  summaryData: {
    daily: BudgetSummary;
    weekly: BudgetSummary;
    monthly: BudgetSummary;
    yearly: BudgetSummary;
  };
  categorySummaries: CategorySummary[];
}
