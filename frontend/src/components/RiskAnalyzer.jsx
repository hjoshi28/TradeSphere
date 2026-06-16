import React from 'react';

const RiskAnalyzer = ({ score, recommendation }) => {
  const getScoreColor = (s) => {
    if (s >= 75) return 'text-emerald-400 border-emerald-500';
    if (s >= 50) return 'text-amber-400 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center gap-6">
      <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-black ${getScoreColor(score)}`}>
        {score}/100
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-200">Portfolio Diversification Health</h3>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">{recommendation}</p>
      </div>
    </div>
  );
};

export default RiskAnalyzer;