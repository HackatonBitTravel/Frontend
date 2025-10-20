import { useState, useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats, Html5Qrcode } from "html5-qrcode"; // Import Html5Qrcode
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

// Define a type for the expected ticket data from the QR code
interface ScannedTicketData {
  bookingRef: string;
  passenger: string;
  route: string;
  date: string;
  price: string;
  phone: string;
  agency: string;
  signedMessage: string;
  publicKey: string;
}

const dummyTicketData: ScannedTicketData = {
  bookingRef: "dcad683e-ddb1-4545-8b12-b824ed365c37",
  passenger: "Godwin AKAKPO",
  route: "Cotonou - Parakou",
  date: "25/10/2025 14:00",
  price: "9000.0 FCFA",
  phone: "+2290167109440",
  agency: "Godwin Transport",
  signedMessage: "dummy_signed_message_123",
  publicKey: "dummy_public_key_456",
};

const TicketVerification = () => {
  const [isScanning, setIsScanning] = useState(true); // The scanner now starts automatically by default
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [ticketData, setTicketData] = useState<ScannedTicketData | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [rearCameraId, setRearCameraId] = useState<string | null>(null); // State to store rear camera ID
  const [error, setError] = useState<string | null>(null); // State for errors

  const scannerContainerId = "qr-scanner-container";

  // Effect to find the rear camera
  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        // Try to find a rear-facing camera
        const rear = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
        if (rear) {
          setRearCameraId(rear.id);
        } else {
          // Fallback to the first camera if no rear camera is explicitly found
          setRearCameraId(devices[0].id);
        }
      } else {
        setError("No camera devices found.");
      }
    }).catch(err => {
      setError(`Error getting camera devices: ${err}`);
      console.error("Error getting camera devices:", err);
    });
  }, []);

  useEffect(() => {
    if (!isScanning || !rearCameraId) { // Only start scanning if isScanning is true and rearCameraId is found
      return;
    }

    const html5Qrcode = new Html5Qrcode(scannerContainerId);

    const qrCodeSuccessCallback = (decodedText: string) => {
      setScannedData(decodedText);
      handleVerify(decodedText);
      setIsScanning(false); // Stop scanning UI
      html5Qrcode.stop().catch(err => console.error("Failed to stop scanner:", err));
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      // Errors are frequent (e.g., no QR code in view), so we can ignore them
      // console.log(`QR Code scan error: ${errorMessage}`);
    };

    html5Qrcode.start(
      rearCameraId, // Use the identified rear camera ID
      {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
      },
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    ).catch(err => {
      setError(`Failed to start scanner: ${err}`);
      console.error("Failed to start scanner:", err);
    });

    return () => {
      // Ensure scanner is cleared when component unmounts or isScanning becomes false
      if (html5Qrcode.isScanning) { // Check if scanner is actually running before stopping
        html5Qrcode.stop().catch(err => {
          console.error("Failed to stop html5-qrcode scanner on cleanup:", err);
        });
      }
    };
  }, [isScanning, rearCameraId]); // Depend on rearCameraId

  const handleVerify = (data: string) => {
    console.log("Scanned Data:", data);
    let parsedData: ScannedTicketData | null = null;
    let isValidFormat = false;

    try {
      const obj = JSON.parse(data);
      // Basic validation to ensure the object has the expected properties
      if (obj.bookingRef && obj.passenger && obj.route && obj.date && obj.price && obj.phone && obj.agency) {
        parsedData = obj;
        isValidFormat = true;
      } else {
        console.error("Parsed data is missing required fields.");
        isValidFormat = false;
      }
    } catch (e) {
      console.error("Failed to parse QR code data as JSON:", e);
      isValidFormat = false;
    }

    setTimeout(() => {
      if (isValidFormat && parsedData) {
        setVerificationResult("valid");
        setTicketData(parsedData);
      } else {
        setVerificationResult("invalid");
        setTicketData(null); // Clear ticket data if invalid
      }
    }, 500);
  };

  const [boardingStatus, setBoardingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleMarkAsBoarded = async () => {
    if (!ticketData) return;

    setBoardingStatus("loading");

    // This is a placeholder URL. Replace with the actual backend endpoint.
    const apiUrl = "https://api.africabless-voyage.com/tickets/board";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticketId: ticketData.bookingRef }),
      });

      if (response.ok) {
        setBoardingStatus("success");
      } else {
        // Handle non-successful responses (e.g., 404, 500)
        console.error("Failed to mark as boarded. Status:", response.status);
        setBoardingStatus("error");
      }
    } catch (error) {
      console.error("Error marking ticket as boarded:", error);
      setBoardingStatus("error");
    }
  };

  const resetState = () => {
    setIsScanning(true); // Go back to scanning mode
    setVerificationResult(null);
    setTicketData(null);
    setScannedData(null);
    setError(null); // Clear any previous errors
    setBoardingStatus("idle"); // Reset boarding status
  }


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {error ? (
            <Card className="p-6 shadow-elevated text-center text-red-500">
              <h1 className="text-2xl font-bold mb-2">Error</h1>
              <p>{error}</p>
              <Button onClick={resetState} className="mt-4">Try Again</Button>
            </Card>
          ) : !rearCameraId && isScanning ? (
            <Card className="p-6 shadow-elevated text-center">
              <h1 className="text-2xl font-bold">Loading Camera...</h1>
              <p className="text-muted-foreground">Please wait while we find your camera.</p>
            </Card>
          ) : !verificationResult ? (
            <Card className="p-6 shadow-elevated">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Scan Ticket QR Code</h1>
                <p className="text-muted-foreground">
                  Position the QR code inside the frame.
                </p>
              </div>
              <div id={scannerContainerId} />
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
                  {verificationResult === "valid" ? "Valid Ticket" : "Invalid Ticket"}
                </h2>
                <p className="text-muted-foreground">
                  {verificationResult === "valid"
                    ? "This ticket has been verified and is authentic"
                    : "This ticket could not be verified"}
                </p>
              </div>

              {ticketData && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                        <p className="font-semibold">{ticketData.bookingRef}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Passenger</p>
                        <p className="font-semibold">{ticketData.passenger}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Route</p>
                        <p className="font-semibold">{ticketData.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date</p>
                        <p className="font-semibold">{ticketData.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Price</p>
                        <p className="font-semibold">{ticketData.price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <p className="font-semibold">{ticketData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Agency</p>
                        <p className="font-semibold">{ticketData.agency}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetState}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan Another
                </Button>
                {verificationResult === "valid" && (
                  <Button 
                    className="flex-1 bg-gradient-hero hover:opacity-90"
                    onClick={handleMarkAsBoarded}
                    disabled={boardingStatus !== 'idle'}
                  >
                    {boardingStatus === 'loading' && '...'}
                    {boardingStatus === 'idle' && 'Marquer comme embarqué'}
                    {boardingStatus === 'success' && 'Embarqué !'}
                    {boardingStatus === 'error' && 'Erreur'}
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
