import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { User, Menu, PanelLeft, LogOut, Ticket, UserCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth(); // Get user object

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
            {isLoggedIn && user?.role === 'client' && ( // Only show for logged-in clients
              <Link to="/my-bookings" className="text-sm font-medium transition-colors hover:text-primary">
                Mes Réservations
              </Link>
            )}
            {!isLoggedIn && ( // Only show if not logged in
              <Link to="/agency/login" className="text-sm font-medium transition-colors hover:text-primary">
                Agence
              </Link>
            )}
            {isLoggedIn && user?.role === 'agency' && ( // Show agency dashboard link for logged-in agencies
              <Link to="/agency/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Tableau de Bord Agence
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Conditional rendering based on login state */}
            {isLoggedIn ? (
              <>
                {user?.role === 'client' ? (
                  <>
                    <Link to="/my-bookings" className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                      <Ticket className="h-4 w-4" />
                      <span className="hidden lg:inline">Mes Réservations</span>
                    </Link>
                    <Link to="/profile" className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                      <UserCircle className="h-4 w-4" />
                      <span className="hidden lg:inline">Profil</span>
                    </Link>
                    <Link to="/my-bookings">
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Ticket className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button size="sm" className="bg-gradient-hero hover:opacity-90" onClick={logout}>
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
                  {isLoggedIn && user?.role === 'client' && (
                    <>
                      <SheetClose asChild>
                        <Link to="/my-bookings" className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2">
                          <Ticket className="h-5 w-5" />
                          Mes Réservations
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="text-lg font-medium transition-colors hover:text-primary flex items-center gap-2">
                          <UserCircle className="h-5 w-5" />
                          Profil
                        </Link>
                      </SheetClose>
                    </>
                  )}
                  {!isLoggedIn && (
                    <SheetClose asChild>
                      <Link to="/agency/login" className="text-lg font-medium transition-colors hover:text-primary">
                        Agence
                      </Link>
                    </SheetClose>
                  )}
                  {isLoggedIn && user?.role === 'agency' && (
                    <SheetClose asChild>
                      <Link to="/agency/dashboard" className="text-lg font-medium transition-colors hover:text-primary">
                        Tableau de Bord Agence
                      </Link>
                    </SheetClose>
                  )}
                  {isLoggedIn && (
                    <SheetClose asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start mt-4"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                      </Button>
                    </SheetClose>
                  )}
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