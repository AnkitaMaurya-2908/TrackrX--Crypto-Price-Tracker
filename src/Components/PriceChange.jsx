
// File: src/components/PriceChange.jsx
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PriceChange = ({ value }) => {
  if (value === undefined || value === null) {
    return <span>-</span>;
  }

  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <div className={`flex items-center justify-end ${isPositive ? 'text-green-500' : isNeutral ? 'text-gray-500' : 'text-red-500'}`}>
      {isPositive ? (
        <ChevronUp size={16} className="mr-1" />
      ) : isNeutral ? null : (
        <ChevronDown size={16} className="mr-1" />
      )}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
};

export default PriceChange;