import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { User, Menu, PanelLeft, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <img src={logo} alt="bitTravel Logo" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Accueil
            </Link>
            <Link to="/search" className="text-sm font-medium transition-colors hover:text-primary">
              Rechercher des voyages
            </Link>
            <Link to="/my-bookings" className="text-sm font-medium transition-colors hover:text-primary">
              Mes Réservations
            </Link>
            <Link to="/agency/login" className="text-sm font-medium transition-colors hover:text-primary">
              Agence
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Conditional rendering based on login state */}
            {isLoggedIn ? (
              <>
                <Link to="/my-bookings">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button size="sm" className="bg-gradient-hero hover:opacity-90" onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-hero hover:opacity-90">
                    S'inscrire
                  </Button>
                </Link>
              </>
            )}
            
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                <div className="flex items-center gap-2 border-b pb-4 mb-4">
                  <PanelLeft className="h-6 w-6" />
                  <span className="text-lg font-semibold">Menu</span>
                </div>
                <nav className="flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link to="/" className="text-lg font-medium transition-colors hover:text-primary">
                      Accueil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/search" className="text-lg font-medium transition-colors hover:text-primary">
                      Rechercher des voyages
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/my-bookings" className="text-lg font-medium transition-colors hover:text-primary">
                      Mes Réservations
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/agency/login" className="text-lg font-medium transition-colors hover:text-primary">
                      Agence
                    </Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
