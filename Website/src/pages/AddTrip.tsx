import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AddTrip = () => {
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
              <h1 className="text-3xl font-bold mb-2">Ajouter un Nouveau Voyage</h1>
              <p className="text-muted-foreground">
                Remplissez les détails ci-dessous pour créer un nouvel itinéraire
              </p>
            </div>

            <Card className="p-8 shadow-elevated">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="from">Ville de départ</Label>
                    <Input id="from" placeholder="Ex: Cotonou" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to">Ville d'arrivée</Label>
                    <Input id="to" placeholder="Ex: Parakou" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Heure de départ</Label>
                    <Input id="departureTime" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Heure d'arrivée</Label>
                    <Input id="arrivalTime" type="time" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label htmlFor="price">Prix (CFA)</Label>
                    <Input id="price" type="number" placeholder="Ex: 7500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée du voyage</Label>
                    <Input id="duration" placeholder="Ex: 8 heures" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input id="image" placeholder="https://example.com/image.jpg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du voyage (facultatif)</Label>
                  <Textarea id="description" placeholder="Décrivez les points forts de ce voyage..." />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link to="/agency/dashboard">
                      <Button variant="outline">Annuler</Button>
                  </Link>
                  <Button className="bg-gradient-hero hover:opacity-90">
                    Créer le Voyage
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

export default AddTrip;
