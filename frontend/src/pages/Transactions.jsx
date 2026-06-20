import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTransactions } from '../services/api';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { HiOutlineClipboardDocumentList, HiOutlineFunnel } from 'react-icons/hi2';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getTransactions(); setTransactions(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'ALL' && t.type !== filterType) return false;
      if (searchQuery && !t.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  const totalBuys = transactions.filter(t => t.type === 'BUY').reduce((s, t) => s + t.totalAmount, 0);
  const totalSells = transactions.filter(t => t.type === 'SELL').reduce((s, t) => s + t.totalAmount, 0);
  const mostTraded = transactions.reduce((acc, t) => { acc[t.symbol] = (acc[t.symbol] || 0) + 1; return acc; }, {});
  const topSymbol = Object.keys(mostTraded).sort((a,b) => mostTraded[b] - mostTraded[a])[0];

  if (loading) return <PageLoader text="Loading transactions..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Transactions</h1>
        <p className="text-sm text-surface-400">Your complete trading history</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Total Trades</span>
          <p className="text-2xl font-bold text-white mt-1">{transactions.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Total Buys</span>
          <p className="text-2xl font-bold text-gain font-mono mt-1">${totalBuys.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Total Sells</span>
          <p className="text-2xl font-bold text-loss font-mono mt-1">${totalSells.toLocaleString(undefined,{minimumFractionDigits:2})}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Most Traded</span>
          <p className="text-2xl font-bold text-white font-mono mt-1">{topSymbol || '—'}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by symbol..." className="input-base max-w-xs" />
        <div className="flex gap-2">
          {['ALL','BUY','SELL'].map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`btn text-xs ${filterType === f ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-surface-800/50 text-surface-400 border-surface-700/30'} border`}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={HiOutlineClipboardDocumentList} title="No Transactions"
          description={searchQuery || filterType !== 'ALL' ? 'No transactions match your filters.' : 'Start trading to see your history.'} />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-900/50 text-surface-400 border-b border-surface-800/40">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase">Symbol</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Quantity</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Price</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/40">
                {filtered.map(t => (
                  <tr key={t._id} className="hover:bg-surface-800/20 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-surface-400 font-mono">{format(new Date(t.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                    <td className="px-5 py-3.5"><Badge variant={t.type === 'BUY' ? 'gain' : 'loss'} size="xs">{t.type}</Badge></td>
                    <td className="px-5 py-3.5 font-bold text-white font-mono">{t.symbol}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-300">{t.quantity}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-surface-300">${t.price.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-white">${t.totalAmount.toLocaleString(undefined,{minimumFractionDigits:2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Transactions;
