
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useExpense } from '@/context/ExpenseContext';
import { generateOptimizationTips } from '@/lib/expenseUtils';
import { Settings } from 'lucide-react';

const OptimizationTips: React.FC = () => {
  const { state } = useExpense();
  const { expenses, timeFrame } = state;
  
  const tips = generateOptimizationTips(expenses, timeFrame);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Settings className="mr-2 h-5 w-5 text-purple-500" />
          Optimization Tips
        </CardTitle>
        <CardDescription>
          Suggestions to help you optimize your spending
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tips.length > 0 ? (
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex gap-2 items-start">
                <span className="text-purple-500 text-lg">💡</span>
                <p className="text-sm">{tip}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground">
            No optimization tips available yet. Add more expenses for personalized recommendations.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationTips;
