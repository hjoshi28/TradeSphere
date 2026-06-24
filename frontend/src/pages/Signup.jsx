import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const getPasswordStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-loss' };
    if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    return { level: 3, label: 'Strong', color: 'bg-gain' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const { data } = await register({ name, email, password });
      login(data, true);
      toast.success('Account created! Welcome to TradeSphere!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-surface-50 relative overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <span className="text-lg font-black text-white">T</span>
            </div>
            <span className="text-2xl font-bold text-surface-900">TradeSphere</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Create your account</h1>
          <p className="text-sm text-surface-400">Start trading with $100,000 in virtual funds</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-loss/10 border border-loss/20 text-sm text-loss">
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              placeholder="John Doe" className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com" className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                className="input-base pr-11" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300 cursor-pointer">
                {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 flex gap-1">
                  {[1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : 'bg-surface-50'}`} />
                  ))}
                </div>
                <span className="text-xs text-surface-400">{strength.label}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">Confirm Password</label>
            <input type="password" required value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
              className="input-base" />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-sm">
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Creating account...
              </div>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-surface-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
