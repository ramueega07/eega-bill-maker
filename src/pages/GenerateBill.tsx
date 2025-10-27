import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/auth";
import { generateInvoiceNumber, type InvoiceItem } from "@/lib/storage";
import { toast } from "sonner";

const GenerateBill = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    invoiceNo: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    wayBillNo: "",
    transportMode: "",
    vehicleNumber: "",
    placeOfSupply: "",
    receiverName: "",
    receiverAddress: "",
    receiverGstin: "",
    receiverState: "",
    receiverCode: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeGstin: "",
    consigneeState: "",
    consigneeCode: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", hsnCode: "5208", price: 0, meters: 0, rate: 0, amount: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: "", hsnCode: "5208", price: 0, meters: 0, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate amount
    if (field === 'meters' || field === 'rate') {
      const meters = field === 'meters' ? Number(value) : newItems[index].meters;
      const rate = field === 'rate' ? Number(value) : newItems[index].rate;
      newItems[index].amount = meters * rate;
    }
    
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const cgst = subtotal * 0.025;
    const sgst = subtotal * 0.025;
    const igst = subtotal * 0.05;
    const grandTotal = subtotal + cgst + sgst;
    
    return { subtotal, cgst, sgst, igst, grandTotal };
  };

  const handlePreview = () => {
    // Validation
    if (!formData.receiverName || !formData.consigneeName) {
      toast.error("Please fill in receiver and consignee details");
      return;
    }
    
    if (items.some(item => !item.description || item.amount === 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    const totals = calculateTotals();
    const invoiceData = {
      ...formData,
      items,
      ...totals,
    };

    navigate("/invoice-review", { state: invoiceData });
  };

  const handleClear = () => {
    setFormData({
      invoiceNo: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      wayBillNo: "",
      transportMode: "",
      vehicleNumber: "",
      placeOfSupply: "",
      receiverName: "",
      receiverAddress: "",
      receiverGstin: "",
      receiverState: "",
      receiverCode: "",
      consigneeName: "",
      consigneeAddress: "",
      consigneeGstin: "",
      consigneeState: "",
      consigneeCode: "",
    });
    setItems([{ description: "", hsnCode: "5208", price: 0, meters: 0, rate: 0, amount: 0 }]);
    toast.success("Form cleared");
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-background">
      <Navbar showLogout showActions />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Generate New Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invoice Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Invoice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceNo">Invoice No.</Label>
                  <Input id="invoiceNo" value={formData.invoiceNo} disabled />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="wayBillNo">Way Bill / DC No.</Label>
                  <Input id="wayBillNo" value={formData.wayBillNo} onChange={(e) => setFormData({...formData, wayBillNo: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="transportMode">Transportation Mode</Label>
                  <Select value={formData.transportMode} onValueChange={(value) => setFormData({...formData, transportMode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Road">Road</SelectItem>
                      <SelectItem value="Air">Air</SelectItem>
                      <SelectItem value="Rail">Rail</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input id="vehicleNumber" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="placeOfSupply">Place of Supply</Label>
                  <Input id="placeOfSupply" value={formData.placeOfSupply} onChange={(e) => setFormData({...formData, placeOfSupply: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Receiver Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Details of Receiver / Billed To</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiverName">Name</Label>
                  <Input id="receiverName" value={formData.receiverName} onChange={(e) => setFormData({...formData, receiverName: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="receiverGstin">GSTIN</Label>
                  <Input id="receiverGstin" value={formData.receiverGstin} onChange={(e) => setFormData({...formData, receiverGstin: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="receiverAddress">Address</Label>
                  <Textarea id="receiverAddress" value={formData.receiverAddress} onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="receiverState">State</Label>
                  <Input id="receiverState" value={formData.receiverState} onChange={(e) => setFormData({...formData, receiverState: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="receiverCode">Code</Label>
                  <Input id="receiverCode" value={formData.receiverCode} onChange={(e) => setFormData({...formData, receiverCode: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Consignee Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Details of Consignee / Shipped To</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consigneeName">Name</Label>
                  <Input id="consigneeName" value={formData.consigneeName} onChange={(e) => setFormData({...formData, consigneeName: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="consigneeGstin">GSTIN</Label>
                  <Input id="consigneeGstin" value={formData.consigneeGstin} onChange={(e) => setFormData({...formData, consigneeGstin: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="consigneeAddress">Address</Label>
                  <Textarea id="consigneeAddress" value={formData.consigneeAddress} onChange={(e) => setFormData({...formData, consigneeAddress: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="consigneeState">State</Label>
                  <Input id="consigneeState" value={formData.consigneeState} onChange={(e) => setFormData({...formData, consigneeState: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="consigneeCode">Code</Label>
                  <Input id="consigneeCode" value={formData.consigneeCode} onChange={(e) => setFormData({...formData, consigneeCode: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Description of Goods</h3>
                <Button onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Input 
                            value={item.description} 
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>HSN Code</Label>
                          <Input 
                            value={item.hsnCode} 
                            onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Price/Meter</Label>
                          <Input 
                            type="number" 
                            value={item.price || ''} 
                            onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Meters</Label>
                          <Input 
                            type="number" 
                            value={item.meters || ''} 
                            onChange={(e) => updateItem(index, 'meters', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Rate</Label>
                          <Input 
                            type="number" 
                            value={item.rate || ''} 
                            onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Amount</Label>
                          <div className="flex gap-2">
                            <Input 
                              value={item.amount.toFixed(2)} 
                              disabled
                            />
                            {items.length > 1 && (
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-muted p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
                <div className="text-right font-semibold">Subtotal:</div>
                <div className="text-right">₹{totals.subtotal.toFixed(2)}</div>
                
                <div className="text-right font-semibold">CGST @ 2.5%:</div>
                <div className="text-right">₹{totals.cgst.toFixed(2)}</div>
                
                <div className="text-right font-semibold">SGST @ 2.5%:</div>
                <div className="text-right">₹{totals.sgst.toFixed(2)}</div>
                
                <div className="text-right font-semibold">IGST @ 5%:</div>
                <div className="text-right">₹{totals.igst.toFixed(2)}</div>
                
                <div className="text-right text-xl font-bold">GRAND TOTAL:</div>
                <div className="text-right text-xl font-bold">₹{totals.grandTotal.toFixed(2)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleClear} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear Form
              </Button>
              <Button onClick={handlePreview} className="gap-2">
                <Eye className="h-4 w-4" />
                Preview Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default GenerateBill;
