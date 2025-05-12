
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency, getCategoryIcon } from '@/lib/expenseUtils';
import { CalendarDays } from 'lucide-react';

const RecentExpenses: React.FC = () => {
  const { state, removeExpense } = useExpense();
  
  const recentExpenses = [...state.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-purple-500" />
            Recent Expenses
          </CardTitle>
          <Link to="/history">
            <Button variant="link" size="sm" className="text-purple-500">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentExpenses.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No recent expenses found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentExpenses.map((expense) => (
              <li
                key={expense.id}
                className="expense-card flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-${expense.category}-100`}>
                    <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="text-xs text-gray-500">
                      {format(parseISO(expense.date), 'MMM d, yyyy')} · <span className="capitalize">{expense.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-right mr-4">
                    {formatCurrency(expense.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                    onClick={() => removeExpense(expense.id)}
                  >
                    ×
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground border-t mt-2 pt-3 pb-3">
        {recentExpenses.length > 0 ? `Showing ${recentExpenses.length} of ${state.expenses.length} expenses` : 'Add expenses to see them here'}
      </CardFooter>
    </Card>
  );
};

export default RecentExpenses;
