import React from 'react';

export const CrystalBallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        {/* Keyframes for sparkle animation are defined inside the SVG for encapsulation */}
        <defs>
            <style>
                {`
                @keyframes sparkle-anim {
                    0%, 100% { opacity: 0; transform: scale(0.5) translateY(0); }
                    50% { opacity: 1; transform: scale(1) translateY(-5px); }
                }
                .sparkle {
                    animation: sparkle-anim 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    transform-origin: center;
                }
                `}
            </style>
        </defs>

        {/* Crystal Ball Stand */}
        <path d="M9 21h6" />
        <path d="M10 18h4" />
        <path d="M12 18v3" />

        {/* Crystal Ball with a subtle pulse from Tailwind's config */}
        <circle cx="12" cy="12" r="7" className="animate-pulse-subtle" />

        {/* Animated Sparkles */}
        <g className="sparkle" style={{ animationDelay: '0s' }}>
            <line x1="6" y1="7" x2="8" y2="7" />
            <line x1="7" y1="6" x2="7" y2="8" />
        </g>
        <g className="sparkle" style={{ animationDelay: '0.4s' }}>
            <line x1="17" y1="5" x2="19" y2="5" />
            <line x1="18" y1="4" x2="18" y2="6" />
        </g>
        <g className="sparkle" style={{ animationDelay: '0.8s' }}>
            <line x1="16" y1="15" x2="18" y2="15" />
            <line x1="17" y1="14" x2="17" y2="16" />
        </g>
         <g className="sparkle" style={{ animationDelay: '1.2s' }}>
            <line x1="9" y1="14" x2="11" y2="14" />
            <line x1="10" y1="13" x2="10" y2="15" />
        </g>
    </svg>
);
