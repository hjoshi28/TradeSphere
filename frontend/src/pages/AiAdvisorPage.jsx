import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAiInsights } from '../services/api';
import { HiOutlineSparkles, HiOutlineArrowDownTray, HiOutlineArrowPath } from 'react-icons/hi2';

const AiAdvisorPage = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data } = await getAiInsights();
      setAnalysis(data.analysis);
      setHistory(prev => [{ text: data.analysis, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
      toast.success('AI analysis generated!');
    } catch (err) {
      setAnalysis('Error generating insights. Please try again.');
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!analysis) return;
    const content = `TradeSphere AI Portfolio Report\nGenerated: ${new Date().toLocaleString()}\n\n${analysis}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TradeSphere_AI_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple markdown rendering
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-5 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold text-white mt-5 mb-3">{line.replace('# ', '')}</h1>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-surface-300 text-sm ml-4 mb-1 list-disc">{line.replace(/^[-*] /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      if (line.match(/^\d+\./)) return <li key={i} className="text-surface-300 text-sm ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-surface-300 text-sm leading-relaxed mb-1">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2">
            <HiOutlineSparkles className="w-7 h-7 text-brand-400" /> AI Advisor
          </h1>
          <p className="text-sm text-surface-400">AI-powered portfolio analysis and recommendations</p>
        </div>
        <div className="flex gap-3">
          {analysis && (
            <button onClick={downloadReport} className="btn-secondary text-xs">
              <HiOutlineArrowDownTray className="w-4 h-4" /> Download Report
            </button>
          )}
          <button onClick={fetchInsights} disabled={loading} className="btn-primary">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <HiOutlineArrowPath className="w-4 h-4" /> Generate Analysis
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-3">
          {loading ? (
            <div className="card p-12 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-surface-800 border-t-brand-500 rounded-full animate-spin" />
                <HiOutlineSparkles className="absolute inset-0 m-auto w-6 h-6 text-brand-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-300">Analyzing your portfolio...</p>
                <p className="text-xs text-surface-500 mt-1">AI is evaluating risk, allocation, and opportunities</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-800/60">
                <HiOutlineSparkles className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-bold text-white">Portfolio Analysis Report</h2>
              </div>
              <div className="prose-sm">
                {renderMarkdown(analysis)}
              </div>
            </div>
          ) : (
            <div className="card p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5">
                <HiOutlineSparkles className="w-8 h-8 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Portfolio Advisor</h3>
              <p className="text-sm text-surface-400 max-w-md mb-6">
                Get personalized portfolio analysis, risk assessment, diversification recommendations,
                and rebalancing suggestions powered by Google Gemini AI.
              </p>
              <button onClick={fetchInsights} className="btn-primary">
                <HiOutlineSparkles className="w-4 h-4" /> Generate Your First Analysis
              </button>
            </div>
          )}
        </motion.div>

        {/* Sidebar - Features + History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-5">
          {/* What AI Covers */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-surface-200 mb-3">What AI Analyzes</h3>
            <ul className="space-y-2.5 text-xs text-surface-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                Portfolio health & capital deployment
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                Sector concentration & risk analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gain mt-1.5 flex-shrink-0" />
                Diversification recommendations
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Actionable rebalancing steps
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-loss mt-1.5 flex-shrink-0" />
                Risk alerts & warnings
              </li>
            </ul>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-bold text-surface-200 mb-3">Recent Analyses</h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button key={i} onClick={() => setAnalysis(h.text)}
                    className="w-full text-left p-3 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-colors cursor-pointer">
                    <p className="text-xs text-surface-300 line-clamp-2">{h.text.substring(0, 80)}...</p>
                    <p className="text-[10px] text-surface-500 mt-1">{h.time}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AiAdvisorPage;
