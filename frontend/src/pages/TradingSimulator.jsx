import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { executeTrade, getTransactions, getLiveQuote, getHoldings, getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { HiOutlineBolt, HiOutlineStar, HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from 'react-icons/hi2';

const TradingSimulator = () => {
  const [searchParams] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [activeSymbol, setActiveSymbol] = useState(searchParams.get('symbol') || 'AAPL');
  const [livePrice, setLivePrice] = useState(0);
  const [quoteData, setQuoteData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [executing, setExecuting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [holdings, setHoldings] = useState([]);

  const fetchHistory = async () => {
    try { const { data } = await getTransactions(); setTransactions(data); } catch {}
  };

  const fetchLivePrice = async (symbol) => {
    try {
      const { data } = await getLiveQuote(symbol);
      setLivePrice(data.price);
      setQuoteData(data);
    } catch {}
  };

  const fetchWatchlist = async () => {
    try { const { data } = await getWatchlist(); setWatchlist(data); } catch {}
  };

  const fetchHoldings = async () => {
    try { const { data } = await getHoldings(); setHoldings(data); } catch {}
  };

  useEffect(() => {
    fetchHistory();
    fetchWatchlist();
    fetchHoldings();
    fetchLivePrice(activeSymbol);
    const priceTicker = setInterval(() => fetchLivePrice(activeSymbol), 15000);
    return () => clearInterval(priceTicker);
  }, [activeSymbol]);

  const handleWatchlistSelect = (symbol) => setActiveSymbol(symbol);

  const inferSector = (symbol) => {
    if (['AAPL','MSFT','NVDA','AMD','GOOGL','META','INTC'].includes(symbol)) return 'Technology';
    if (['TSLA','F','GM'].includes(symbol)) return 'Automotive';
    if (['AMZN','BABA','EBAY','SHOP'].includes(symbol)) return 'E-commerce';
    if (['JPM','BAC','GS','V','MA'].includes(symbol)) return 'Financials';
    if (['JNJ','PFE','UNH','MRNA'].includes(symbol)) return 'Healthcare';
    if (['XOM','CVX','COP'].includes(symbol)) return 'Energy';
    return 'Diversified Growth';
  };

  const handleOrder = async () => {
    if (!livePrice || executing) return;
    setExecuting(true);
    try {
      await executeTrade({
        symbol: activeSymbol, companyName: `${activeSymbol} Corp.`,
        type: tradeType, quantity: Number(quantity),
        price: livePrice, sector: inferSector(activeSymbol)
      });
      toast.success(`${tradeType} ${quantity} ${activeSymbol} @ $${livePrice.toFixed(2)}`);
      setShowPreview(false);
      fetchHistory();
      fetchHoldings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed');
    } finally {
      setExecuting(false);
    }
  };

  const currentHolding = holdings.find(h => h.symbol === activeSymbol);
  const totalCost = (quantity * livePrice).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-1">Trade Terminal</h1>
        <p className="text-sm text-surface-400">Execute simulated trades with real-time market prices</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Order Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-surface-200/60">
            <h2 className="text-sm font-bold text-surface-800 flex items-center gap-2">
              <HiOutlineBolt className="w-4 h-4 text-brand-400" /> Order Terminal
            </h2>
            <Badge variant="brand" size="xs">Simulated</Badge>
          </div>

          {/* Symbol */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Symbol</label>
            <input type="text" value={activeSymbol}
              onChange={(e) => setActiveSymbol(e.target.value.toUpperCase())}
              className="input-base font-mono font-bold uppercase text-lg" />
          </div>

          {/* Price Display */}
          <div className="bg-surface-50/80 border border-surface-200/60 rounded-xl p-4 text-center">
            <span className="text-xs uppercase text-surface-400 block mb-1">Market Price</span>
            <span className="text-3xl font-bold font-mono text-surface-900">${livePrice ? livePrice.toFixed(2) : '0.00'}</span>
            {quoteData.high && (
              <div className="flex justify-center gap-4 mt-2 text-xs text-surface-400">
                <span>H: <span className="text-gain font-mono">${quoteData.high?.toFixed(2)}</span></span>
                <span>L: <span className="text-loss font-mono">${quoteData.low?.toFixed(2)}</span></span>
                <span>PC: <span className="font-mono text-surface-700">${quoteData.previousClose?.toFixed(2)}</span></span>
              </div>
            )}
          </div>

          {/* Buy/Sell Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Action</label>
            <div className="grid grid-cols-2 gap-2 bg-surface-50/80 p-1 rounded-xl border border-surface-200/60">
              <button type="button" onClick={() => setTradeType('BUY')}
                className={`py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  tradeType === 'BUY' ? 'bg-gain/10 text-gain border border-gain/20' : 'text-surface-400 border border-transparent'
                }`}>BUY</button>
              <button type="button" onClick={() => setTradeType('SELL')}
                className={`py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  tradeType === 'SELL' ? 'bg-loss/10 text-loss border border-loss/20' : 'text-surface-400 border border-transparent'
                }`}>SELL</button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Quantity</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}
              className="input-base font-mono font-bold" />
          </div>

          {/* Position info */}
          {currentHolding && (
            <div className="bg-brand-500/5 border border-brand-500/10 rounded-xl p-3 text-xs">
              <span className="text-surface-400">Current Position: </span>
              <span className="font-bold text-surface-900">{currentHolding.quantity} shares</span>
              <span className="text-surface-400 ml-2">@ ${currentHolding.avgPrice.toFixed(2)} avg</span>
            </div>
          )}

          {/* Total + Submit */}
          <div className="pt-4 border-t border-surface-200/60 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Estimated Total</span>
              <span className="font-bold font-mono text-surface-900 text-lg">${totalCost}</span>
            </div>
            <button onClick={() => setShowPreview(true)} disabled={!livePrice || quantity < 1}
              className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tradeType === 'BUY'
                  ? 'bg-gain hover:bg-gain-dark text-white shadow-lg shadow-gain/20'
                  : 'bg-loss hover:bg-loss-dark text-white shadow-lg shadow-loss/20'
              } disabled:opacity-30`}>
              Preview {tradeType} Order
            </button>
          </div>
        </motion.div>

        {/* Watchlist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card p-5 max-h-[650px] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200/60">
            <h2 className="text-sm font-bold text-surface-800 flex items-center gap-2">
              <HiOutlineStar className="w-4 h-4 text-brand-400" /> Watchlist
            </h2>
            <span className="text-xs text-surface-400">{watchlist.length} stocks</span>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1">
            {watchlist.map((item) => {
              const isUp = item.change >= 0;
              return (
                <button key={item.symbol} onClick={() => handleWatchlistSelect(item.symbol)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                    activeSymbol === item.symbol ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-surface-100/30 border border-transparent'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-surface-900 font-mono">{item.symbol}</span>
                    <Badge variant={isUp ? 'gain' : 'loss'} size="xs">
                      {isUp ? '+' : ''}{item.percentChange?.toFixed(2)}%
                    </Badge>
                  </div>
                  <span className="font-mono text-sm font-semibold text-surface-700">${item.price?.toFixed(2)}</span>
                </button>
              );
            })}
            {watchlist.length === 0 && (
              <p className="text-xs text-surface-400 text-center py-8">No watchlist items. Add from Market page.</p>
            )}
          </div>
        </motion.div>

        {/* Order History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card overflow-hidden max-h-[650px] flex flex-col">
          <div className="px-5 py-4 border-b border-surface-200/60">
            <h2 className="text-sm font-bold text-surface-800">Recent Orders</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/50 text-surface-400 border-b border-surface-200/40 sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase">Type</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase">Symbol</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase text-right">Qty</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200/40">
                {transactions.slice(0, 15).map(t => (
                  <tr key={t._id} className="hover:bg-surface-100/20 transition-colors">
                    <td className="px-4 py-2.5"><Badge variant={t.type === 'BUY' ? 'gain' : 'loss'} size="xs">{t.type}</Badge></td>
                    <td className="px-4 py-2.5 font-bold text-surface-900 font-mono text-xs">{t.symbol}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-surface-700 text-xs">{t.quantity}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-surface-700 text-xs">${t.price.toFixed(2)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan="4" className="px-4 py-12 text-center text-surface-400 text-sm">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Order Preview" size="sm">
        <div className="space-y-4">
          <div className="bg-white/80 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Action</span>
              <Badge variant={tradeType === 'BUY' ? 'gain' : 'loss'}>{tradeType}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Symbol</span>
              <span className="font-bold text-surface-900 font-mono">{activeSymbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Quantity</span>
              <span className="font-mono text-surface-900">{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Price</span>
              <span className="font-mono text-surface-900">${livePrice?.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-surface-300/40 flex justify-between text-sm">
              <span className="font-semibold text-surface-700">Total</span>
              <span className="font-bold font-mono text-surface-900 text-lg">${totalCost}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPreview(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleOrder} disabled={executing}
              className={`flex-1 btn text-sm font-bold ${tradeType === 'BUY' ? 'bg-gain hover:bg-gain-dark text-white' : 'bg-loss hover:bg-loss-dark text-white'}`}>
              {executing ? 'Executing...' : `Confirm ${tradeType}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TradingSimulator;