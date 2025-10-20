import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus } from "lucide-react";
import { Link } from "react-router-dom";

const AgencyLogin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero mx-auto mb-4">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Portail Agence</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour gérer vos voyages et réservations
            </p>
          </div>

          <Card className="p-8 shadow-elevated">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agence@example.com"
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

              <Link to="/agency/dashboard">
                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                  Se connecter
                </Button>
              </Link>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Button variant="link" className="px-0 text-primary">
                  Enregistrez votre agence
                </Button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgencyLogin;
