
// File: src/components/CryptoTable.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatNumber, formatCurrency, formatPercent } from '../utils/formatters';
import PriceChange from '../Components/PriceChange';
import SparklineChart from './SparkLineChart';

const CryptoTable = () => {
  const { cryptocurrencies } = useSelector((state) => state.crypto);
  const [favoriteCoins, setFavoriteCoins] = useState([]);

  const toggleFavorite = (id) => {
    if (favoriteCoins.includes(id)) {
      setFavoriteCoins(favoriteCoins.filter(coinId => coinId !== id));
    } else {
      setFavoriteCoins([...favoriteCoins, id]);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              1h %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              7d %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Market Cap
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Volume(24h)
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Circulating Supply
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {cryptocurrencies.map((crypto, index) => (
            <tr key={crypto.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <button 
                  onClick={() => toggleFavorite(crypto.id)}
                  className="focus:outline-none"
                >
                  <svg 
                    className={`w-5 h-5 ${favoriteCoins.includes(crypto.id) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                <span className="ml-2">{index + 1}</span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{crypto.name}</div>
                    <div className="text-gray-500 text-sm">{crypto.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                {formatCurrency(crypto.price)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <PriceChange value={crypto.price_change_percentage_1h_in_currency} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <PriceChange value={crypto.price_change_percentage_24h} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <PriceChange value={crypto.price_change_percentage_7d_in_currency} />
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                {formatCurrency(crypto.market_cap)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <div>
                  {formatCurrency(crypto.total_volume)}
                </div>
                <div className="text-gray-500 text-sm">
                  {formatNumber(crypto.total_volume / crypto.price)} {crypto.symbol.toUpperCase()}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <SparklineChart data={crypto.sparkline_in_7d?.price || []} change={crypto.price_change_percentage_7d_in_currency} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;