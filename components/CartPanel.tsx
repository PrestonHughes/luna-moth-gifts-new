
import React from 'react';
import type { CartItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, newQuantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  onCheckout: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.selectedVariant.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'bg-black/40' : 'bg-transparent pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h2 className="font-serif text-3xl font-bold text-brand-deep-purple">Your Cart</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-3xl">&times;</button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-slate-500 pt-16">
                <p className="text-xl">Your cart is empty.</p>
                <p>Find something special to add!</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {cartItems.map(item => (
                  <li key={item.cartId} className="py-4 flex gap-4">
                    <img src={item.imageUrls[0]} alt={item.name} referrerPolicy="no-referrer" className="w-24 h-24 rounded-md object-cover" />
                    <div className="flex-grow flex flex-col">
                      <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                      {item.selectedVariant.size !== 'Standard' && (
                        <p className="text-sm text-slate-500">{item.selectedVariant.size}</p>
                      )}
                      <p className="text-brand-purple font-semibold">${item.selectedVariant.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-auto">
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1 rounded-full border border-slate-300 hover:bg-slate-100"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <MinusIcon className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                           className="p-1 rounded-full border border-slate-300 hover:bg-slate-100"
                           aria-label={`Increase quantity of ${item.name}`}
                        >
                          <PlusIcon className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-auto self-start p-1"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4 font-bold text-lg">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-brand-light-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPanel;