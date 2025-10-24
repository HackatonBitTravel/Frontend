import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface BookingContextType {
  selectedTrip: any; // This will be the schedule object
  passengerInfo: { name: string; phone: string; email: string } | null;
  totalAmount: number;
  reservationId: string | null;
  ticketId: string | null; // Add ticketId
  selectTrip: (trip: any) => void;
  setPassengerInfo: (info: { name: string; phone: string; email: string }) => void;
  setTotalAmount: (amount: number) => void;
  setReservationId: (id: string) => void;
  setTicketId: (id: string) => void; // Add setTicketId
  resetBooking: () => void; // To clear booking state after confirmation or cancellation
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [passengerInfo, setPassengerInfo] = useState<{ name: string; phone: string; email: string } | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null); // Add ticketId

  const selectTrip = (trip: any) => {
    setSelectedTrip(trip);
  };

  const resetBooking = () => {
    setSelectedTrip(null);
    setPassengerInfo(null);
    setTotalAmount(0);
    setReservationId(null);
    setTicketId(null); // Reset ticketId
  };

  const value = {
    selectedTrip,
    passengerInfo,
    totalAmount,
    reservationId,
    ticketId, // Add ticketId
    selectTrip,
    setPassengerInfo,
    setTotalAmount,
    setReservationId,
    setTicketId, // Add setTicketId
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
