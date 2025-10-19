
import {
  popularRoutes,
  searchResults,
  agencyStats,
  recentBookings,
  upcomingTrips,
} from "@/data/mockData";

const SIMULATED_DELAY = 1000; // 1 second

// API function to get popular routes
export const getPopularRoutes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(popularRoutes);
    }, SIMULATED_DELAY);
  });
};

// API function to search for trips
export const searchTrips = (filters) => {
  console.log("Searching with filters:", filters);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a network error for testing purposes
      if (filters?.from?.toLowerCase() === 'error') {
        reject(new Error("Failed to fetch trip data. Please try again later."));
        return;
      }

      if (!filters || (!filters.from && !filters.to)) {
        resolve(searchResults);
        return;
      }

      const filteredResults = searchResults.filter((trip) => {
        const fromMatch = filters.from
          ? trip.from.toLowerCase().includes(filters.from.toLowerCase())
          : true;
        const toMatch = filters.to
          ? trip.to.toLowerCase().includes(filters.to.toLowerCase())
          : true;
        return fromMatch && toMatch;
      });

      resolve(filteredResults);
    }, SIMULATED_DELAY);
  });
};

// API function to get agency stats
export const getAgencyStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(agencyStats);
    }, SIMULATED_DELAY);
  });
};

// API function to get recent bookings
export const getRecentBookings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recentBookings);
    }, SIMULATED_DELAY);
  });
};

// API function to get upcoming trips
export const getUpcomingTrips = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(upcomingTrips);
    }, SIMULATED_DELAY);
  });
};

// API function to get a chatbot response
export const getChatbotResponse = (message, language) => {
  console.log(`Getting bot response for: "${message}" in ${language}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = language === "fr"
        ? "Je suis là pour vous aider à réserver vos billets et à comprendre le paiement Bitcoin."
        : "Maa ngi fi pour aide avec les billets et Bitcoin.";
      resolve(response);
    }, SIMULATED_DELAY);
  });
};

