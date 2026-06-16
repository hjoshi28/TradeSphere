import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError('');
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Access denied.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 bg-black text-zinc-200 font-sans">
      <form 
        onSubmit={handleSubmit} 
        className="bg-zinc-950 border border-zinc-800 p-10 rounded-xl shadow-2xl w-full max-w-md space-y-6"
      >
        {/* Header Block */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Welcome</span>
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          </h2>
          <p className="text-sm text-zinc-500">Pls fill in your details to access TradeSphere.</p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="p-4 rounded-lg bg-pink-950/10 border border-pink-950/20 text-sm font-mono font-medium text-pink-400 animate-fadeIn">
            ⚠️ {error}
          </div>
        )}

        {/* Inputs Layout */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase text-zinc-500 mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="name@domain.com"
              className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-mono text-base tracking-wide placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase text-zinc-500 mb-2">
              Security Password
            </label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white font-mono text-base tracking-widest placeholder:text-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors" 
            />
          </div>
        </div>

        {/* Submission Action */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white border border-purple-600 transition-colors cursor-pointer disabled:opacity-40"
          >
            {submitting ? "Verifying..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;