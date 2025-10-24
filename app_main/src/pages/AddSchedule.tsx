import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { createSchedule, getRoutes } from "../lib/api"; // Will create/update these functions
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const formSchema = z.object({
  route_id: z.string().uuid({ message: "Veuillez sélectionner un itinéraire valide." }),
  departureDate: z.date({
    required_error: "Veuillez sélectionner une date de départ.",
  }),
  departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Veuillez entrer une heure de départ valide (HH:MM).",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Le prix doit être supérieur à 0.",
  }),
  seats: z.coerce.number().int().min(1, {
    message: "Le nombre de sièges doit être d'au moins 1.",
  }),
});

const AddSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      route_id: "",
      departureDate: new Date(),
      departureTime: "",
      price: 0.01,
      seats: 1,
    },
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const fetchedRoutes = await getRoutes(token);
        setRoutes(fetchedRoutes);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les itinéraires disponibles.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRoutes(false);
      }
    };

    if (token) {
      fetchRoutes();
    }
  }, [token, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un horaire.",
        variant: "destructive",
      });
      navigate("/agency/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const departureDateTime = new Date(values.departureDate);
      const [hours, minutes] = values.departureTime.split(':').map(Number);
      departureDateTime.setHours(hours, minutes, 0, 0);

      await createSchedule(token, {
        route_id: values.route_id,
        departure_time: departureDateTime.toISOString(),
        price: values.price,
        seats: values.seats,
      });

      toast({
        title: "Horaire ajouté avec succès !",
        description: "Le nouvel horaire a été enregistré.",
      });
      navigate("/agency/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'ajout de l'horaire",
        description: error.message || "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h1 className="text-3xl font-bold mb-2">Ajouter un Nouvel Horaire</h1>
              <p className="text-muted-foreground">
                Remplissez les détails ci-dessous pour créer un nouvel horaire de voyage
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="route_id">Itinéraire</Label>
                  <Select onValueChange={(value) => form.setValue("route_id", value)} value={form.watch("route_id")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un itinéraire" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingRoutes ? (
                        <SelectItem value="loading" disabled>Chargement des itinéraires...</SelectItem>
                      ) : routes.length === 0 ? (
                        <SelectItem value="no-routes" disabled>Aucun itinéraire disponible</SelectItem>
                      ) : (
                        routes.map((route: any) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.origin} - {route.destination} ({route.duration} min)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.route_id && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.route_id.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Date de départ</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("departureDate") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("departureDate") ? (
                            format(form.watch("departureDate"), "PPP")
                          ) : (
                            <span>Choisir une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("departureDate")}
                          onSelect={(date) => form.setValue("departureDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.departureDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.departureDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Heure de départ</Label>
                    <Input
                      id="departureTime"
                      type="time"
                      {...form.register("departureTime")}
                    />
                    {form.formState.errors.departureTime && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.departureTime.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label htmlFor="price">Prix (CFA)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Ex: 7500"
                      {...form.register("price", { valueAsNumber: true })}
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seats">Nombre de sièges</Label>
                    <Input
                      id="seats"
                      type="number"
                      placeholder="Ex: 50"
                      {...form.register("seats", { valueAsNumber: true })} 
                    />
                    {form.formState.errors.seats && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.seats.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link to="/agency/dashboard">
                      <Button variant="outline">Annuler</Button>
                  </Link>
                  <Button className="bg-gradient-hero hover:opacity-90" type="submit" loading={isSubmitting}>
                    {isSubmitting ? "Création en cours..." : "Créer l'Horaire"}
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

export default AddSchedule;