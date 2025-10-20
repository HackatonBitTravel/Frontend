import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, UserPlus, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

const PassengerDetails = () => {
  const [bookingFor, setBookingFor] = useState("self");
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

  const { from, to, price, agency, departureTime } = selectedTrip;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Détails du passager</h1>
          <p className="text-muted-foreground mb-8">
            Veuillez fournir les informations sur le passager pour le voyage
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking For */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Pour qui réservez-vous ?</h3>
                <RadioGroup value={bookingFor} onValueChange={setBookingFor}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="self" id="self" />
                    <Label htmlFor="self" className="flex items-center gap-2 cursor-pointer flex-1">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Moi-même</p>
                        <p className="text-sm text-muted-foreground">Je voyage</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex items-center gap-2 cursor-pointer flex-1">
                      <UserPlus className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Quelqu'un d'autre</p>
                        <p className="text-sm text-muted-foreground">Je réserve pour une autre personne</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Personal Details */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Informations personnelles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" placeholder="Entrez le prénom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom de famille *</Label>
                    <Input id="lastName" placeholder="Entrez le nom de famille" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone *</Label>
                    <Input id="phone" type="tel" placeholder="+221 XX XXX XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail (facultatif)</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="idNumber">Numéro d'identification *</Label>
                    <Input id="idNumber" placeholder="Numéro de carte d'identité nationale ou de passeport" />
                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Contact d'urgence (facultatif)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Nom du contact</Label>
                    <Input id="emergencyName" placeholder="Nom complet" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Téléphone du contact</Label>
                    <Input id="emergencyPhone" type="tel" placeholder="+221 XX XXX XXXX" />
                  </div>
                </div>
              </Card>

              <Link to="/payment">
                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                  Continuer vers le paiement
                </Button>
              </Link>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-elevated sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Résumé du voyage</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Itinéraire</span>
                    <span className="font-medium">{from} → {to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">Dec 25, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-medium">{departureTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agence</span>
                    <span className="font-medium">{agency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passagers</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-muted-foreground">Total</span>
                    <div>
                      <span className="text-2xl font-bold text-primary">{price}</span>
                      <span className="text-sm text-muted-foreground ml-1">CFA</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default PassengerDetails;
