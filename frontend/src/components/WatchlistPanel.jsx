import React, { useState, useEffect } from 'react';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';

const WatchlistPanel = ({ onSelectStock }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const { data } = await getWatchlist();
      setWatchlist(data);
    } catch (err) {
      console.error("Watchlist network fetch error", err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    const ticker = setInterval(fetchWatchlist, 15000);
    return () => clearInterval(ticker);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSymbol || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFeedback('');
      await addToWatchlist(newSymbol);
      setNewSymbol('');
      fetchWatchlist();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Invalid ticker.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (symbol, e) => {
    e.stopPropagation();
    try {
      await removeFromWatchlist(symbol);
      fetchWatchlist();
    } catch (err) {
      console.error("Failed to alter watchlist map structure", err);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl h-[560px] flex flex-col justify-between shadow-sm">
      <div>
        <div className="mb-4 pb-3 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Watchlist</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Select a row to populate fields</p>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-500">Live Client</span>
        </div>

        <form onSubmit={handleAdd} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="ADD SYMBOL (e.g. NVDA)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-sm font-bold tracking-wider text-white uppercase focus:outline-none focus:border-zinc-700 font-mono placeholder:normal-case placeholder:font-normal placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold px-5 rounded-lg text-sm tracking-wide transition-colors disabled:opacity-40 cursor-pointer"
          >
            Add
          </button>
        </form>

        {feedback && (
          <p className="text-xs text-pink-400 mb-4 bg-pink-950/10 p-3 rounded border border-pink-950/20 font-mono font-medium">
            {feedback}
          </p>
        )}

        <div className="space-y-2.5 overflow-y-auto max-h-[310px] pr-1">
          {watchlist.map((item) => {
            const isUp = item.change >= 0;
            return (
              <div
                key={item.symbol}
                onClick={() => onSelectStock(item.symbol)}
                className="flex justify-between items-center p-3.5 border border-zinc-900 bg-black/40 rounded-lg hover:bg-zinc-900/40 hover:border-zinc-800 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm font-mono text-white uppercase tracking-wider">{item.symbol}</span>
                  <span className={`text-xs font-mono font-bold ${isUp ? 'text-purple-400' : 'text-pink-400'}`}>
                    {isUp ? '+' : ''}{item.percentChange.toFixed(2)}%
                  </span>
                </div>

                <div className="text-right flex items-center gap-4">
                  <span className="font-mono font-bold text-sm text-zinc-200">${item.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => handleRemove(item.symbol, e)}
                    className="text-zinc-600 hover:text-zinc-300 font-bold text-sm p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}

          {watchlist.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider font-semibold">No symbols tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel;