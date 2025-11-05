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

const COUNTER_KEY = 'invoice_counter';
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

export const generateInvoiceNumber = (): string => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  const counter = getCounter();
  const paddedCounter = String(counter).padStart(3, '0');
  incrementCounter();
  return `INV${dateStr}-${paddedCounter}`;
};

const getCounter = (): number => {
  const counter = localStorage.getItem(COUNTER_KEY);
  return counter ? parseInt(counter) : 1;
};

const incrementCounter = (): void => {
  const counter = getCounter();
  localStorage.setItem(COUNTER_KEY, String(counter + 1));
};

export const resetCounter = (): void => {
  localStorage.setItem(COUNTER_KEY, '1');
};
