import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics, getHoldings, getTransactions } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { HiOutlineChartPie } from 'react-icons/hi2';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, h, t] = await Promise.all([getAnalytics(), getHoldings(), getTransactions()]);
        setAnalytics(a.data);
        setHoldings(h.data);
        setTransactions(t.data);
      } catch { } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader text="Loading analytics..." />;

  // Compute metrics
  const totalBuys = transactions.filter(t => t.type === 'BUY').length;
  const totalSells = transactions.filter(t => t.type === 'SELL').length;
  const totalVolume = transactions.reduce((s, t) => s + t.totalAmount, 0);
  const holdingValues = holdings.map(h => ({ name: h.symbol, value: h.quantity * h.avgPrice, sector: h.sector }));
  const totalHoldingValue = holdingValues.reduce((s, h) => s + h.value, 0);

  // Activity by month
  const activityByMonth = transactions.reduce((acc, t) => {
    const month = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { name: month, buys: 0, sells: 0 };
    if (t.type === 'BUY') acc[month].buys++;
    else acc[month].sells++;
    return acc;
  }, {});
  const activityData = Object.values(activityByMonth);

  // P/L by stock
  const plByStock = holdings.map(h => ({
    name: h.symbol,
    invested: h.quantity * h.avgPrice,
    allocation: totalHoldingValue > 0 ? ((h.quantity * h.avgPrice / totalHoldingValue) * 100).toFixed(1) : 0,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-sm text-surface-400">Deep dive into your trading performance</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Portfolio Value</span>
          <p className="text-xl font-bold text-white font-mono mt-1">${analytics?.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Net P/L</span>
          <p className={`text-xl font-bold font-mono mt-1 ${analytics?.netGainLoss >= 0 ? 'text-gain' : 'text-loss'}`}>
            {analytics?.netGainLoss >= 0 ? '+' : '-'}${Math.abs(analytics?.netGainLoss || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Total Trades</span>
          <p className="text-xl font-bold text-white mt-1">{transactions.length}</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="gain" size="xs">{totalBuys} buys</Badge>
            <Badge variant="loss" size="xs">{totalSells} sells</Badge>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Health Score</span>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xl font-bold text-white">{analytics?.healthScore || 0}/100</p>
            <Badge variant={analytics?.healthScore >= 70 ? 'gain' : analytics?.healthScore >= 40 ? 'warning' : 'loss'} size="xs">
              {analytics?.healthScore >= 70 ? 'Good' : analytics?.healthScore >= 40 ? 'Fair' : 'Risk'}
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h2 className="text-sm font-bold text-surface-200 mb-4">Sector Allocation</h2>
          {analytics?.sectorData?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={analytics.sectorData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {analytics.sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {analytics.sectorData.map((s, i) => {
                  const pct = analytics.currentValue > 0 ? ((s.value / analytics.currentValue) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-surface-300">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-surface-400">{pct}%</span>
                        <span className="font-mono text-white">${s.value.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : <div className="h-64 flex items-center justify-center text-sm text-surface-500">No allocation data</div>}
        </motion.div>

        {/* Holdings Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <h2 className="text-sm font-bold text-surface-200 mb-4">Holdings Breakdown</h2>
          {holdingValues.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={holdingValues}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-72 flex items-center justify-center text-sm text-surface-500">No holdings</div>}
        </motion.div>

        {/* Trading Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h2 className="text-sm font-bold text-surface-200 mb-4">Trading Activity</h2>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="buys" fill="#10b981" name="Buys" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sells" fill="#ef4444" name="Sells" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-64 flex items-center justify-center text-sm text-surface-500">No trading activity</div>}
        </motion.div>

        {/* Risk Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
          <h2 className="text-sm font-bold text-surface-200 mb-4">Risk Assessment</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-black ${analytics?.healthScore >= 70 ? 'text-gain border-gain' :
                analytics?.healthScore >= 40 ? 'text-amber-400 border-amber-500' : 'text-loss border-loss'
              }`}>
              {analytics?.healthScore || 0}
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Diversification Health</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{analytics?.recommendation || 'No analysis available.'}</p>
            </div>
          </div>

          {/* Allocation table */}
          <div className="space-y-2">
            {plByStock.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-surface-800/30 last:border-0">
                <span className="font-bold text-white font-mono">{h.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-surface-400 text-xs">{h.allocation}%</span>
                  <div className="w-24 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${h.allocation}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
