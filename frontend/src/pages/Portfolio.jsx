import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHoldings, getAnalytics } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { HiOutlineBriefcase, HiOutlineBolt, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [h, a] = await Promise.all([getHoldings(), getAnalytics()]);
        setHoldings(h.data);
        setAnalytics(a.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = 'Symbol,Company,Quantity,Avg Price,Sector,Total Value\n';
    const rows = holdings.map(h =>
      `${h.symbol},${h.companyName},${h.quantity},${h.avgPrice.toFixed(2)},${h.sector},${(h.quantity * h.avgPrice).toFixed(2)}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TradeSphere_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <PageLoader text="Loading portfolio..." />;

  if (holdings.length === 0) {
    return <EmptyState icon={HiOutlineBriefcase} title="No Holdings" description="Start trading to build your portfolio."
      action={() => window.location.href = '/trade'} actionLabel="Go to Trade" />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Portfolio</h1>
          <p className="text-sm text-surface-400">Your holdings & asset allocation</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-secondary text-xs">
            <HiOutlineArrowDownTray className="w-4 h-4" /> Export CSV
          </button>
          <Link to="/trade" className="btn-primary text-xs">
            <HiOutlineBolt className="w-4 h-4" /> Trade
          </Link>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Total Invested</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">${analytics?.totalInvestment?.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Current Value</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">${analytics?.currentValue?.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Net P/L</span>
          <p className={`text-2xl font-bold font-mono mt-1 ${analytics?.netGainLoss >= 0 ? 'text-gain' : 'text-loss'}`}>
            {analytics?.netGainLoss >= 0 ? '+' : '-'}${Math.abs(analytics?.netGainLoss || 0).toLocaleString(undefined, {minimumFractionDigits:2})}
          </p>
        </motion.div>
      </div>

      {/* Grid: Table + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800/60">
            <h2 className="text-sm font-bold text-surface-200">Holdings ({holdings.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-900/50 text-surface-400 border-b border-surface-800/40">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase">Symbol</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Qty</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Avg Price</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Total Value</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase">Sector</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/40">
                {holdings.map(h => (
                  <tr key={h._id} className="hover:bg-surface-800/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/market/${h.symbol}`} className="font-bold text-white hover:text-brand-400 font-mono">{h.symbol}</Link>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-300">{h.quantity.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-300">${h.avgPrice.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-white font-semibold">${(h.quantity * h.avgPrice).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                    <td className="px-5 py-3.5"><Badge variant="brand" size="xs">{h.sector}</Badge></td>
                    <td className="px-5 py-3.5 text-center">
                      <Link to={`/trade?symbol=${h.symbol}`} className="text-xs text-brand-400 hover:text-brand-300 font-semibold">Trade</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
            <h2 className="text-sm font-bold text-surface-200 mb-4">Sector Breakdown</h2>
            {analytics?.sectorData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={analytics.sectorData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {analytics.sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-sm text-surface-500">No data</div>}
            <div className="space-y-1.5 mt-2">
              {analytics?.sectorData?.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-surface-300">{s.name}</span>
                  </div>
                  <span className="font-mono text-surface-400">${s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
            <h2 className="text-sm font-bold text-surface-200 mb-4">Holdings by Value</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={holdings.map(h => ({ name: h.symbol, value: h.quantity * h.avgPrice }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
