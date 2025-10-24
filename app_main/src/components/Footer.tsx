import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const Footer = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="bitTravel Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre plateforme de confiance pour réserver des billets de bus à travers l'Afrique.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
                <li><Link to="/search" className="text-muted-foreground hover:text-primary">Rechercher</Link></li>
                {isLoggedIn && user?.role === 'client' && (
                  <li><Link to="/my-bookings" className="text-muted-foreground hover:text-primary">Mes Réservations</Link></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">À Propos</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                {!isLoggedIn ? (
                  <li><Link to="/agency/login" className="text-muted-foreground hover:text-primary">Portail Agence</Link></li>
                ) : user?.role === 'agency' ? (
                  <li><Link to="/agency/dashboard" className="text-muted-foreground hover:text-primary">Tableau de Bord</Link></li>
                ) : null}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Termes & Conditions</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Politique de Confidentialité</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white bg-orange-500 px-4 py-2 rounded-md">
            © {new Date().getFullYear()} bitTravel. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;