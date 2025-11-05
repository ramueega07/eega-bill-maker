import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import logo from "@/assets/logo.png";
import heroIllustration from "@/assets/hero-illustration.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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
              <Button
                onClick={() => navigate("/login")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Bill
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-secondary hover:bg-white/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Bills
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-5xl font-bold text-foreground">
              Welcome to Ramakrishna Fabrics Invoice Portal
            </h2>
            <p className="text-xl text-muted-foreground">
              Generate, manage, and print your invoices effortlessly.
            </p>
          </div>

          <img 
            src={heroIllustration} 
            alt="Invoice Management Illustration" 
            className="w-full max-w-2xl rounded-2xl shadow-2xl"
          />

          <div className="flex gap-4 mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
            >
              <FileText className="mr-2 h-5 w-5" />
              Generate Bill
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-white text-secondary hover:bg-white/90 text-lg px-8 py-6"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Bills
            </Button>
          </div>

          {/* Business Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="bg-card p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">
                #6-6-56/1, Geetha Nagar<br />
                Sircilla - 505 301<br />
                Dist: Rajanna Sircilla (T.S.)
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Phone: 9440915624<br />
                Phone: 7382562207<br />
                GSTIN: 36AAQPE5740B12X
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-lg mb-2">Bank Details</h3>
              <p className="text-sm text-muted-foreground">
                SBI Bank<br />
                A/C: 30825662679<br />
                IFSC: SBIN0012903
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
