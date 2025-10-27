import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import logo from "@/assets/logo.png";

interface NavbarProps {
  showLogout?: boolean;
  showActions?: boolean;
}

const Navbar = ({ showLogout = false, showActions = false }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Ramakrishna Fabrics Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold">Ramakrishna Fabrics</h1>
              <p className="text-sm opacity-90">Dyed Casement Grey Cloth Manufacturers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showActions && (
              <Button
                variant="outline"
                onClick={() => navigate("/download-bills")}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Download Bills
              </Button>
            )}
            {showLogout && (
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
