import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface BookingContextType {
  selectedTrip: any; // In a real app, you'd have a strict type for the trip
  selectTrip: (trip: any) => void;
}

// Create the context with a default value
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const selectTrip = (trip: any) => {
    setSelectedTrip(trip);
  };

  const value = {
    selectedTrip,
    selectTrip,
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
