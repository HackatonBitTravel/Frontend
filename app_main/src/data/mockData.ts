
import routeDakar from "@/assets/route-dakar.jpg";
import routeBamako from "@/assets/route-bamako.jpg";
import routeAbidjan from "@/assets/route-abidjan.jpg";
import { Bus, TrendingUp, Users, DollarSign } from "lucide-react";

export const popularRoutes = [
  {
    from: "Dakar",
    to: "Bamako",
    price: "15,000",
    duration: "18h",
    rating: 4.8,
    agency: "Trans-Sahel Express",
    image: routeBamako,
    departureTime: "08:00",
    arrivalTime: "02:00+1",
  },
  {
    from: "Abidjan",
    to: "Dakar",
    price: "22,000",
    duration: "24h",
    rating: 4.6,
    agency: "West African Tours",
    image: routeDakar,
    departureTime: "06:00",
    arrivalTime: "06:00+1",
  },
  {
    from: "Bamako",
    to: "Abidjan",
    price: "18,500",
    duration: "20h",
    rating: 4.7,
    agency: "Sahel Connect",
    image: routeAbidjan,
    departureTime: "10:00",
    arrivalTime: "06:00+1",
  },
];

export const searchResults = [
    {
      from: "Dakar",
      to: "Bamako",
      price: "15,000",
      duration: "18h",
      rating: 4.8,
      agency: "Trans-Sahel Express",
      image: routeBamako,
      departureTime: "08:00",
      arrivalTime: "02:00+1",
    },
    {
      from: "Dakar",
      to: "Bamako",
      price: "16,500",
      duration: "17h 30min",
      rating: 4.9,
      agency: "Premium Voyages",
      image: routeBamako,
      departureTime: "10:00",
      arrivalTime: "03:30+1",
    },
    {
      from: "Dakar",
      to: "Bamako",
      price: "14,000",
      duration: "19h",
      rating: 4.5,
      agency: "Budget Trans",
      image: routeBamako,
      departureTime: "14:00",
      arrivalTime: "09:00+1",
    },
    {
      from: "Dakar",
      to: "Bamako",
      price: "17,200",
      duration: "17h",
      rating: 4.7,
      agency: "Express Route",
      image: routeBamako,
      departureTime: "06:00",
      arrivalTime: "23:00",
    },
];

export const agencyStats = [
    {
      icon: Bus,
      label: "Active Trips",
      value: "24",
      change: "+3 this week",
      trend: "up",
    },
    {
      icon: Users,
      label: "Total Bookings",
      value: "1,234",
      change: "+12% this month",
      trend: "up",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: "5.2M CFA",
      change: "+18% this month",
      trend: "up",
    },
    {
      icon: TrendingUp,
      label: "Occupancy Rate",
      value: "87%",
      change: "+5% from last month",
      trend: "up",
    },
];

export const recentBookings = [
    {
      id: "BT-2025-00142",
      passenger: "John Doe",
      route: "Dakar → Bamako",
      date: "Dec 25, 2025",
      amount: "15,000 CFA",
      status: "confirmed",
    },
    {
      id: "BT-2025-00141",
      passenger: "Jane Smith",
      route: "Bamako → Abidjan",
      date: "Dec 24, 2025",
      amount: "18,500 CFA",
      status: "confirmed",
    },
    {
      id: "BT-2025-00140",
      passenger: "Ali Hassan",
      route: "Dakar → Bamako",
      date: "Dec 25, 2025",
      amount: "15,000 CFA",
      status: "pending",
    },
];

export const upcomingTrips = [
    {
      id: "TS-001",
      route: "Dakar → Bamako",
      departure: "Dec 25, 08:00 AM",
      seats: "12/45",
      status: "scheduled",
    },
    {
      id: "TS-002",
      route: "Bamako → Dakar",
      departure: "Dec 26, 10:00 AM",
      seats: "8/45",
      status: "scheduled",
    },
    {
      id: "TS-003",
      route: "Dakar → Abidjan",
      departure: "Dec 27, 06:00 AM",
      seats: "15/45",
      status: "scheduled",
    },
];
