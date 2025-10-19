import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MyBookings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Mes Réservations</h1>
        <div className="bg-card p-6 rounded-lg shadow-card">
          <p className="text-muted-foreground">
            Vos réservations seront affichées ici une fois que vous serez connecté et que vous aurez effectué des réservations.
          </p>
          {/* Le contenu dynamique des réservations sera chargé depuis l'API ici */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
