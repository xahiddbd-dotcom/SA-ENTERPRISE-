import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Product, Service, Invoice } from '../../types';
import {
  Calculator,
  Printer,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Receipt,
  User,
  CreditCard,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  nameBn: string;
  type: 'product' | 'service';
  price: number;
  quantity: number;
  total: number;
}

export const POSCounter: React.FC = () => {
  const { language } = useLanguage();
  const { products, services, createInvoice } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'card'>('cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Quick service buttons for speed counter
  const quickPresets = [
    { nameBn: 'ফটোকপি (১ পাতা)', nameEn: 'Photocopy (1 Page)', price: 3, type: 'service' as const },
    { nameBn: 'প্রিন্ট সাদাকালো (১ পাতা)', nameEn: 'B/W Print (1 Page)', price: 5, type: 'service' as const },
    { nameBn: 'কালার প্রিন্ট (১ পাতা)', nameEn: 'Color Print (1 Page)', price: 15, type: 'service' as const },
    { nameBn: 'পাসপোর্ট ছবি (৪ কপি)', nameEn: 'Passport Photo (4 Pcs)', price: 50, type: 'service' as const },
    { nameBn: 'লেমিনেশন (A4)', nameEn: 'Lamination (A4)', price: 30, type: 'service' as const },
    { nameBn: 'অনলাইন আবেদন চার্জ', nameEn: 'Online Application Charge', price: 100, type: 'service' as const },
  ];

  const addToCart = (item: { name: string; nameBn: string; price: number; type: 'product' | 'service'; id?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
      }
      return [
        ...prev,
        {
          id: item.id || `pos_${Date.now()}_${Math.random()}`,
          name: item.name,
          nameBn: item.nameBn,
          type: item.type,
          price: item.price,
          quantity: 1,
          total: item.price
        }
      ];
    });
  };

  const updateQuantity = (name: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.name === name) {
        const nextQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: nextQty, total: nextQty * i.price };
      }
      return i;
    }));
  };

  const removeItem = (name: string) => {
    setCartItems(prev => prev.filter(i => i.name !== name));
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setDiscountAmount(0);
    setPaidAmount('');
  };

  const subtotal = cartItems.reduce((s, i) => s + i.total, 0);
  const total = Math.max(0, subtotal - discountAmount);
  const numericPaid = paidAmount ? parseFloat(paidAmount) : total;
  const changeDue = Math.max(0, numericPaid - total);

  const handleGenerateInvoice = () => {
    if (cartItems.length === 0) return;

    const newInvoice = createInvoice({
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'Counter',
      items: cartItems.map(i => ({
        id: i.id,
        name: i.name,
        nameBn: i.nameBn,
        quantity: i.quantity,
        unitPrice: i.price,
        total: i.total
      })),
      subtotal,
      discount: discountAmount,
      tax: 0,
      total,
      paidAmount: numericPaid,
      dueAmount: Math.max(0, total - numericPaid),
      paymentMethod,
      paymentStatus: numericPaid >= total ? 'paid' : numericPaid > 0 ? 'partial' : 'unpaid',
      cashierId: currentUser?.id || 'admin',
      cashierName: currentUser?.name || 'Saiful Enterprise Admin',
      notes: 'Counter POS Transaction'
    });

    setActiveInvoice(newInvoice);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">POS Retail Cashier Counter</h1>
            <p className="text-xs text-neutral-400">
              Instant Billing for Photocopy, Print Lab, Applications & Paper Market
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
            Cashier: <strong className="text-emerald-400">{currentUser?.name || 'Admin'}</strong>
          </span>
        </div>
      </div>

      {/* POS Grid: Left catalog & Right Cart/Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (7 cols): Quick Buttons & Catalog */}
        <div className="lg:col-span-7 space-y-5">
          {/* Fast Quick-Presets */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Quick Counter Presets (1-Click Add)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => addToCart({ name: preset.nameEn, nameBn: preset.nameBn, price: preset.price, type: preset.type })}
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all active:scale-95 group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-400">
                    {language === 'bn' ? preset.nameBn : preset.nameEn}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-400">
                    ৳{preset.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Tab Selector */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'services'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  Services Catalog ({services.length})
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'products'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  Paper & Products ({products.length})
                </button>
              </div>
            </div>

            {/* Catalog Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {activeTab === 'services'
                ? services.map(s => (
                    <div
                      key={s.id}
                      onClick={() => addToCart({ id: s.id, name: s.name, nameBn: s.nameBn, price: s.price, type: 'service' })}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all active:scale-95"
                    >
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                        {language === 'bn' ? s.nameBn : s.name}
                      </h4>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        ৳{s.price}
                      </span>
                    </div>
                  ))
                : products.map(p => (
                    <div
                      key={p.id}
                      onClick={() => addToCart({ id: p.id, name: p.name, nameBn: p.nameBn, price: p.discountPrice || p.price, type: 'product' })}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all active:scale-95"
                    >
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">
                        {language === 'bn' ? p.nameBn : p.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">{p.gsm ? `${p.gsm} GSM` : 'Item'}</span>
                        <span className="font-mono font-bold text-emerald-400">৳{p.discountPrice || p.price}</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Active Cart & Checkout Panel */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
          {/* Customer Input */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <input
              type="text"
              id="pos-cust-name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <input
              type="tel"
              id="pos-cust-phone"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              placeholder="Phone (Optional)"
              className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 text-xs">
                No items added yet. Click presets or items on left.
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
                >
                  <div className="flex-1 truncate">
                    <span className="font-bold text-white block truncate">{item.name}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">৳{item.price} each</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-right font-mono font-bold text-emerald-400">৳{item.total}</span>
                    <button
                      onClick={() => removeItem(item.name)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Payment Method</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['cash', 'bkash', 'nagad', 'card'] as const).map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    paymentMethod === pm
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Totals & Calculations */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">৳{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-neutral-400">
              <span>Discount (৳):</span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-20 px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-right text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-between text-base font-extrabold text-emerald-400 pt-2 border-t border-neutral-800">
              <span>Net Total:</span>
              <span className="font-mono">৳{total}</span>
            </div>

            <div className="flex items-center justify-between text-neutral-400 pt-1">
              <span>Paid Amount:</span>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                placeholder={total.toString()}
                className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-right text-xs font-mono text-emerald-400 font-bold focus:outline-none"
              />
            </div>

            {numericPaid > total && (
              <div className="flex justify-between text-xs font-bold text-amber-400 pt-1">
                <span>Change to Return:</span>
                <span className="font-mono">৳{changeDue}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={clearCart}
              className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold"
            >
              Clear Counter
            </button>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleGenerateInvoice}
              className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 disabled:opacity-50"
            >
              <Receipt className="w-4 h-4" />
              <span>Print Bill (৳{total})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thermal Invoice Print Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">POS Invoice Ready</span>
              <button
                onClick={() => { setActiveInvoice(null); clearCart(); }}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Preview */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div id="thermal-receipt" className="bg-white text-black p-5 rounded-lg font-mono text-xs space-y-3 shadow-inner">
                <div className="text-center border-b border-dashed border-neutral-400 pb-3 space-y-0.5">
                  <h2 className="text-base font-extrabold">SAIFUL ENTERPRISE</h2>
                  <p className="text-[10px]">20/1 Sagar-Saikat Market, Indira Road, Farmgate</p>
                  <p className="text-[10px]">Beside Tejgaon College, Dhaka-1215</p>
                  <p className="text-[10px] font-bold">Mob: 01540004966 | 01517992585</p>
                </div>

                <div className="text-[11px] space-y-0.5 border-b border-dashed border-neutral-400 pb-2">
                  <div className="flex justify-between">
                    <span>Invoice: {activeInvoice.invoiceNumber}</span>
                    <span>{new Date(activeInvoice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer: {activeInvoice.customerName}</span>
                    <span>{activeInvoice.customerPhone}</span>
                  </div>
                  <div>Cashier: {activeInvoice.cashierName}</div>
                </div>

                {/* Items */}
                <div className="space-y-1 border-b border-dashed border-neutral-400 pb-2">
                  <div className="flex justify-between font-bold text-[10px] border-b pb-1">
                    <span>Item</span>
                    <span>Qty x Rate</span>
                    <span>Total</span>
                  </div>
                  {activeInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[10px]">
                      <span className="truncate max-w-[140px]">{item.name}</span>
                      <span>{item.quantity} x {item.unitPrice}</span>
                      <span>৳{item.total}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-[11px] border-b border-dashed border-neutral-400 pb-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳{activeInvoice.subtotal}</span>
                  </div>
                  {activeInvoice.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount:</span>
                      <span>-৳{activeInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm">
                    <span>Grand Total:</span>
                    <span>৳{activeInvoice.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid ({activeInvoice.paymentMethod.toUpperCase()}):</span>
                    <span>৳{activeInvoice.paidAmount}</span>
                  </div>
                  {activeInvoice.dueAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>Due:</span>
                      <span>৳{activeInvoice.dueAmount}</span>
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] pt-1 space-y-0.5">
                  <p>*** ধন্যবাদ, আবার আসবেন ***</p>
                  <p>Developed with Saiful Enterprise Management System</p>
                </div>
              </div>

              {/* Print Action */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={printReceipt}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => { setActiveInvoice(null); clearCart(); }}
                  className="px-5 py-3 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700"
                >
                  New Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
