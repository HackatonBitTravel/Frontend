import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { createRoute } from "../lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const formSchema = z.object({
  origin: z.string().min(2, {
    message: "La ville de départ doit contenir au moins 2 caractères.",
  }),
  destination: z.string().min(2, {
    message: "La ville d'arrivée doit contenir au moins 2 caractères.",
  }),
  duration: z.coerce.number().min(1, {
    message: "La durée du voyage doit être d'au moins 1 minute.",
  }),
});

const AddRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, isLoading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: "",
      destination: "",
      duration: 0,
    },
  });

  // Debug: Log du contexte au chargement du composant
  useEffect(() => {
    console.log("=== AddRoute Component Loaded ===");
    console.log("authLoading:", authLoading);
    console.log("token:", token);
    console.log("user:", user);
    console.log("token from localStorage:", localStorage.getItem('authToken'));
  }, [authLoading, token, user]);

  // Rediriger si non authentifié après le chargement
  useEffect(() => {
    if (!authLoading && !token) {
      console.error("❌ No token after loading, redirecting to login");
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un itinéraire.",
        variant: "destructive",
      });
      navigate("/agency/login");
    }
  }, [authLoading, token, navigate, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("=== FORM SUBMIT ===");
    console.log("Token from context:", token);
    console.log("Token length:", token?.length);
    console.log("Form values:", values);
    
    if (!token) {
      console.error("❌ No token available!");
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un itinéraire.",
        variant: "destructive",
      });
      navigate("/agency/login");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("✅ Calling createRoute with token:", token.substring(0, 20) + "...");
      const result = await createRoute(token, values.origin, values.destination, values.duration);
      console.log("✅ Route created successfully:", result);
      
      toast({
        title: "Itinéraire ajouté avec succès !",
        description: "Le nouvel itinéraire a été enregistré.",
      });
      navigate("/agency/dashboard");
    } catch (error: any) {
      console.error("❌ Error creating route:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      toast({
        title: "Erreur lors de l'ajout de l'itinéraire",
        description: error.message || "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
      
      // Si l'erreur est liée à l'authentification, rediriger vers la page de login
      if (error.message.includes("Non authentifié") || 
          error.message.includes("authentification") ||
          error.message.includes("Not authenticated")) {
        console.log("🔄 Redirecting to login due to auth error");
        navigate("/agency/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un loader pendant le chargement de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si pas de token après chargement, ne pas afficher le formulaire
  if (!token) {
    return null; // La redirection sera gérée par le useEffect
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero mx-auto mb-4">
                <PlusCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Ajouter un Nouvel Itinéraire</h1>
              <p className="text-muted-foreground">
                Remplissez les détails ci-dessous pour créer un nouvel itinéraire
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Ville de départ</Label>
                    <Input
                      id="origin"
                      placeholder="Ex: Cotonou"
                      {...form.register("origin")}
                    />
                    {form.formState.errors.origin && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.origin.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Ville d'arrivée</Label>
                    <Input
                      id="destination"
                      placeholder="Ex: Porto-Novo"
                      {...form.register("destination")}
                    />
                    {form.formState.errors.destination && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.destination.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (en minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Ex: 45"
                    {...form.register("duration", { valueAsNumber: true })}
                  />
                  {form.formState.errors.duration && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.duration.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link to="/agency/dashboard">
                    <Button variant="outline">Annuler</Button>
                  </Link>
                  <Button 
                    className="bg-gradient-hero hover:opacity-90" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Création en cours..." : "Créer l'Itinéraire"}
                  </Button>
                </div>
              </form>
            </Card>


          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddRoute;