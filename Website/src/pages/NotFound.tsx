import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <Compass className="h-24 w-24 text-muted-foreground/50 mb-6" />
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          Oups! La page que vous cherchez semble s'être perdue dans la nature.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-gradient-hero hover:opacity-90">
            Retourner à l'accueil
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
