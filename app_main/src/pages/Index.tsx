import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import RouteCard from "@/components/RouteCard";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import routeDakar from "@/assets/route-dakar.jpg";
import routeBamako from "@/assets/route-bamako.jpg";
import routeAbidjan from "@/assets/route-abidjan.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Bitcoin } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import { useEffect, useState } from "react";
import { getPopularRoutes } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Interface correspondant à la structure réelle des données
interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  duration: number;
  agency_name: string;
}

const Index = () => {
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await getPopularRoutes();
        setPopularRoutes(routes);
      } catch (error) {
        console.error("Error fetching popular routes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Meilleurs Prix",
      description:
        "Comparez les prix des meilleures agences et obtenez les meilleures offres",
    },
    {
      icon: Shield,
      title: "Réservation Sécurisée",
      description:
        "Vos paiements et vos données sont protégés par un cryptage avancé",
    },
    {
      icon: Zap,
      title: "Réservation Instantanée",
      description:
        "Réservez vos billets en quelques secondes sans créer de compte",
    },
    {
      icon: Bitcoin,
      title: "Paiements en Bitcoin",
      description:
        "Payez avec Bitcoin Lightning Network pour des transactions rapides",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="African travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Voyagez à travers l'Afrique{" "}
                <span className="block mt-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Avec Confiance
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Réservez instantanément des billets de bus interurbains. Payez
                avec Mobile Money ou Bitcoin.
              </p>{" "}
            </div>

            <div className="max-w-4xl mx-auto">
              <SearchBar variant="hero" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Itinéraires Populaires</h2>
                <p className="text-muted-foreground">
                  Destinations les plus fréquentées cette semaine
                </p>
              </div>

            </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <Card key={idx} className="p-4 shadow-card space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                      </Card>
                    ))
                  : popularRoutes.map((route, idx) => (
                      <Card key={idx} className="p-4 shadow-card">
                        <img
                          src={routeBamako} // Placeholder image
                          alt={`${route.origin} to ${route.destination}`}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">{route.origin} → {route.destination}</h3>
                        <p className="text-muted-foreground text-sm mb-4">Agence: {route.agency_name}</p>
                        <Link to={`/search?origin=${route.origin}&destination=${route.destination}`}>
                          <Button className="w-full bg-gradient-hero hover:opacity-90">
                            Voir les voyages
                          </Button>
                        </Link>
                      </Card>
                    ))}
              </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Inscrivez-vous et obtenez 10% de réduction
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Créez un compte pour bénéficier de réductions exclusives et de
              réservations plus rapides
            </p>
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="font-semibold">
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Index;
