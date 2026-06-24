import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCog6Tooth, HiOutlineLockClosed, HiOutlineBellAlert, HiOutlinePaintBrush } from 'react-icons/hi2';

const Settings = () => {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setChangingPassword(true);
      await changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">Settings</h1>
        <p className="text-sm text-surface-400">Manage your preferences and security</p>
      </motion.div>


      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineLockClosed className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-bold text-surface-900">Security</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              required className="input-base max-w-md" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              required className="input-base max-w-md" placeholder="Min. 6 characters" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              required className="input-base max-w-md" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={changingPassword} className="btn-primary text-sm">
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineBellAlert className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-bold text-surface-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Trade Confirmations', desc: 'Get notified after each trade execution', checked: true },
            { label: 'Price Alerts', desc: 'Alerts when watchlist stocks move significantly', checked: true },
            { label: 'AI Insights', desc: 'Periodic AI-generated portfolio recommendations', checked: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-surface-200/40 last:border-0">
              <div>
                <p className="text-sm font-medium text-surface-800">{item.label}</p>
                <p className="text-xs text-surface-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-10 h-5 bg-surface-200 peer-checked:bg-brand-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="card p-6 border-loss/20">
        <h2 className="text-lg font-bold text-loss mb-2">Danger Zone</h2>
        <p className="text-sm text-surface-400 mb-4">Signing out will end your current session.</p>
        <button onClick={() => { logout(); window.location.href = '/login'; }} className="btn-danger text-sm">
          Sign Out of All Sessions
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
