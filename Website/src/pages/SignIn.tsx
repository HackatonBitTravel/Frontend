import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed User import
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // In a real application, you would handle authentication here
    // For now, we just redirect to the my-bookings page
    navigate('/my-bookings');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              {/* Icon removed */}
              <h1 className="text-3xl font-bold mb-2">Connexion Client</h1>
              <p className="text-muted-foreground">
                Accédez à votre compte pour voir vos réservations
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-input"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm cursor-pointer"
                    >
                      Se souvenir de moi
                    </label>
                  </div>
                  <Button variant="link" className="px-0 text-primary">
                    Mot de passe oublié ?
                  </Button>
                </div>

                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" type="submit">
                  Se connecter
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas de compte ?{" "}
                  <Link to="/signup">
                    <Button variant="link" className="px-0 text-primary">
                      Inscrivez-vous
                    </Button>
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
