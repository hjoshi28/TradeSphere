import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getLiveQuote, getStockProfile, addToWatchlist } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { HiOutlineStar, HiOutlineBolt, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from 'react-icons/hi2';

const StockDetail = () => {
  const { symbol } = useParams();
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [q, p] = await Promise.allSettled([getLiveQuote(symbol), getStockProfile(symbol)]);
        if (q.status === 'fulfilled') setQuote(q.value.data);
        if (p.status === 'fulfilled') setProfile(p.value.data);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(async () => {
      try { const { data } = await getLiveQuote(symbol); setQuote(data); } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  const handleAddWatchlist = async () => {
    try {
      await addToWatchlist(symbol);
      toast.success(`${symbol} added to watchlist`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  if (loading) return <PageLoader text={`Loading ${symbol}...`} />;

  const priceChange = quote ? quote.price - quote.previousClose : 0;
  const percentChange = quote?.previousClose ? ((priceChange / quote.previousClose) * 100) : 0;
  const isUp = priceChange >= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-mono">{symbol}</h1>
            {profile?.name && <span className="text-surface-400 text-sm">{profile.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold font-mono text-white">${quote?.price?.toFixed(2) || '—'}</span>
            <div className="flex items-center gap-1">
              {isUp ? <HiOutlineArrowTrendingUp className="w-5 h-5 text-gain" /> : <HiOutlineArrowTrendingDown className="w-5 h-5 text-loss" />}
              <Badge variant={isUp ? 'gain' : 'loss'} size="md">
                {isUp ? '+' : ''}{priceChange.toFixed(2)} ({isUp ? '+' : ''}{percentChange.toFixed(2)}%)
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAddWatchlist} className="btn-secondary">
            <HiOutlineStar className="w-4 h-4" /> Watchlist
          </button>
          <Link to={`/trade?symbol=${symbol}`} className="btn-primary">
            <HiOutlineBolt className="w-4 h-4" /> Trade
          </Link>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <span className="text-xs font-semibold uppercase text-surface-400">High</span>
            <p className="text-lg font-bold font-mono text-gain mt-1">${quote?.high?.toFixed(2) || '—'}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-semibold uppercase text-surface-400">Low</span>
            <p className="text-lg font-bold font-mono text-loss mt-1">${quote?.low?.toFixed(2) || '—'}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-semibold uppercase text-surface-400">Open</span>
            <p className="text-lg font-bold font-mono text-white mt-1">${quote?.previousClose?.toFixed(2) || '—'}</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-semibold uppercase text-surface-400">Prev Close</span>
            <p className="text-lg font-bold font-mono text-white mt-1">${quote?.previousClose?.toFixed(2) || '—'}</p>
          </div>
        </div>
      </motion.div>

      {/* Company Info */}
      {profile && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-6">
          <h2 className="text-lg font-bold text-white mb-4">About {profile.name || symbol}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {profile.finnhubIndustry && (
              <div><span className="text-surface-400">Industry:</span> <span className="text-white ml-2">{profile.finnhubIndustry}</span></div>
            )}
            {profile.country && (
              <div><span className="text-surface-400">Country:</span> <span className="text-white ml-2">{profile.country}</span></div>
            )}
            {profile.exchange && (
              <div><span className="text-surface-400">Exchange:</span> <span className="text-white ml-2">{profile.exchange}</span></div>
            )}
            {profile.marketCapitalization && (
              <div><span className="text-surface-400">Market Cap:</span> <span className="text-white ml-2">${(profile.marketCapitalization).toLocaleString()}M</span></div>
            )}
            {profile.weburl && (
              <div><span className="text-surface-400">Website:</span> <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 ml-2">{profile.weburl}</a></div>
            )}
            {profile.ipo && (
              <div><span className="text-surface-400">IPO Date:</span> <span className="text-white ml-2">{profile.ipo}</span></div>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Ready to trade {symbol}?</h3>
        <p className="text-sm text-surface-400 mb-4">Open the trading terminal to execute a buy or sell order.</p>
        <Link to={`/trade?symbol=${symbol}`} className="btn-primary">
          <HiOutlineBolt className="w-4 h-4" /> Open Trade Terminal
        </Link>
      </motion.div>
    </div>
  );
};

export default StockDetail;
