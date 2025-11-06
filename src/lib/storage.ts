// Local storage utilities for invoice management

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  pieces: number;
  meters: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  invoiceNo: string;
  date: string;
  wayBillNo: string;
  transportMode: string;
  vehicleNumber: string;
  placeOfSupply: string;
  receiver: {
    name: string;
    address: string;
    gstin: string;
    state: string;
    code: string;
  };
  consignee: {
    name: string;
    address: string;
    gstin: string;
    state: string;
    code: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
  amountInWords: string;
}

const API_BASE = 'http://localhost:3001/api';

export const getInvoices = async (): Promise<Invoice[]> => {
  const res = await fetch(`${API_BASE}/invoices`);
  if (!res.ok) return [];
  return await res.json();
};

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  await fetch(`${API_BASE}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
};

export const getInvoiceByNumber = async (invoiceNo: string): Promise<Invoice | undefined> => {
  const res = await fetch(`${API_BASE}/invoices/${invoiceNo}`);
  if (!res.ok) return undefined;
  return await res.json();
};

export const searchInvoices = async (query: string): Promise<Invoice[]> => {
  const params = new URLSearchParams({ customerName: query, invoiceNo: query });
  const res = await fetch(`${API_BASE}/invoices?${params.toString()}`);
  if (!res.ok) return [];
  return await res.json();
};

export const filterInvoicesByDate = async (fromDate: string, toDate: string): Promise<Invoice[]> => {
  const params = new URLSearchParams({ fromDate, toDate });
  const res = await fetch(`${API_BASE}/invoices?${params.toString()}`);
  if (!res.ok) return [];
  return await res.json();
};

export const generateInvoiceNumber = async (): Promise<string> => {
  const today = new Date();
  // Format date as YYYYMMDD (no hyphens) for the invoice number format
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Send date in ISO format (YYYY-MM-DD) to backend for sequencing
  const isoDateStr = today.toISOString().split('T')[0];
  const res = await fetch(`${API_BASE}/next-invoice?date=${isoDateStr}`);
  
  if (!res.ok) {
    // Fallback: use date format YYYYMMDD with sequence 001
    return `INV${dateStr}-001`;
  }
  
  const data = await res.json();
  // If backend returns invoice number, use it directly
  if (data.invoiceNo) {
    return data.invoiceNo as string;
  }
  
  // If backend returns sequence number only, format it
  if (data.sequence !== undefined) {
    const sequence = String(data.sequence).padStart(3, '0');
    return `INV${dateStr}-${sequence}`;
  }
  
  // Final fallback
  return `INV${dateStr}-001`;
};
