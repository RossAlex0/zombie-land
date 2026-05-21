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
  onClick,
  ...props
}: ButtonZblProps) {
  const router = useRouter();

  //const handleClick = useCallback(() => router.push(navTo), [navTo, router]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (navTo && !e.defaultPrevented) router.push(navTo);
  };

  const buttonClass = props.disabled ? `button_custom_disabled` : `button_custom`;

  return (
    <button
      type="button"
      {...props}
      className={`${buttonClass} ${theme} ${props.className}`}
      onClick={handleClick}
      aria-label="button"
    >
      {children}
    </button>
  );
}
