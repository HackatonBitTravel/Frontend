import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, Bitcoin, Wallet, AlertTriangle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  createReservation,
  getKkiapayInfo,
  verifyKkiapayPayment,
  createLightningInvoice,
  verifyLightningPayment,
  generateTicket,
} from "@/lib/api";

// Declare kkiapay_widget globally
declare const kkiapay_widget: any;

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [lightningInvoice, setLightningInvoice] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input
  const { selectedTrip, passengerInfo, totalAmount, setReservationId, setTicketId, resetBooking } = useBooking();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedTrip || !passengerInfo || totalAmount === 0) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedTrip, passengerInfo, totalAmount, navigate]);

  // Load KKiapay SDK dynamically
  useEffect(() => {
    if (paymentMethod === "momo" || paymentMethod === "wave") {
      // Vérifier si le SDK est déjà chargé
      if (typeof window !== "undefined" && typeof (window as any).kkiapay_widget !== "undefined") {
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.kkiapay.me/k.js";
      script.async = true;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [paymentMethod]);

  const handlePayment = async () => {
    if (!selectedTrip || !passengerInfo) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir toutes les informations requises.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsCreatingReservation(true);
    
    try {
      console.log("selectedTrip:", selectedTrip);
      console.log("passengerInfo:", passengerInfo);
      
      // Vérifier que selectedTrip et selectedTrip.schedule_id sont définis
      if (!selectedTrip || !selectedTrip.schedule_id) {
        throw new Error("Aucun voyage sélectionné. Veuillez recommencer la réservation.");
      }
      
      // Create Reservation (status will be pending)
      const reservation = await createReservation(
        selectedTrip.schedule_id, // schedule_id
        passengerInfo,
        token // Pass token for discount
      );
      const reservationId = reservation.id;
      setReservationId(reservationId);
      setIsCreatingReservation(false);
      setIsProcessingPayment(true);

      if (paymentMethod === "bitcoin") {
        // Create Lightning Invoice
        const invoiceData = await createLightningInvoice(reservationId);
        console.log("Invoice data received:", invoiceData);
        setLightningInvoice(invoiceData);
        toast({
          title: "Facture Lightning créée",
          description: "Veuillez scanner le QR code ou utiliser le lien pour payer.",
        });
        // Implement polling for payment verification
        const pollPayment = setInterval(async () => {
          try {
            const verification = await verifyLightningPayment(invoiceData.invoice_id, reservationId);
            if (verification.paid) {
              clearInterval(pollPayment);
              await handleSuccessfulPayment(reservationId);
              // Réinitialiser les états de chargement après succès
              setIsLoading(false);
              setIsProcessingPayment(false);
            }
          } catch (error) {
            console.error("Polling Lightning payment failed:", error);
          }
        }, 5000); // Poll every 5 seconds
      } else {
        // Step 2b: Get KKiapay Info and open widget
        const kkiapayInfo = await getKkiapayInfo(reservationId);

        // Attendre que le SDK soit chargé
        let attempts = 0;
        const maxAttempts = 50; // 5 secondes maximum d'attente
        while (typeof kkiapay_widget === "undefined" && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (typeof kkiapay_widget !== "undefined") {
          kkiapay_widget.open({
            public_key: kkiapayInfo.public_key,
            amount: kkiapayInfo.amount,
            api_key: kkiapayInfo.public_key, // Kkiapay uses public_key as api_key for widget
            sandbox: kkiapayInfo.sandbox,
            phone: phoneNumber || passengerInfo.phone, // Use input phone or passenger phone
            name: passengerInfo.name,
            reason: kkiapayInfo.reason,
            data: {
              reservation_id: reservationId,
            },
          });

          kkiapay_widget.on_success(async (response: any) => {
            try {
              await verifyKkiapayPayment(response.transaction_id, reservationId);
              await handleSuccessfulPayment(reservationId);
            } catch (error) {
              toast({
                title: "Erreur de vérification de paiement",
                description: error.message || "Échec de la vérification du paiement KKiapay.",
                variant: "destructive",
              });
            }
          });

          kkiapay_widget.on_error((error: any) => {
            toast({
              title: "Paiement KKiapay annulé ou échoué",
              description: error.message || "Une erreur est survenue lors du paiement KKiapay.",
              variant: "destructive",
            });
            setIsLoading(false);
            setIsProcessingPayment(false);
          });
        } else {
          throw new Error("KKiapay SDK non chargé. Veuillez réessayer.");
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur de réservation ou de paiement",
        description: error.message || "Une erreur est survenue lors de la création de la réservation ou du paiement.",
        variant: "destructive",
      });
    } finally {
      // Ne réinitialiser les états que si ce n'est pas un paiement Bitcoin
      // (pour le paiement Bitcoin, la réinitialisation se fait dans le polling)
      if (paymentMethod !== "bitcoin") {
        setIsLoading(false);
        setIsProcessingPayment(false);
      }
    }
  };

  const handleSuccessfulPayment = async (reservationId: string) => {
    try {
      // Generate Ticket
      const ticket = await generateTicket(reservationId);
      // Stocker l'ID du ticket dans le contexte
      setTicketId(ticket.id);
      
      // Navigate to confirmation page
      navigate("/confirmation");
    } catch (error: any) {
      toast({
        title: "Erreur de génération de billet",
        description: error.message || "Une erreur est survenue lors de la génération du billet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsProcessingPayment(false);
    }
  };

  // Extraire les propriétés avec des valeurs par défaut pour correspondre à la structure de l'API
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    price = 0, 
    departure_time = new Date().toISOString(), 
    agency_name: agencyName = "Agence inconnue"
  } = selectedTrip || {};

  if (!selectedTrip || !passengerInfo || totalAmount === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Informations de réservation manquantes</h1>
        <p className="text-muted-foreground mb-6">
          Vous serez redirigé vers la page d'accueil dans 5 secondes.
        </p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Paiement</h1>
          <p className="text-muted-foreground mb-8">
            Sélectionnez votre méthode de paiement préférée
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold text-lg mb-4">Méthode de paiement</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-sm text-muted-foreground">Paiement par SMS</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="wave" id="wave" />
                    <Label htmlFor="wave" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Wave</p>
                        <p className="text-sm text-muted-foreground">Paiement Wave</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border-2 hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="bitcoin" id="bitcoin" />
                    <Label htmlFor="bitcoin" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Bitcoin className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Bitcoin (Lightning)</p>
                        <p className="text-sm text-muted-foreground">Paiement instantané par Bitcoin</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Phone Number Input (for Mobile Money/Wave) */}
              {(paymentMethod === "momo" || paymentMethod === "wave") && (
                <Card className="p-6 shadow-card">
                  <h3 className="font-semibold text-lg mb-4">Numéro de téléphone</h3>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Numéro de téléphone pour le paiement</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder={passengerInfo.phone || "+221 XX XXX XXXX"}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Entrez le numéro de téléphone à utiliser pour le paiement Mobile Money/Wave
                    </p>
                  </div>
                </Card>
              )}

              {/* Bitcoin Payment Instructions */}
              {paymentMethod === "bitcoin" && lightningInvoice && (
                <Card className="p-6 shadow-card">
                  <h3 className="font-semibold text-lg mb-4">Instructions de paiement Bitcoin</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Scannez ce QR code avec votre portefeuille Lightning:</p>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        {/* Afficher le QR code à partir des données base64 */}
                        {lightningInvoice.qr_code ? (
                          <img 
                            src={lightningInvoice.qr_code} 
                            alt="Lightning Invoice QR Code" 
                            className="w-48 h-48"
                          />
                        ) : (
                          // Fallback si qr_code n'est pas disponible
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(lightningInvoice.payment_request)}`} 
                            alt="Lightning Invoice QR Code" 
                            className="w-48 h-48"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Ou copiez cette facture:</p>
                      <div className="bg-muted p-3 rounded-lg break-all text-sm">
                        {lightningInvoice.invoice || lightningInvoice.payment_request}
                      </div>
                    </div>
                    {lightningInvoice.checkout_link && (
                      <div className="pt-2">
                        <a 
                          href={lightningInvoice.checkout_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                        >
                          Payer avec BTCPay Server
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>En attente de confirmation de paiement...</span>
                    </div>
                  </div>
                </Card>
              )}

              <Button 
                className="w-full bg-gradient-hero hover:opacity-90" 
                size="lg" 
                onClick={handlePayment}
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <>
                    {isCreatingReservation && "Création de la réservation..."}
                    {isProcessingPayment && paymentMethod === "bitcoin" && "Génération de la facture..."}
                    {isProcessingPayment && (paymentMethod === "momo" || paymentMethod === "wave") && "Ouverture du paiement..."}
                  </>
                ) : (
                  `Payer ${totalAmount.toLocaleString()} CFA`
                )}
              </Button>
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-elevated sticky top-24">
                <h3 className="font-semibold text-lg mb-4">Résumé de la commande</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Itinéraire</span>
                    <span className="font-medium">{origin} → {destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{new Date(departure_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-medium">{new Date(departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-muted-foreground">Total à payer</span>
                    <div>
                      <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}</span>
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

export default Payment;