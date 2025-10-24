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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

const passengerDetailsSchema = z.object({
  firstName: z.string().min(1, { message: "Le prénom est requis." }),
  lastName: z.string().min(1, { message: "Le nom de famille est requis." }),
  phone: z.string().regex(/^\+?[0-9\s\-\(]{7,20}$/, { message: "Numéro de téléphone invalide." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }).optional().or(z.literal("")),
  idNumber: z.string().min(1, { message: "Le numéro d'identification est requis." }),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().regex(/^\+?[0-9\s\-\(]{7,20}$/, { message: "Numéro de téléphone invalide." }).optional().or(z.literal("")),
});

const PassengerDetails = () => {
  const [bookingFor, setBookingFor] = useState("self");
  const { selectedTrip, setPassengerInfo, setTotalAmount } = useBooking();
  const { isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof passengerDetailsSchema>>({
    resolver: zodResolver(passengerDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      idNumber: "",
      emergencyName: "",
      emergencyPhone: "",
    },
  });

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

  // Extraire les propriétés avec des valeurs par défaut pour correspondre à la structure de l'API
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    price = 0, 
    departure_time = new Date().toISOString(), 
    agency_name: agencyName = "Agence inconnue"
  } = selectedTrip || {};

  const onSubmit = (values: z.infer<typeof passengerDetailsSchema>) => {
    setIsSubmitting(true);
    const basePrice = selectedTrip.price;
    const discount = isLoggedIn ? 0.10 : 0; // 10% discount if logged in
    const finalPrice = basePrice * (1 - discount);

    setPassengerInfo({
      name: `${values.firstName} ${values.lastName}`,
      phone: values.phone,
      email: values.email || "",
    });
    setTotalAmount(finalPrice);
    navigate("/payment");
  };

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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Input id="firstName" placeholder="Entrez le prénom" {...form.register("firstName")} />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom de famille *</Label>
                      <Input id="lastName" placeholder="Entrez le nom de famille" {...form.register("lastName")} />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone *</Label>
                      <Input id="phone" type="tel" placeholder="+221 XX XXX XXXX" {...form.register("phone")} />
                      {form.formState.errors.phone && (
                        <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail (facultatif)</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="idNumber">Numéro d'identification *</Label>
                      <Input id="idNumber" placeholder="Numéro de carte d'identité nationale ou de passeport" {...form.register("idNumber")} />
                      {form.formState.errors.idNumber && (
                        <p className="text-sm text-red-500">{form.formState.errors.idNumber.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6 shadow-card">
                  <h3 className="font-semibold text-lg mb-4">Contact d'urgence (facultatif)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Nom du contact</Label>
                      <Input id="emergencyName" placeholder="Nom complet" {...form.register("emergencyName")} />
                      {form.formState.errors.emergencyName && (
                        <p className="text-sm text-red-500">{form.formState.errors.emergencyName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Téléphone du contact</Label>
                      <Input id="emergencyPhone" type="tel" placeholder="+221 XX XXX XXXX" {...form.register("emergencyPhone")} />
                      {form.formState.errors.emergencyPhone && (
                        <p className="text-sm text-red-500">{form.formState.errors.emergencyPhone.message}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" type="submit" loading={isSubmitting}>
                  {isSubmitting ? "Traitement en cours..." : "Continuer vers le paiement"}
                </Button>
              </form>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-elevated sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Résumé du voyage</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Itinéraire</span>
                    <span className="font-medium">{origin} → {destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{format(new Date(departure_time), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-medium">{format(new Date(departure_time), "HH:mm")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agence</span>
                    <span className="font-medium">{agencyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passagers</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-muted-foreground">Prix de base</span>
                    <span className="font-medium">{price.toLocaleString()} CFA</span>
                  </div>
                  {isLoggedIn && (
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-muted-foreground">Réduction (10%)</span>
                      <span className="font-medium text-green-500">-{(price * 0.10).toLocaleString()} CFA</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-muted-foreground">Total à payer</span>
                    <div>
                      <span className="text-2xl font-bold text-primary">{(price * (isLoggedIn ? 0.90 : 1)).toLocaleString()}</span>
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