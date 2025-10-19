import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, Mail, Share2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const Confirmation = () => {
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
                <p className="text-2xl font-bold text-primary">BT-2025-00142</p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center bg-muted rounded-lg">
                <QrCode className="h-16 w-16" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Itinéraire</p>
                  <p className="font-semibold">Dakar → Bamako</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold">Dec 25, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Départ</p>
                  <p className="font-semibold">08:00 AM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Siège</p>
                  <p className="font-semibold">A12</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Passager</p>
                  <p className="font-semibold">John Doe</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Agence</p>
                  <p className="font-semibold">Trans-Sahel Express</p>
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
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le PDF
            </Button>
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Envoyer le billet par e-mail
            </Button>
            <Button variant="outline" className="w-full">
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
            <Link to="/">
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
