
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/expenseUtils';
import { useExpense } from '@/context/ExpenseContext';
import { Wallet } from 'lucide-react';

const BudgetCard: React.FC = () => {
  const { state, setBudget } = useExpense();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(state.budget.toString());
  
  const { timeFrame } = state;
  const summary = state.summaryData[timeFrame];
  
  // Progress bar color based on percentage
  let progressColor = 'bg-green-500';
  if (summary.percentage > 80) {
    progressColor = 'bg-red-500';
  } else if (summary.percentage > 60) {
    progressColor = 'bg-yellow-500';
  }
  
  const handleBudgetUpdate = () => {
    const budgetValue = parseFloat(newBudget);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      setBudget(budgetValue);
      setIsDialogOpen(false);
    }
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-purple-500" />
            Budget Overview
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Your Budget</DialogTitle>
                <DialogDescription>
                  Set your new budget amount for better expense tracking.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="Enter new budget amount"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBudgetUpdate}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Budget Usage</div>
          <Progress value={summary.percentage} className={progressColor} />
          <div className="flex justify-between mt-1 text-sm">
            <span>{summary.percentage.toFixed(0)}% used</span>
            <span>{formatCurrency(summary.spent)} / {formatCurrency(summary.total)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-700">Available</div>
            <div className="text-xl font-bold text-green-800 animated-number">
              {formatCurrency(summary.remaining)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-700">Spent</div>
            <div className="text-xl font-bold text-purple-800 animated-number">
              {formatCurrency(summary.spent)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t mt-2 pt-2">
        Based on your {timeFrame} expenses
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
