
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/expenseUtils';
import { useToast } from '@/components/ui/use-toast';

const Settings: React.FC = () => {
  const { state, setBudget } = useExpense();
  const { toast } = useToast();
  const [budgetValue, setBudgetValue] = React.useState(state.budget.toString());
  
  const handleBudgetUpdate = () => {
    const newBudget = parseFloat(budgetValue);
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget);
      toast({
        title: "Budget updated",
        description: `Your budget has been set to ${formatCurrency(newBudget)}`,
      });
    } else {
      toast({
        title: "Invalid budget value",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
    }
  };
  
  const handleClearLocalData = () => {
    // In a real app, this would clear local storage
    toast({
      title: "Data cleared",
      description: "All your local data has been cleared",
    });
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your budget settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Configure your budget amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="budget">Monthly Budget</Label>
                  <div className="flex gap-2">
                    <Input
                      id="budget"
                      type="number"
                      value={budgetValue}
                      onChange={(e) => setBudgetValue(e.target.value)}
                      placeholder="Enter your budget amount"
                    />
                    <Button onClick={handleBudgetUpdate}>Update</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your current budget is {formatCurrency(state.budget)} per month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your expense data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Button variant="outline" onClick={handleClearLocalData}>
                    Clear Local Data
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will remove all your locally stored expense data and reset your settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>Student Expense Tracker v1.0</p>
                <p className="mt-2">
                  This application was designed to help students track and optimize their expenses.
                  Add your daily expenses, set a budget, and get insights to better manage your finances.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
