import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/Header"; // Corrected import
import Footer from "@/components/Footer"; // Added footer for consistency
import { Input } from "@/components/ui/input"; // Import Input component
import { useState } from "react"; // Import useState

// Dummy data representing boarded tickets
const boardedTickets = [
  {
    ticketId: "TKT-12345XYZ",
    passengerName: "John Doe",
    trip: "Cotonou - Parakou",
    scannedAt: "2025-10-25 13:55",
    controller: "Driver 1",
  },
  {
    ticketId: "TKT-67890ABC",
    passengerName: "Jane Smith",
    trip: "Cotonou - Parakou",
    scannedAt: "2025-10-25 13:58",
    controller: "Controller A",
  },
  {
    ticketId: "TKT-ABCDEF123",
    passengerName: "Peter Jones",
    trip: "Cotonou - Parakou",
    scannedAt: "2025-10-25 14:02",
    controller: "Driver 1",
  },
];

const BoardingControl = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = boardedTickets.filter(
    (ticket) =>
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.trip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-8">Contrôle des Embarquements</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Tickets Récemment Scannés</CardTitle>
              <div className="mt-4">
                <Input 
                  placeholder="Filtrer par ID du Ticket, Passager, ou Trajet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID du Ticket</TableHead>
                    <TableHead>Passager</TableHead>
                    <TableHead>Trajet</TableHead>
                    <TableHead>Scanné le</TableHead>
                    <TableHead>Scanné par</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                      <TableCell className="font-medium">{ticket.ticketId}</TableCell>
                      <TableCell>{ticket.passengerName}</TableCell>
                      <TableCell>{ticket.trip}</TableCell>
                      <TableCell>{ticket.scannedAt}</TableCell>
                      <TableCell>{ticket.controller}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardingControl;
