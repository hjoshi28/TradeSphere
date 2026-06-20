import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTrendingStocks, getTopMovers, getMarketNews, searchStock } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { HiOutlineGlobeAlt, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineBolt, HiMagnifyingGlass } from 'react-icons/hi2';

const Market = () => {
  const [trending, setTrending] = useState([]);
  const [movers, setMovers] = useState({ gainers: [], losers: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, m, n] = await Promise.allSettled([getTrendingStocks(), getTopMovers(), getMarketNews()]);
        if (t.status === 'fulfilled') setTrending(t.value.data);
        if (m.status === 'fulfilled') setMovers(m.value.data);
        if (n.status === 'fulfilled') setNews(n.value.data?.slice(0, 8) || []);
      } catch { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = async (q) => {
    setSearchQuery(q);
    if (q.length < 1) { setSearchResults([]); return; }
    try {
      const { data } = await searchStock(q);
      setSearchResults(data.slice(0, 8));
    } catch { setSearchResults([]); }
  };

  if (loading) return <PageLoader text="Loading market data..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Market</h1>
        <p className="text-sm text-surface-400">Live market data, trending stocks, and news</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative max-w-xl">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)}
          placeholder="Search stocks by name or symbol..." className="input-base pl-11" />
        {searchResults.length > 0 && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden shadow-2xl z-10">
            {searchResults.map((r, i) => (
              <Link key={i} to={`/market/${r.symbol}`} onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-800/40 transition-colors">
                <div>
                  <span className="text-sm font-bold text-white">{r.symbol}</span>
                  <span className="text-xs text-surface-400 ml-2">{r.description}</span>
                </div>
                <Badge variant="default" size="xs">{r.type}</Badge>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Trending */}
      {trending.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-bold text-white mb-4">Trending Stocks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {trending.map((stock, i) => {
              const isUp = stock.change >= 0;
              return (
                <Link key={i} to={`/market/${stock.symbol}`} className="card card-hover p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white font-mono">{stock.symbol}</span>
                    <Badge variant={isUp ? 'gain' : 'loss'} size="xs">{isUp ? '+' : ''}{stock.percentChange?.toFixed(2)}%</Badge>
                  </div>
                  <span className="text-lg font-bold font-mono text-surface-200">${stock.price?.toFixed(2)}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Gainers/Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gainers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800/60 flex items-center gap-2">
            <HiOutlineArrowTrendingUp className="w-4 h-4 text-gain" />
            <h2 className="text-sm font-bold text-surface-200">Top Gainers</h2>
          </div>
          <div className="divide-y divide-gray-100 divide-surface-800/40">
            {(movers.gainers || []).map((s, i) => (
              <Link key={i} to={`/market/${s.symbol}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 bg-surface-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white font-mono text-sm">{s.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-surface-300 text-sm">${s.price?.toFixed(2)}</span>
                  <Badge variant="gain" size="xs">+{s.percentChange?.toFixed(2)}%</Badge>
                </div>
              </Link>
            ))}
            {(!movers.gainers || movers.gainers.length === 0) && (
              <p className="px-5 py-8 text-sm text-surface-500 text-center">No gainer data available</p>
            )}
          </div>
        </motion.div>

        {/* Losers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800/60 flex items-center gap-2">
            <HiOutlineArrowTrendingDown className="w-4 h-4 text-loss" />
            <h2 className="text-sm font-bold text-surface-200">Top Losers</h2>
          </div>
          <div className="divide-y divide-gray-100 divide-surface-800/40">
            {(movers.losers || []).map((s, i) => (
              <Link key={i} to={`/market/${s.symbol}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 bg-surface-800/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white font-mono text-sm">{s.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-surface-300 text-sm">${s.price?.toFixed(2)}</span>
                  <Badge variant="loss" size="xs">{s.percentChange?.toFixed(2)}%</Badge>
                </div>
              </Link>
            ))}
            {(!movers.losers || movers.losers.length === 0) && (
              <p className="px-5 py-8 text-sm text-surface-500 text-center">No loser data available</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Market News */}
      {news.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-white mb-4">Market News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {news.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" className="card card-hover p-4 group">
                {n.image && <img src={n.image} alt="" className="w-full h-32 object-cover rounded-xl mb-3 opacity-80 group-hover:opacity-100 transition-opacity" />}
                <h3 className="text-sm font-semibold text-surface-200 line-clamp-2 mb-2 group-hover:text-white transition-colors">{n.headline}</h3>
                <p className="text-xs text-surface-500">{n.source} · {n.datetime ? new Date(n.datetime * 1000).toLocaleDateString() : ''}</p>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Market;
