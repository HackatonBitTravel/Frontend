import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, Mail, Share2, QrCode, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import { getTicketPdfUrl } from "@/lib/api";

const Confirmation = () => {
  const { selectedTrip, passengerInfo, totalAmount, reservationId, ticketId, resetBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservationId || !selectedTrip || !passengerInfo || totalAmount === 0) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [reservationId, selectedTrip, passengerInfo, totalAmount, navigate]);

  if (!reservationId || !selectedTrip || !passengerInfo || totalAmount === 0) {
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

  // Extraire les propriétés avec des valeurs par défaut pour correspondre à la structure de l'API
  const { 
    origin = "Origine inconnue", 
    destination = "Destination inconnue", 
    duration = 0,
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

  // Fonction pour télécharger le PDF du ticket
  const handleDownloadTicket = () => {
    if (ticketId) {
      const pdfUrl = getTicketPdfUrl(ticketId);
      window.open(pdfUrl, '_blank');
    } else {
      alert("Ticket non disponible pour le moment. Veuillez réessayer dans quelques instants.");
    }
  };

  // Fonction pour envoyer le ticket par email
  const handleEmailTicket = () => {
    // Implémentation de l'envoi par email
    alert("Fonction d'envoi par email à implémenter");
  };

  // Fonction pour partager le ticket
  const handleShareTicket = () => {
    // Implémentation du partage
    alert("Fonction de partage à implémenter");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Réservation confirmée !</h1>
            <p className="text-muted-foreground text-lg">
              Votre billet a été réservé avec succès
            </p>
          </div>

          {/* Booking Details */}
          <Card className="p-8 shadow-elevated mb-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Référence de réservation</p>
                <p className="text-2xl font-bold text-primary">{reservationId}</p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center bg-muted rounded-lg">
                <QrCode className="h-16 w-16" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Itinéraire</p>
                  <p className="font-semibold">{origin} → {destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold">{format(new Date(departure_time), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Départ</p>
                  <p className="font-semibold">{format(new Date(departure_time), "HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Siège</p>
                  <p className="font-semibold">À attribuer</p> {/* Placeholder for seat number */}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Passager</p>
                  <p className="font-semibold">{passengerInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Agence</p>
                  <p className="font-semibold">{agency?.name || "Agence Inconnue"}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Informations importantes :</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Veuillez arriver 30 minutes avant le départ</li>
                <li>• Apportez votre pièce d'identité et votre référence de réservation</li>
                <li>• Présentez ce code QR à la porte d'embarquement</li>
              </ul>
            </div>
          </Card>

          {/* Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" className="w-full" onClick={handleDownloadTicket} disabled={!ticketId}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger le PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={handleEmailTicket} disabled={!ticketId}>
              <Mail className="h-4 w-4 mr-2" />
              Envoyer le billet par e-mail
            </Button>
            <Button variant="outline" className="w-full" onClick={handleShareTicket} disabled={!ticketId}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>

          {/* Signature Info */}
          <Card className="p-6 shadow-card mb-6">
            <h3 className="font-semibold text-lg mb-3">Vérification du billet</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Message signé:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">SHA256...</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Clé Publique:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">03a7b2...</code>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Ce billet est signé cryptographiquement pour vérification à l'embarquement
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Link to="/" onClick={resetBooking}>
              <Button className="bg-gradient-hero hover:opacity-90" size="lg">
                Réserver un Autre Voyage
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Créez un compte pour suivre vos réservations et obtenir des réductions exclusives
            </p>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  );
};

export default Confirmation;