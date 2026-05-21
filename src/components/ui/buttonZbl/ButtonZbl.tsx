'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import type { ReactNode, ButtonHTMLAttributes } from 'react';

import './ButtonZbl.scss';

export type ButtonZblProps = {
  children: ReactNode;
  theme?: 'dark' | 'light';
  navTo?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

export default function ButtonZbl({
  children,
  theme = 'dark',
  navTo = '/',
  ...props
}: ButtonZblProps) {
  const router = useRouter();

  const handleClick = useCallback(() => router.push(navTo), [navTo, router]);

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
