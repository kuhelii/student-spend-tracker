
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDate } from 'date-fns';
import { useExpense } from '@/context/ExpenseContext';
import { ChartBar } from 'lucide-react';

const TrendChart: React.FC = () => {
  const { state } = useExpense();
  const { expenses, timeFrame } = state;

  // Generate chart data based on time frame
  const chartData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    
    const daysInMonth = eachDayOfInterval({ start, end });
    
    // Initialize data with all days of the month
    const dailyData = daysInMonth.map(date => {
      return {
        date: format(date, 'yyyy-MM-dd'),
        day: getDate(date),
        amount: 0
      };
    });
    
    // Add expense amounts to corresponding days
    expenses.forEach(expense => {
      const expenseDate = parseISO(expense.date);
      const expenseMonth = expenseDate.getMonth();
      const expenseYear = expenseDate.getFullYear();
      
      // Only include expenses from current month
      if (expenseMonth === currentMonth && expenseYear === currentYear) {
        const day = getDate(expenseDate);
        const dayIndex = dailyData.findIndex(d => d.day === day);
        
        if (dayIndex !== -1) {
          dailyData[dayIndex].amount += expense.amount;
        }
      }
    });
    
    return dailyData;
  }, [expenses, timeFrame]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center">
          <ChartBar className="mr-2 h-5 w-5 text-purple-500" />
          Monthly Expense Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(day) => `Day ${day}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#9b87f5"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
