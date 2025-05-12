
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TimeFrame } from '@/types/expense';

const TimeFrameSelector: React.FC = () => {
  const { state, setTimeFrame } = useExpense();
  const { timeFrame } = state;
  
  const handleTimeFrameChange = (value: string) => {
    if (value) {
      setTimeFrame(value as TimeFrame);
    }
  };
  
  return (
    <div className="mb-6">
      <ToggleGroup
        type="single"
        value={timeFrame}
        onValueChange={handleTimeFrameChange}
        className="justify-center"
      >
        <ToggleGroupItem value="daily" className="px-4">
          Daily
        </ToggleGroupItem>
        <ToggleGroupItem value="weekly" className="px-4">
          Weekly
        </ToggleGroupItem>
        <ToggleGroupItem value="monthly" className="px-4">
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem value="yearly" className="px-4">
          Yearly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TimeFrameSelector;
