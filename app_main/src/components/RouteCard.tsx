import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Clock, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import routeDakar from "@/assets/route-dakar.jpg";
import routeBamako from "@/assets/route-bamako.jpg";
import routeAbidjan from "@/assets/route-abidjan.jpg";

interface Schedule {
  id: string;
  route_id: string;
  departure_time: string;
  price: number;
  seats: number;
  available_seats?: number;
  // Structure réelle renvoyée par l'API
  origin: string;
  destination: string;
  duration: number;
  agency_name: string;
  agency_rating?: number;
}

interface RouteCardProps {
  schedule: Schedule;
}

const RouteCard = ({ schedule }: RouteCardProps) => {
  const { selectTrip } = useBooking();
  
  const handleClick = () => {
    console.log("Selecting trip:", schedule);
    selectTrip(schedule);
  };

  // Extraire les propriétés avec des valeurs par défaut
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    duration = 0,
    price = 0, 
    departure_time = new Date().toISOString(), 
    agency_name: agencyName = "Agence inconnue",
    agency_rating: agencyRating
  } = schedule || {};
  
  // Placeholder for rating, as it's not in the schedule object yet
  const rating = agencyRating || 4.5; 
  
  // Select image based on route
  let image = routeDakar; // Default image
  if (origin?.toLowerCase().includes('dakar') && destination?.toLowerCase().includes('bamako')) {
    image = routeBamako;
  } else if (origin?.toLowerCase().includes('bamako') && destination?.toLowerCase().includes('abidjan')) {
    image = routeAbidjan;
  } else if (origin?.toLowerCase().includes('abidjan') && destination?.toLowerCase().includes('dakar')) {
    image = routeDakar;
  }

  return (
    <div className="group bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-scale-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`Trip from ${origin} to ${destination}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-lg">{origin}</p>
              <div className="flex items-center gap-2 text-white/90">
                <ArrowRight className="h-4 w-4" />
                <p className="text-lg">{destination}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white font-bold text-lg">{price ? price.toLocaleString() : "Prix non disponible"}</p>
              <p className="text-white/80 text-xs">CFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{agencyName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{departure_time ? format(new Date(departure_time), "HH:mm") : "Heure non disponible"}</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <span>{departure_time ? format(new Date(departure_time), "MMM dd, yyyy") : "Date non disponible"}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{duration} minutes</span>
          </div>
          <Link to="/trip-details" onClick={handleClick}>
            <Button size="sm" className="bg-gradient-hero hover:opacity-90">
              Réserver maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
