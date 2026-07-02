'use client';

import TextZbl from '@components/ui/text-zbl/TextZbl';
import { Calendar1, Minus, Plus, TicketMinus, Users } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { parseDateFr } from '@shared/date';
import './ticketSummary.scss';

type TicketSummaryProps = {
  selectedDate: DateRange | undefined;
  numberOfPeople: number;
  entryPrice: number;
  onAddPeople?: () => void;
  onRemovePeople?: () => void;
  isRemoveDisabled?: boolean;
};

export default function TicketSummary({
  selectedDate,
  numberOfPeople,
  entryPrice,
  onAddPeople,
  onRemovePeople,
  isRemoveDisabled = false,
}: TicketSummaryProps) {
  return (
    <div className="ticket_summary">
      <div className="ticket_summary_details">
        <Calendar1 color="#ac382a" size={20} />
        <TextZbl color="grey" jetbrains>
          Date :
        </TextZbl>
        <TextZbl jetbrains className="ticket_summary_text_wrap">
          {selectedDate?.from && selectedDate?.to
            ? selectedDate?.from === selectedDate?.to
              ? ` ${parseDateFr(selectedDate?.from)}`
              : ` ${parseDateFr(selectedDate?.from)} au ${parseDateFr(selectedDate?.to)}`
            : undefined}
        </TextZbl>
      </div>

      <div className="ticket_summary_details">
        <Users color="#ac382a" size={20} />
        <TextZbl color="grey" jetbrains>
          Personnes :
        </TextZbl>
        <TextZbl jetbrains>{numberOfPeople}</TextZbl>
        {onAddPeople && onRemovePeople ? (
          <div className="ticket_summary_details_btns">
            <button
              className={`${isRemoveDisabled ? 'ticket_summary_btn_disabled' : 'ticket_summary_btn'} ticket_summary_btn_left`}
              disabled={isRemoveDisabled}
              onClick={onRemovePeople}
              aria-label="Retirer une personne"
            >
              <Minus color="#e5e5e5" size={16} />
            </button>
            <button
              className="ticket_summary_btn ticket_summary_btn_right"
              onClick={onAddPeople}
              aria-label="Ajouter une personne"
            >
              <Plus color="#e5e5e5" size={16} />
            </button>
          </div>
        ) : undefined}
      </div>

      <div className="ticket_summary_details">
        <TicketMinus color="#ac382a" size={20} />
        <TextZbl color="grey" jetbrains>
          Prix du billet :
        </TextZbl>
        <TextZbl jetbrains>{entryPrice} €</TextZbl>
      </div>
    </div>
  );
}
