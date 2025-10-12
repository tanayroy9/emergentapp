import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Player({ embedUrl, logoUrl, nowPlaying }) {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    loadTickers();
    const interval = setInterval(loadTickers, 30000);
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
    <div className="relative w-full" data-testid="player-container">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Nzuri TV Live"
            allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            data-testid="video-iframe"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-gray-400 text-lg">No content scheduled</p>
            </div>
          </div>
        )}
        
        {/* Logo Overlay - Top Right */}
        <div className="absolute top-4 right-4 z-50" data-testid="logo-overlay">
          <img src="/nzuri-logo.svg" alt="Nzuri TV" className="w-32 h-16 drop-shadow-2xl" />
        </div>

        {/* Breaking News Ticker Overlay - Inside Player */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 via-red-700 to-red-600 py-2 z-40" data-testid="player-ticker">
          <div className="flex items-center">
            <div className="bg-white text-red-600 font-bold px-4 py-1 text-xs uppercase tracking-wider flex-shrink-0">
              Breaking
            </div>
            <div className="flex-1 overflow-hidden ml-3">
              <div className="animate-marquee text-white font-medium text-sm whitespace-nowrap">
                {tickerText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
