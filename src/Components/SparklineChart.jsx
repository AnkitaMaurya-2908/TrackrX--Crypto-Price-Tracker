// File: src/components/SparklineChart.jsx
import React from 'react';
import { Line } from 'recharts';
import { LineChart } from 'recharts';

const SparklineChart = ({ data, change }) => {
  if (!data || data.length === 0) {
    return <div className="h-12 w-32">No data available</div>;
  }

  const chartData = data.map((price, index) => ({
    value: price,
    index
  }));

  const isPositive = change >= 0;
  const strokeColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div className="h-12 w-32">
      <LineChart width={128} height={48} data={chartData}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={strokeColor} 
          strokeWidth={1.5} 
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
};

export default SparklineChart;