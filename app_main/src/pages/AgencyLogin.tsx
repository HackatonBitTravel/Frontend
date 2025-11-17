import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { agencyLogin } from "@/lib/api"; // Import the new API function
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

const AgencyLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const token = await agencyLogin(values.email, values.password);
      // Assuming the backend returns some user data along with the token,
      // or we can fetch it separately after successful login.
      // For now, using a placeholder user object.
      login({ email: values.email }, token, 'agency'); // Pass 'agency' role
      toast({
        title: "Connexion réussie !",
        description: "Vous êtes maintenant connecté à votre portail agence.",
      });
      navigate("/agency/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Portail Agence</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour gérer vos voyages et réservations
            </p>
          </div>

          <Card className="p-8 shadow-elevated">
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agence@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
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

              <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" type="submit" loading={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link to="/agency/signup">
                  <Button variant="link" className="px-0 text-primary">
                    Enregistrez votre agence
                  </Button>
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
       <Footer />
    </div>
  );
};

export default AgencyLogin;