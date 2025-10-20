import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, Bitcoin, Wallet, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
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

  const { price } = selectedTrip;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Paiement</h1>
          <p className="text-muted-foreground mb-8">
            Choisissez votre méthode de paiement préférée
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Sélectionner la Méthode de Paiement</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Mobile Money (MoMo)</p>
                          <p className="text-sm text-muted-foreground">Orange Money, MTN, etc.</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="wave" id="wave" />
                      <Label htmlFor="wave" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
                          <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Wave</p>
                          <p className="text-sm text-muted-foreground">Rapide et sécurisé</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="bitcoin" id="bitcoin" />
                      <Label htmlFor="bitcoin" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
                          <Bitcoin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Bitcoin (Lightning Network)</p>
                          <p className="text-sm text-muted-foreground">Instantané & frais réduits</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </Card>

              {/* Payment Details */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">
                  {paymentMethod === "bitcoin" ? "Paiement Bitcoin" : "Détails du Paiement Mobile"}
                </h3>

                {paymentMethod === "bitcoin" ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Vous serez redirigé pour compléter votre paiement Bitcoin Lightning. 
                        Le paiement est instantané et sécurisé.
                      </p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>✓ Aucune inscription requise</li>
                        <li>✓ Confirmation instantanée</li>
                        <li>✓ Frais de transaction bas</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+221 XX XXX XXXX"
                      />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Vous recevrez une notification sur votre téléphone pour confirmer le paiement
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <Link to="/confirmation">
                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                  {paymentMethod === "bitcoin" ? "Procéder au Paiement Bitcoin" : "Payer Maintenant"}
                </Button>
              </Link>

              <p className="text-xs text-center text-muted-foreground">
                En continuant, vous acceptez nos termes et conditions
              </p>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-elevated sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Résumé du Paiement</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix du Billet</span>
                    <span className="font-medium">{price} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de Service</span>
                    <span className="font-medium">500 CFA</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-500 CFA</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Montant Total</span>
                    <div>
                      <span className="text-2xl font-bold text-primary">{price}</span>
                      <span className="text-sm text-muted-foreground ml-1">CFA</span>
                    </div>
                  </div>
                  {paymentMethod === "bitcoin" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ≈ 0.00025 BTC (estimé)
                    </p>
                  )}
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

export default Payment;
