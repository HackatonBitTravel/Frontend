// API Base URL
export const API_BASE_URL = "https://backend-s7gk.onrender.com";

// Type definitions for better type safety
interface AgencyStats {
  agency_id: string;
  agency_name: string;
  active_trips: number;
  total_passengers: number;
  monthly_revenue: number;
  tickets_sold: number;
  period: string;
}

interface StatCard {
  icon: string;
  label: string;
  value: string | number;
  change: string;
}

// Petit garde de type pour vérifier si une valeur possède une propriété 'name'
const isNamedError = (v: unknown): v is { name: string } => {
  return (
    typeof v === 'object' &&
    v !== null &&
    'name' in v &&
    typeof (v as { name?: unknown }).name === 'string'
  );
};

// API function to get popular routes
export const getPopularRoutes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/popular?limit=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const routes = await response.json();
    return routes;
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    return [];
  }
};

// API function to search for trips
export const searchTrips = async (filters: { origin?: string; destination?: string; date?: string; min_price?: number; max_price?: number }) => {
  try {
    const params = new URLSearchParams();
    if (filters.origin) params.append('origin', filters.origin);
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.date) params.append('date', filters.date);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    
    const url = `${API_BASE_URL}/search?${params.toString()}`;
    console.log("Searching trips with URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const trips = await response.json();
    console.log("Trips received:", trips);
    return trips;
  } catch (error) {
    console.error("Error searching trips:", error);
    return [];
  }
};

// API function to create a new reservation
export const createReservation = async (
  schedule_id: string,
  passenger_info: { name: string; phone: string; email: string },
  token: string | null
) => {
  try {
    if (!schedule_id) {
      throw new Error("schedule_id is required");
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        schedule_id,
        passenger_info
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const reservation = await response.json();
    return reservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

// API function to get KKiapay payment info
export const getKkiapayInfo = async (reservation_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/kkiapay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservation_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const kkiapayInfo = await response.json();
    return kkiapayInfo;
  } catch (error) {
    console.error("Error getting KKiapay info:", error);
    throw error;
  }
};

// API function to verify KKiapay payment
export const verifyKkiapayPayment = async (transaction_id: string, reservation_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/kkiapay/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id,
        reservation_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const verification = await response.json();
    return verification;
  } catch (error) {
    console.error("Error verifying KKiapay payment:", error);
    throw error;
  }
};

// API function to create a Lightning invoice
export const createLightningInvoice = async (reservation_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/lightning/create-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservation_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const invoiceData = await response.json();
    return invoiceData;
  } catch (error) {
    console.error("Error creating Lightning invoice:", error);
    throw error;
  }
};

// API function to verify Lightning payment
export const verifyLightningPayment = async (paymentHash: string, reservationId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/lightning/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_hash: paymentHash,
        reservation_id: reservationId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.text());
      console.error("Backend validation error:", errorData);
      throw new Error(
        typeof errorData === 'string'
          ? errorData
          : errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const verification = await response.json();
    return verification;
  } catch (error: unknown) {
    console.error("Error verifying Lightning payment:", error instanceof Error ? error.message : error);
    throw error;
  }
};

// API function to generate a ticket
export const generateTicket = async (reservation_id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reservation_id
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const ticket = await response.json();
    return ticket;
  } catch (error) {
    console.error("Error generating ticket:", error);
    throw error;
  }
};

// Function to get ticket PDF URL
export const getTicketPdfUrl = (ticket_id: string) => {
  return `/api/tickets/${ticket_id}/pdf`;
};

// API function to get current user's reservations
export const getMyReservations = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/my-reservations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const reservations = await response.json();
    return reservations;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw error;
  }
};

// API function to get schedule details
export const getScheduleDetails = async (scheduleId: string, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const schedule = await response.json();
    return schedule;
  } catch (error) {
    console.error("Error fetching schedule details:", error);
    throw error;
  }
};

// API function for agency login
export const agencyLogin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error logging in agency:", error);
    throw error;
  }
};

// API function to get agency details (NOW DYNAMIC!)
export const getAgencyDetails = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const agencyDetails = await response.json();
    return agencyDetails;
  } catch (error) {
    console.error("Error fetching agency details:", error);
    throw error;
  }
};

