import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Calendar, Bus, Shield, Wifi, Coffee, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { useEffect } from "react";
import { format } from "date-fns";
import routeDakar from "@/assets/route-dakar.jpg";
import routeBamako from "@/assets/route-bamako.jpg";
import routeAbidjan from "@/assets/route-abidjan.jpg";

const TripDetails = () => {
  const { selectedTrip } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTrip) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedTrip, navigate]);

  const amenities = [
    { icon: Wifi, label: "Wi-Fi Gratuit" },
    { icon: Coffee, label: "Rafraîchissements" },
    { icon: Shield, label: "Assurance" },
    { icon: Bus, label: "Bus Climatisé" },
  ];

  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Aucun voyage sélectionné</h1>
        <p className="text-muted-foreground mb-6">
          Vous serez redirigé vers la page d'accueil dans 5 secondes.
        </p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  // Extraire les propriétés avec des valeurs par défaut
  // Adapter la structure pour correspondre aux données SearchResult de l'API
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    duration = 0,
    price = 0, 
    departure_time = new Date().toISOString(), 
    agency_name: agencyName = "Agence inconnue",
    agency_rating: agencyRating,
    // Ajouter d'autres propriétés si nécessaire
  } = selectedTrip || {};
  
  // Créer des objets simulés pour l'interface
  const agency = {
    name: agencyName,
    rating: agencyRating || 4.5
  };
  
  // Créer un objet route simulé
  const route = {
    origin,
    destination,
    duration
  };

  // Placeholder for rating and image, as they are not directly in the schedule object yet
  const rating = agency?.rating || 4.5;
  
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={image}
                alt={`Trip from ${origin} to ${destination}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h1 className="text-3xl font-bold text-white mb-2">{origin} → {destination}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(departure_time), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{duration} minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agency Info */}
            <Card className="p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{agency?.name || "Agence Inconnue"}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="font-semibold">{rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">(234 avis)</span>
                  </div>
                </div>
                <Badge className="bg-gradient-hero text-white">Premium</Badge>
              </div>
              <p className="text-muted-foreground">
                Service de transport interurbain professionnel avec plus de 10 ans d'expérience.
                Connu pour sa ponctualité et ses bus confortables.
              </p>
            </Card>

            {/* Trip Details */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold text-lg mb-4">Détails du Voyage</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Départ</p>
                    <p className="text-sm text-muted-foreground">{origin} Terminal, Gare Routière</p>
                    <p className="text-sm font-semibold mt-1">{format(new Date(departure_time), "HH:mm")}</p>
                  </div>
                </div>

                <div className="ml-5 border-l-2 border-dashed border-muted h-12" />

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Arrivée</p>
                    <p className="text-sm text-muted-foreground">{destination} Central Station</p>
                    <p className="text-sm font-semibold mt-1">{format(new Date(new Date(departure_time).getTime() + duration * 60 * 1000), "HH:mm")} (Jour Suivant)</p> // Assuming arrival is departure + duration
                  </div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold text-lg mb-4">Commodités</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <amenity.icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Policies */}
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold text-lg mb-4">Politiques</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Arriver 30 minutes avant le départ</li>
                <li>• Annulation gratuite jusqu'à 24 heures avant le départ</li>
                <li>• Maximum 2 sacs par passager (20kg chacun)</li>
                <li>• Pièce d'identité requise pour l'embarquement</li>
              </ul>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-elevated sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">{price.toLocaleString()}</span>
                  <span className="text-muted-foreground">CFA</span>
                </div>
                <p className="text-sm text-muted-foreground">par personne</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sièges Disponibles</span>
                  <span className="font-semibold">12 restants</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type de Bus</span>
                  <span className="font-semibold">Premium AC</span>
                </div>
              </div>

              <Link to="/passenger-details">
                <Button className="w-full bg-gradient-hero hover:opacity-90 mb-3" size="lg">
                  Réserver Maintenant
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Aucun compte requis • Confirmation instantanée
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default TripDetails;
