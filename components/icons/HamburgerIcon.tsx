
import React from 'react';

interface HamburgerIconProps extends React.SVGProps<SVGSVGElement> {
  isOpen: boolean;
}

export const HamburgerIcon: React.FC<HamburgerIconProps> = ({ isOpen, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    style={{ transition: 'transform 0.3s ease' }}
  >
    <line x1="3" y1="12" x2="21" y2="12" style={{ transformOrigin: 'center', transition: 'transform 0.3s ease, opacity 0.3s ease', transform: isOpen ? 'rotate(45deg) translate(0, 0)' : 'rotate(0deg)', opacity: isOpen ? 0 : 1 }} />
    <line x1="3" y1="6" x2="21" y2="6" style={{ transformOrigin: 'center', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg) translate(-2px, -3px)' : 'rotate(0deg)' }} />
    <line x1="3" y1="18" x2="21" y2="18" style={{ transformOrigin: 'center', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(-45deg) translate(-3px, 4px)' : 'rotate(0deg)' }} />
  </svg>
);
