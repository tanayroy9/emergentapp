import { Link } from 'react-router-dom';
import { Home, Calendar, LogIn } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-black/80 backdrop-blur-lg border-b border-cyan-500/30 sticky top-0 z-40" data-testid="main-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src="https://customer-assets.emergentagent.com/job_nzuritv/artifacts/0w4oq3kd_Nzurilogo.png" alt="Nzuri TV" className="h-14" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Nzuri TV</h1>
              <p className="text-xs text-cyan-400 -mt-1">News & Entertainment</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors" data-testid="nav-home">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <a href="#schedule" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors" data-testid="nav-schedule">
              <Calendar size={18} />
              <span>Schedule</span>
            </a>
            <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors" data-testid="nav-login">
              <LogIn size={18} />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/login" className="p-2 text-cyan-400 hover:bg-gray-800 rounded-lg">
              <LogIn size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
