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
                onClick={() => navigate("/download-bills")}
                className="bg-white text-secondary hover:bg-white/90 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/></svg>
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
