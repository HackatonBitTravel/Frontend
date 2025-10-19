import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAgencyStats,
  getRecentBookings,
  getUpcomingTrips,
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const AgencyDashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, bookingsData, tripsData] = await Promise.all([
          getAgencyStats(),
          getRecentBookings(),
          getUpcomingTrips(),
        ]);
        setStats(statsData);
        setRecentBookings(bookingsData);
        setUpcomingTrips(tripsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Here you could set an error state and display a toast message
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord de l'Agence</h1>
            <p className="text-muted-foreground">Trans-Sahel Express</p>
          </div>
          <Link to="/agency/add-trip">
            <Button className="bg-gradient-hero hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un Nouveau Voyage
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Card key={idx} className="p-6 shadow-card space-y-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </Card>
              ))
            : stats.map((stat, idx) => (
                <Card key={idx} className="p-6 shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-hero">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </Card>
              ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Réservations Récentes</TabsTrigger>
            <TabsTrigger value="trips">Voyages à Venir</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="shadow-card">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Réservations Récentes</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Réservation</TableHead>
                    <TableHead>Passager</TableHead>
                    <TableHead>Trajet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    : recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.id}
                          </TableCell>
                          <TableCell>{booking.passenger}</TableCell>
                          <TableCell>{booking.route}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="trips">
            <Card className="shadow-card">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Voyages à Venir</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Voyage</TableHead>
                    <TableHead>Trajet</TableHead>
                    <TableHead>Départ</TableHead>
                    <TableHead>Sièges Réservés</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => (
                        <TableRow key={idx}>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                        </TableRow>
                      ))
                    : upcomingTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell className="font-medium">
                            {trip.id}
                          </TableCell>
                          <TableCell>{trip.route}</TableCell>
                          <TableCell>{trip.departure}</TableCell>
                          <TableCell>{trip.seats}</TableCell>
                          <TableCell>
                            <Badge>{trip.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6 shadow-card">
              <h3 className="font-semibold text-lg mb-4">Statistiques</h3>
              <p className="text-muted-foreground">
                Les statistiques et rapports détaillés seront affichés ici
              </p>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgencyDashboard;
