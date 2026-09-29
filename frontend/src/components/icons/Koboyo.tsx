import React from 'react';
import { IconProps } from './Reicon';

// Koboyo Icons (koboyo.com/icons) - Hand-drawn organic SVG icons

export const KoboyoSparkle: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2.5C12.4 7.2 16.5 11.2 21.5 12C16.8 12.6 12.5 16.6 12 21.5C11.4 16.8 7.3 12.5 2.5 12C7.2 11.4 11.5 7.3 12 2.5Z" />
  </svg>
);

export const KoboyoBrain: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9.5 4.5C7.2 4.5 5.5 6.2 5.5 8.5C4.2 9.2 3.5 10.6 3.5 12.2C3.5 13.9 4.4 15.3 5.8 16C5.9 18 7.5 19.5 9.5 19.5C10.5 19.5 11.4 19.1 12 18.5C12.6 19.1 13.5 19.5 14.5 19.5C16.5 19.5 18.1 18 18.2 16C19.6 15.3 20.5 13.9 20.5 12.2C20.5 10.6 19.8 9.2 18.5 8.5C18.5 6.2 16.8 4.5 14.5 4.5C13.5 4.5 12.6 4.9 12 5.5C11.4 4.9 10.5 4.5 9.5 4.5Z" />
    <path d="M12 6V18" />
    <path d="M8.5 9.5C9.5 10.5 9.5 11.5 8.5 12.5" />
    <path d="M15.5 9.5C14.5 10.5 14.5 11.5 15.5 12.5" />
  </svg>
);

export const KoboyoTarget: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9.2" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
  </svg>
);

export const KoboyoBadge: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 1.75,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="9" r="6.5" />
    <path d="M8.5 14.5L7 21.5L12 18.5L17 21.5L15.5 14.5" />
  </svg>
);

export const KoboyoCheck: React.FC<IconProps> = ({
  size = 20,
  strokeWidth = 2,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4.5 12.8L9.2 17.5L19.5 6.8" />
  </svg>
);
