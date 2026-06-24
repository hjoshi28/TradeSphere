import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { HiOutlineStar, HiOutlinePlus, HiOutlineXMark, HiOutlineBolt } from 'react-icons/hi2';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const { data } = await getWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSymbol.trim() || adding) return;
    try {
      setAdding(true);
      await addToWatchlist(newSymbol);
      toast.success(`${newSymbol.toUpperCase()} added to watchlist`);
      setNewSymbol('');
      fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid ticker symbol');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await removeFromWatchlist(symbol);
      toast.success(`${symbol} removed`);
      fetchWatchlist();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <PageLoader text="Loading watchlist..." />;

  // Sort by best/worst performers
  const sorted = [...watchlist].sort((a, b) => (b.percentChange || 0) - (a.percentChange || 0));
  const gainers = sorted.filter(s => s.change >= 0);
  const losers = sorted.filter(s => s.change < 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">Watchlist</h1>
          <p className="text-sm text-surface-400">Track your favorite stocks</p>
        </div>
      </motion.div>

      {/* Add Symbol */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input type="text" value={newSymbol} onChange={e => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="Add symbol (e.g. NVDA, MSFT, GOOGL)" className="input-base flex-1 max-w-md font-mono uppercase" />
          <button type="submit" disabled={adding} className="btn-primary">
            <HiOutlinePlus className="w-4 h-4" /> Add
          </button>
        </form>
      </motion.div>

      {watchlist.length === 0 ? (
        <EmptyState icon={HiOutlineStar} title="Empty Watchlist"
          description="Start tracking stocks by adding symbols above." />
      ) : (
        <>
          {/* Analytics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Tracking</span>
              <p className="text-2xl font-bold text-surface-900 mt-1">{watchlist.length} stocks</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Best Performer</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-surface-900">{sorted[0]?.symbol || '—'}</span>
                {sorted[0] && <Badge variant="gain" size="xs">+{sorted[0].percentChange?.toFixed(2)}%</Badge>}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Worst Performer</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-surface-900">{sorted[sorted.length-1]?.symbol || '—'}</span>
                {sorted[sorted.length-1] && <Badge variant="loss" size="xs">{sorted[sorted.length-1].percentChange?.toFixed(2)}%</Badge>}
              </div>
            </motion.div>
          </div>

          {/* Watchlist Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {watchlist.map((item, i) => {
                const isUp = item.change >= 0;
                return (
                  <motion.div key={item.symbol} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="card card-hover p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <Link to={`/market/${item.symbol}`} className="text-base font-bold text-surface-900 hover:text-brand-400 font-mono">{item.symbol}</Link>
                      <button onClick={() => handleRemove(item.symbol)}
                        className="w-7 h-7 rounded-lg hover:bg-surface-100/50 flex items-center justify-center text-surface-400 hover:text-loss transition-colors cursor-pointer">
                        <HiOutlineXMark className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-xl font-bold font-mono text-surface-900">${item.price?.toFixed(2)}</span>
                      <Badge variant={isUp ? 'gain' : 'loss'} size="sm">
                        {isUp ? '+' : ''}{item.percentChange?.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-surface-200/40">
                      <Link to={`/trade?symbol=${item.symbol}`} className="btn-primary flex-1 text-xs py-1.5 justify-center">
                        <HiOutlineBolt className="w-3 h-3" /> Trade
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WatchlistPage;
