import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ExpenseState, Expense, TimeFrame } from '@/types/expense';
import { calculateBudgetSummary, calculateCategorySummaries, getRandomId } from '@/lib/expenseUtils';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

// Define action types
type ExpenseAction = 
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'SET_TIME_FRAME'; payload: TimeFrame }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'INITIALIZE' };

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
    
    case 'SET_EXPENSES': {
      const expenses = action.payload;
      
      return {
        ...state,
        expenses,
        summaryData: {
          daily: calculateBudgetSummary(expenses, state.budget, 'daily'),
          weekly: calculateBudgetSummary(expenses, state.budget, 'weekly'),
          monthly: calculateBudgetSummary(expenses, state.budget, 'monthly'),
          yearly: calculateBudgetSummary(expenses, state.budget, 'yearly'),
        },
        categorySummaries: calculateCategorySummaries(expenses, state.timeFrame)
      };
    }
    
    case 'INITIALIZE': {
      return {
        ...initialState,
        categorySummaries: calculateCategorySummaries([], initialState.timeFrame)
      };
    }
    
    default:
      return state;
  }
};

// Create context
type ExpenseContextType = {
  state: ExpenseState;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  setBudget: (amount: number) => void;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  fetchExpenses: () => Promise<void>;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { user } = useAuth();
  
  // Fetch expenses when user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      // Reset state when logged out
      dispatch({ type: 'INITIALIZE' });
    }
  }, [user]);
  
  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedExpenses: Expense[] = data.map(item => ({
          id: item.id,
          amount: Number(item.amount),
          category: item.category as any,
          description: item.description,
          date: format(new Date(item.date), 'yyyy-MM-dd'),
        }));
        
        dispatch({ type: 'SET_EXPENSES', payload: formattedExpenses });
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast("Error loading expenses", {
        description: "There was a problem loading your expenses."
      });
    }
  };
  
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    
    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: new Date(expense.date).toISOString(),
        }])
        .select('*')
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newExpense: Expense = {
          id: data.id,
          amount: Number(data.amount),
          category: data.category as any,
          description: data.description,
          date: format(new Date(data.date), 'yyyy-MM-dd'),
        };
        
        // Update local state
        dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
        
        toast("Expense added", {
          description: `${expense.description} - $${expense.amount}`,
        });
      }
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast("Error adding expense", {
        description: error.message || "There was a problem adding your expense."
      });
    }
  };
  
  const removeExpense = async (id: string) => {
    if (!user) return;
    
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      dispatch({ type: 'REMOVE_EXPENSE', payload: id });
      
      toast("Expense removed", {
        description: "The expense has been removed successfully",
      });
    } catch (error: any) {
      console.error('Error removing expense:', error);
      toast("Error removing expense", {
        description: error.message || "There was a problem removing your expense."
      });
    }
  };
  
  const setBudget = (amount: number) => {
    dispatch({ type: 'SET_BUDGET', payload: amount });
    toast("Budget updated", {
      description: `Your budget has been set to $${amount}`,
    });
  };
  
  const setTimeFrame = (timeFrame: TimeFrame) => {
    dispatch({ type: 'SET_TIME_FRAME', payload: timeFrame });
  };
  
  return (
    <ExpenseContext.Provider value={{ 
      state, 
      addExpense, 
      removeExpense, 
      setBudget, 
      setTimeFrame,
      fetchExpenses
    }}>
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
