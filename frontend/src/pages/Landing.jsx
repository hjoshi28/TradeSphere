import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineChartBarSquare,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineCpuChip,
  HiArrowRight,
} from 'react-icons/hi2';

const features = [
  { icon: HiOutlineChartBarSquare, title: 'Real-Time Analytics', desc: 'Live portfolio tracking with advanced performance metrics and sector analysis.' },
  { icon: HiOutlineBolt, title: 'Instant Trading', desc: 'Execute trades in milliseconds with our powerful simulated trading engine.' },
  { icon: HiOutlineSparkles, title: 'AI-Powered Insights', desc: 'Get intelligent portfolio recommendations powered by Google Gemini AI.' },
  { icon: HiOutlineShieldCheck, title: 'Risk Management', desc: 'Advanced risk scoring and diversification health monitoring for your portfolio.' },
  { icon: HiOutlineGlobeAlt, title: 'Live Market Data', desc: 'Real-time stock prices and market data from Finnhub financial API.' },
  { icon: HiOutlineCpuChip, title: 'Smart Watchlists', desc: 'Track your favorite stocks with live price updates and quick trade actions.' },
];

const stats = [
  { value: '100K+', label: 'Starting Balance' },
  { value: 'Real-Time', label: 'Market Data' },
  { value: 'AI', label: 'Portfolio Advisor' },
  { value: '0%', label: 'Commission' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface-950 overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <span className="text-base font-black text-white">T</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TradeSphere</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 sm:px-10 lg:px-16 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/8 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-8">
              <HiOutlineSparkles className="w-3.5 h-3.5" />
              AI-Powered Trading Simulator
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Master Trading{' '}
              <span className="gradient-text">Without the Risk</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice stock trading with $100,000 in virtual funds, real-time market data, 
              and AI-powered portfolio insights. Build your strategy risk-free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-brand-500/20">
                Start Trading Free
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign In to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 sm:px-10 lg:px-16 py-12 border-y border-surface-800/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-surface-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Everything You Need to Trade Smarter</h2>
            <p className="text-surface-400 text-lg max-w-xl mx-auto">Professional-grade tools wrapped in a beautiful, intuitive interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card card-hover p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/15 transition-colors">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 lg:px-16 py-20">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Start Trading?</h2>
            <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">Join TradeSphere and practice with real market data and AI-powered insights.</p>
            <Link to="/signup" className="btn-primary text-base px-10 py-3.5 shadow-xl shadow-brand-500/20">
              Create Free Account
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 lg:px-16 py-8 border-t border-surface-800/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">T</span>
            </div>
            <span className="text-sm font-semibold text-surface-400">TradeSphere</span>
          </div>
          <p className="text-xs text-surface-600">© 2026 TradeSphere. Virtual trading simulator for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
