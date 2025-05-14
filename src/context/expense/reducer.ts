
import { ExpenseState } from '@/types/expense';
import { ExpenseAction } from './types';
import { calculateBudgetSummary, calculateCategorySummaries, getRandomId } from '@/lib/expenseUtils';
import { initialState } from './initialState';

// Reducer function
export const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
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
