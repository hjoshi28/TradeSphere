import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getTransactions, getHoldings } from '../services/api';
import { HiOutlineUserCircle, HiOutlinePencilSquare } from 'react-icons/hi2';
import Badge from '../components/ui/Badge';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ trades: 0, holdings: 0, buys: 0, sells: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tx, h] = await Promise.all([getTransactions(), getHoldings()]);
        const buys = tx.data.filter(t => t.type === 'BUY').length;
        const sells = tx.data.filter(t => t.type === 'SELL').length;
        setStats({ trades: tx.data.length, holdings: h.data.length, buys, sells });
      } catch {}
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      await updateProfile({ name });
      updateUser({ name });
      localStorage.setItem('userName', name);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-surface-400">Manage your account information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-brand-500/20 flex-shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-base max-w-xs" />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary text-xs">{saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => { setEditing(false); setName(user?.name || ''); }} className="btn-ghost text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                  <button onClick={() => setEditing(true)} className="w-7 h-7 rounded-lg hover:bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-white cursor-pointer">
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-surface-400 mt-1">{user?.email}</p>
              </>
            )}
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <Badge variant="brand">Trader</Badge>
              <span className="text-xs text-surface-500">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trading Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-bold text-white mb-4">Trading Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-5 text-center">
            <span className="text-3xl font-bold text-white">{stats.trades}</span>
            <p className="text-xs text-surface-400 mt-1">Total Trades</p>
          </div>
          <div className="card p-5 text-center">
            <span className="text-3xl font-bold text-white">{stats.holdings}</span>
            <p className="text-xs text-surface-400 mt-1">Holdings</p>
          </div>
          <div className="card p-5 text-center">
            <span className="text-3xl font-bold text-gain">{stats.buys}</span>
            <p className="text-xs text-surface-400 mt-1">Buy Orders</p>
          </div>
          <div className="card p-5 text-center">
            <span className="text-3xl font-bold text-loss">{stats.sells}</span>
            <p className="text-xs text-surface-400 mt-1">Sell Orders</p>
          </div>
        </div>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6">
        <h2 className="text-lg font-bold text-white mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-surface-800/40">
            <span className="text-sm text-surface-400">Cash Balance</span>
            <span className="text-sm font-bold font-mono text-white">${(user?.balance || 100000).toLocaleString(undefined,{minimumFractionDigits:2})}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-surface-800/40">
            <span className="text-sm text-surface-400">Account Type</span>
            <Badge variant="brand" size="sm">Simulator</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-surface-400">Starting Balance</span>
            <span className="text-sm font-mono text-surface-300">$100,000.00</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
