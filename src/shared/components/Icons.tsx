/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const BIMIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export const ZaloIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M50 8C26.8 8 8 23.8 8 43.3c0 8.7 3.7 16.7 9.8 22.7L12 86l18.1-7.8c6.2 3.1 13.2 4.8 20.6 4.8 23.2 0 42-15.8 42-35.3S73.2 8 50 8z" 
      fill="#FFFFFF" 
    />
    <text 
      x="50" 
      y="54" 
      fill="#0068FF" 
      fontSize="28" 
      fontWeight="900" 
      fontFamily="Arial, Helvetica, sans-serif" 
      textAnchor="middle" 
      letterSpacing="-1"
    >
      zalo
    </text>
  </svg>
);
