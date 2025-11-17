import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

const SearchBar = ({ variant = "hero" }: SearchBarProps) => {
  const [date, setDate] = useState<Date>();
  const [origin, setOrigin] = useState(""); // Renamed from 'from'
  const [destination, setDestination] = useState(""); // Renamed from 'to'
  const [minPrice, setMinPrice] = useState<string>(""); // New state for min price
  const [maxPrice, setMaxPrice] = useState<string>(""); // New state for max price
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!origin || !destination) {
      // Add user feedback for empty fields (e.g., a toast notification)
      return;
    }
    const params = new URLSearchParams();
    params.append("origin", origin);
    params.append("destination", destination);
    if (date) {
      params.append("date", format(date, "yyyy-MM-dd")); // Format date for backend
    }
    if (minPrice) {
      params.append("min_price", minPrice);
    }
    if (maxPrice) {
      params.append("max_price", maxPrice);
    }
    navigate(`/search?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={`w-full ${
        isHero ? "bg-card shadow-elevated rounded-2xl p-6" : "bg-card shadow-card rounded-xl p-4"
      } animate-fade-in`}
    >
      <div className={`grid gap-4 ${isHero ? "md:grid-cols-2" : "md:grid-cols-4"}`}> {/* Adjusted grid columns */}
        <div className="relative">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">De</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ville de départ"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">À</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ville de destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
            </PopoverContent>
          </Popover>
        </div>

        {/* <div className="relative">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prix Min</label>
          <Input
            type="number"
            placeholder="Prix minimum"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="relative">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prix Max</label>
          <Input
            type="number"
            placeholder="Prix maximum"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>  */}

        <Button
          className="bg-gradient-hero hover:opacity-90 mt-auto h-10"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
