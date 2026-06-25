import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnalytics, getHoldings, getTransactions, getWatchlist, getMarketNews } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import {
  HiOutlineBriefcase,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from 'react-icons/hi2';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAnalytics, resHoldings, resTx, resWatch, resNews] = await Promise.allSettled([
          getAnalytics(),
          getHoldings(),
          getTransactions(),
          getWatchlist(),
          getMarketNews(),
        ]);

        if (resAnalytics.status === 'fulfilled') setAnalytics(resAnalytics.value.data);
        if (resHoldings.status === 'fulfilled') setHoldings(resHoldings.value.data);
        if (resTx.status === 'fulfilled') setTransactions(resTx.value.data);
        if (resWatch.status === 'fulfilled') setWatchlist(resWatch.value.data);
        if (resNews.status === 'fulfilled') setNews(resNews.value.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader text="Loading your dashboard..." />;

  const dailyPL = analytics?.netGainLoss || 0;
  const cashBalance = user?.balance || 100000;

  // Mock performance chart data from holdings
  const perfData = holdings.map((h, i) => ({
    name: h.symbol,
    value: h.quantity * h.avgPrice,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'Trader'}
        </h1>
        <p className="text-sm text-surface-400">Here's your portfolio overview</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Portfolio Value"
          value={analytics?.currentValue || 0}
          prefix="$"
          icon={HiOutlineBriefcase}
          change={dailyPL >= 0 ? `+$${Math.abs(dailyPL).toLocaleString(undefined, {minimumFractionDigits:2})}` : `-$${Math.abs(dailyPL).toLocaleString(undefined, {minimumFractionDigits:2})}`}
          changeType={dailyPL >= 0 ? 'gain' : 'loss'}
          delay={0}
        />
        <StatCard
          title="Daily P/L"
          value={Math.abs(dailyPL)}
          prefix={dailyPL >= 0 ? '+$' : '-$'}
          icon={HiOutlineArrowTrendingUp}
          changeType={dailyPL >= 0 ? 'gain' : 'loss'}
          delay={0.1}
        />
        <StatCard
          title="Cash Balance"
          value={cashBalance}
          prefix="$"
          icon={HiOutlineBanknotes}
          delay={0.2}
        />
        <StatCard
          title="Health Score"
          value={analytics?.healthScore || 0}
          suffix="/100"
          icon={HiOutlineShieldCheck}
          changeType={analytics?.healthScore >= 70 ? 'gain' : analytics?.healthScore >= 40 ? 'neutral' : 'loss'}
          change={analytics?.healthScore >= 70 ? 'Good' : analytics?.healthScore >= 40 ? 'Fair' : 'Risk'}
          delay={0.3}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 card overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/60">
            <h2 className="text-sm font-bold text-surface-800">Active Holdings</h2>
            <Link to="/portfolio" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
              View All <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/50 text-surface-400 border-b border-surface-200/40">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Asset</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-right">Shares</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-right">Avg Cost</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/40">
                {holdings.slice(0, 6).map((h) => (
                  <tr key={h._id} className="hover:bg-surface-100/20 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-surface-900 font-mono text-sm">{h.symbol}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-700">{h.quantity.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-700">${h.avgPrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5"><Badge variant="brand" size="xs">{h.sector}</Badge></td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-12 text-center text-surface-400 text-sm">
                      No holdings yet. <Link to="/trade" className="text-brand-400 hover:underline">Start trading</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sector Allocation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <h2 className="text-sm font-bold text-surface-800 mb-4">Sector Allocation</h2>
          {analytics?.sectorData && analytics.sectorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={analytics.sectorData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {analytics.sectorData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-sm text-surface-400">No allocation data</div>
          )}
          <div className="space-y-2 mt-2">
            {analytics?.sectorData?.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-surface-700">{s.name}</span>
                </div>
                <span className="font-mono text-surface-400">${s.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-surface-800">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
              View All <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-surface-200/30 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant={t.type === 'BUY' ? 'gain' : 'loss'} size="xs">{t.type}</Badge>
                  <span className="text-sm font-semibold text-surface-900">{t.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-surface-700">${t.price.toFixed(2)}</span>
                  <span className="text-xs text-surface-400 ml-2">×{t.quantity}</span>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-sm text-surface-400 text-center py-6">No transactions yet</p>
            )}
          </div>
        </motion.div>

        {/* Watchlist Movers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-surface-800">Watchlist</h2>
            <Link to="/watchlist" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
              View All <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {watchlist.slice(0, 6).map((item) => {
              const isUp = item.change >= 0;
              return (
                <Link key={item.symbol} to={`/market/${item.symbol}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-surface-100/30 transition-colors">
                  <span className="text-sm font-bold text-surface-900">{item.symbol}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-surface-700">${item.price?.toFixed(2)}</span>
                    <Badge variant={isUp ? 'gain' : 'loss'} size="xs">
                      {isUp ? '+' : ''}{item.percentChange?.toFixed(2)}%
                    </Badge>
                  </div>
                </Link>
              );
            })}
            {watchlist.length === 0 && (
              <p className="text-sm text-surface-400 text-center py-6">Add stocks to your watchlist</p>
            )}
          </div>
        </motion.div>

        {/* AI Insights + News */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-5 space-y-5">
          {/* AI Quick Card */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineSparkles className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-bold text-surface-800">AI Insights</h2>
            </div>
            <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-4">
              <p className="text-sm text-surface-700 leading-relaxed">
                {analytics?.recommendation || 'Generate AI insights for personalized portfolio advice.'}
              </p>
              <Link to="/ai-advisor" className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold mt-3">
                Full Analysis <HiOutlineArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Market News */}
          <div>
            <h3 className="text-sm font-bold text-surface-800 mb-3">Market News</h3>
            <div className="space-y-3">
              {news.slice(0, 3).map((n, i) => (
                <a key={i} href={n.url} target="_blank" rel="noopener noreferrer"
                  className="block text-xs text-surface-400 hover:text-surface-200 transition-colors leading-relaxed line-clamp-2">
                  {n.headline}
                </a>
              ))}
              {news.length === 0 && <p className="text-xs text-surface-400">News loading...</p>}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Alert */}
      {analytics && analytics.healthScore < 50 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="bg-loss/5 border border-loss/15 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-loss/10 flex items-center justify-center flex-shrink-0">
            <HiOutlineShieldCheck className="w-5 h-5 text-loss" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-loss mb-1">Portfolio Risk Alert</h3>
            <p className="text-sm text-surface-400">{analytics.recommendation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;