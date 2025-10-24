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
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est requis.",
  }),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
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
  const formData = new URLSearchParams();
  formData.append("username", values.email);
  formData.append("password", values.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : data.detail?.[0]?.msg || "Échec de la connexion.";
    throw new Error(message);
  }

  const token = data.access_token;
  const userData = { email: values.email };
  login(userData, token, 'client'); // Add 'client' role
  // Remove the separate localStorage.setItem as it's handled in the login function

  toast({
    title: "Connexion réussie !",
    description: "Vous êtes maintenant connecté.",
  });

  setTimeout(() => navigate("/"), 1000);

} catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Une erreur inattendue est survenue.";

  toast({
    title: "Erreur de connexion",
    description: message,
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
              <h1 className="text-3xl font-bold mb-2">Connexion Client</h1>
              <p className="text-muted-foreground">
                Accédez à votre compte pour voir vos réservations
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@example.com"
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