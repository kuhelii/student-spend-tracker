
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TimeFrameSelector from '@/components/dashboard/TimeFrameSelector';
import BudgetCard from '@/components/dashboard/BudgetCard';
import ExpenseForm from '@/components/dashboard/ExpenseForm';
import RecentExpenses from '@/components/dashboard/RecentExpenses';
import ExpenseChart from '@/components/analytics/ExpenseChart';
import { useExpense } from '@/context/ExpenseContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, fetchExpenses } = useExpense();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch expenses when dashboard is loaded
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, fetchExpenses]);
  
  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Track your expenses and manage your budget</p>
          </div>
          
          {/* Quick action buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/history')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              View All Expenses
            </Button>
          </div>
        </div>
        
        <TimeFrameSelector />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BudgetCard />
            <RecentExpenses />
          </div>
          
          <div className="space-y-6">
            <ExpenseForm />
            <ExpenseChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
