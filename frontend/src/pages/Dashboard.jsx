import React, { useEffect, useState } from 'react';
import { getAnalytics, getHoldings } from '../services/api';
import PortfolioChart from '../components/PortfolioChart';
import RiskAnalyzer from '../components/RiskAnalyzer';
import AiAdvisor from '../components/AiAdvisor';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAnalytics = await getAnalytics();
        const resHoldings = await getHoldings();
        setAnalytics(resAnalytics.data);
        setHoldings(resHoldings.data);
      } catch (err) {
        console.error("Error connecting to data layer", err);
      }
    };
    fetchData();
  }, []);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3 text-zinc-400 font-mono text-sm tracking-wider">
        <div className="w-6 h-6 border-2 border-zinc-800 border-t-purple-500 rounded-full animate-spin"></div>
        <span>LOADING SESSIONS...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 py-10 px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Core Financial Balance Banner */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-zinc-800">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-black tracking-tight text-white">Portfolio Dashboard</h1>
            <p className="text-sm text-zinc-400">General overview of asset values, allocations, and algorithmic risk profiling.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-xl text-left sm:text-right min-w-[260px] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">Total Portfolio Value</span>
            <span className="text-3xl font-black font-mono text-white">${analytics.currentValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </header>

        {/* Modular Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <span className="text-xs font-bold font-mono uppercase text-zinc-500 block mb-1.5">Invested Capital</span>
            <p className="text-2xl font-bold font-mono text-zinc-100">${analytics.totalInvestment.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl">
            <span className="text-xs font-bold font-mono uppercase text-zinc-500 block mb-1.5">Net Yield Performance</span>
            <p className="text-2xl font-black font-mono">
              <span className={analytics.netGainLoss >= 0 ? 'text-purple-400' : 'text-pink-400'}>
                {analytics.netGainLoss >= 0 ? '+' : '-'}${Math.abs(analytics.netGainLoss).toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-bold font-mono uppercase text-zinc-500 block mb-1.5">Monitored Assets</span>
            <p className="text-2xl font-bold font-mono text-zinc-100">{holdings.length} Positions Active</p>
          </div>
        </div>

        {/* Risk Metrics Layer */}
        <RiskAnalyzer score={analytics.healthScore} recommendation={analytics.recommendation} />

        {/* Main Interface Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Data Records Table */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 bg-zinc-900/40 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-200">Active Holdings Ledger</span>
              <span className="text-xs font-mono font-semibold text-zinc-500">Live Engine</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono uppercase text-xs">
                  <tr>
                    <th className="p-4 font-semibold">Asset</th>
                    <th className="p-4 text-right font-semibold">Shares</th>
                    <th className="p-4 text-right font-semibold">Avg Cost</th>
                    <th className="p-4 pl-8 font-semibold">Sector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300 text-base">
                  {holdings.map((h) => (
                    <tr key={h._id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 font-black text-white uppercase tracking-wider font-mono">{h.symbol}</td>
                      <td className="p-4 text-right font-mono font-medium">{h.quantity.toLocaleString()}</td>
                      <td className="p-4 text-right font-mono text-zinc-200">${h.avgPrice.toFixed(2)}</td>
                      <td className="p-4 pl-8 font-mono text-zinc-400 uppercase text-xs font-semibold tracking-wide">{h.sector}</td>
                    </tr>
                  ))}
                  {holdings.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-wider font-semibold">
                        No active allocations recorded. Open a route via the simulator desk.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Portfolio Chart Frame */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 h-full">
            <PortfolioChart data={analytics.sectorData} />
          </div>
        </div>

        {/* AI Advisory Panel */}
        <AiAdvisor />

      </div>
    </div>
  );
};

export default Dashboard;