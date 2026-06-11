import React from 'react';
import './textZbl.scss';

export type TextZblProps = {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  jetbrains?: boolean;
  color?: 'white' | 'black' | 'yellow' | 'red' | 'grey' | 'none';
  redPrefix?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export default function TextZbl({
  tag: Tag = 'p',
  color = 'white',
  jetbrains = false,
  redPrefix,
  children,
  ...props
}: TextZblProps) {
  const fontText = jetbrains ? '_jtb' : undefined;

  const colorText = color !== 'none' && `color_${color}`;
  return (
    <Tag
      {...props}
      className={`global_text text_${Tag}${fontText ? fontText : ''} ${colorText} ${props.className ?? ''}`.trim()}
    >
      {redPrefix ? <span className="color_red text_p_jtb">{redPrefix}</span> : undefined}
      {children}
    </Tag>
  );
}
