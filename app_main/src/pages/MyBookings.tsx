import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, QrCode, Download, Bus, AlertTriangle, User, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { getMyReservations, getTicketPdfUrl, getScheduleDetails } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MyBookings = () => {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("MyBookings: token =", token);
    console.log("MyBookings: user =", user);
    
    if (!token) {
      console.log("MyBookings: Pas de token, redirection vers /signin");
      navigate("/signin");
      return;
    }

    const fetchReservations = async () => {
      try {
        console.log("MyBookings: Appel de getMyReservations avec token");
        const data = await getMyReservations(token);
        console.log("MyBookings: Données reçues de getMyReservations:", data);
        setReservations(data);
      } catch (error: any) {
        console.error("MyBookings: Erreur lors du chargement des réservations:", error);
        toast({
          title: "Erreur de chargement",
          description: error.message || "Impossible de charger vos réservations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [token, navigate, toast, user]);

  // Effet pour charger les détails des schedules
  useEffect(() => {
    if (!token || reservations.length === 0) {
      console.log("MyBookings: Pas de token ou pas de réservations, skip fetchSchedules");
      return;
    }

    console.log("MyBookings: Chargement des détails des schedules pour", reservations.length, "réservations");

    const fetchSchedules = async () => {
      const newSchedules: any = {};
      for (const reservation of reservations) {
        console.log("MyBookings: Traitement de la réservation", reservation.id, "avec schedule_id", reservation.schedule_id);
        if (reservation.schedule_id && !schedules[reservation.schedule_id]) {
          try {
            console.log("MyBookings: Appel de getScheduleDetails pour schedule_id", reservation.schedule_id);
            const schedule = await getScheduleDetails(reservation.schedule_id, token);
            console.log("MyBookings: Schedule reçu:", schedule);
            newSchedules[reservation.schedule_id] = schedule;
          } catch (error) {
            console.error("MyBookings: Erreur lors du chargement du schedule:", error);
          }
        }
      }
      if (Object.keys(newSchedules).length > 0) {
        console.log("MyBookings: Mise à jour des schedules avec", Object.keys(newSchedules).length, "nouveaux schedules");
        setSchedules(prev => ({ ...prev, ...newSchedules }));
      }
    };

    fetchSchedules();
  }, [reservations, token]);

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
            <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>
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

  console.log("MyBookings: Affichage de", reservations.length, "réservations");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Mes Réservations</h1>
              <p className="text-muted-foreground">
                Gérez vos réservations passées et futures
              </p>
            </div>
            <Button asChild>
              <Link to="/search">
                <Bus className="h-4 w-4 mr-2" />
                Réserver un voyage
              </Link>
            </Button>
          </div>

          {reservations.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucune réservation trouvée</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore réservé de voyage. Commencez dès maintenant !
              </p>
              <Button asChild>
                <Link to="/search">Rechercher des voyages</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {reservations.map((reservation) => {
                console.log("MyBookings: Affichage de la réservation", reservation);
                
                // Accéder aux données avec des valeurs par défaut
                const passengerInfo = reservation.passenger_info || {};
                const totalAmount = parseFloat(reservation.total_amount) || 0;
                const createdAt = reservation.created_at ? new Date(reservation.created_at) : new Date();
                
                // Obtenir le schedule associé
                const schedule = schedules[reservation.schedule_id] || {};
                console.log("MyBookings: Schedule associé pour réservation", reservation.id, ":", schedule);
                
                const route = schedule.route || {};
                
                // Données du voyage
                const origin = route.origin || "Origine inconnue";
                const destination = route.destination || "Destination inconnue";
                const agencyName = route.agency_name || "Agence inconnue";
                const departureTime = schedule.departure_time ? new Date(schedule.departure_time) : new Date();
                
                // Obtenir le statut
                const status = getReservationStatus(reservation.payment_status || "pending");
                
                return (
                  <Card key={reservation.id} className="p-6 shadow-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">
                            {origin} → {destination}
                          </h3>
                          <Badge variant={status.variant as any}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Réservé le {format(createdAt, "dd MMM yyyy", { locale: fr })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {totalAmount.toLocaleString()} CFA
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Réf: {reservation.id ? reservation.id.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {format(departureTime, "dd MMM yyyy", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Départ</p>
                          <p className="font-medium">
                            {format(departureTime, "HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Agence</p>
                          <p className="font-medium">
                            {agencyName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Passager</p>
                          <p className="font-medium">
                            {passengerInfo.name || "Non spécifié"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p className="font-medium">
                            {passengerInfo.phone || "Non spécifié"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                            {passengerInfo.email || "Non spécifié"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDownloadTicket(reservation.ticket_id)}
                        disabled={!reservation.ticket_id}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {reservation.ticket_id ? "Télécharger le ticket" : "Ticket non disponible"}
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/my-bookings/${reservation.id}`}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Voir les détails
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MyBookings;