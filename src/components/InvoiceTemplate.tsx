import { Invoice } from "@/lib/storage";
import { toWords } from "number-to-words";

interface InvoiceTemplateProps {
  invoice: Invoice;
}

const InvoiceTemplate = ({ invoice }: InvoiceTemplateProps) => {
  const amountInWords = toWords(Math.floor(invoice.grandTotal)).toUpperCase() + " RUPEES ONLY";

  return (
    <div id="invoice-template" className="bg-white p-8 max-w-[210mm] mx-auto relative print:p-0">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[200px] font-bold text-muted rotate-[-45deg]">Eega</span>
      </div>

      {/* Header */}
      <div className="border-2 border-black">
        {/* Top Section */}
        <div className="border-b-2 border-black p-4 text-center">
          <div className="text-sm mb-1">TAX INVOICE</div>
          <div className="flex justify-between items-start">
            <div className="text-xs">Cell: 9440915624, 7382562207</div>
          </div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#DC143C' }}>
            RAMAKRISHNA FABRICS
          </h1>
          <div className="text-base font-semibold mb-2">DYED CASEMENT GREY CLOTH MANUFACTURERS</div>
          <div className="text-sm">
            #6-6-56/1, Geetha nagar, <strong>SIRCILLA - 505 301</strong>, Dist: Rajanna Sircilla. (T.S.)
          </div>
          <div className="text-sm mt-1">
            <strong style={{ color: '#DC143C' }}>GSTIN: 36AAQPE5740B12X</strong>
            <span className="float-right">Prop: Eega Balaji</span>
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black">
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-2 text-sm border-r border-black">
                <strong>Invoice No.</strong>
              </div>
              <div className="p-2 text-sm">{invoice.invoiceNo}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-2 text-sm border-r border-black">
                <strong>Way bill No. / DC No.</strong>
              </div>
              <div className="p-2 text-sm">{invoice.wayBillNo}</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="p-2 text-sm border-r border-black">
                <strong>State</strong>
              </div>
              <div className="p-2 text-sm border-r border-black">Telangana</div>
              <div className="p-2 text-sm">
                <strong>Code:</strong> 36
              </div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-2 text-sm border-r border-black">
                <strong>Date:</strong>
              </div>
              <div className="p-2 text-sm">{new Date(invoice.date).toLocaleDateString('en-IN')}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-2 text-sm border-r border-black">
                <strong>Transportation Mode</strong>
              </div>
              <div className="p-2 text-sm">{invoice.transportMode}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-2 text-sm border-r border-black">
                <strong>Vehicle Number</strong>
              </div>
              <div className="p-2 text-sm">{invoice.vehicleNumber}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-2 text-sm border-r border-black">
                <strong>Date of Supply</strong>
              </div>
              <div className="p-2 text-sm">{new Date(invoice.date).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Receiver and Consignee */}
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-3">
            <div className="font-semibold mb-2">Details of Receiver / Billed to:</div>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {invoice.receiver.name}</div>
              <div><strong>Address:</strong> {invoice.receiver.address}</div>
              <div><strong>GSTIN:</strong> {invoice.receiver.gstin}</div>
              <div className="flex justify-between">
                <span><strong>State:</strong> {invoice.receiver.state}</span>
                <span><strong>Code:</strong> {invoice.receiver.code}</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="font-semibold mb-2">Details of Consignee / Shipped to:</div>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {invoice.consignee.name}</div>
              <div><strong>Address:</strong> {invoice.consignee.address}</div>
              <div><strong>GSTIN:</strong> {invoice.consignee.gstin}</div>
              <div className="flex justify-between">
                <span><strong>State:</strong> {invoice.consignee.state}</span>
                <span><strong>Code:</strong> {invoice.consignee.code}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-2 text-left">S.No</th>
                <th className="border-r border-black p-2 text-left">Description of Goods</th>
                <th className="border-r border-black p-2 text-center">HSN Code</th>
                <th className="border-r border-black p-2 text-right">Price</th>
                <th className="border-r border-black p-2 text-right">Meters</th>
                <th className="border-r border-black p-2 text-right">Rate</th>
                <th className="p-2 text-right">Amount Rs</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="border-r border-black p-2">{index + 1}</td>
                  <td className="border-r border-black p-2">{item.description}</td>
                  <td className="border-r border-black p-2 text-center">{item.hsnCode}</td>
                  <td className="border-r border-black p-2 text-right">{item.price.toFixed(2)}</td>
                  <td className="border-r border-black p-2 text-right">{item.meters}</td>
                  <td className="border-r border-black p-2 text-right">{item.rate.toFixed(2)}</td>
                  <td className="p-2 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              {[...Array(Math.max(0, 5 - invoice.items.length))].map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-black">
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="border-r border-black p-2">&nbsp;</td>
                  <td className="p-2">&nbsp;</td>
                </tr>
              ))}
              <tr className="border-b border-black font-bold">
                <td colSpan={6} className="border-r border-black p-2 text-center">TOTAL</td>
                <td className="p-2 text-right">{invoice.subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2">
          <div className="border-r border-black p-3">
            <div className="mb-4">
              <strong>Total Invoice Amount in Words:</strong>
              <div className="mt-1">{amountInWords}</div>
            </div>
            <div className="mt-8 pt-4 border-t border-black">
              <div className="font-semibold">Bank Details: SBI BANK</div>
              <div className="text-sm">A/C No. 30825662679, IFSC Code SBIN0012903</div>
              <div className="text-sm mt-2">Branch: SIRCILLA, Dist.: Rajanna Sircilla</div>
            </div>
            <div className="mt-4 text-xs">
              GST Payable on reserve charge Rs...........................
            </div>
          </div>
          <div className="p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold">ADD: CGST @ 2.5%</td>
                  <td className="p-2 text-right">{invoice.cgst.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold">ADD: SGST @ 2.5%</td>
                  <td className="p-2 text-right">{invoice.sgst.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold">ADD: IGST @ 5%</td>
                  <td className="p-2 text-right">{invoice.igst.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-black font-bold">
                  <td className="p-2">GRAND TOTAL</td>
                  <td className="p-2 text-right">{invoice.grandTotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-2 text-right" style={{ color: '#DC143C' }}>
                    <strong>For: RAMAKRISHNA FABRICS</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-8 text-right">
                    <div className="mt-4">Authorised Signatory</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
