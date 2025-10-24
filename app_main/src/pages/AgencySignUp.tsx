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
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const formSchema = z.object({
  agencyName: z.string().min(2, {
    message: "Le nom de l'agence doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  phone: z.string().min(10, {
    message: "Veuillez entrer un numéro de téléphone valide (au moins 10 chiffres).",
  }),
});

const AgencySignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/agencies/register`, { // Placeholder endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.agencyName,
          email: values.email,
          password: values.password,
          phone: values.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Échec de l'enregistrement de l'agence.");
      }

      const userData = await response.json();
      const token = userData.access_token || "fake-agency-token-after-signup"; 
      login(userData, token, 'agency'); // Add 'agency' role

      toast({
        title: "Agence enregistrée avec succès !",
        description: "Vous êtes maintenant connecté en tant qu'agence.",
      });
      navigate("/agency/dashboard"); // Redirect to agency dashboard
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'enregistrement de l'agence",
        description: error.message || "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Enregistrer votre Agence</h1>
              <p className="text-muted-foreground">
                Créez un compte pour votre agence et gérez vos voyages
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Nom de l'agence</Label>
                  <Input
                    id="agencyName"
                    type="text"
                    placeholder="Nom de votre agence"
                    {...form.register("agencyName")}
                  />
                  {form.formState.errors.agencyName && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.agencyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail de l'agence</Label>
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
                    placeholder="Créez un mot de passe sécurisé"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 0700000000"
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" type="submit" loading={isLoading}>
                  {isLoading ? "Enregistrement en cours..." : "Enregistrer l'agence"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà un compte agence ?{" "}
                  <Link to="/agency/login">
                    <Button variant="link" className="px-0 text-primary">
                      Connectez-vous
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

export default AgencySignUp;