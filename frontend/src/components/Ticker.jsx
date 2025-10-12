import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Ticker() {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    loadTickers();
    const interval = setInterval(loadTickers, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTickers = async () => {
    try {
      const response = await axios.get(`${API}/ticker`);
      setTickers(response.data);
    } catch (error) {
      console.error('Error loading tickers:', error);
    }
  };

  const tickerText = tickers.length > 0 
    ? tickers.map(t => t.text).join(' • ')
    : 'Welcome to Nzuri TV - Your source for local and international news';

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-black via-gray-900 to-black border-t-2 border-cyan-500 py-3 overflow-hidden z-50" data-testid="ticker-container">
      <div className="flex items-center">
        <div className="bg-cyan-500 text-black font-bold px-6 py-1 text-sm uppercase tracking-wider flex-shrink-0">
          Breaking News
        </div>
        <div className="flex-1 overflow-hidden ml-4">
          <div className="animate-marquee text-white font-medium text-base" data-testid="ticker-text">
            {tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}
