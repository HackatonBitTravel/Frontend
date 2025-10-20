import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building, Target, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos de bitTravel</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Révolutionner le voyage en bus en Afrique grâce à une technologie simple, sécurisée et accessible à tous.
            </p>
          </div>
        </section>

        {/* Mission/Vision Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
                <p className="text-muted-foreground mb-6">
                  Notre mission est de connecter les villes et les communautés africaines en offrant une plateforme de réservation de bus fiable et facile à utiliser. Nous nous engageons à fournir des options de paiement sécurisées, y compris des solutions innovantes comme le Bitcoin Lightning Network, pour rendre le voyage plus accessible que jamais.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero text-white">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Connecter l'Afrique</h4>
                      <p className="text-sm text-muted-foreground">Faciliter les déplacements entre les villes pour le commerce, la famille et le tourisme.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-hero text-white">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Technologie Accessible</h4>
                      <p className="text-sm text-muted-foreground">Utiliser la technologie pour simplifier le processus de réservation et de paiement.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-elevated">
                  <img src="/placeholder.svg" alt="African landscape" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Notre Équipe</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Les passionnés qui rendent tout cela possible.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-hero mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Users className="h-16 w-16 text-white/80" />
                  </div>
                  <h4 className="font-semibold">Nom du Membre</h4>
                  <p className="text-sm text-muted-foreground">Rôle</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
