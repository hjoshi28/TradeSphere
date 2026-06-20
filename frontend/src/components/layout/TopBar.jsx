import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiBars3, HiMagnifyingGlass, HiBell } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { searchStock } from '../../services/api';

const TopBar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 1) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    try {
      setSearching(true);
      const { data } = await searchStock(query);
      setSearchResults(data.slice(0, 6));
      setShowResults(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (symbol) => {
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    navigate(`/market/${symbol}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/40">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Hamburger + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 rounded-xl bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-white cursor-pointer">
            <HiBars3 className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden sm:block w-full max-w-md">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search stocks (e.g. AAPL, TSLA)..."
              className="w-full bg-surface-900/60 border border-surface-800/60 pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden shadow-2xl border border-surface-700/40">
                {searchResults.map((r, i) => (
                  <button key={i} onMouseDown={() => selectResult(r.symbol)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-800/40 text-left transition-colors cursor-pointer">
                    <div>
                      <span className="text-sm font-bold text-white">{r.symbol}</span>
                      <span className="text-xs text-surface-400 ml-2 truncate">{r.description}</span>
                    </div>
                    <span className="text-xs text-surface-500">{r.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-xl bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-white transition-colors cursor-pointer">
            <HiBell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-surface-800/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-surface-300">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
