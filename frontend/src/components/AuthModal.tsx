import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Food Manufacturer');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (e: string) => {
    return /\S+@\S+\.\S+/.test(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      return setError('Please enter a valid email address.');
    }

    if (!password) {
      return setError('Please enter your password.');
    }

    if (mode === 'signup') {
      if (!fullName.trim()) return setError('Please enter your full name.');
      if (password.length < 6) return setError('Password must be at least 6 characters long.');
      if (password !== confirmPassword) return setError('Passwords do not match.');
    }

    const userObj: User = {
      id: email.includes('admin') ? 'u-admin' : `u-${Date.now()}`,
      full_name: fullName || (email.includes('admin') ? 'SIH Admin User' : 'PackWise Professional'),
      email: email.toLowerCase().trim(),
      user_type: email.includes('admin') ? 'Admin' : userType
    };

    onLoginSuccess(userObj);
    onClose();
  };

  const fillDemoUser = (type: 'demo' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@packwise.ai');
      setPassword('admin123');
      setUserType('Admin');
    } else {
      setEmail('demo@packwise.ai');
      setPassword('demo123');
      setUserType('Food Manufacturer');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      return setError('Enter your email address above to reset password.');
    }
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#4CAF50]/20 w-full max-w-md overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#245B35] to-[#4CAF50] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-extrabold flex items-center gap-2">
            {mode === 'login' ? <LogIn className="w-6 h-6 text-[#FFC107]" /> : <UserPlus className="w-6 h-6 text-[#FFC107]" />}
            {mode === 'login' ? 'Sign In to PackWise AI' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-100 mt-1">
            Smarter Packaging. Better Food Protection.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 text-xs bg-red-50 text-tomato-red border border-red-200 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {forgotSent && (
            <div className="p-3 text-xs bg-emerald-50 text-[#245B35] border border-emerald-200 rounded-xl font-semibold">
              Password reset link sent to {email}. Check your inbox!
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@packwise.ai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">User Category</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-sm bg-white"
                >
                  <option value="Farmer">Farmer / Agri Producer</option>
                  <option value="Food Manufacturer">Food Manufacturer</option>
                  <option value="Startup">Agri-Food Startup</option>
                  <option value="Researcher">Researcher / Scientist</option>
                  <option value="Student">Student</option>
                  <option value="Packaging Professional">Packaging Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-1.5 font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#4CAF50] focus:ring-[#4CAF50]"
                />
                Remember Me
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-bold text-[#4CAF50] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-extrabold text-sm rounded-xl shadow-md transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Dashboard' : 'Create Account'}
          </button>

          {/* Quick Demo Pre-fill Shortcuts */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoUser('demo')}
              className="flex-1 py-1.5 px-2 bg-[#FFF8E7] hover:bg-[#FFC107]/20 border border-[#FFC107] text-[#245B35] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> Quick Demo User
            </button>
            <button
              type="button"
              onClick={() => fillDemoUser('admin')}
              className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-[#4CAF50] text-[#245B35] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-[#245B35]" /> Quick Admin User
            </button>
          </div>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-[#4CAF50] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-[#4CAF50] font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
