import React, { useEffect, useState } from 'react';
import type { User, Page } from '../types';
import { UserIcon } from './icons/UserIcon';
import { CartIcon } from './icons/CartIcon';
import { XIcon } from './icons/XIcon';

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  navigateTo: (page: Page) => void;
  onCartClick: () => void;
  cartItemCount: number;
  currentPage: Page;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, user, onClose, onLoginClick, onLogoutClick, navigateTo, onCartClick, cartItemCount, currentPage }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => setIsRendered(false), 300); // Wait for animation to finish
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);


  const handleNavigate = (page: Page) => {
    navigateTo(page);
    onClose();
  };

  const handleLogin = () => {
    onLoginClick();
    onClose();
  };
  
  const handleLogout = () => {
    onLogoutClick();
    onClose();
  };

  const handleCartClick = () => {
    onCartClick();
    onClose();
  }

  if (!isRendered) return null;

  return (
    <div
      className="fixed inset-0 z-[60] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-lg p-6 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-brand-deep-purple p-2"
            aria-label="Close menu"
        >
            <XIcon className="w-6 h-6" />
        </button>

        <nav className="flex flex-col gap-6 text-lg mt-12">
          {currentPage !== 'home' && <button onClick={() => handleNavigate('home')} className="bg-transparent text-slate-700 hover:text-brand-purple font-medium text-left py-2">Home</button>}
          {currentPage !== 'inventory' && <button onClick={() => handleNavigate('inventory')} className="bg-transparent text-slate-700 hover:text-brand-purple font-medium text-left py-2">Collection</button>}
          {user && currentPage !== 'stone-identifier' && <button onClick={() => handleNavigate('stone-identifier')} className="bg-transparent text-slate-700 hover:text-brand-purple font-medium text-left py-2">Stone Identifier</button>}
          {user && currentPage !== 'account' && <button onClick={() => handleNavigate('account')} className="bg-transparent text-slate-700 hover:text-brand-purple font-medium text-left py-2">My Account</button>}
           <button onClick={handleCartClick} className="bg-transparent flex items-center gap-2 text-slate-700 hover:text-brand-purple font-medium text-left py-2">
            <span>Cart</span>
             {cartItemCount > 0 && (
                <span className="block h-6 w-6 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
          </button>
        </nav>

        <div className="border-t border-slate-200 mt-6 pt-6">
          {user ? (
              <div className="flex flex-col gap-4">
                 <p className="text-slate-600">Welcome, {user.email.split('@')[0]}</p>
                 <button
                    onClick={handleLogout}
                    className="bg-brand-light-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-purple transition-colors duration-300 w-full"
                >
                    Logout
                </button>
              </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-brand-purple text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <UserIcon className="w-5 h-5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;