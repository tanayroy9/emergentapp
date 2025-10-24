import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Sun, Cloud, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function RightSidebar() {
  const [ads, setAds] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadAds();
    
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const loadAds = async () => {
    try {
      const response = await axios.get(`${API}/ads`);
      setAds(response.data);
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const getZimbabweTime = () => {
    const options = {
      timeZone: 'Africa/Harare',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(currentTime);
  };

  const getZimbabweDate = () => {
    const options = {
      timeZone: 'Africa/Harare',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(currentTime);
  };

  return (
    <aside className="w-full lg:w-1/3 space-y-6" data-testid="right-sidebar">
      {/* Weather Widget - Harare, Zimbabwe */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-5 border border-cyan-500/30" data-testid="weather-widget">
        <h2 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
          <Sun className="text-cyan-400" size={20} />
          Weather - Harare
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">22°C</p>
              <p className="text-sm text-gray-400">Harare, Zimbabwe</p>
            </div>
            <Cloud className="text-cyan-400" size={48} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700">
            <div className="text-center">
              <Sun className="mx-auto mb-1 text-yellow-400" size={20} />
              <p className="text-xs text-gray-400">Tomorrow</p>
              <p className="text-sm font-semibold text-white">24°</p>
            </div>
            <div className="text-center">
              <Cloud className="mx-auto mb-1 text-gray-400" size={20} />
              <p className="text-xs text-gray-400">Tue</p>
              <p className="text-sm font-semibold text-white">21°</p>
            </div>
            <div className="text-center">
              <CloudRain className="mx-auto mb-1 text-blue-400" size={20} />
              <p className="text-xs text-gray-400">Wed</p>
              <p className="text-sm font-semibold text-white">19°</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Clock - Zimbabwe Time */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30" data-testid="live-clock">
        <h2 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
          <Clock className="text-blue-400" size={20} />
          Local Time
        </h2>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2 font-mono">
            {getZimbabweTime()}
          </div>
          <p className="text-sm text-gray-400">{getZimbabweDate()}</p>
          <p className="text-xs text-cyan-400 mt-2">Harare, Zimbabwe (CAT)</p>
        </div>
      </div>

      {/* Exclusive Content On Demand */}
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-5 border border-gray-700">
        <h3 className="font-semibold text-white mb-3">Exclusive Content On Demand</h3>
        <div className="space-y-2">
          {['Economy', 'Sports', 'Mining', 'Green Energy', 'Music', 'Entertainment'].map((category) => (
            <button
              key={category}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
              data-testid={`category-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
