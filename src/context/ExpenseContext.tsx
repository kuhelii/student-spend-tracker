
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Expense, TimeFrame } from '@/types/expense';
import { toast } from '@/components/ui/sonner';
import { useAuth } from './AuthContext';
import { expenseReducer } from './expense/reducer';
import { getInitialState } from './expense/initialState';
import { ExpenseContextType } from './expense/types';
import { fetchUserExpenses, addUserExpense, removeUserExpense } from './expense/api';

// Create context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, getInitialState());
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
      const expenses = await fetchUserExpenses(user.id);
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
    } catch (error) {
      console.error('Error in fetchExpenses:', error);
    }
  };
  
  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    
    const newExpense = await addUserExpense(expense, user.id);
    if (newExpense) {
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    }
  };
  
  const removeExpense = async (id: string) => {
    if (!user) return;
    
    const success = await removeUserExpense(id);
    if (success) {
      dispatch({ type: 'REMOVE_EXPENSE', payload: id });
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
