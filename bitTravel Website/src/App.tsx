import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TripDetails from "./pages/TripDetails";
import PassengerDetails from "./pages/PassengerDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import AgencyLogin from "./pages/AgencyLogin";
import AgencyDashboard from "./pages/AgencyDashboard";
import AddTrip from "./pages/AddTrip";
import TicketVerification from "./pages/TicketVerification";
import NotFound from "./pages/NotFound";
import MyBookings from "./pages/MyBookings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/trip-details" element={<TripDetails />} />
            <Route path="/passenger-details" element={<PassengerDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/agency/login" element={<AgencyLogin />} />
            <Route path="/agency/dashboard" element={<AgencyDashboard />} />
            <Route path="/agency/add-trip" element={<AddTrip />} />
            <Route path="/verify" element={<TicketVerification />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
