import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, CheckCircle2, XCircle, ScanLine } from "lucide-react";
import { useState } from "react";

const TicketVerification = () => {
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [ticketData, setTicketData] = useState<any>(null);

  const handleVerify = () => {
    // Simulate verification
    setTimeout(() => {
      setVerificationResult("valid");
      setTicketData({
        bookingRef: "BT-2025-00142",
        passenger: "John Doe",
        route: "Dakar → Bamako",
        date: "Dec 25, 2025",
        seat: "A12",
        agency: "Trans-Sahel Express",
        signedMessage: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        publicKey: "03a7b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Vérification de Billet</h1>
            <p className="text-muted-foreground">
              Scannez le code QR pour vérifier le billet du passager
            </p>
          </div>

          {!verificationResult ? (
            <Card className="p-12 text-center shadow-elevated">
              <div className="flex justify-center mb-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-hero">
                  <QrCode className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-4">Prêt à Scanner</h3>
              <p className="text-muted-foreground mb-8">
                Positionnez le code QR dans le cadre pour vérifier le billet
              </p>
              <Button
                className="bg-gradient-hero hover:opacity-90"
                size="lg"
                onClick={handleVerify}
              >
                <ScanLine className="h-5 w-5 mr-2" />
                Démarrer le Scanner
              </Button>
            </Card>
          ) : (
            <Card className={`p-8 shadow-elevated ${
              verificationResult === "valid" ? "border-green-500" : "border-red-500"
            } border-2`}>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {verificationResult === "valid" ? (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {verificationResult === "valid" ? "Billet Valide" : "Billet Invalide"}
                </h2>
                <p className="text-muted-foreground">
                  {verificationResult === "valid"
                    ? "Ce billet a été vérifié et est authentique"
                    : "Ce billet n'a pas pu être vérifié"}
                </p>
              </div>

              {ticketData && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Référence de Réservation</p>
                        <p className="font-semibold">{ticketData.bookingRef}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Passager</p>
                        <p className="font-semibold">{ticketData.passenger}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Trajet</p>
                        <p className="font-semibold">{ticketData.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date</p>
                        <p className="font-semibold">{ticketData.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Siège</p>
                        <p className="font-semibold">{ticketData.seat}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Agence</p>
                        <p className="font-semibold">{ticketData.agency}</p>
                      </div>
                    </div>
                  </div>

                  <Card className="p-4 bg-muted/50 mb-6">
                    <h4 className="font-medium mb-3 text-sm">Vérification Cryptographique</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Message Signé</p>
                        <code className="text-xs bg-background px-2 py-1 rounded block break-all">
                          {ticketData.signedMessage}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Clé Publique</p>
                        <code className="text-xs bg-background px-2 py-1 rounded block break-all">
                          {ticketData.publicKey}
                        </code>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setVerificationResult(null);
                    setTicketData(null);
                  }}
                >
                  Scanner un Autre
                </Button>
                {verificationResult === "valid" && (
                  <Button className="flex-1 bg-gradient-hero hover:opacity-90">
                    Marquer comme Embarqué
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketVerification;
