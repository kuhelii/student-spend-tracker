
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TimeFrameSelector from '@/components/dashboard/TimeFrameSelector';
import ExpenseChart from '@/components/analytics/ExpenseChart';
import TrendChart from '@/components/analytics/TrendChart';
import OptimizationTips from '@/components/analytics/OptimizationTips';

const Analytics: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Get insights about your spending patterns</p>
        </div>
        
        <TimeFrameSelector />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ExpenseChart />
          <TrendChart />
        </div>
        
        <div className="mb-6">
          <OptimizationTips />
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
