import React from 'react';
import { Logo } from './Logo';
import { User } from '../types';
import { LogIn, UserPlus, LayoutDashboard, Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  activeView,
  setActiveView
}) => {
  const scrollToSection = (sectionId: string) => {
    if (activeView !== 'landing') {
      setActiveView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#4CAF50]/20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div onClick={() => setActiveView('landing')}>
          <Logo />
        </div>

        {/* Navigation Links with Smooth Scrolling */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-dark">
          <button 
            onClick={() => setActiveView('landing')} 
            className={`hover:text-[#4CAF50] transition-colors ${activeView === 'landing' ? 'text-[#245B35] font-bold border-b-2 border-[#4CAF50] pb-1' : ''}`}
          >
            Home
          </button>
          
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-[#4CAF50] transition-colors"
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-[#4CAF50] transition-colors"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('food-categories')}
            className="hover:text-[#4CAF50] transition-colors"
          >
            Food Categories
          </button>

          <button 
            onClick={() => setActiveView('explorer')} 
            className={`hover:text-[#4CAF50] transition-colors ${activeView === 'explorer' ? 'text-[#245B35] font-bold border-b-2 border-[#4CAF50] pb-1' : ''}`}
          >
            Packaging Materials
          </button>

          <button
            onClick={() => scrollToSection('sustainability')}
            className="hover:text-[#4CAF50] transition-colors"
          >
            Sustainability
          </button>

          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-[#4CAF50] transition-colors"
          >
            About
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2 bg-[#FFF8E7] text-[#245B35] border border-[#FFC107] hover:bg-[#FFC107]/20 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-[#4CAF50]" />
                Dashboard
              </button>
              
              {currentUser.user_type === 'Admin' && (
                <button
                  onClick={() => setActiveView('admin')}
                  className="flex items-center gap-1.5 bg-[#245B35] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#245B35]/90 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FFC107]" />
                  Admin Panel
                </button>
              )}

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 text-slate-500 hover:text-tomato-red hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#245B35] hover:text-[#4CAF50] px-3.5 py-2 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
