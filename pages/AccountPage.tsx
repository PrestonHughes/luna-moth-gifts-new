
import React, { useState } from 'react';
import type { User, Order } from '../types';
import { PencilIcon } from '../components/icons/PencilIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';

interface AccountPageProps {
  user: User | null;
  onLogoutClick: () => void;
  onUpdateUser: (updatedInfo: Partial<User>) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, onLogoutClick, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center animate-fade-in">
        <h1 className="font-serif text-4xl font-bold text-brand-deep-purple mb-4">Access Denied</h1>
        <p className="text-slate-600">Please log in to view your account details.</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
    setIsEditing(false);
  };
  
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const greetingName = user.firstName || user.email.split('@')[0];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-12">
      <h1 className="font-serif text-5xl font-bold text-brand-deep-purple mb-6 text-center">
        My Account
      </h1>
      
      {/* Personal Info */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
        <p className="text-xl text-slate-700 mb-8 text-center">
          Welcome back, <span className="font-bold">{greetingName}</span>!
        </p>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
            <h2 className="font-serif text-2xl font-bold text-brand-deep-purple">Edit Information</h2>
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-slate-600 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light-purple" 
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold text-slate-600 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light-purple" 
                placeholder="Enter your last name"
              />
            </div>
            <div className="border-t border-slate-200 pt-6 flex justify-end gap-4">
              <button type="button" onClick={handleCancel} className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
              <button type="submit" className="bg-brand-purple text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-brand-deep-purple">Personal Information</h2>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-semibold text-brand-purple hover:underline p-1">
                <PencilIcon className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Name</span>
                <span className="text-slate-800 text-right">{user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : <span className="italic text-slate-400">Not provided</span>}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-500">Email</span>
                <span className="text-slate-800">{user.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
        <h2 className="font-serif text-3xl font-bold text-brand-deep-purple mb-6">Order History</h2>
        {user.orders && user.orders.length > 0 ? (
          <div className="space-y-4">
            {user.orders.map(order => (
              <div key={order.id} className="border border-slate-200 rounded-lg">
                <button 
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 transition-colors"
                    aria-expanded={expandedOrderId === order.id}
                    aria-controls={`order-details-${order.id}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <span className="font-bold text-slate-800">Order #{order.id}</span>
                    <span className="text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="font-bold text-brand-purple">${order.total.toFixed(2)}</span>
                     <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {expandedOrderId === order.id && (
                    <div id={`order-details-${order.id}`} className="p-4 border-t border-slate-200 bg-slate-50/50 animate-fade-in">
                        <h4 className="font-bold mb-3 text-slate-700">Items:</h4>
                        <ul className="space-y-3">
                            {order.items.map(item => (
                                <li key={item.productId} className="flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-800">{item.name}</p>
                                        <p className="text-sm text-slate-500">{item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-slate-800">${item.price.toFixed(2)}</p>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">You haven't placed any orders yet.</p>
        )}
      </div>

      <div className="text-center">
        <button
            onClick={onLogoutClick}
            className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300"
        >
            Logout
        </button>
      </div>

    </div>
  );
};

export default AccountPage;
