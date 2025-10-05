import React from 'react';

/**
 * The official logo for Luna Moth Gifts.
 * A refined and elegant logo combining the celestial moth icon
 * with the brand's name in the Cormorant Garamond font.
 */
export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 -5 260 45"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g fill="currentColor">
            {/* Moth Icon */}
            <g transform="translate(15, 23) scale(1.6)" color="#A7A1E5">
                {/* Body */}
                <path d="M0 -14v10" stroke="currentColor" strokeWidth="1" />
                {/* Antennae */}
                <path d="M-2 -14.5 a3 -3 0 0 1 -3 -2" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M2 -14.5 a3 3 0 0 0 3 -2" stroke="currentColor" strokeWidth="1" fill="none" />
                {/* Wings */}
                <path d="M-1 -13 C -8 -16, -10 -8, -1 -6" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M1 -13 C 8 -16, 10 -8, 1 -6" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M-1 -5.5 C -7 -5, -6 2, -3 1" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M1 -5.5 C 7 -5, 6 2, 3 1" stroke="currentColor" strokeWidth="1" fill="none" />
                {/* Celestial Elements */}
                <path d="M-5 -10.5 A 2 2 0 0 0 -4.5 -9 A 1.5 1.5 0 0 1 -5 -10.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
                <path d="M5 -10 L5.5 -11 L6 -10 L5.25 -9.5 L6 -9 L5 -9.25 L4 -9 L4.75 -9.5 Z" strokeWidth="0.5" stroke="currentColor" fill="currentColor"/>
            </g>

            {/* Brand Name Text */}
            <text
                x="42"
                y="27"
                fontFamily="'Cormorant Garamond', serif"
                fontSize="26"
                fontWeight="700"
                letterSpacing="1.5"
                fill="currentColor"
            >
                Luna Moth Gifts
            </text>
        </g>
    </svg>
);