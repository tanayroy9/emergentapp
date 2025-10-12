export default function Player({ embedUrl, logoUrl, nowPlaying }) {
  return (
    <div className="relative w-full" data-testid="player-container">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-cyan-500/30">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Nzuri TV Live"
            allow="autoplay; encrypted-media; fullscreen"
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
          <div className="bg-black/60 backdrop-blur-md rounded-lg px-4 py-2 border border-cyan-500/30">
            <span className="text-white font-bold text-xl tracking-wider">NZURI TV</span>
          </div>
        </div>
      </div>
    </div>
  );
}
