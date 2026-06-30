'use client';

import { createContext, useContext, useState } from 'react';
import type { DateRange } from 'react-day-picker';

type BookingContextType = {
  selectedDate: DateRange | undefined;
  setSelectedDate: (date: DateRange | undefined) => void;
  quantities: Record<number, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  reset: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>();
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const reset = () => {
    setSelectedDate(undefined);
    setQuantities({});
  };

  return (
    <BookingContext.Provider
      value={{ selectedDate, setSelectedDate, quantities, setQuantities, reset }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking doit être utilisé à l’intérieur d’un BookingProvider');
  }
  return context;
}
