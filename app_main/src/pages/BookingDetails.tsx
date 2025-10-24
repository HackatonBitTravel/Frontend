import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  Download, 
  User, 
  Phone, 
  Mail,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getMyReservations, getTicketPdfUrl, getScheduleDetails } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const BookingDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchReservation = async () => {
      try {
        const reservations = await getMyReservations(token);
        const foundReservation = reservations.find((r: any) => r.id === id);
        
        if (foundReservation) {
          setReservation(foundReservation);
          
          // Récupérer les détails du schedule
          if (foundReservation.schedule_id) {
            try {
              const scheduleDetails = await getScheduleDetails(foundReservation.schedule_id, token);
              setSchedule(scheduleDetails);
            } catch (scheduleError) {
              console.error("Erreur lors du chargement du schedule:", scheduleError);
            }
          }
        } else {
          toast({
            title: "Réservation non trouvée",
            description: "La réservation demandée n'existe pas ou n'est pas accessible.",
            variant: "destructive",
          });
          navigate("/my-bookings");
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement de la réservation:", error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger les détails de la réservation.",
          variant: "destructive",
        });
        navigate("/my-bookings");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReservation();
    } else {
      navigate("/my-bookings");
    }
  }, [id, token, navigate, toast]);

  // Fonction pour télécharger le ticket
  const handleDownloadTicket = (ticketId: string) => {
    if (ticketId) {
      const pdfUrl = getTicketPdfUrl(ticketId);
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        title: "Ticket non disponible",
        description: "Le ticket n'est pas encore généré pour cette réservation.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour obtenir le statut de la réservation
  const getReservationStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmée', variant: 'default' };
      case 'pending':
        return { label: 'En attente', variant: 'secondary' };
      case 'completed':
        return { label: 'Terminée', variant: 'outline' };
      case 'cancelled':
        return { label: 'Annulée', variant: 'destructive' };
      default:
        return { label: status, variant: 'secondary' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="outline" size="icon" asChild>
                <Link to="/my-bookings">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Détails de la réservation</h1>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Réservation non trouvée</h1>
            <p className="text-muted-foreground mb-6">
              La réservation demandée n'existe pas ou n'est pas accessible.
            </p>
            <Button asChild>
              <Link to="/my-bookings">Retour à mes réservations</Link>
            </Button>
          </div>
        </main>
        <Footer />
        <Chatbot />
      </div>
    );
  }

  // Accéder aux données avec des valeurs par défaut
  const passengerInfo = reservation.passenger_info || {};
  const totalAmount = parseFloat(reservation.total_amount) || 0;
  const createdAt = reservation.created_at ? new Date(reservation.created_at) : new Date();
  
  // Données du schedule
  const route = schedule?.route || {};
  const origin = route.origin || "Origine inconnue";
  const destination = route.destination || "Destination inconnue";
  const agencyName = route.agency_name || "Agence inconnue";
  const departureTime = schedule?.departure_time ? new Date(schedule.departure_time) : new Date();
  
  // Obtenir le statut
  const status = getReservationStatus(reservation.payment_status || "pending");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link to="/my-bookings">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Détails de la réservation</h1>
              <p className="text-muted-foreground">
                Référence: {reservation.id || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Voyage Details */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Détails du voyage</h2>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">
                    {origin} → {destination}
                  </h3>
                  <Badge variant={status.variant as any}>
                    {status.label}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(departureTime, "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Départ</p>
                      <p className="font-medium">
                        {format(departureTime, "HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Agence</p>
                      <p className="font-medium">
                        {agencyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
                      <span className="text-lg">💺</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Siège</p>
                      <p className="font-medium">
                        {reservation.seat_number || "À attribuer"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Passenger Details */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Informations du passager</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nom complet</p>
                      <p className="font-medium">{passengerInfo.name || "Non fourni"}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{passengerInfo.phone || "Non fourni"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {passengerInfo.email || "Non fourni"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Payment Summary */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Résumé du paiement</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix du billet</span>
                    <span className="font-medium">{totalAmount.toLocaleString()} CFA</span>
                  </div>
                  {reservation.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réduction</span>
                      <span className="font-medium text-green-500">-{reservation.discount.toLocaleString()} CFA</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total payé</span>
                      <span className="font-bold text-primary">{totalAmount.toLocaleString()} CFA</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Méthode de paiement: {reservation.payment_method || "Non spécifiée"}</p>
                    <p>Payé le: {format(createdAt, "dd MMM yyyy", { locale: fr })}</p>
                    <p>Statut: {status.label}</p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => handleDownloadTicket(reservation.ticket_id)}
                    disabled={!reservation.ticket_id}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {reservation.ticket_id ? "Télécharger le ticket" : "Ticket non disponible"}
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <QrCode className="h-4 w-4 mr-2" />
                    Voir le QR code
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    Annuler la réservation
                  </Button>
                </div>
              </Card>

              {/* Security Info */}
              <Card className="p-6 shadow-card">
                <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ce billet est signé cryptographiquement pour vérification à l'embarquement.
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>ID du ticket: {reservation.ticket_id ? reservation.ticket_id.substring(0, 8) : "Non généré"}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default BookingDetails;