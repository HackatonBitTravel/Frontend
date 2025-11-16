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
import { Plus, Bus, Users, DollarSign, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAgencyStats,
  getRecentBookings,
  getUpcomingTrips,
  getAgencyDetails,
  getAgencyRoutes, // AJOUT
} from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AgencyDashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [agencyName, setAgencyName] = useState("Votre Agence");
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [routes, setRoutes] = useState([]); // LISTE DES ROUTES
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError("Token d'authentification manquant");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Chargement parallèle
        const [agencyData, statsData, bookingsData, tripsData, routesData] =
          await Promise.all([
            getAgencyDetails(token),
            getAgencyStats(token),
            getRecentBookings(token),
            getUpcomingTrips(token),
            getAgencyRoutes(token), // NOUVEAU
          ]);

        setAgencyName(agencyData.name || "Votre Agence");
        setStats(statsData);
        setRecentBookings(bookingsData);
        setUpcomingTrips(tripsData);
        setRoutes(routesData);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement des données";

        setError(errorMessage);
        toast({
          title: "Erreur",
          description: "Impossible de charger le tableau de bord",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, toast]);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Authentification requise</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour accéder au tableau de bord.
            </p>
            <Link to="/agency/login">
              <Button className="w-full">Se connecter</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Tableau de Bord de {agencyName}
              </h1>
              <p className="text-muted-foreground">Trans-Sahel Express</p>
            </div>

            <div className="flex gap-4">
              <Link to="/agency/add-route">
                <Button className="bg-gradient-hero hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Itinéraire
                </Button>
              </Link>
              <Link to="/agency/add-schedule">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Horaire
                </Button>
              </Link>
            </div>
          </div>

          {error && (
            <Card className="p-4 mb-6 border-destructive">
              <p className="text-destructive">{error}</p>
            </Card>
          )}

          {/* STATISTIQUES */}
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
              : stats.map((stat, idx) => {
                  const IconComponent = { Bus, Users, DollarSign, Ticket }[
                    stat.icon
                  ];
                  return (
                    <Card key={idx} className="p-6 shadow-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-hero">
                          {IconComponent && (
                            <IconComponent className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    </Card>
                  );
                })}
          </div>

          {/* TABS */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">Réservations Récentes</TabsTrigger>
              <TabsTrigger value="trips">Voyages à Venir</TabsTrigger>
              <TabsTrigger value="routes">Itinéraires</TabsTrigger>
            </TabsList>

            {/* RÉSERVATIONS */}
                <TabsContent value="bookings">
              <Card className="shadow-card">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-lg">
                    Réservations Récentes
                  </h3>
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
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </TableCell>
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


            {/* VOYAGES */}
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
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-16" />
                            </TableCell>
                          </TableRow>
                        ))
                      : upcomingTrips.map((trip) => (
                          <TableRow key={trip.id}>
                            <TableCell className="font-medium">
                              {trip.id}
                            </TableCell>
                            <TableCell>
                              {trip.route.origin} - {trip.route.destination}
                            </TableCell>
                            <TableCell>
                              {new Date(trip.departure_time).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {trip.seats - trip.available_seats}/{trip.seats}
                            </TableCell>
                            <TableCell>
                              <Badge>Actif</Badge>
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


            {/* ROUTES (NOUVEAU) */}
            <TabsContent value="routes">
              <Card className="shadow-card">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-lg">
                    Itinéraires de l’Agence
                  </h3>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Destination</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-20" />
                            </TableCell>
                          </TableRow>
                        ))
                      : routes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell>{route.id}</TableCell>
                            <TableCell>{route.origin}</TableCell>
                            <TableCell>{route.destination}</TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
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
