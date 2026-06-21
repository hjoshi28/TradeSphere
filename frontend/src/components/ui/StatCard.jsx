import React from 'react';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, prefix = '', suffix = '', delay = 0 }) => {
  const changeColors = {
    gain: 'text-gain bg-gain-bg',
    loss: 'text-loss bg-loss-bg',
    neutral: 'text-surface-400 bg-surface-800/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="card card-hover p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-brand-400" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-2xl font-bold text-white font-mono tracking-tight">
          {prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}{suffix}
        </span>
        {change !== undefined && change !== null && (
          <span className={`inline-flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${changeColors[changeType]}`}>
            {changeType === 'gain' ? <HiArrowTrendingUp className="w-3 h-3" /> : changeType === 'loss' ? <HiArrowTrendingDown className="w-3 h-3" /> : null}
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
