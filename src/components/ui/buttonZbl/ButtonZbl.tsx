'use client';

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
  navTo = '/',
  onClick,
  type = 'button',
  ...props
}: ButtonZblProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (type === 'submit') return;
    if (navTo && !e.defaultPrevented) router.push(navTo);
  };

  const buttonClass = props.disabled ? `button_custom_disabled` : `button_custom`;

  return (
    <button
      {...props}
      type={type}
      className={`${buttonClass} ${theme} ${props.className ?? ''}`}
      onClick={handleClick}
      aria-label="button"
    >
      {children}
    </button>
  );
}
