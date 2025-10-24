import { useState, useEffect } from 'react';
import axios from 'axios';
import Player from '../components/Player';
import RightSidebar from '../components/RightSidebar';
import ScheduleGrid from '../components/ScheduleGrid';
import Header from '../components/Header';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannel();
  }, []);

  useEffect(() => {
    if (channel) {
      loadNowPlaying();
      const interval = setInterval(loadNowPlaying, 10000);
      return () => clearInterval(interval);
    }
  }, [channel]);

  const loadChannel = async () => {
    try {
      const response = await axios.get(`${API}/channels`);
      if (response.data && response.data.length > 0) {
        setChannel(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNowPlaying = async () => {
    if (!channel) return;
    try {
      const response = await axios.get(`${API}/schedule/now-playing?channel_id=${channel.id}`);
      setNowPlaying(response.data);
    } catch (error) {
      console.error('Error loading now playing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const embedUrl = nowPlaying?.program?.youtube_link || channel?.default_embed_url || '';
  const logoUrl = '/nzuri-logo.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Player & Highlights */}
          <div className="flex-1 lg:w-2/3" data-testid="main-content">
            <Player 
              embedUrl={embedUrl} 
              logoUrl={logoUrl} 
              nowPlaying={nowPlaying}
            />
            
            {/* Now Playing Info */}
            {nowPlaying?.program && (
              <div className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20" data-testid="now-playing-info">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Now Playing</h3>
                <h4 className="text-xl font-bold text-white">{nowPlaying.program.title}</h4>
                {nowPlaying.program.description && (
                  <p className="text-gray-300 mt-2">{nowPlaying.program.description}</p>
                )}
                {nowPlaying.next_program && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400">Up Next: <span className="text-white font-medium">{nowPlaying.next_program.title}</span></p>
                  </div>
                )}
              </div>
            )}

            {/* November Highlights Section */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4 text-white" data-testid="highlights-heading">November Highlights</h2>
              
              {/* Movie Posters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_nzuritv/artifacts/hux5n7sj_1a.png" 
                  alt="Mining Talk" 
                  className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                />
                <img 
                  src="https://customer-assets.emergentagent.com/job_nzuritv/artifacts/hcyp4vat_1b.png" 
                  alt="Youth in Sports" 
                  className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                />
                <img 
                  src="https://customer-assets.emergentagent.com/job_nzuritv/artifacts/hfv4l82b_1c.png" 
                  alt="Mangwanani Africa" 
                  className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                />
                <img 
                  src="https://customer-assets.emergentagent.com/job_nzuritv/artifacts/zpooxxlu_1d.png" 
                  alt="Moyo Africa" 
                  className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <RightSidebar />
        </div>

        {/* Weekly Schedule Section */}
        <section className="mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20" data-testid="schedule-section">
          <h2 className="text-2xl font-bold mb-4 text-white">Weekly Schedule</h2>
          {channel && <ScheduleGrid channelId={channel.id} nowPlaying={nowPlaying} />}
        </section>
      </main>
    </div>
  );
}
