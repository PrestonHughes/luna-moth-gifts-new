
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 py-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Luna Moth Gifts. All rights reserved.</p>
        <p className="text-sm mt-2">Please note: We are currently a cash-only business for in-person sales.</p>
      </div>
    </footer>
  );
};

export default Footer;