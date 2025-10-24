// API Base URL
export const API_BASE_URL = "/api";

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
    // Construire l'URL de recherche avec les paramètres
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
  token: string | null // Optional token for discount
) => {
  try {
    // Vérifier que schedule_id est défini
    if (!schedule_id) {
      throw new Error("schedule_id is required");
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token d'authentification si disponible
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
      // Log les erreurs backend
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

// API function to get agency details
export const getAgencyDetails = async (token: string) => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: "agency-1",
    name: "Trans-Sahel Express",
    email: "contact@transsahel.com",
    phone: "+22997123456"
  };
};

// API function to get agency stats
export const getAgencyStats = async () => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { icon: "Bus", label: "Voyages Actifs", value: 12, change: "+2" },
    { icon: "Users", label: "Passagers Total", value: 1247, change: "+15%" },
    { icon: "DollarSign", label: "Revenus (Mois)", value: "450000", change: "+8%" },
    { icon: "Ticket", label: "Billets Vendus", value: 892, change: "+12%" },
  ];
};

// API function to get recent bookings
export const getRecentBookings = async () => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { id: "BKG001", passenger: "Jean Dupont", route: "Cotonou-Dakar", date: "2025-10-15", amount: "15000", status: "confirmed" },
    { id: "BKG002", passenger: "Marie Kouakou", route: "Cotonou-Accra", date: "2025-10-16", amount: "12000", status: "pending" },
    { id: "BKG003", passenger: "Paul Adjovi", route: "Cotonou-Ouagadougou", date: "2025-10-17", amount: "18000", status: "confirmed" },
  ];
};

// API function to get upcoming trips for an agency
export const getUpcomingTrips = async (token: string) => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: "schedule-1",
      route_id: "route-1",
      departure_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      price: 15000,
      seats: 45,
      available_seats: 20,
      route: {
        id: "route-1",
        origin: "Cotonou",
        destination: "Dakar",
        duration: 480
      }
    }
  ];
};

// API function to get a chatbot response with retry mechanism
export const getChatbotResponse = async (message: string, language: string) => {
  const maxRetries = 2;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Getting bot response for: "${message}" in ${language} (attempt ${attempt + 1})`);
      
      // Utiliser le proxy pour contourner le CORS
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: language
        }),
        // Ajout d'un timeout pour éviter les attentes trop longues
        signal: AbortSignal.timeout(15000) // 15 secondes timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Essayer de parser comme JSON d'abord
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.response || data.message || "Désolé, je n'ai pas compris votre message.";
      } else {
        // Si ce n'est pas du JSON, retourner le texte directement
        const text = await response.text();
        return text || "Désolé, je n'ai pas compris votre message.";
      }
    } catch (error: unknown) {
      console.error(`Error getting chatbot response (attempt ${attempt + 1}):`, error);
      lastError = error;

      // Ne pas réessayer pour les erreurs de timeout ou d'annulation
      if (isNamedError(error) && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        break;
      }
      
      // Attendre un peu avant de réessayer (sauf pour la dernière tentative)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  // Gestion spécifique des timeouts
  if (isNamedError(lastError) && (lastError.name === 'TimeoutError' || lastError.name === 'AbortError')) {
    return language === "fr" 
      ? "Désolé, le chatbot met trop de temps à répondre. Veuillez réessayer." 
      : "Naka nga def, bot bi am ci bokk. Jéemaatal ci kanam.";
  }
  
  // En cas d'autre erreur, retourner une réponse par défaut
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
  try {
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        origin,
        destination,
        duration
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const route = await response.json();
    return route;
  } catch (error) {
    console.error("Error creating route:", error);
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
    // Retourner un tableau vide en cas d'erreur pour éviter de casser l'interface
    return [];
  }
};