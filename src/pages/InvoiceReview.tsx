import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { isAuthenticated } from "@/lib/auth";
import { saveInvoice, type Invoice } from "@/lib/storage";
import { generatePDF, printInvoice } from "@/lib/pdf";
import { toast } from "sonner";
import { toWords } from "number-to-words";

const InvoiceReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const invoiceData = location.state;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
    if (!invoiceData) {
      navigate("/generate-bill");
    }
  }, [navigate, invoiceData]);

  if (!invoiceData) return null;

  const invoice: Invoice = {
    invoiceNo: invoiceData.invoiceNo,
    date: invoiceData.date,
    wayBillNo: invoiceData.wayBillNo,
    transportMode: invoiceData.transportMode,
    vehicleNumber: invoiceData.vehicleNumber,
    placeOfSupply: invoiceData.placeOfSupply,
    receiver: {
      name: invoiceData.receiverName,
      address: invoiceData.receiverAddress,
      gstin: invoiceData.receiverGstin,
      state: invoiceData.receiverState,
      code: invoiceData.receiverCode,
    },
    consignee: {
      name: invoiceData.consigneeName,
      address: invoiceData.consigneeAddress,
      gstin: invoiceData.consigneeGstin,
      state: invoiceData.consigneeState,
      code: invoiceData.consigneeCode,
    },
    items: invoiceData.items,
    subtotal: invoiceData.subtotal,
    cgst: invoiceData.cgst,
    sgst: invoiceData.sgst,
    igst: invoiceData.igst,
    grandTotal: invoiceData.grandTotal,
    amountInWords: toWords(Math.floor(invoiceData.grandTotal)).toUpperCase() + " RUPEES ONLY",
  };

  const handleSaveAndPrint = () => {
    saveInvoice(invoice);
    toast.success("Invoice saved successfully!");
    setTimeout(() => {
      printInvoice();
    }, 500);
  };

  const handleDownloadPDF = async () => {
    await generatePDF('invoice-template', `${invoice.invoiceNo}.pdf`);
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showLogout showActions />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Invoice Preview</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/generate-bill")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Edit Details
            </Button>
            <Button variant="default" onClick={handleSaveAndPrint} className="gap-2 bg-primary">
              <Save className="h-4 w-4" />
              <Printer className="h-4 w-4" />
              Submit & Print
            </Button>
            <Button variant="default" onClick={handleDownloadPDF} className="gap-2 bg-accent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-lg p-8 print-wrapper">
          <InvoiceTemplate invoice={invoice} />
        </div>
      </main>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 4mm;
          }
          html, body { margin: 0; padding: 0; }
          body * {
            visibility: hidden;
          }
          #invoice-template, #invoice-template * {
            visibility: visible;
          }
          #invoice-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            transform: scale(0.965);
            transform-origin: top left;
          }
          .print-wrapper {
            padding: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceReview;
