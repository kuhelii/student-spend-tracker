
import { ExpenseState, Expense, TimeFrame } from '@/types/expense';

// Define action types
export type ExpenseAction = 
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'SET_TIME_FRAME'; payload: TimeFrame }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'INITIALIZE' };

// Define context type
export type ExpenseContextType = {
  state: ExpenseState;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  setBudget: (amount: number) => void;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  fetchExpenses: () => Promise<void>;
};
