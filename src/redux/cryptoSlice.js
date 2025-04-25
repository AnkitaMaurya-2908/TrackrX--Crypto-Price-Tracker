
// // File: src/redux/cryptoSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // Initial coins to track
// const INITIAL_COINS = [
//   'bitcoin', 'ethereum', 'tether', 'ripple', 'binancecoin', 'solana'
// ];

// export const fetchCryptoData = createAsyncThunk(
//   'crypto/fetchCryptoData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${INITIAL_COINS.join(',')}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
//       );
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const cryptoSlice = createSlice({
//   name: 'crypto',
//   initialState: {
//     cryptocurrencies: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     updateCryptoPrice: (state, action) => {
//       const { symbol, price, priceChangePercent24h } = action.payload;
      
//       // Find the crypto by symbol
//       const crypto = state.cryptocurrencies.find(
//         c => c.symbol.toUpperCase() === symbol
//       );
      
//       if (crypto) {
//         crypto.price = price;
//         crypto.price_change_percentage_24h = priceChangePercent24h;
        
//         // Update the sparkline data (add new price to end, remove oldest)
//         if (crypto.sparkline_in_7d && crypto.sparkline_in_7d.price) {
//           crypto.sparkline_in_7d.price.push(price);
//           crypto.sparkline_in_7d.price.shift();
//         }
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCryptoData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCryptoData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.cryptocurrencies = action.payload;
//       })
//       .addCase(fetchCryptoData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { updateCryptoPrice } = cryptoSlice.actions;
// export default cryptoSlice.reducer;



// File: src/redux/cryptoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial coins to track
const INITIAL_COINS = [
  'bitcoin', 'ethereum', 'tether', 'ripple', 'binancecoin', 'solana'
];

// Symbol mapping between CoinGecko and Binance
const SYMBOL_MAPPING = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'usdt': 'tether',
  'xrp': 'ripple',
  'bnb': 'binancecoin',
  'sol': 'solana'
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${INITIAL_COINS.join(',')}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptocurrencies: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateCryptoPrice: (state, action) => {
      const { symbol, price, priceChange24h, priceChangePercent24h, volume24h } = action.payload;
      
      // Convert Binance symbol to CoinGecko id
      const coinId = SYMBOL_MAPPING[symbol];
      
      if (!coinId) return; // Skip if we don't have a mapping
      
      // Find the crypto by id
      const cryptoIndex = state.cryptocurrencies.findIndex(c => c.id === coinId);
      
      if (cryptoIndex !== -1) {
        const crypto = state.cryptocurrencies[cryptoIndex];
        
        // Calculate the 1h percent change by maintaining the difference
        // between 24h and 1h changes
        const diff1h24h = crypto.price_change_percentage_1h_in_currency - crypto.price_change_percentage_24h;
        
        // Update the data
        crypto.current_price = price;
        crypto.price_change_24h = priceChange24h;
        crypto.price_change_percentage_24h = priceChangePercent24h;
        crypto.price_change_percentage_1h_in_currency = priceChangePercent24h + diff1h24h;
        
        if (volume24h) {
          crypto.total_volume = volume24h;
        }
        
        // Update sparkline data
        if (crypto.sparkline_in_7d && crypto.sparkline_in_7d.price) {
          const newPrices = [...crypto.sparkline_in_7d.price];
          newPrices.push(price);
          newPrices.shift();
          crypto.sparkline_in_7d.price = newPrices;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.cryptocurrencies = action.payload.map(crypto => ({
          ...crypto,
          // Rename property to match our component expectations
          price: crypto.current_price
        }));
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;