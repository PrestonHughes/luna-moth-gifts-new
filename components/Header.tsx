import React from 'react';
import type { User, Page } from '../types';
import { Logo } from './Logo';
import { UserIcon } from './icons/UserIcon';
import { HamburgerIcon } from './icons/HamburgerIcon';
import { CartIcon } from './icons/CartIcon';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  navigateTo: (page: Page) => void;
  onCartClick: () => void;
  cartItemCount: number;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, navigateTo, onCartClick, cartItemCount, isMenuOpen, onMenuToggle, currentPage }) => {

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => navigateTo('home')} className="flex items-center gap-3" aria-label="Go to homepage">
          <Logo className="h-10 text-brand-deep-purple" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {currentPage !== 'inventory' && <button onClick={() => navigateTo('inventory')} className="text-slate-600 hover:text-brand-purple transition-colors font-semibold text-lg tracking-wide">Collection</button>}
          {user && currentPage !== 'account' && <button onClick={() => navigateTo('account')} className="text-slate-600 hover:text-brand-purple transition-colors font-semibold text-lg tracking-wide">My Account</button>}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-slate-600">Welcome, {user.firstName || user.email.split('@')[0]}!</span>
              <button
                onClick={onLogoutClick}
                className="bg-brand-light-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-purple transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 bg-transparent border border-brand-purple text-brand-purple font-bold py-2 px-4 rounded-lg hover:bg-brand-purple hover:text-white transition-all duration-300"
            >
              <UserIcon className="w-5 h-5" />
              <span>Login / Sign Up</span>
            </button>
          )}
           <button onClick={onCartClick} className="relative text-slate-600 hover:text-brand-purple hover:bg-slate-100 rounded-lg transition-all p-2" aria-label={`View cart with ${cartItemCount} items`}>
              <CartIcon className="w-7 h-7" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartItemCount}
                </span>
              )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
           <button onClick={onCartClick} className="relative text-slate-600 hover:text-brand-purple hover:bg-slate-100 rounded-lg transition-all p-2" aria-label={`View cart with ${cartItemCount} items`}>
              <CartIcon className="w-7 h-7" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-purple text-white text-xs flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartItemCount}
                </span>
              )}
          </button>
          <button onClick={onMenuToggle} aria-label="Open menu">
            <HamburgerIcon isOpen={isMenuOpen} className="w-8 h-8 text-brand-deep-purple" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;