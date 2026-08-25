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
  X,
  PlusCircle,
  Tag,
  Edit3,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  nameBn: string;
  type: 'product' | 'service';
  price: number;
  quantity: number;
  total: number;
  isCustom?: boolean;
}

export const POSCounter: React.FC = () => {
  const { language } = useLanguage();
  const { products, services, createInvoice } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'custom'>('services');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'nagad' | 'card'>('cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Custom Item Form States
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState<string>('');
  const [customItemQty, setCustomItemQty] = useState<number>(1);
  const [customItemType, setCustomItemType] = useState<'service' | 'product'>('service');

  // Quick custom item quick suggestions
  const customSuggestions = [
    { nameEn: 'Urgent Document Scan', nameBn: 'জরুরী ডকুমেন্ট স্ক্যান', price: 20, type: 'service' as const },
    { nameEn: 'Photo Background Change & Print', nameBn: 'ছবি ব্যাকগ্রাউন্ড চেঞ্জ ও প্রিন্ট', price: 60, type: 'service' as const },
    { nameEn: 'Official Typing & Format', nameBn: 'বাংলা/ইংরেজি কম্পোজ ও টাইপিং', price: 40, type: 'service' as const },
    { nameEn: 'Sticker / Glossy Paper Print', nameBn: 'স্টিকার / গ্লসি পেপার প্রিন্ট', price: 30, type: 'product' as const },
    { nameEn: 'Spiral Binding Charge', nameBn: 'স্পাইরাল বাইন্ডিং চার্জ', price: 50, type: 'service' as const },
    { nameEn: 'Online Form / Govt Fee Deposit', nameBn: 'অনলাইন ফি জমা চার্জ', price: 80, type: 'service' as const },
    { nameEn: 'PVC ID Card Print', nameBn: 'পিভিসি স্মার্ট আইডি কার্ড', price: 100, type: 'product' as const },
    { nameEn: 'Miscellaneous Service', nameBn: 'বিবিধ কম্পিউটার সেবা', price: 50, type: 'service' as const }
  ];

  // Quick service buttons for speed counter
  const quickPresets = [
    { nameBn: 'ফটোকপি (১ পাতা)', nameEn: 'Photocopy (1 Page)', price: 3, type: 'service' as const },
    { nameBn: 'প্রিন্ট সাদাকালো (১ পাতা)', nameEn: 'B/W Print (1 Page)', price: 5, type: 'service' as const },
    { nameBn: 'কালার প্রিন্ট (১ পাতা)', nameEn: 'Color Print (1 Page)', price: 15, type: 'service' as const },
    { nameBn: 'পাসপোর্ট ছবি (৪ কপি)', nameEn: 'Passport Photo (4 Pcs)', price: 50, type: 'service' as const },
    { nameBn: 'লেমিনেশন (A4)', nameEn: 'Lamination (A4)', price: 30, type: 'service' as const },
    { nameBn: 'অনলাইন আবেদন চার্জ', nameEn: 'Online Application Charge', price: 100, type: 'service' as const },
  ];

  const addToCart = (item: { name: string; nameBn?: string; price: number; type: 'product' | 'service'; id?: string; isCustom?: boolean; quantity?: number }) => {
    const qty = item.quantity || 1;
    setCartItems(prev => {
      // If it's not custom, find by matching name and price
      const existing = !item.isCustom ? prev.find(i => i.name === item.name && !i.isCustom) : null;
      if (existing) {
        return prev.map(i => i.name === item.name && !i.isCustom ? { ...i, quantity: i.quantity + qty, total: (i.quantity + qty) * i.price } : i);
      }
      return [
        ...prev,
        {
          id: item.id || `pos_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: item.name,
          nameBn: item.nameBn || item.name,
          type: item.type,
          price: item.price,
          quantity: qty,
          total: item.price * qty,
          isCustom: item.isCustom || false
        }
      ];
    });
  };

  const handleAddCustomItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = customItemName.trim() || (language === 'bn' ? 'কাস্টম সেবা / আইটেম' : 'Custom Item / Service');
    const price = parseFloat(customItemPrice) || 0;
    if (price <= 0) return;

    addToCart({
      name,
      nameBn: name,
      price,
      quantity: Math.max(1, customItemQty),
      type: customItemType,
      isCustom: true
    });

    // Reset inputs
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const nextQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: nextQty, total: nextQty * i.price };
      }
      return i;
    }));
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const price = Math.max(0, newPrice);
        return { ...i, price, total: i.quantity * price };
      }
      return i;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
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
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'পিওএস রিটেইল ক্যাশিয়ার কাউন্টার' : 'POS Retail Cashier Counter'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold uppercase">
                Terminal V2
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              {language === 'bn'
                ? 'ফটোকপি, প্রিন্টিং ল্যাব, অনলাইন আবেদন, কাগজ বিক্রয় ও যেকোনো কাস্টম আইটেম দ্রুত বিলিং'
                : 'Instant Billing for Photocopy, Print Lab, Applications, Paper Market & Custom Manual Items'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cashier: <strong className="text-emerald-400">{currentUser?.name || 'Admin'}</strong></span>
          </span>
        </div>
      </div>

      {/* POS Grid: Left catalog & Right Cart/Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (7 cols): Quick Buttons, Custom Item Input & Catalog */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. CUSTOM ITEM ENTRY BOX (প্রমিনেন্ট কাস্টম আইটেম বক্স) */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'কাস্টম আইটেম / সার্ভিস সরাসরি টাইপ করুন' : 'Write Custom Item / Manual Entry'}</span>
              </span>
              <span className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 font-mono">
                Press Enter to Add
              </span>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* Item Name */}
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'আইটেম বা সেবার নাম লিখুন (যেমন: জরুরী স্ক্যান, পাসপোর্ট ছবি...)' : 'Enter custom item or service name...'}
                    value={customItemName}
                    onChange={e => setCustomItemName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Price (৳) */}
                <div className="sm:col-span-3">
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-mono font-bold text-emerald-400">৳</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      placeholder="Rate / ৳"
                      value={customItemPrice}
                      onChange={e => setCustomItemPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-2 bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl text-xs font-mono font-bold text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Qty */}
                <div className="sm:col-span-3">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={customItemQty}
                    onChange={e => setCustomItemQty(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-700 focus:border-emerald-500 rounded-xl text-xs font-mono text-center text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Bottom Form Row: Type selector & Add Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Type buttons */}
                <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setCustomItemType('service')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      customItemType === 'service'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {language === 'bn' ? 'সেবা (Service)' : 'Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomItemType('product')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      customItemType === 'product'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {language === 'bn' ? 'পণ্য/কাগজ (Product)' : 'Product / Goods'}
                  </button>
                </div>

                {/* Add Custom Button */}
                <button
                  type="submit"
                  disabled={!customItemName.trim() || !customItemPrice}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'কার্টে আইটেম যোগ করুন (+)' : 'Add Custom Item (+) '}</span>
                </button>
              </div>

              {/* Quick Custom Click Tags */}
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[10px] text-neutral-400 block mb-1.5 font-semibold">
                  {language === 'bn' ? '⚡ সাধারণ কাস্টম কাজের দ্রুত বাটন:' : '⚡ Common Custom Tasks Shortcut:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {customSuggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setCustomItemName(language === 'bn' ? sug.nameBn : sug.nameEn);
                        setCustomItemPrice(sug.price.toString());
                        setCustomItemType(sug.type);
                      }}
                      className="px-2 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-[10px] text-neutral-300 hover:text-emerald-300 font-medium transition-all"
                    >
                      {language === 'bn' ? sug.nameBn : sug.nameEn} (৳{sug.price})
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Fast Quick-Presets (1-Click) */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              {language === 'bn' ? '১-ক্লিক ফাস্ট কাউন্টার প্রিসেট' : 'Quick Counter Presets (1-Click Add)'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => addToCart({ name: preset.nameEn, nameBn: preset.nameBn, price: preset.price, type: preset.type })}
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all active:scale-95 group"
                >
                  <span className="text-xs font-bold text-white block group-hover:text-emerald-400 truncate">
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'services'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? `সেবাসমূহ (${services.length})` : `Services (${services.length})`}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'products'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? `কাগজ ও পণ্য (${products.length})` : `Paper & Products (${products.length})`}
                </button>
              </div>
            </div>

            {/* Catalog Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {activeTab === 'services'
                ? services.map(s => (
                    <div
                      key={s.id}
                      onClick={() => addToCart({ id: s.id, name: s.name, nameBn: s.nameBn, price: s.price, type: 'service' })}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all active:scale-95 group"
                    >
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-2 group-hover:text-emerald-300">
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
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/40 cursor-pointer flex flex-col justify-between transition-all active:scale-95 group"
                    >
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-1 group-hover:text-emerald-300">
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
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 sticky top-6 shadow-2xl">
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

          {/* Cart Header */}
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800 text-xs">
            <span className="font-bold text-neutral-300 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'বিল আইটেম তালিকা' : 'Bill Items'} ({cartItems.length})</span>
            </span>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-rose-400 hover:underline"
              >
                {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs space-y-2">
                <Calculator className="w-8 h-8 mx-auto text-neutral-600 opacity-50" />
                <p>{language === 'bn' ? 'কোন আইটেম যোগ করা হয়নি। বামপাশের প্রিসেট বা কাস্টম আইটেম লিখুন।' : 'No items added yet. Click presets or write custom item on the left.'}</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs hover:border-neutral-700 transition-colors"
                >
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white block truncate">{item.name}</span>
                      {item.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono shrink-0">
                          Custom
                        </span>
                      )}
                    </div>
                    {/* Inline Rate Input */}
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-0.5">
                      <span>Rate: ৳</span>
                      <input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={e => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                        className="w-14 px-1 py-0.2 bg-neutral-900 border border-neutral-700 rounded font-mono text-emerald-400 text-[11px] focus:outline-none focus:border-emerald-500"
                        title="Click to adjust unit price"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                      title="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                      title="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="w-14 text-right font-mono font-bold text-emerald-400">৳{item.total}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['cash', 'bkash', 'nagad', 'card'] as const).map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    paymentMethod === pm
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
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
                className="w-20 px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-right text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
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
                className="w-24 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-right text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
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
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={clearCart}
              className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              {language === 'bn' ? 'কাউন্টার ক্লিয়ার' : 'Clear Counter'}
            </button>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleGenerateInvoice}
              className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 disabled:opacity-50 transition-all active:scale-95"
            >
              <Receipt className="w-4 h-4" />
              <span>{language === 'bn' ? `রশিদ প্রিন্ট (৳${total})` : `Print Bill (৳${total})`}</span>
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

