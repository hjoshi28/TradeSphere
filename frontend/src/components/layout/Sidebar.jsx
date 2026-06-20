import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineChartBarSquare,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineBolt,
  HiOutlineClipboardDocumentList,
  HiOutlineGlobeAlt,
  HiOutlineChartPie,
  HiOutlineSparkles,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiXMark,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineChartBarSquare },
  { to: '/portfolio', label: 'Portfolio', icon: HiOutlineBriefcase },
  { to: '/watchlist', label: 'Watchlist', icon: HiOutlineStar },
  { to: '/trade', label: 'Trade', icon: HiOutlineBolt },
  { to: '/transactions', label: 'Transactions', icon: HiOutlineClipboardDocumentList },
  { to: '/market', label: 'Market', icon: HiOutlineGlobeAlt },
  { to: '/analytics', label: 'Analytics', icon: HiOutlineChartPie },
  { to: '/ai-advisor', label: 'AI Advisor', icon: HiOutlineSparkles },
];

const bottomItems = [
  { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
      ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 border border-transparent'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
            <span className="text-sm font-black text-white">T</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">TradeSphere</span>
        </NavLink>
        <button onClick={onClose} className="lg:hidden w-8 h-8 rounded-lg bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-white cursor-pointer">
          <HiXMark className="w-4 h-4" />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="mb-2 px-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">Menu</span>
        </div>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClasses} onClick={onClose}>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="mt-6 mb-2 px-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-surface-600">Account</span>
        </div>
        {bottomItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClasses} onClick={onClose}>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-surface-800/60">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-800/30">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
          </div>
          <button onClick={handleLogout} className="w-8 h-8 rounded-lg hover:bg-surface-700/50 flex items-center justify-center text-surface-500 hover:text-loss transition-colors cursor-pointer" title="Sign Out">
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-surface-950/80 border-r border-surface-800/40 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-surface-950 border-r border-surface-800/40 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
