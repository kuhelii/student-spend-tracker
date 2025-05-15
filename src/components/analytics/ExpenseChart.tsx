
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CATEGORY_COLORS, formatCurrency } from '@/lib/expenseUtils';
import { ChartPie } from 'lucide-react';

const ExpenseChart: React.FC = () => {
  const { state } = useExpense();
  const { categorySummaries } = state;

  // Filter out categories with zero amount
  const chartData = categorySummaries
    .filter(summary => summary.amount > 0)
    .map(summary => ({
      name: summary.category.charAt(0).toUpperCase() + summary.category.slice(1),
      value: summary.amount,
      percentage: summary.percentage
    }));

  // Generate pie chart color cells
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center">
          <ChartPie className="mr-2 h-5 w-5 text-purple-500" />
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No expense data to display
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name.toLowerCase() as keyof typeof CATEGORY_COLORS]?.dark || '#8884d8'} 
                    />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'Amount']}
                  labelFormatter={(name) => `Category: ${name}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Improved breakdown cards for better dark/light mode */}
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categorySummaries
              .filter(summary => summary.amount > 0)
              .map(summary => (
                <div
                  key={summary.category}
                  className={`
                    w-full flex flex-col items-center 
                    rounded-xl px-3 py-2
                    shadow
                    glass-morphism
                    transition
                    bg-white/70
                    dark:bg-purple-950/70
                    backdrop-blur-md
                    border border-white/30 dark:border-purple-900/60
                  `}
                >
                  <div
                    className={`
                      text-xs font-bold capitalize tracking-wide
                      mb-1
                      ${summary.category === 'other'
                        ? 'text-gray-600 dark:text-gray-200'
                        : ''}
                    `}
                  >
                    {summary.category}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-purple-100">
                    {formatCurrency(summary.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-purple-200 flex gap-1">
                    <span>{summary.percentage.toFixed(1)}%</span>
                    <span>&bull;</span>
                    <span>{summary.count} {summary.count === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;

