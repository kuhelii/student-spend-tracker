
import { Expense } from '@/types/expense';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

export const fetchUserExpenses = async (userId: string | undefined) => {
  if (!userId) return [];

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
      
      return formattedExpenses;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    toast("Error loading expenses", {
      description: "There was a problem loading your expenses."
    });
    return [];
  }
};

export const addUserExpense = async (expense: Omit<Expense, 'id'>, userId: string | undefined) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: userId,
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
      
      toast("Expense added", {
        description: `${expense.description} - $${expense.amount}`,
      });
      
      return newExpense;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error adding expense:', error);
    toast("Error adding expense", {
      description: error.message || "There was a problem adding your expense."
    });
    return null;
  }
};

export const removeUserExpense = async (id: string) => {
  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast("Expense removed", {
      description: "The expense has been removed successfully",
    });
    
    return true;
  } catch (error: any) {
    console.error('Error removing expense:', error);
    toast("Error removing expense", {
      description: error.message || "There was a problem removing your expense."
    });
    return false;
  }
};
