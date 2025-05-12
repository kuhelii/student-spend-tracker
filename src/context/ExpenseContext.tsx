
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ExpenseState, Expense, TimeFrame } from '@/types/expense';
import { calculateBudgetSummary, calculateCategorySummaries, getSampleExpenses, getRandomId } from '@/lib/expenseUtils';
import { useToast } from '@/components/ui/use-toast';

// Define action types
type ExpenseAction = 
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'SET_TIME_FRAME'; payload: TimeFrame }
  | { type: 'LOAD_INITIAL_DATA' };

// Initial state
const initialState: ExpenseState = {
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

// Reducer function
const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExpense = { ...action.payload, id: getRandomId() };
      const updatedExpenses = [...state.expenses, newExpense];
      
      // Recalculate summaries
      return {
        ...state,
        expenses: updatedExpenses,
        summaryData: {
          daily: calculateBudgetSummary(updatedExpenses, state.budget, 'daily'),
          weekly: calculateBudgetSummary(updatedExpenses, state.budget, 'weekly'),
          monthly: calculateBudgetSummary(updatedExpenses, state.budget, 'monthly'),
          yearly: calculateBudgetSummary(updatedExpenses, state.budget, 'yearly'),
        },
        categorySummaries: calculateCategorySummaries(updatedExpenses, state.timeFrame)
      };
    }
    
    case 'REMOVE_EXPENSE': {
      const updatedExpenses = state.expenses.filter(expense => expense.id !== action.payload);
      
      return {
        ...state,
        expenses: updatedExpenses,
        summaryData: {
          daily: calculateBudgetSummary(updatedExpenses, state.budget, 'daily'),
          weekly: calculateBudgetSummary(updatedExpenses, state.budget, 'weekly'),
          monthly: calculateBudgetSummary(updatedExpenses, state.budget, 'monthly'),
          yearly: calculateBudgetSummary(updatedExpenses, state.budget, 'yearly'),
        },
        categorySummaries: calculateCategorySummaries(updatedExpenses, state.timeFrame)
      };
    }
    
    case 'SET_BUDGET': {
      return {
        ...state,
        budget: action.payload,
        summaryData: {
          daily: calculateBudgetSummary(state.expenses, action.payload, 'daily'),
          weekly: calculateBudgetSummary(state.expenses, action.payload, 'weekly'),
          monthly: calculateBudgetSummary(state.expenses, action.payload, 'monthly'),
          yearly: calculateBudgetSummary(state.expenses, action.payload, 'yearly'),
        }
      };
    }
    
    case 'SET_TIME_FRAME': {
      return {
        ...state,
        timeFrame: action.payload,
        categorySummaries: calculateCategorySummaries(state.expenses, action.payload)
      };
    }
    
    case 'LOAD_INITIAL_DATA': {
      const sampleExpenses = getSampleExpenses();
      
      return {
        ...state,
        expenses: sampleExpenses,
        summaryData: {
          daily: calculateBudgetSummary(sampleExpenses, state.budget, 'daily'),
          weekly: calculateBudgetSummary(sampleExpenses, state.budget, 'weekly'),
          monthly: calculateBudgetSummary(sampleExpenses, state.budget, 'monthly'),
          yearly: calculateBudgetSummary(sampleExpenses, state.budget, 'yearly'),
        },
        categorySummaries: calculateCategorySummaries(sampleExpenses, state.timeFrame)
      };
    }
    
    default:
      return state;
  }
};

// Create context
type ExpenseContextType = {
  state: ExpenseState;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  setBudget: (amount: number) => void;
  setTimeFrame: (timeFrame: TimeFrame) => void;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load initial sample data
    dispatch({ type: 'LOAD_INITIAL_DATA' });
  }, []);
  
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
    toast({
      title: "Expense added",
      description: `${expense.description} - $${expense.amount}`,
    });
  };
  
  const removeExpense = (id: string) => {
    dispatch({ type: 'REMOVE_EXPENSE', payload: id });
    toast({
      title: "Expense removed",
      description: "The expense has been removed successfully",
    });
  };
  
  const setBudget = (amount: number) => {
    dispatch({ type: 'SET_BUDGET', payload: amount });
    toast({
      title: "Budget updated",
      description: `Your budget has been set to $${amount}`,
    });
  };
  
  const setTimeFrame = (timeFrame: TimeFrame) => {
    dispatch({ type: 'SET_TIME_FRAME', payload: timeFrame });
  };
  
  return (
    <ExpenseContext.Provider value={{ state, addExpense, removeExpense, setBudget, setTimeFrame }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook for using the context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
