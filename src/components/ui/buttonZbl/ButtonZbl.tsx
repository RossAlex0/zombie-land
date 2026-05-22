'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import type { ReactNode, ButtonHTMLAttributes } from 'react';

import './ButtonZbl.scss';

export type ButtonZblProps = {
  children: ReactNode;
  theme?: 'dark' | 'light' | 'custom';
  navTo?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonZbl({
  children,
  theme = 'light',
  navTo,
  disabled,
  onClick,
  ...props
}: ButtonZblProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (navTo) {
        router.push(navTo);
        return;
      }

      onClick?.(e);
    },
    [navTo, onClick, router]
  );

  const buttonClass = disabled ? `button_custom_disabled` : `button_custom`;

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${buttonClass} ${theme} ${props.className}`}
      onClick={handleClick}
      aria-label="button"
    >
      {children}
    </button>
  );
}
