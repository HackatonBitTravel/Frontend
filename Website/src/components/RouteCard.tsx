import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Clock, Bus } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";

interface RouteCardProps {
  from: string;
  to: string;
  price: string;
  duration: string;
  rating: number;
  agency: string;
  image: string;
  departureTime?: string;
  arrivalTime?: string;
}

const RouteCard = (props: RouteCardProps) => {
  const { from, to, price, duration, rating, agency, image, departureTime, arrivalTime } = props;
  const { selectTrip } = useBooking();

  return (
    <div className="group bg-gradient-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-scale-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${from} to ${to}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-lg">{from}</p>
              <div className="flex items-center gap-2 text-white/90">
                <ArrowRight className="h-4 w-4" />
                <p className="text-lg">{to}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white font-bold text-lg">{price}</p>
              <p className="text-white/80 text-xs">CFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{agency}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-semibold">{rating}</span>
          </div>
        </div>

        {departureTime && arrivalTime && (
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{departureTime}</span>
            </div>
            <ArrowRight className="h-3 w-3" />
            <span>{arrivalTime}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{duration}</span>
          </div>
          <Link to="/trip-details" onClick={() => selectTrip(props)}>
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
