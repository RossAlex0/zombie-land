'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import { useMemo } from 'react';
import './ticketCategoryCard.scss';

type TicketCategoryCardProps = {
  label: string;
  basePrice: number; // config.entry_price
  reduction: number; // pourcentage (ex: 50 = -50%)
  quantity: number;
  onChange: (quantity: number) => void;
};

export default function TicketCategoryCard({
  label,
  basePrice,
  reduction,
  quantity,
  onChange,
}: TicketCategoryCardProps) {
  const price = useMemo(() => basePrice * (1 - reduction / 100), [basePrice, reduction]);
  const age =
    label === 'Enfant'
      ? '12-18 ans'
      : label == 'Sénior'
        ? '+60 ans'
        : label == 'Adulte'
          ? '18-60ans'
          : null;
  const decrement = () => onChange(Math.max(0, quantity - 1));
  const increment = () => onChange(quantity + 1);

  return (
    <div className="ticket_row">
      <div className="ticket_row_info">
        <TextZbl tag="h3" color="red" className="ticket_row_label">
          {label}
        </TextZbl>
        {age ? (
          <TextZbl jetbrains className="ticket_row_age" color="grey" redPrefix="//">
            {age}
          </TextZbl>
        ) : undefined}
      </div>

      <div className="ticket_row_controls">
        <button
          type="button"
          className="ticket_row_btn"
          onClick={decrement}
          disabled={quantity === 0}
        >
          −
        </button>
        <span className="ticket_row_quantity">{quantity}</span>
        <button type="button" className="ticket_row_btn ticket_row_btn_add" onClick={increment}>
          +
        </button>
      </div>

      <span className="ticket_row_price">{price.toFixed(2)} €</span>
    </div>
  );
}
