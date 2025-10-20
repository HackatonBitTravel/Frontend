import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

const Header = () => {
  const { agencyName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/scanner" className="flex items-center gap-2">
            <img src="/logo1.png" className="h-10 w-10" />
            {agencyName && (
              <span className="font-semibold text-lg">{agencyName}</span>
            )}
          </Link>

          {agencyName && (
            <Button variant="ghost" onClick={handleLogout}>Déconnexion</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;