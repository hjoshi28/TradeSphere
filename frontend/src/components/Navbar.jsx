import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'User';

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black border-b border-zinc-800 px-8 py-5 flex justify-between items-center shadow-md">
      {/* Platform Branding */}
      <Link to="/" className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-2.5">
        <span>TradeSphere</span>
        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
      </Link>

      {/* Navigation Controls */}
      {token ? (
        <div className="flex gap-8 items-center">
          <div className="flex gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
            <Link 
              to="/" 
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') 
                  ? 'bg-zinc-900 text-purple-400' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/trade" 
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/trade') 
                  ? 'bg-zinc-900 text-purple-400' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Trading Simulator
            </Link>
          </div>

          <div className="text-sm font-semibold text-zinc-400 font-mono">
            user_id: <span className="text-surface-900 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md ml-1">{userName}</span>
          </div>

          <button 
            onClick={logout} 
            className="text-sm font-bold text-zinc-400 hover:text-pink-400 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <Link 
          to="/login" 
          className="bg-white hover:bg-zinc-200 text-black px-5 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Navbar;