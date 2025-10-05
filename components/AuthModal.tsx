
import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail } from '../services/firebaseService';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
        if (isLogin) {
            // Handle Login
            await signInWithEmail(email, password);
            onClose(); // Close modal on success
        } else {
            // Handle Sign Up
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setIsLoading(false);
                return;
            }
            await signUpWithEmail(email, password);
            onClose(); // Close modal on success
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-3xl font-bold text-brand-deep-purple">{isLogin ? 'Login' : 'Sign Up'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-600 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-light-purple"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-600 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-light-purple"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
                <label className="block text-slate-600 mb-2" htmlFor="confirm-password">Confirm Password</label>
                <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-light-purple"
                placeholder="••••••••"
                required
                />
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <button 
            type="submit" 
            className="w-full bg-brand-light-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }} 
            className="font-bold text-brand-light-purple hover:underline ml-2"
            disabled={isLoading}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;