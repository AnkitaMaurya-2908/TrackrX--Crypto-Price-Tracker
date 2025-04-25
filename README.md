# 📈 TrackerX - Crypto Price Tracker 💰

A real-time cryptocurrency price tracker that displays live market data using React, Redux Toolkit, Tailwind CSS, and the Binance WebSocket API.

## ✨ Project Overview

This application displays real-time cryptocurrency data in a responsive table format similar to CoinMarketCap or CoinGecko. It fetches initial data and then maintains live updates through WebSockets, with all state managed via Redux Toolkit.

### 🚀 Features

- **⚡ Real-time Price Updates**: Live data from Binance WebSocket API
- **📱 Responsive Data Table**: Displays comprehensive crypto market data
- **🎨 Visual Indicators**: Color-coded price changes (green for positive, red for negative)
- **📊 7-Day Price Charts**: Visual representation of price trends
- **⭐ Favorite/Star System**: Mark your favorite cryptocurrencies
- **🔄 Fully Redux-managed State**: No local component state for data

## 🛠️ Tech Stack

- **⚛️ React**: UI framework
- **🔄 Redux Toolkit**: State management
- **💅 Tailwind CSS**: Styling
- **📊 Recharts**: Data visualization
- **📡 Binance WebSocket API**: Live price data
- **🦎 CoinGecko API**: Initial market data
- **⚡ Vite**: Build tool and development environment

## 🏗️ Architecture

### 🔄 Data Flow

1. **Initial Load**:
   - Application fetches initial cryptocurrency data from CoinGecko API
   - Data is stored in Redux state

2. **Real-time Updates**:
   - WebSocket connection established with Binance
   - Subscribes to ticker streams for major cryptocurrencies (BTC, ETH, USDT, XRP, BNB, SOL)
   - Incoming WebSocket messages trigger Redux actions
   - UI components re-render with updated data

### 🧩 Component Structure

- **📱 App**: Main component, manages WebSocket connection
- **📊 CryptoTable**: Displays the cryptocurrency data table
- **💹 PriceChange**: Handles price change display with color coding
- **📈 SparklineChart**: Renders 7-day price charts

### 🔄 Redux Structure

- **🏪 Store**: Central Redux store configuration
- **🍕 CryptoSlice**: Manages cryptocurrency data state
  - Initial data loading
  - WebSocket update handling
  - Price change calculations

## 🚀 Setup Instructions

### 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crypto-tracker.git
   cd crypto-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

The application will automatically:
- Load initial cryptocurrency data
- Connect to Binance WebSocket for real-time updates
- Display live price changes and market data

You can:
- ⭐ Star/favorite cryptocurrencies by clicking the star icon
- 📊 View detailed market data for each cryptocurrency
- 📈 Monitor price trends with the 7-day sparkline charts

## 🔍 Implementation Details

### 📡 WebSocket Implementation

The application connects to the Binance WebSocket API and subscribes to ticker streams for multiple cryptocurrencies. When new data arrives, it dispatches Redux actions to update the store.

```javascript
// WebSocket connection and subscription
const ws = new WebSocket('wss://stream.binance.com:9443/ws');
const symbols = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'solusdt'];
const subscribeMsg = {
  method: 'SUBSCRIBE',
  params: symbols.map(symbol => `${symbol}@ticker`),
  id: 1
};
```

### 🔄 Redux State Management

All cryptocurrency data is managed through Redux Toolkit. The application uses a dedicated slice for crypto data:

```javascript
const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptocurrencies: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateCryptoPrice: (state, action) => {
      // Update logic for WebSocket data
    }
  },
  extraReducers: (builder) => {
    // Handle initial data fetching
  }
});
```

## 🔮 Future Improvements

- 🔍 Add filtering and sorting capabilities
- 🔎 Implement search functionality
- 🌓 Add dark/light theme toggle
- 💾 Persist favorites to localStorage
- 🪙 Add more cryptocurrencies and detailed views
- 🧪 Implement unit tests for reducers and selectors

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ by Ankita

---

⭐ Don't forget to star this repo if you find it useful! ⭐
