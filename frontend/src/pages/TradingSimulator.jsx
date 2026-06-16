import React, { useState, useEffect } from 'react';
import { executeTrade, getTransactions, getLiveQuote } from '../services/api';
import WatchlistPanel from '../components/WatchlistPanel';

const TradingSimulator = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState('AAPL');
  const [livePrice, setLivePrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [message, setMessage] = useState('');
  const [executing, setExecuting] = useState(false);

  const fetchHistory = async () => {
    try {
      const { data } = await getTransactions();
      setTransactions(data);
    } catch (err) { console.error(err); }
  };

  const fetchLivePrice = async (symbol) => {
    try {
      const { data } = await getLiveQuote(symbol);
      setLivePrice(data.price);
    } catch (err) {
      console.error("Error updating tracking data", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchLivePrice(activeSymbol);

    const priceTicker = setInterval(() => {
      fetchLivePrice(activeSymbol);
    }, 15000);

    return () => clearInterval(priceTicker);
  }, [activeSymbol]);

  const handleWatchlistSelect = (symbol) => {
    setActiveSymbol(symbol);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!livePrice || executing) return;
    
    setExecuting(true);
    let inferredSector = "Diversified Growth";
    if (['AAPL', 'MSFT', 'NVDA', 'AMD'].includes(activeSymbol)) inferredSector = "Technology";
    if (['TSLA', 'F', 'GM'].includes(activeSymbol)) inferredSector = "Automotive";
    if (['AMZN', 'BABA', 'EBAY'].includes(activeSymbol)) inferredSector = "E-commerce";
    if (['JPM', 'BAC', 'GS'].includes(activeSymbol)) inferredSector = "Financials";

    try {
      await executeTrade({
        symbol: activeSymbol,
        companyName: `${activeSymbol} Asset Corp.`,
        type: tradeType,
        quantity: Number(quantity),
        price: livePrice,
        sector: inferredSector
      });
      setMessage(`Order Processed: ${tradeType} ${quantity} ${activeSymbol} at $${livePrice}`);
      fetchHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Transaction could not be cleared.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 py-10 px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Order Submission Form Block */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl flex flex-col justify-between h-[560px]">
          <div>
            <div className="mb-5 pb-3 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Order Terminal</h2>
              <span className="text-xs font-mono font-medium text-zinc-600">Simulated Account</span>
            </div>
            
            {message && (
              <div className="p-3.5 mb-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono text-zinc-200">
                {message}
              </div>
            )}
            
            <form onSubmit={handleOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-zinc-500 mb-2">Asset Symbol</label>
                <input 
                  type="text" 
                  value={activeSymbol} 
                  onChange={(e) => setActiveSymbol(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-black uppercase tracking-wider focus:outline-none focus:border-zinc-700 font-mono text-base"
                />
              </div>

              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
                <span className="text-xs font-mono uppercase text-zinc-500 block mb-1">Market Price Feed</span>
                <span className="text-2xl font-black font-mono text-white">${livePrice ? livePrice.toFixed(2) : "0.00"}</span>
              </div>
              
              <div>
                <label className="block text-xs font-bold font-mono uppercase text-zinc-500 mb-2">Action Code</label>
                <div className="grid grid-cols-2 gap-3 bg-black p-1 rounded-lg border border-zinc-800">
                  <button 
                    type="button" 
                    className={`py-2 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                      tradeType === 'BUY' ? 'bg-zinc-900 text-purple-400 border border-zinc-800' : 'text-zinc-500'
                    }`} 
                    onClick={() => setTradeType('BUY')}
                  >
                    BUY
                  </button>
                  <button 
                    type="button" 
                    className={`py-2 rounded-md text-sm font-bold transition-colors cursor-pointer ${
                      tradeType === 'SELL' ? 'bg-zinc-900 text-pink-400 border border-zinc-800' : 'text-zinc-500'
                    }`} 
                    onClick={() => setTradeType('SELL')}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase text-zinc-500 mb-2">Quantity Order Units</label>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={e => setQuantity(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-black font-mono text-base focus:outline-none focus:border-zinc-700" 
                />
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <div className="flex justify-between items-center text-sm font-mono text-zinc-400">
              <span>Gross Accounting Value:</span>
              <span className="text-white font-black text-lg">${(quantity * livePrice).toFixed(2)}</span>
            </div>
            <button 
              onClick={handleOrder} 
              disabled={executing || !livePrice}
              type="button" 
              className={`w-full py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                tradeType === 'BUY' 
                  ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700' 
                  : 'bg-black text-pink-400 border-pink-900/60 hover:bg-pink-950/20'
              } disabled:opacity-30`}
            >
              {executing ? "Clearing..." : `Execute ${tradeType}`}
            </button>
          </div>
        </div>

        {/* Watchlist Core Frame Component */}
        <WatchlistPanel onSelectStock={handleWatchlistSelect} />

        {/* Order History Database List Container */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col h-[560px]">
          <div className="mb-4 pb-3 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Order Logs</h2>
            <span className="text-xs font-mono text-zinc-600 font-semibold">Database Stream</span>
          </div>
          <div className="overflow-y-auto flex-grow rounded-lg border border-zinc-800 bg-black/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-mono uppercase text-xs sticky top-0">
                <tr>
                  <th className="p-3.5 font-semibold">Type</th>
                  <th className="p-3.5 font-semibold">Ticker</th>
                  <th className="p-3.5 text-right font-semibold">Size</th>
                  <th className="p-3.5 text-right font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {transactions.map(t => (
                  <tr key={t._id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="p-3.5 font-mono text-xs font-bold">
                      <span className={t.type === 'BUY' ? 'text-purple-400' : 'text-pink-400'}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold uppercase text-white font-mono tracking-wide">{t.symbol}</td>
                    <td className="p-3.5 text-right font-mono font-medium">{t.quantity}</td>
                    <td className="p-3.5 text-right font-mono font-medium text-zinc-200">${t.price.toFixed(2)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider font-semibold">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TradingSimulator;