// API function to get agency stats (NOW DYNAMIC!)
export const getAgencyStats = async (token: string): Promise<StatCard[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/agencies/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const statsData: AgencyStats = await response.json();
    
    // Formater les données pour correspondre au format attendu par le frontend
    return [
      { 
        icon: "Bus", 
        label: "Voyages Actifs", 
        value: statsData.active_trips, 
        change: "+2 cette semaine" 
      },
      { 
        icon: "Users", 
        label: "Passagers Total", 
        value: statsData.total_passengers, 
        change: "+15% ce mois" 
      },
      { 
        icon: "DollarSign", 
        label: `Revenus (${statsData.period})`, 
        value: `${statsData.monthly_revenue.toLocaleString('fr-FR')} FCFA`, 
        change: "+8% vs mois dernier" 
      },
      { 
        icon: "Ticket", 
        label: "Billets Vendus", 
        value: statsData.tickets_sold, 
        change: "+12% ce mois" 
      },
    ];
  } catch (error) {
    console.error("Error fetching agency stats:", error);
    // Retourner des données par défaut en cas d'erreur
    return [
      { icon: "Bus", label: "Voyages Actifs", value: 0, change: "N/A" },
      { icon: "Users", label: "Passagers Total", value: 0, change: "N/A" },
      { icon: "DollarSign", label: "Revenus (Mois)", value: "0 FCFA", change: "N/A" },
      { icon: "Ticket", label: "Billets Vendus", value: 0, change: "N/A" },
    ];
  }
};

// API function to get recent bookings (NOW DYNAMIC!)
export const getRecentBookings = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/agency/recent?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const bookings = await response.json();
    return bookings.map((booking: any) => ({
      id: booking.id,
      passenger: booking.passenger,
      route: booking.route,
      date: new Date(booking.departure).toLocaleDateString('fr-FR'),
      amount: `${booking.amount.toLocaleString()} FCFA`,
      status: booking.status === "COMPLETED" ? "confirmed" : "pending"
    }));
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    return [];
  }
};

// API function to get upcoming trips for an agency (NOW DYNAMIC!)
export const getUpcomingTrips = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules/agency_schedules?limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const schedules = await response.json();
    return schedules;
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    return [];
  }
};

// API function to get a chatbot response with retry mechanism
export const getChatbotResponse = async (message: string, language: string) => {
  const maxRetries = 2;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Getting bot response for: "${message}" in ${language} (attempt ${attempt + 1})`);
      
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: language
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.response || data.message || "Désolé, je n'ai pas compris votre message.";
      } else {
        const text = await response.text();
        return text || "Désolé, je n'ai pas compris votre message.";
      }
    } catch (error: unknown) {
      console.error(`Error getting chatbot response (attempt ${attempt + 1}):`, error);
      lastError = error;

      if (isNamedError(error) && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        break;
      }
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  if (isNamedError(lastError) && (lastError.name === 'TimeoutError' || lastError.name === 'AbortError')) {
    return language === "fr" 
      ? "Désolé, le chatbot met trop de temps à répondre. Veuillez réessayer." 
      : "Naka nga def, bot bi am ci bokk. Jéemaatal ci kanam.";
  }
  
  return language === "fr" 
    ? "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard." 
    : "Naka nga def, ma nga am ci bokk. Jéemaatal ci kanam.";
};

// API function to update user profile
export const updateUserProfile = async (token: string, userData: unknown) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData as Record<string, unknown>),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// API function to change password
export const changePassword = async (token: string, passwords: { current_password: string; new_password: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// API function to get user profile
export const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const userProfile = await response.json();
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// API function to create a new route
export const createRoute = async (token: string, origin: string, destination: string, duration: number) => {
  console.log("=== CREATE ROUTE DEBUG ===");
  console.log("1. Token reçu:", token ? `${token.substring(0, 30)}...` : "NULL");
  console.log("2. Origin:", origin);
  console.log("3. Destination:", destination);
  console.log("4. Duration:", duration);
  
  try {
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    };
    
    console.log("5. Headers préparés");
    
    const bodyData = {
      origin,
      destination,
      duration
    };
    
    const url = `${API_BASE_URL}/routes`;
    console.log("6. URL complète:", url);
    
    console.log("7. Envoi de la requête...");
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyData),
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log("8. Réponse reçue:");
    console.log("   - Status:", response.status);
    console.log("   - StatusText:", response.statusText);
    
    const responseText = await response.text();
    console.log("   - Response body:", responseText);
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        console.error(" Authentification rejetée par le backend");
      }
      
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        throw new Error(responseText || `HTTP error! status: ${response.status}`);
      }
    }
    
    const route = JSON.parse(responseText);
    console.log("✅ Route créée avec succès:", route);
    return route;
  } catch (error) {
    console.error("=== CREATE ROUTE ERROR ===");
    console.error("Type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Message:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// API function to create a new schedule
export const createSchedule = async (token: string, scheduleData: { route_id: string; departure_time: string; price: number; seats: number }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(scheduleData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const schedule = await response.json();
    return schedule;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

// API function to get all routes for an agency
export const getRoutes = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const routes = await response.json();
    return routes;
  } catch (error) {
    console.error("Error fetching agency routes:", error);
    return [];
  }
};
// Récupérer les itinéraires de l'agence connectée
export const getAgencyRoutes = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching agency routes:", error);
    throw error;
  }
};
