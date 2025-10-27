// Local storage utilities for invoice management

export interface InvoiceItem {
  description: string;
  hsnCode: string;
  price: number;
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

const STORAGE_KEY = 'ramakrishna_invoices';
const COUNTER_KEY = 'invoice_counter';

export const getInvoices = (): Invoice[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
};

export const getInvoiceByNumber = (invoiceNo: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find(inv => inv.invoiceNo === invoiceNo);
};

export const searchInvoices = (query: string): Invoice[] => {
  const invoices = getInvoices();
  const lowerQuery = query.toLowerCase();
  return invoices.filter(inv => 
    inv.invoiceNo.toLowerCase().includes(lowerQuery) ||
    inv.receiver.name.toLowerCase().includes(lowerQuery) ||
    inv.consignee.name.toLowerCase().includes(lowerQuery)
  );
};

export const filterInvoicesByDate = (fromDate: string, toDate: string): Invoice[] => {
  const invoices = getInvoices();
  return invoices.filter(inv => {
    const invDate = new Date(inv.date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return invDate >= from && invDate <= to;
  });
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
