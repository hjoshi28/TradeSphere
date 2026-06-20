import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action, actionLabel, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-800/50 border border-surface-700/30 flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-surface-500" />
        </div>
      )}
      <h3 className="text-lg font-bold text-surface-300 mb-2">{title}</h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      {action && (
        <button onClick={action} className="btn-primary">
          {actionLabel || 'Get Started'}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
