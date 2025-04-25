export const formatNumber = (num) => {
  if (num === undefined || num === null) return '-';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
};

export const formatCurrency = (num) => {
  if (num === undefined || num === null) return '-';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: num < 1 ? 8 : 2
  });
  
  return formatter.format(num);
};

export const formatPercent = (num) => {
  if (num === undefined || num === null) return '-';
  return `${num.toFixed(2)}%`;
};