// // File: src/App.jsx
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCryptoData, updateCryptoPrice } from './redux/cryptoSlice';
// import CryptoTable from './Components/CryptoTable';
// import { ChevronUp } from 'lucide-react';

// function App() {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.crypto);

//   useEffect(() => {
//     dispatch(fetchCryptoData());
    
//     // Set up WebSocket connection
//     const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    
//     // List of symbols to subscribe to
//     const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'solusdt'];
    
//     // Subscribe to ticker streams for each symbol
//     const subscribeMsg = {
//       method: 'SUBSCRIBE',
//       params: symbols.map(symbol => `${symbol}@ticker`),
//       id: 1
//     };
    
//     ws.onopen = () => {
//       ws.send(JSON.stringify(subscribeMsg));
//     };
    
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
      
//       // Make sure we have the right data format
//       if (data.s && data.c) {
//         const symbol = data.s.toUpperCase();
//         const price = parseFloat(data.c);
//         const priceChange24h = parseFloat(data.p);
//         const priceChangePercent24h = parseFloat(data.P);
        
//         dispatch(updateCryptoPrice({ 
//           symbol,
//           price,
//           priceChange24h,
//           priceChangePercent24h
//         }));
//       }
//     };
    
//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         const unsubscribeMsg = {
//           method: 'UNSUBSCRIBE',
//           params: symbols.map(symbol => `${symbol}@ticker`),
//           id: 2
//         };
//         ws.send(JSON.stringify(unsubscribeMsg));
//         ws.close();
//       }
//     };
//   }, [dispatch]);

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="container mx-auto py-8 px-4">
//         <h1 className="text-2xl font-bold mb-6">Cryptocurrency Market</h1>
        
//         {loading && <p>Loading cryptocurrency data...</p>}
//         {error && <p className="text-red-500">Error: {error}</p>}
        
//         <CryptoTable />
        
//         <button 
//           className="fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg"
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         >
//           <ChevronUp size={24} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;

// File: src/App.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData, updateCryptoPrice } from './redux/cryptoSlice';
import CryptoTable from './Components/CryptoTable';
import { ChevronUp } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchCryptoData());
    
    // Set up WebSocket connection to Binance
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');
    
    // Define the symbols we want to track
    const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'solusdt'];
    
    // Create the subscription message for all symbols
    const subscribeMsg = {
      method: 'SUBSCRIBE',
      params: symbols.map(symbol => `${symbol}@ticker`),
      id: 1
    };
    
    ws.onopen = () => {
      console.log('Connected to Binance WebSocket');
      ws.send(JSON.stringify(subscribeMsg));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Check if we have ticker data
        if (data && data.s) {
          const symbol = data.s.toLowerCase(); // Symbol like 'BTCUSDT'
          const baseSymbol = symbol.replace('usdt', ''); // Just 'btc'
          
          // Extract the data we need
          const price = parseFloat(data.c); // Current price
          const priceChange24h = parseFloat(data.p); // Price change
          const priceChangePercent24h = parseFloat(data.P); // Price change percentage
          const volume24h = parseFloat(data.v) * price; // 24h volume in USD
          
          // Dispatch the update action
          dispatch(updateCryptoPrice({
            symbol: baseSymbol,
            price,
            priceChange24h,
            priceChangePercent24h,
            volume24h
          }));
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('Disconnected from Binance WebSocket');
    };
    
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        // Unsubscribe before closing
        const unsubscribeMsg = {
          method: 'UNSUBSCRIBE',
          params: symbols.map(symbol => `${symbol}@ticker`),
          id: 2
        };
        ws.send(JSON.stringify(unsubscribeMsg));
        ws.close();
      }
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl mb-6"><span className='text-blue-700 font-bold text-3xl'  >TrackrX</span>  -  Real-Time Crypto Price Tracker</h1>
        
        {loading && <p>Loading cryptocurrency data...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        
        <CryptoTable />
        
        <button 
          className="fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;