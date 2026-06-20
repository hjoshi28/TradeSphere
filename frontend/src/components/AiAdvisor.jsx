import React, { useState } from 'react';
import { getAiInsights } from '../services/api';

const AiAdvisor = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const { data } = await getAiInsights();
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis("Error gathering remote ledger auditing analytics from model node endpoints.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-zinc-200">AI Risk Assessment Hub</h2>
          <p className="text-xs text-zinc-500 font-mono">Automated prompt engineering module parsing live portfolio structure loops</p>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-40 shadow-sm cursor-pointer"
        >
          {loading ? "Analyzing..." : "Generate AI Audit"}
        </button>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 bg-black border border-zinc-800 rounded-xl">
          <div className="w-5 h-5 border border-zinc-800 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-black animate-pulse">Querying LLM Frame Context...</p>
        </div>
      ) : analysis ? (
        <div className="bg-black border border-zinc-800 p-5 rounded-lg text-sm text-zinc-200 leading-relaxed font-mono whitespace-pre-line shadow-inner">
          {analysis}
        </div>
      ) : (
        <div className="text-center py-12 bg-black/40 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-600 font-mono uppercase tracking-wider font-semibold">
          Click button to run an on-demand generative asset reallocation strategy check.
        </div>
      )}
    </div>
  );
};

export default AiAdvisor;