import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-Nous</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nous sommes là pour vous aider. N'hésitez pas à nous envoyer un message ou à nous appeler.
            </p>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 shadow-elevated">
                <h2 className="text-2xl font-bold mb-6">Envoyer un message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Votre Nom</Label>
                      <Input id="name" placeholder="Entrez votre nom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Votre E-mail</Label>
                      <Input id="email" type="email" placeholder="Entrez votre e-mail" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" placeholder="Sujet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Écrivez votre message ici..." rows={5} />
                  </div>
                  <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg">
                    Envoyer
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Nos Coordonnées</h2>
                  <p className="text-muted-foreground mb-6">
                    Vous pouvez également nous joindre via les canaux suivants.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">E-mail</h4>
                    <p className="text-muted-foreground">support@bittravel.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Téléphone</h4>
                    <p className="text-muted-foreground">+229 90 00 00 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Adresse</h4>
                    <p className="text-muted-foreground">123 Rue de la Confiance, Cotonou, Bénin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
