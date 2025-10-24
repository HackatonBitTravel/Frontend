import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TripDetails from "./pages/TripDetails";
import PassengerDetails from "./pages/PassengerDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import AgencyLogin from "./pages/AgencyLogin";
import AgencyDashboard from "./pages/AgencyDashboard";
import AddSchedule from "./pages/AddSchedule";
import AddRoute from "./pages/AddRoute";
import TicketVerification from "./pages/TicketVerification";
import NotFound from "./pages/NotFound";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import BoardingControl from "./pages/BoardingControl";
import Contact from "./pages/Contact";
import AgencySignUp from "./pages/AgencySignUp";
import AgencyAuthRedirect from "./components/AgencyAuthRedirect"; // Import AgencyAuthRedirect
import ClientAuthGuard from "./components/ClientAuthGuard"; // Import ClientAuthGuard

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BookingProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/trip-details" element={<TripDetails />} />
            <Route path="/passenger-details" element={<PassengerDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            {/* Protected agency auth routes */}
            <Route element={<AgencyAuthRedirect />}>
              <Route path="/agency/login" element={<AgencyLogin />} />
              <Route path="/agency/signup" element={<AgencySignUp />} />
            </Route>
            <Route path="/agency/dashboard" element={<AgencyDashboard />} />
            <Route path="/agency/add-route" element={<AddRoute />} />
            <Route path="/agency/add-schedule" element={<AddSchedule />} />
            <Route path="/agency/boarding-control" element={<BoardingControl />} />
            <Route path="/verify" element={<TicketVerification />} />
            {/* Protected client routes */}
            <Route element={<ClientAuthGuard />}>
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-bookings/:id" element={<BookingDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AuthProvider>
      </BookingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
