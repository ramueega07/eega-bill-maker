import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Printer, Download, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/auth";
import { getInvoices, searchInvoices, filterInvoicesByDate, type Invoice } from "@/lib/storage";
import { generatePDF } from "@/lib/pdf";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { toast } from "sonner";

const DownloadBills = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    invoiceNo: "",
    customerName: "",
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      (async () => {
        const allInvoices = await getInvoices();
        setInvoices(allInvoices);
        setFilteredInvoices(allInvoices);
      })();
    }
  }, [navigate]);

  const handleFilter = async () => {
    let results: Invoice[] = [];

    if (filters.fromDate && filters.toDate) {
      results = await filterInvoicesByDate(filters.fromDate, filters.toDate);
    } else if (filters.invoiceNo || filters.customerName) {
      const query = filters.invoiceNo || filters.customerName;
      results = await searchInvoices(query);
    } else {
      results = await getInvoices();
    }

    // Additional client-side refine if both invoiceNo and customerName provided
    if (filters.invoiceNo) {
      results = results.filter(inv => inv.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase()));
    }
    if (filters.customerName) {
      const q = filters.customerName.toLowerCase();
      results = results.filter(inv => inv.receiver.name.toLowerCase().includes(q) || inv.consignee.name.toLowerCase().includes(q));
    }

    setFilteredInvoices(results);
    toast.success(`Found ${results.length} invoice(s)`);
  };

  const handleView = (invoice: Invoice) => {
    navigate("/invoice-review", { state: invoice });
  };

  const handlePrint = (invoice: Invoice) => {
    navigate("/invoice-review", { state: invoice });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      // Create a temporary hidden container for the invoice template
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.background = 'white';
      document.body.appendChild(tempContainer);

      // Create the invoice template div
      const invoiceDiv = document.createElement('div');
      invoiceDiv.id = 'invoice-template';
      tempContainer.appendChild(invoiceDiv);

      // Render the InvoiceTemplate component using React
      const reactRoot = createRoot(invoiceDiv);
      reactRoot.render(
        <StrictMode>
          <InvoiceTemplate invoice={invoice} />
        </StrictMode>
      );

      // Wait for rendering to complete (images, fonts, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate PDF
      await generatePDF('invoice-template', `${invoice.invoiceNo}.pdf`);
      
      // Cleanup
      setTimeout(() => {
        reactRoot.unmount();
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      }, 100);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showLogout />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Invoice Records</h1>

        {/* Filters */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Search & Filter Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="invoiceNo">Invoice Number</Label>
                <Input
                  id="invoiceNo"
                  placeholder="Search by invoice no..."
                  value={filters.invoiceNo}
                  onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Search by customer..."
                  value={filters.customerName}
                  onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleFilter} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Results ({filteredInvoices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found. Try adjusting your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead className="text-right">Grand Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.invoiceNo}>
                        <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString('en-IN')}</TableCell>
                        <TableCell>{invoice.receiver.name}</TableCell>
                        <TableCell className="text-right">₹{invoice.grandTotal.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(invoice)}
                              className="gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrint(invoice)}
                              className="gap-1"
                            >
                              <Printer className="h-3 w-3" />
                              Print
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(invoice)}
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DownloadBills;
