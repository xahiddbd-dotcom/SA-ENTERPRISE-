import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  StampItemConfig,
  StampSaleRecord,
  StampStockPurchase,
  Language
} from '../../types';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Package,
  Plus,
  Search,
  Download,
  Printer,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Sliders,
  X,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { StampSettingsModal } from './stamp/StampSettingsModal';
import { StampPrintableReportModal } from './stamp/StampPrintableReportModal';

interface JudicialStampRegisterProps {
  lang: Language;
}

export const JudicialStampRegister: React.FC<JudicialStampRegisterProps> = ({ lang }) => {
  const {
    settings,
    stampConfigs,
    stampSales,
    stampPurchases,
    recordStampSale,
    updateStampSale,
    deleteStampSale,
    recordStampPurchase,
    deleteStampPurchase,
    updateStampConfig,
    addStampConfig,
    deleteStampConfig
  } = useData();

  // Customer Privacy Mode: hides purchase cost and profits in counter/customer view
  const [customerPrivacyMode, setCustomerPrivacyMode] = useState<boolean>(true);
  const [showProfitValues, setShowProfitValues] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'sales' | 'stock' | 'purchases' | 'pricing'>('sales');

  // Date Filter: 'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom'
  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customEndDate, setCustomEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Search & Item filter
  const [searchQuery, setSearchQuery] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState<string>('all');

  // Modals
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isAddPurchaseOpen, setIsAddPurchaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<StampSaleRecord | null>(null);
  const [selectedSaleForMemo, setSelectedSaleForMemo] = useState<StampSaleRecord | null>(null);

  // Helper for Bengali Month and Date
  const getMonthAndDateBn = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const mIndex = d.getMonth();
    const year = d.getFullYear();
    const day = d.getDate();
    return {
      monthBn: `${monthsBn[mIndex]} ${year}`,
      dateBn: `${day} ${monthsBn[mIndex]}, ${year}`,
      monthEn: `${monthsEn[mIndex]} ${year}`,
      dateEn: d.toLocaleDateString('en-GB')
    };
  };

  // Dynamic initial config reference
  const initialConfig = stampConfigs.find(c => c.id === 'stamp_100') || stampConfigs[0];

  // New Sale Form State
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    itemType: initialConfig?.id || 'stamp_100',
    quantity: 1,
    buyPricePerUnit: initialConfig?.defaultBuyPrice ?? 105,
    salePricePerUnit: initialConfig?.defaultSalePrice ?? 120,
    serialNumbers: '',
    deedType: 'দোকান ভাড়ানামা চুক্তিপত্র',
    customerName: '',
    customerPhone: '',
    advocateOrVendor: '',
    paymentMethod: 'cash' as 'cash' | 'bkash' | 'nagad' | 'bank' | 'due',
    operatorName: 'সাইফুল ইসলাম (Saiful Islam)',
    notes: '',
    syncToLedger: true
  });

  // Stock Purchase Form State
  const [purchaseForm, setPurchaseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    itemType: initialConfig?.id || 'stamp_100',
    quantity: 50,
    buyPricePerUnit: initialConfig?.defaultBuyPrice ?? 105,
    vendorSource: 'ডিস্ট্রিক্ট ট্রেজারি ভেন্ডার পয়েন্ট',
    serialRange: '',
    paidBy: 'Saiful Islam',
    note: ''
  });

  // Today string
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }, []);

  // Filtered Sales Logic
  const filteredSales = useMemo(() => {
    return stampSales.filter(sale => {
      // Date filter
      if (dateFilter === 'today' && sale.date !== todayStr) return false;
      if (dateFilter === 'yesterday' && sale.date !== yesterdayStr) return false;
      if (dateFilter === 'week') {
        const saleDate = new Date(sale.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (saleDate < weekAgo) return false;
      }
      if (dateFilter === 'month') {
        const saleDate = new Date(sale.date);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        if (saleDate < monthAgo) return false;
      }
      if (dateFilter === 'custom') {
        if (sale.date < customStartDate || sale.date > customEndDate) return false;
      }

      // Item type filter
      if (itemTypeFilter !== 'all' && sale.itemType !== itemTypeFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = sale.itemNameBn?.toLowerCase().includes(q) || sale.itemName?.toLowerCase().includes(q);
        const matchCustomer = sale.customerName?.toLowerCase().includes(q) || sale.customerPhone?.includes(q);
        const matchSerial = sale.serialNumbers?.toLowerCase().includes(q);
        const matchDeed = sale.deedType?.toLowerCase().includes(q);
        if (!matchName && !matchCustomer && !matchSerial && !matchDeed) return false;
      }

      return true;
    });
  }, [stampSales, dateFilter, todayStr, yesterdayStr, customStartDate, customEndDate, itemTypeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalSalesAmount = filteredSales.reduce((sum, s) => sum + (s.totalSaleAmount || 0), 0);
    const totalBuyCost = filteredSales.reduce((sum, s) => sum + (s.totalBuyCost || 0), 0);
    const totalProfit = filteredSales.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    const totalQuantity = filteredSales.reduce((sum, s) => sum + (s.quantity || 0), 0);

    // Group by item
    const stamp50Count = filteredSales.filter(s => s.itemType === 'stamp_50').reduce((sum, s) => sum + s.quantity, 0);
    const stamp100Count = filteredSales.filter(s => s.itemType === 'stamp_100').reduce((sum, s) => sum + s.quantity, 0);
    const cartridgeCount = filteredSales.filter(s => s.itemType === 'cartridge_paper').reduce((sum, s) => sum + s.quantity, 0);
    const otherCount = filteredSales.filter(s => !['stamp_50', 'stamp_100', 'cartridge_paper'].includes(s.itemType)).reduce((sum, s) => sum + s.quantity, 0);

    // Current stock totals
    const totalCurrentStock = stampConfigs.reduce((sum, c) => sum + (c.currentStock || 0), 0);
    const totalStockValue = stampConfigs.reduce((sum, c) => sum + ((c.currentStock || 0) * (c.defaultBuyPrice || 0)), 0);

    return {
      totalSalesAmount,
      totalBuyCost,
      totalProfit,
      totalQuantity,
      stamp50Count,
      stamp100Count,
      cartridgeCount,
      otherCount,
      totalCurrentStock,
      totalStockValue
    };
  }, [filteredSales, stampConfigs]);

  // Total stock purchases cost from Treasury / Vendor
  const totalStockPurchasesCost = useMemo(() => {
    return stampPurchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  }, [stampPurchases]);

  // Dynamic price references for core stamps and cartridge paper
  const stamp50Config = stampConfigs.find(c => c.id === 'stamp_50');
  const stamp100Config = stampConfigs.find(c => c.id === 'stamp_100');
  const cartConfig = stampConfigs.find(c => c.id === 'cartridge_paper');

  const stamp50SalePrice = stamp50Config?.defaultSalePrice ?? 70;
  const stamp50BuyPrice = stamp50Config?.defaultBuyPrice ?? 55;
  const stamp50Profit = stamp50SalePrice - stamp50BuyPrice;

  const stamp100SalePrice = stamp100Config?.defaultSalePrice ?? 120;
  const stamp100BuyPrice = stamp100Config?.defaultBuyPrice ?? 105;
  const stamp100Profit = stamp100SalePrice - stamp100BuyPrice;

  const cartSalePrice = cartConfig?.defaultSalePrice ?? 10;
  const cartBuyPrice = cartConfig?.defaultBuyPrice ?? 5;
  const cartProfit = cartSalePrice - cartBuyPrice;

  // Open New Sale Modal with the latest config prices and stock
  const openNewSaleModal = (preselectedItemId?: string) => {
    setEditingSale(null);
    const targetId = preselectedItemId || saleForm.itemType || stampConfigs[0]?.id || 'stamp_100';
    const config = stampConfigs.find(c => c.id === targetId) || stampConfigs[0];
    const defaultDeed =
      config?.id === 'cartridge_paper'
        ? 'কার্টিজ লিগ্যাল পেপার'
        : config?.id === 'stamp_50'
        ? 'হলফনামা / অঙ্গীকারনামা'
        : 'দোকান ভাড়ানামা চুক্তিপত্র';

    setSaleForm({
      date: todayStr,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      itemType: config?.id || 'stamp_100',
      quantity: 1,
      buyPricePerUnit: config?.defaultBuyPrice ?? 105,
      salePricePerUnit: config?.defaultSalePrice ?? 120,
      serialNumbers: '',
      deedType: defaultDeed,
      customerName: '',
      customerPhone: '',
      advocateOrVendor: '',
      paymentMethod: 'cash',
      operatorName: 'সাইফুল ইসলাম (Saiful Islam)',
      notes: '',
      syncToLedger: true
    });
    setIsAddSaleOpen(true);
  };

  // Open New Purchase / Stock Inward Modal
  const openNewPurchaseModal = (preselectedItemId?: string) => {
    const targetId = preselectedItemId || purchaseForm.itemType || stampConfigs[0]?.id || 'stamp_100';
    const config = stampConfigs.find(c => c.id === targetId) || stampConfigs[0];

    setPurchaseForm({
      date: todayStr,
      itemType: config?.id || 'stamp_100',
      quantity: 50,
      buyPricePerUnit: config?.defaultBuyPrice ?? 105,
      vendorSource: 'ডিস্ট্রিক্ট ট্রেজারি ভেন্ডার পয়েন্ট',
      serialRange: '',
      paidBy: 'Saiful Islam',
      note: ''
    });
    setIsAddPurchaseOpen(true);
  };

  // Handle Item selection in sale form
  const handleItemSelect = (typeId: string) => {
    const config = stampConfigs.find(c => c.id === typeId);
    if (config) {
      setSaleForm(prev => ({
        ...prev,
        itemType: typeId,
        buyPricePerUnit: config.defaultBuyPrice,
        salePricePerUnit: config.defaultSalePrice,
        deedType:
          prev.deedType &&
          prev.deedType !== 'দোকান ভাড়ানামা চুক্তিপত্র' &&
          prev.deedType !== 'কার্টিজ লিগ্যাল পেপার' &&
          prev.deedType !== 'হলফনামা / অঙ্গীকারনামা'
            ? prev.deedType
            : typeId === 'cartridge_paper'
            ? 'কার্টিজ লিগ্যাল পেপার'
            : typeId === 'stamp_50'
            ? 'হলফনামা / অঙ্গীকারনামা'
            : 'দোকান ভাড়ানামা চুক্তিপত্র'
      }));
    } else {
      setSaleForm(prev => ({ ...prev, itemType: typeId }));
    }
  };

  // Quick Sale Presets
  const triggerQuickSale = (typeId: string, qty: number, customDeed?: string) => {
    const config = stampConfigs.find(c => c.id === typeId);
    if (!config) return;

    const buyPrice = Number(config.defaultBuyPrice) || 0;
    const salePrice = Number(config.defaultSalePrice) || 0;
    const totalBuy = qty * buyPrice;
    const totalSale = qty * salePrice;
    const totalProfit = totalSale - totalBuy;

    recordStampSale({
      date: todayStr,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      itemType: typeId,
      itemName: config.name,
      itemNameBn: config.nameBn,
      quantity: qty,
      buyPricePerUnit: buyPrice,
      salePricePerUnit: salePrice,
      totalBuyCost: totalBuy,
      totalSaleAmount: totalSale,
      totalProfit: totalProfit,
      deedType: customDeed || (typeId === 'cartridge_paper' ? 'কার্টিজ লিগ্যাল পেপার' : 'চুক্তিপত্র / হলফনামা'),
      customerName: 'দোকানের সাধারণ ক্রেতা',
      customerPhone: '',
      paymentMethod: 'cash',
      operatorName: 'Saiful Islam',
      notes: `কুইক সেল বাটন থেকে এন্ট্রি (${qty} পিস)`
    });
  };

  // Submit Sale Form
  const handleSaveSale = (e: React.FormEvent) => {
    e.preventDefault();
    const config = stampConfigs.find(c => c.id === saleForm.itemType);
    const itemName = config ? config.name : saleForm.itemType;
    const itemNameBn = config ? config.nameBn : saleForm.itemType;

    const qty = Math.max(1, Number(saleForm.quantity) || 1);
    const buyPrice = Number(saleForm.buyPricePerUnit) || 0;
    const salePrice = Number(saleForm.salePricePerUnit) || 0;
    const totalBuyCost = qty * buyPrice;
    const totalSaleAmount = qty * salePrice;
    const totalProfit = totalSaleAmount - totalBuyCost;

    if (editingSale) {
      updateStampSale(editingSale.id, {
        date: saleForm.date,
        time: saleForm.time,
        itemType: saleForm.itemType,
        itemName,
        itemNameBn,
        quantity: qty,
        buyPricePerUnit: buyPrice,
        salePricePerUnit: salePrice,
        totalBuyCost,
        totalSaleAmount,
        totalProfit,
        serialNumbers: saleForm.serialNumbers,
        deedType: saleForm.deedType,
        customerName: saleForm.customerName,
        customerPhone: saleForm.customerPhone,
        advocateOrVendor: saleForm.advocateOrVendor,
        paymentMethod: saleForm.paymentMethod,
        operatorName: saleForm.operatorName,
        notes: saleForm.notes
      });
      setEditingSale(null);
    } else {
      recordStampSale({
        date: saleForm.date,
        time: saleForm.time,
        itemType: saleForm.itemType,
        itemName,
        itemNameBn,
        quantity: qty,
        buyPricePerUnit: buyPrice,
        salePricePerUnit: salePrice,
        totalBuyCost,
        totalSaleAmount,
        totalProfit,
        serialNumbers: saleForm.serialNumbers,
        deedType: saleForm.deedType,
        customerName: saleForm.customerName,
        customerPhone: saleForm.customerPhone,
        advocateOrVendor: saleForm.advocateOrVendor,
        paymentMethod: saleForm.paymentMethod,
        operatorName: saleForm.operatorName,
        notes: saleForm.notes
      }, saleForm.syncToLedger);
    }

    setIsAddSaleOpen(false);
  };

  // Submit Purchase Form
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const config = stampConfigs.find(c => c.id === purchaseForm.itemType);
    const itemNameBn = config ? config.nameBn : purchaseForm.itemType;
    const qty = Math.max(1, Number(purchaseForm.quantity) || 1);
    const unitCost = Number(purchaseForm.buyPricePerUnit) || 0;
    const totalCost = qty * unitCost;

    recordStampPurchase({
      date: purchaseForm.date,
      itemType: purchaseForm.itemType,
      itemNameBn,
      quantity: qty,
      buyPricePerUnit: unitCost,
      totalCost,
      vendorSource: purchaseForm.vendorSource,
      serialRange: purchaseForm.serialRange,
      paidBy: purchaseForm.paidBy,
      note: purchaseForm.note
    });

    setIsAddPurchaseOpen(false);
  };

  // Export to Excel with Shop Name, Month, Date, Total Profit, and Serial Numbers
  const exportToExcel = () => {
    const { monthBn, dateBn } = getMonthAndDateBn();
    const shopName = settings.businessNameBn || 'সাইফুল এন্টারপ্রাইজ (Saiful Enterprise)';
    const shopAddress = settings.addressBn || '২০/১, সাগর-সৈকত মার্কেট, ইন্দিরা রোড, তেজগাঁও, ঢাকা';
    const shopPhone = settings.phonePrimary || '০১৫৪০০০৪৯৬৬';

    const metaRows: any[][] = [
      [shopName],
      [`ঠিকানা: ${shopAddress} | মোবাইল: ${shopPhone}`],
      ['জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার বিক্রয়, ক্রয় ব্যয় ও মুনাফা রেজিস্টার'],
      [`রিপোর্টের মাস: ${monthBn} | তৈরির তারিখ: ${dateBn} | সময়সীমা: ${dateFilter.toUpperCase()}`],
      [`মোট বিক্রয় মূল্য: ৳${stats.totalSalesAmount} | মোট ক্রয় ব্যয়: ৳${stats.totalBuyCost} | মোট অর্জিত নিট মুনাফা: ৳${stats.totalProfit} | মোট স্টক ক্রয় ব্যয়: ৳${totalStockPurchasesCost}`],
      [`মোট বিক্রিত সংখ্যা: ${stats.totalQuantity} পিস (৫০৳ স্ট্যাম্প: ${stats.stamp50Count} পিস, ১০০৳ স্ট্যাম্প: ${stats.stamp100Count} পিস, কার্টিজ পেপার: ${stats.cartridgeCount} পাতা)`],
      [] // spacer
    ];

    const tableHeaders = [
      'ক্রমিক নং',
      'তারিখ',
      'সময়',
      'আইটেম / স্ট্যাম্পের বিবরণ',
      'স্ট্যাম্পের ক্রমিক নং (Serial No)',
      'পরিমাণ (পিস)',
      'একক ক্রয় মূল্য (৳)',
      'একক বিক্রয় মূল্য (৳)',
      'মোট বিক্রয় মূল্য (৳)',
      'মোট ক্রয় ব্যয় (৳)',
      'মোট অর্জিত নিট মুনাফা (৳)',
      'দলিলের ধরন / উদ্দেশ্য',
      'ক্রেতার নাম',
      'মোবাইল নম্বর',
      'পেমেন্ট মাধ্যম',
      'অপারেটর'
    ];

    const dataRows = filteredSales.map((s, idx) => [
      idx + 1,
      s.date,
      s.time || '-',
      s.itemNameBn || s.itemName,
      s.serialNumbers || '-',
      s.quantity,
      s.buyPricePerUnit,
      s.salePricePerUnit,
      s.totalSaleAmount,
      s.totalBuyCost,
      s.totalProfit,
      s.deedType || '-',
      s.customerName || 'নগদ ক্রেতা',
      s.customerPhone || '-',
      s.paymentMethod,
      s.operatorName || '-'
    ]);

    const allRows = [...metaRows, tableHeaders, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(allRows);

    ws['!cols'] = [
      { wch: 10 },
      { wch: 13 },
      { wch: 10 },
      { wch: 28 },
      { wch: 24 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 26 },
      { wch: 20 },
      { wch: 16 },
      { wch: 14 },
      { wch: 18 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'স্ট্যাম্প ও কার্টিজ রেজিস্টার');

    if (stampPurchases.length > 0) {
      const purchaseRows = [
        [shopName],
        [`স্টক ক্রয় ও ভেন্ডার ব্যয় হিস্ট্রি - মাস: ${monthBn}`],
        [`মোট স্টক ক্রয় খরচ: ৳${totalStockPurchasesCost}`],
        [],
        ['ক্রমিক নং', 'ক্রয়ের তারিখ', 'আইটেমের নাম', 'পরিমাণ (পিস)', 'একক ক্রয় রেট (৳)', 'মোট ক্রয় খরচ (৳)', 'ভেন্ডার / ট্রেজারি সোর্স', 'ক্রমিক নম্বর রেঞ্জ', 'পরিশোধকারী'],
        ...stampPurchases.map((p, i) => [
          i + 1,
          p.date,
          p.itemNameBn,
          p.quantity,
          p.buyPricePerUnit,
          p.totalCost,
          p.vendorSource || '-',
          p.serialRange || '-',
          p.paidBy || '-'
        ])
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(purchaseRows);
      XLSX.utils.book_append_sheet(wb, ws2, 'স্টক ক্রয় হিস্ট্রি');
    }

    XLSX.writeFile(wb, `Stamp_Cartridge_Register_${monthBn.replace(/\s+/g, '_')}_${todayStr}.xlsx`);
  };

  // Export PDF Report with Shop Name, Month, Date, Total Profit, and Serial Numbers
  const exportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const { monthEn, dateEn, monthBn } = getMonthAndDateBn();
    const shopName = settings.businessName || 'Saiful Enterprise';

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(shopName, 105, 14, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('20/1, Sagar-Saikat Market, Indira Road, Tejgaon, Dhaka-1215 | Cell: 01540004966', 105, 19, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Judicial Stamp & Cartridge Paper Register', 105, 25, { align: 'center' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Month: ${monthEn} (${monthBn}) | Date: ${dateEn} | Filter: ${dateFilter.toUpperCase()}`, 105, 30, { align: 'center' });

    // Summary Box
    doc.setDrawColor(200, 205, 212);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 34, 182, 25, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('FINANCIAL & QUANTITY SUMMARY:', 18, 40);

    doc.setFont('helvetica', 'normal');
    doc.text(`Total Sales Amount: BDT ${stats.totalSalesAmount.toLocaleString()}`, 18, 46);
    doc.text(`Total Purchase Cost (Cost of Goods): BDT ${stats.totalBuyCost.toLocaleString()}`, 18, 51);
    doc.text(`Total Stock Purchases (Expenses): BDT ${totalStockPurchasesCost.toLocaleString()}`, 18, 56);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(10);
    doc.text(`NET PROFIT: BDT ${stats.totalProfit.toLocaleString()}`, 120, 46);

    doc.setTextColor(70, 70, 70);
    doc.setFontSize(8);
    doc.text(`Total Sold: ${stats.totalQuantity} pcs`, 120, 51);
    doc.text(`50Tk: ${stats.stamp50Count} | 100Tk: ${stats.stamp100Count} | Cartridge: ${stats.cartridgeCount}`, 120, 56);
    doc.setTextColor(0, 0, 0);

    // Table
    let y = 66;
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(235, 238, 242);
    doc.rect(14, y - 4, 182, 6, 'F');
    doc.text('#', 16, y);
    doc.text('Date', 22, y);
    doc.text('Item', 38, y);
    doc.text('Serial No', 72, y);
    doc.text('Qty', 104, y);
    doc.text('Sale', 114, y);
    doc.text('Total Sale', 128, y);
    doc.text('Cost', 148, y);
    doc.text('Profit', 166, y);
    doc.text('Customer', 182, y);

    doc.setFont('helvetica', 'normal');
    y += 5.5;

    filteredSales.slice(0, 36).forEach((sale, index) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
      doc.text(`${index + 1}`, 16, y);
      doc.text(`${sale.date}`, 22, y);
      const itemName = (sale.itemType === 'stamp_50' ? '50 Tk Stamp' : sale.itemType === 'stamp_100' ? '100 Tk Stamp' : sale.itemType === 'cartridge_paper' ? 'Cartridge Paper' : sale.itemName || sale.itemType).substring(0, 18);
      doc.text(itemName, 38, y);
      doc.text(`${sale.serialNumbers || '-'}`.substring(0, 16), 72, y);
      doc.text(`${sale.quantity}`, 104, y);
      doc.text(`${sale.salePricePerUnit}`, 114, y);
      doc.text(`${sale.totalSaleAmount}`, 128, y);
      doc.text(`${sale.totalBuyCost}`, 148, y);
      doc.text(`+${sale.totalProfit}`, 166, y);
      doc.text(`${sale.customerName || 'Cash'}`.substring(0, 10), 182, y);
      y += 5.5;
    });

    // Footer Signature Block
    y = Math.max(y + 8, 270);
    doc.setFontSize(8);
    doc.setDrawColor(180, 180, 180);
    doc.line(14, y, 65, y);
    doc.line(135, y, 186, y);
    doc.text('Operator Signature', 24, y + 4);
    doc.text('Proprietor / Official Seal', 142, y + 4);

    doc.save(`Stamp_Register_${todayStr}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 p-5 lg:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <FileText className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার রেজিস্টার</span>
                  {customerPrivacyMode ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>কাষ্টমার ভিউ (ক্রয় ও লাভ সুরক্ষিত)</span>
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      <span>অ্যাডমিন ভিউ (পূর্ণাঙ্গ লাভ দৃশ্যমান)</span>
                    </span>
                  )}
                </h1>
                <p className="text-xs lg:text-sm text-neutral-400">
                  কার্টিজ পেপার, ৫০ টাকা ও ১০০ টাকা স্ট্যাম্প বিক্রয় ও সরকারি স্টক খাতা
                </p>
              </div>
            </div>

            {/* Quick Price Badge Indicator */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 flex items-center gap-1.5 text-neutral-300 transition-all text-left"
                title="ক্লিক করে ৫০৳ স্ট্যাম্প রেট পরিবর্তন করুন"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-white">৫০ টাকার স্ট্যাম্প:</span>
                {customerPrivacyMode ? (
                  <span className="font-mono font-bold text-emerald-400">বিক্রয় ৳{stamp50SalePrice}</span>
                ) : (
                  <>
                    <span>ক্রয় ৳{stamp50BuyPrice} | বিক্রয় ৳{stamp50SalePrice}</span>
                    <span className="text-emerald-400 font-bold">(লাভ ৳{stamp50Profit})</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 flex items-center gap-1.5 text-neutral-300 transition-all text-left"
                title="ক্লিক করে ১০০৳ স্ট্যাম্প রেট পরিবর্তন করুন"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="font-semibold text-white">১০০ টাকার স্ট্যাম্প:</span>
                {customerPrivacyMode ? (
                  <span className="font-mono font-bold text-cyan-300">বিক্রয় ৳{stamp100SalePrice}</span>
                ) : (
                  <>
                    <span>ক্রয় ৳{stamp100BuyPrice} | বিক্রয় ৳{stamp100SalePrice}</span>
                    <span className="text-emerald-400 font-bold">(লাভ ৳{stamp100Profit})</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 flex items-center gap-1.5 text-neutral-300 transition-all text-left"
                title="ক্লিক করে কার্টিজ পেপার রেট পরিবর্তন করুন"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-white">কার্টিজ পেপার:</span>
                {customerPrivacyMode ? (
                  <span className="font-mono font-bold text-amber-300">বিক্রয় ৳{cartSalePrice}</span>
                ) : (
                  <>
                    <span>ক্রয় ৳{cartBuyPrice} | বিক্রয় ৳{cartSalePrice}</span>
                    <span className="text-emerald-400 font-bold">(লাভ ৳{cartProfit})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Customer Privacy Mode Toggle */}
            <button
              onClick={() => setCustomerPrivacyMode(p => !p)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                customerPrivacyMode
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border-amber-500/40'
              }`}
              title={customerPrivacyMode ? 'অ্যাডমিন মোডে মুনাফা দেখুন' : 'কাষ্টমারের সামনে মুনাফা ও ক্রয় রেট লুকান'}
            >
              {customerPrivacyMode ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কাষ্টমার মোড সক্রিয় (মুনাফা গোপন)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>অ্যাডমিন মোড (মুনাফা দৃশ্যমান)</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsPrintReportOpen(true)}
              className="px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all shadow"
              title="দোকানের নাম ও মাস সহ পূর্ণাঙ্গ রিপোর্ট"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>রিপোর্ট ভিউ / প্রিন্ট</span>
            </button>

            <button
              onClick={() => openNewSaleModal()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বিক্রি এন্ট্রি (+)</span>
            </button>

            <button
              onClick={() => openNewPurchaseModal()}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>স্টক ক্রয় / ইনওয়ার্ড</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              title="আইটেম সংযোজন, বিয়োজন ও রেট সেটিংস"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Sell Presets Strip (এক ক্লিকে দ্রুত বিক্রয়) */}
      <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>এক ক্লিকে দ্রুত বিক্রয় শর্টকাট (Quick Sale Presets):</span>
          </span>
          <span className="text-[11px] text-neutral-400">
            {customerPrivacyMode ? 'কাষ্টমারের সামনে নিরাপদ বিক্রয় শর্টকাট' : 'ক্লিক করলেই স্বয়ংক্রিয়ভাবে স্টক কমবে ও লাভ যোগ হবে'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => triggerQuickSale('stamp_50', 1, 'হলফনামা / অঙ্গীকারনামা')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+১ টি ৫০ টাকার স্ট্যাম্প</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{stamp50SalePrice}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{stamp50Profit} লাভ</span>
              )}
            </div>
          </button>

          <button
            onClick={() => triggerQuickSale('stamp_50', 2, '৫০ টাকার স্ট্যাম্প (২ কপি)')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+২ টি ৫০ টাকার স্ট্যাম্প</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{stamp50SalePrice * 2}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{stamp50Profit * 2} লাভ</span>
              )}
            </div>
          </button>

          <button
            onClick={() => triggerQuickSale('stamp_100', 1, 'চুক্তিপত্র / নোটারি')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+১ টি ১০০ টাকার স্ট্যাম্প</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{stamp100SalePrice}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{stamp100Profit} লাভ</span>
              )}
            </div>
          </button>

          <button
            onClick={() => triggerQuickSale('stamp_100', 3, '৩০০ টাকার ভাড়ানামা চুক্তি')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+৩ টি ১০০ টাকার (৩০০৳ চুক্তি)</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{stamp100SalePrice * 3}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{stamp100Profit * 3} লাভ</span>
              )}
            </div>
          </button>

          <button
            onClick={() => triggerQuickSale('cartridge_paper', 2, 'কার্টিজ পেপার (২ পাতা)')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+২ টি কার্টিজ পেপার</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{cartSalePrice * 2}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{cartProfit * 2} লাভ</span>
              )}
            </div>
          </button>

          <button
            onClick={() => triggerQuickSale('cartridge_paper', 5, 'কার্টিজ পেপার (৫ পাতা)')}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="text-[10px] text-neutral-400 font-medium">+৫ টি কার্টিজ পেপার</div>
            <div className="text-xs font-bold text-white flex items-center justify-between mt-0.5">
              <span>বিক্রি: ৳{cartSalePrice * 5}</span>
              {!customerPrivacyMode && (
                <span className="text-[10px] text-emerald-400 font-semibold group-hover:scale-105">+৳{cartProfit * 5} লাভ</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Net Profit */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-neutral-900 border border-emerald-500/30 p-4 shadow-lg relative">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span className="font-semibold text-emerald-300 flex items-center gap-1">
              <span>নিট লাভ / মুনাফা</span>
              {customerPrivacyMode && (
                <button
                  type="button"
                  onClick={() => setShowProfitValues(p => !p)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                  title={showProfitValues ? 'লুকান' : 'গোপন মুনাফা দেখুন'}
                >
                  {showProfitValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              )}
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight">
            {customerPrivacyMode && !showProfitValues ? (
              <span className="font-mono text-neutral-500 tracking-widest">••••••</span>
            ) : (
              `৳${stats.totalProfit.toLocaleString()}`
            )}
          </div>

          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            {customerPrivacyMode && !showProfitValues ? (
              <span className="text-neutral-500 text-[10px]">🔒 কাষ্টমার ভিউতে সুরক্ষিত</span>
            ) : (
              <>
                <span className="text-emerald-300 font-medium">
                  {stats.totalSalesAmount > 0 ? Math.round((stats.totalProfit / stats.totalSalesAmount) * 100) : 0}% মার্জিন
                </span>
                <span>(ফিল্টার অনুযায়ী)</span>
              </>
            )}
          </div>
        </div>

        {/* Total Sales Value */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>মোট বিক্রি মূল্য</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-white">
            ৳{stats.totalSalesAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            মোট সংগৃহীত বিক্রয় মূল্য
          </div>
        </div>

        {/* Total Cost Value */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>মোট বিক্রিত স্ট্যাম্প ব্যয়</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-neutral-200">
            {customerPrivacyMode && !showProfitValues ? (
              <span className="font-mono text-neutral-500 tracking-widest">••••••</span>
            ) : (
              `৳${stats.totalBuyCost.toLocaleString()}`
            )}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {customerPrivacyMode && !showProfitValues ? (
              <span className="text-neutral-500 text-[10px]">🔒 ক্রয় ব্যয় গোপন</span>
            ) : (
              `স্টক ক্রয় খরচ: ৳${totalStockPurchasesCost.toLocaleString()}`
            )}
          </div>
        </div>

        {/* Units Sold Breakdown */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>মোট বিক্রিত সংখ্যা</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-white flex items-baseline gap-1">
            <span>{stats.totalQuantity}</span>
            <span className="text-xs font-normal text-neutral-400">পিস</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 truncate">
            ৫০৳: {stats.stamp50Count} | ১০০৳: {stats.stamp100Count} | কার্টিজ: {stats.cartridgeCount}
          </div>
        </div>

        {/* Current Available Stock */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>দোকানে মজুদ স্টক</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-purple-300 flex items-baseline gap-1">
            <span>{stats.totalCurrentStock}</span>
            <span className="text-xs font-normal text-neutral-400">পিস</span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex flex-wrap items-center gap-1 truncate">
            <span>৫০৳: <strong className="text-white font-mono">{stamp50Config?.currentStock ?? 0}</strong></span>
            <span>•</span>
            <span>১০০৳: <strong className="text-white font-mono">{stamp100Config?.currentStock ?? 0}</strong></span>
            <span>•</span>
            <span>কার্টিজ: <strong className="text-white font-mono">{cartConfig?.currentStock ?? 0}</strong></span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            মোট ক্রয় মূল্য: ৳{stats.totalStockValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            স্ট্যাম্প বিক্রয় খাতা ({filteredSales.length})
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'stock'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            বর্তমান মজুদ ও আইটেম রেট
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'purchases'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            স্টক ক্রয় হিস্ট্রি ({stampPurchases.length})
          </button>
        </div>

        {/* Date Filters (Only shown on sales tab) */}
        {activeTab === 'sales' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-neutral-900 rounded-xl p-1 border border-neutral-800 text-xs">
              <button
                onClick={() => setDateFilter('today')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'today' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                আজকে
              </button>
              <button
                onClick={() => setDateFilter('yesterday')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'yesterday' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                গতকাল
              </button>
              <button
                onClick={() => setDateFilter('week')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'week' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                ৭ দিন
              </button>
              <button
                onClick={() => setDateFilter('month')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'month' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                এই মাস
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                সকল
              </button>
              <button
                onClick={() => setDateFilter('custom')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  dateFilter === 'custom' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                কাস্টম তারিখ
              </button>
            </div>

            {dateFilter === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
                <span className="text-neutral-400">থেকে</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>
            )}

              {/* Export & Report Buttons */}
              <button
                onClick={() => setIsPrintReportOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-800/60 transition-colors flex items-center gap-1.5"
                title="পূর্ণাঙ্গ প্রিন্ট ভিউ ও PDF রিপোর্ট"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিপোর্ট প্রিন্ট</span>
              </button>
              <button
                onClick={exportToExcel}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                title="Excel (.xlsx) ডাউনলোড"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                onClick={exportPDF}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                title="PDF রিপোর্ট ডাউনলোড"
              >
                <Download className="w-4 h-4 text-blue-400" />
              </button>
            </div>
          )}
      </div>

      {/* TAB 1: SALES LEDGER TABLE */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ক্রেতার নাম, মোবাইল, স্ট্যাম্পের ক্রমিক নম্বর বা দলিলের ধরন খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={itemTypeFilter}
              onChange={e => setItemTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="all">সকল প্রকার আইটেম</option>
              {stampConfigs.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Sales Table */}
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3.5">তারিখ ও সময়</th>
                    <th className="py-3 px-3.5">আইটেম / স্ট্যাম্পের বিবরণ</th>
                    <th className="py-3 px-3.5 text-center">পরিমাণ</th>
                    {(!customerPrivacyMode || showProfitValues) && (
                      <th className="py-3 px-3.5 text-right">ক্রয় রেট</th>
                    )}
                    <th className="py-3 px-3.5 text-right">বিক্রি রেট</th>
                    <th className="py-3 px-3.5 text-right">মোট বিক্রি</th>
                    {(!customerPrivacyMode || showProfitValues) && (
                      <>
                        <th className="py-3 px-3.5 text-right">ক্রয় খরচ</th>
                        <th className="py-3 px-3.5 text-right text-emerald-400 font-bold">মুনাফা / লাভ</th>
                      </>
                    )}
                    <th className="py-3 px-3.5">দলিলের বিবরণ / ক্রমিক নং</th>
                    <th className="py-3 px-3.5">ক্রেতার তথ্য</th>
                    <th className="py-3 px-3.5 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={(!customerPrivacyMode || showProfitValues) ? 11 : 8} className="py-12 text-center text-neutral-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
                        <p className="font-semibold text-neutral-400">কোনো স্ট্যাম্প বিক্রয় রেকর্ড পাওয়া যায়নি</p>
                        <p className="text-xs text-neutral-500 mt-1">উপরে "নতুন বিক্রি এন্ট্রি (+)" বাটনে ক্লিক করে প্রথম বিক্রি যোগ করুন</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="font-semibold text-white">{sale.date}</div>
                          <div className="text-[10px] text-neutral-400">{sale.time || '-'}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{sale.itemNameBn}</span>
                            {sale.itemType === 'stamp_50' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ৫০৳
                              </span>
                            )}
                            {sale.itemType === 'stamp_100' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                ১০০৳
                              </span>
                            )}
                          </div>
                          {(() => {
                            const cfg = stampConfigs.find(c => c.id === sale.itemType);
                            return cfg && cfg.category !== 'service' ? (
                              <div className="text-[10px] text-purple-300/80 mt-0.5 flex items-center gap-1 font-mono">
                                <span>অবশিষ্ট স্টক: {cfg.currentStock} পিস</span>
                              </div>
                            ) : null;
                          })()}
                          {sale.notes && (
                            <div className="text-[10px] text-neutral-400 mt-0.5 truncate max-w-xs">
                              {sale.notes}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-center font-bold text-white">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800">
                            {sale.quantity} পিস
                          </span>
                        </td>

                        {(!customerPrivacyMode || showProfitValues) && (
                          <td className="py-3 px-3.5 text-right font-mono text-neutral-400">
                            ৳{sale.buyPricePerUnit}
                          </td>
                        )}

                        <td className="py-3 px-3.5 text-right font-mono text-white font-semibold">
                          ৳{sale.salePricePerUnit}
                        </td>

                        <td className="py-3 px-3.5 text-right font-mono font-bold text-white">
                          ৳{sale.totalSaleAmount}
                        </td>

                        {(!customerPrivacyMode || showProfitValues) && (
                          <>
                            <td className="py-3 px-3.5 text-right font-mono text-red-400/80">
                              ৳{sale.totalBuyCost}
                            </td>

                            <td className="py-3 px-3.5 text-right font-mono font-extrabold text-emerald-400 bg-emerald-950/20">
                              +৳{sale.totalProfit}
                            </td>
                          </>
                        )}

                        <td className="py-3 px-3.5">
                          <div className="text-white font-medium">{sale.deedType || '-'}</div>
                          {sale.serialNumbers && (
                            <div className="text-[10px] font-mono text-amber-400 mt-0.5">
                              ক্রমিক: {sale.serialNumbers}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="text-white font-medium">{sale.customerName || 'নগদ ক্রেতা'}</div>
                          {sale.customerPhone && (
                            <div className="text-[10px] text-neutral-400">{sale.customerPhone}</div>
                          )}
                          <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 uppercase font-mono">
                            {sale.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedSaleForMemo(sale)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                              title="ক্যাশ মেমো / রশিদ প্রিন্ট"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingSale(sale);
                                setSaleForm({
                                  date: sale.date,
                                  time: sale.time,
                                  itemType: sale.itemType,
                                  quantity: sale.quantity,
                                  buyPricePerUnit: sale.buyPricePerUnit,
                                  salePricePerUnit: sale.salePricePerUnit,
                                  serialNumbers: sale.serialNumbers || '',
                                  deedType: sale.deedType || '',
                                  customerName: sale.customerName || '',
                                  customerPhone: sale.customerPhone || '',
                                  advocateOrVendor: sale.advocateOrVendor || '',
                                  paymentMethod: sale.paymentMethod,
                                  operatorName: sale.operatorName || '',
                                  notes: sale.notes || '',
                                  syncToLedger: false
                                });
                                setIsAddSaleOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                              title="এডিট"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি এই স্ট্যাম্প বিক্রয় রেকর্ডটি মুছে ফেলতে চান? (${sale.itemNameBn})`)) {
                                  deleteStampSale(sale.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENT STOCK & ITEM PRICING */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span>স্ট্যাম্প ও কার্টিজ পেপার মজুদ (Stock Inventory) ও রেট চার্ট</span>
            </h2>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>রেট ও স্টক এডিট করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stampConfigs.map(item => {
              const unitProfit = item.defaultSalePrice - item.defaultBuyPrice;
              const isLowStock = item.currentStock <= item.lowStockThreshold && item.category !== 'service';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl bg-neutral-900 border p-5 relative overflow-hidden transition-all ${
                    isLowStock
                      ? 'border-amber-500/50 shadow-amber-950/20'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {isLowStock && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      <span>মজুদ কম!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <span className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm">{item.nameBn}</h3>
                      <p className="text-[11px] text-neutral-400">{item.name}</p>
                    </div>
                  </div>

                  {item.descriptionBn && (
                    <p className="text-xs text-neutral-400 mb-4 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80">
                      {item.descriptionBn}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-center mb-3 font-mono">
                    <div>
                      <div className="text-[10px] text-neutral-400">ক্রয় মূল্য</div>
                      <div className="text-sm font-bold text-red-400">৳{item.defaultBuyPrice}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultBuyPrice: Math.max(0, item.defaultBuyPrice - 5) })}
                          className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-red-300 text-[10px] font-bold"
                          title="ক্রয় মূল্য ৫ টাকা কমান"
                        >
                          -৫
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultBuyPrice: item.defaultBuyPrice + 5 })}
                          className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold"
                          title="ক্রয় মূল্য ৫ টাকা বাড়ান"
                        >
                          +৫
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400">বিক্রয় মূল্য</div>
                      <div className="text-sm font-bold text-white">৳{item.defaultSalePrice}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultSalePrice: Math.max(0, item.defaultSalePrice - 5) })}
                          className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-400 text-[10px] font-bold"
                          title="বিক্রয় মূল্য ৫ টাকা কমান"
                        >
                          -৫
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultSalePrice: Math.max(0, item.defaultSalePrice - 1) })}
                          className="px-1 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold"
                          title="বিক্রয় মূল্য ১ টাকা কমান"
                        >
                          -১
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultSalePrice: item.defaultSalePrice + 1 })}
                          className="px-1 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold"
                          title="বিক্রয় মূল্য ১ টাকা বাড়ান"
                        >
                          +১
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStampConfig(item.id, { defaultSalePrice: item.defaultSalePrice + 5 })}
                          className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 text-[10px] font-bold"
                          title="বিক্রয় মূল্য ৫ টাকা বাড়ান"
                        >
                          +৫
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-400 font-semibold">নিট লাভ</div>
                      <div className="text-sm font-bold text-emerald-400">+৳{unitProfit}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 font-sans">
                        স্বয়ংক্রিয় হিসাব
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400">বর্তমান স্টক:</span>
                        <span className={`font-bold ${isLowStock ? 'text-amber-400 font-mono text-sm' : 'text-white font-mono text-sm'}`}>
                          {item.category === 'service' ? 'সীমাহীন' : `${item.currentStock} পিস`}
                        </span>
                      </div>
                      {item.category !== 'service' && (
                        <button
                          type="button"
                          onClick={() => openNewPurchaseModal(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                        >
                          <Package className="w-3 h-3 text-purple-400" />
                          <span>+ স্টক ইন</span>
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openNewSaleModal(item.id)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                      title={`${item.nameBn} বিক্রয় এন্ট্রি করুন`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>এই আইটেম বিক্রি করুন (৳{item.defaultSalePrice})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STOCK PURCHASES HISTORY */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span>স্টক ক্রয় / ট্রেজারি থেকে উত্তোলন হিস্ট্রি</span>
            </h2>
            <button
              onClick={() => setIsAddPurchaseOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন স্টক যোগ করুন (+)</span>
            </button>
          </div>

          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">ক্রয়ের তারিখ</th>
                    <th className="py-3 px-4">আইটেমের নাম</th>
                    <th className="py-3 px-4 text-center">পরিমাণ (পিস)</th>
                    <th className="py-3 px-4 text-right">একক ক্রয় রেট</th>
                    <th className="py-3 px-4 text-right">মোট ক্রয় খরচ</th>
                    <th className="py-3 px-4">ভেন্ডার / ট্রেজারি সোর্স</th>
                    <th className="py-3 px-4">ক্রমিক নম্বর রেঞ্জ</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {stampPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-500">
                        কোনো স্টক ক্রয়ের ইতিহাস পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    stampPurchases.map(pur => (
                      <tr key={pur.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">{pur.date}</td>
                        <td className="py-3 px-4 font-bold text-white">{pur.itemNameBn}</td>
                        <td className="py-3 px-4 text-center font-bold text-white">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800">
                            {pur.quantity} পিস
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-neutral-400">৳{pur.buyPricePerUnit}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-red-400">৳{pur.totalCost}</td>
                        <td className="py-3 px-4 text-neutral-300">{pur.vendorSource || '-'}</td>
                        <td className="py-3 px-4 font-mono text-amber-400 text-[11px]">{pur.serialRange || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm('আপনি কি এই ক্রয় রেকর্ডটি মুছে ফেলতে চান? (স্টক কমে যাবে)')) {
                                deleteStampPurchase(pur.id);
                              }
                            }}
                            className="p-1 rounded hover:bg-red-950 text-neutral-400 hover:text-red-400"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SALE RECORD */}
      {isAddSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 w-full max-w-2xl p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddSaleOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingSale ? 'স্ট্যাম্প বিক্রয় রেকর্ড সংশোধন' : 'নতুন জুডিশিয়াল স্ট্যাম্প / কার্টিজ বিক্রয় এন্ট্রি'}
                </h3>
                <p className="text-xs text-neutral-400">
                  সঠিক মূল্য ও পরিমাণ লিখলে স্বয়ংক্রিয়ভাবে লাভ ও স্টক হিসাব হবে
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSale} className="space-y-4 text-xs">
              {/* Live Item Stock & Price Status Indicator */}
              {(() => {
                const currentItem = stampConfigs.find(c => c.id === saleForm.itemType);
                if (!currentItem) return null;
                const isOutOfStock = currentItem.category !== 'service' && currentItem.currentStock <= 0;
                const isLow = currentItem.category !== 'service' && currentItem.currentStock <= 10;
                return (
                  <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
                    isOutOfStock
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : isLow
                      ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Package className={`w-4 h-4 ${isOutOfStock ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-purple-400'}`} />
                      <div>
                        <span className="font-semibold text-white">{currentItem.nameBn}</span>:
                        <span className="ml-1 text-neutral-400">দোকানে মজুদ:</span>{' '}
                        <strong className={`font-mono text-sm ${isOutOfStock ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {currentItem.category === 'service' ? 'সীমাহীন' : `${currentItem.currentStock} পিস`}
                        </strong>
                        {isOutOfStock && <span className="ml-2 text-rose-400 font-bold">(স্টক শূন্য!)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-400">সেটিংসে নির্ধারিত বিক্রয় রেট: <strong className="text-white">৳{currentItem.defaultSalePrice}</strong></span>
                      {Number(saleForm.salePricePerUnit) !== Number(currentItem.defaultSalePrice) && (
                        <button
                          type="button"
                          onClick={() => setSaleForm(p => ({
                            ...p,
                            buyPricePerUnit: currentItem.defaultBuyPrice,
                            salePricePerUnit: currentItem.defaultSalePrice
                          }))}
                          className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium transition-colors"
                          title="আপডেট করা সেটিং মূল্যে রিসেট করুন"
                        >
                          আপডেট রেট বসান (৳{currentItem.defaultSalePrice})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Row 1: Item Selection & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    আইটেম / স্ট্যাম্পের ধরন <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={saleForm.itemType}
                    onChange={e => handleItemSelect(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  >
                    {stampConfigs.map(item => (
                      <option key={item.id} value={item.id}>
                        {customerPrivacyMode
                          ? `${item.nameBn} — ৳${item.defaultSalePrice}`
                          : `${item.nameBn} (ক্রয়: ৳${item.defaultBuyPrice} | বিক্রয়: ৳${item.defaultSalePrice})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    বিক্রির পরিমাণ (পিস) <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSaleForm(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={saleForm.quantity}
                      onChange={e => setSaleForm(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold text-center text-sm focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSaleForm(p => ({ ...p, quantity: p.quantity + 1 }))}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Rates & Live Calculator (Customer Privacy Aware) */}
              {customerPrivacyMode ? (
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-400 font-semibold text-xs">
                          একক বিক্রয় রেট (৳)
                        </label>
                        <span className="text-[10px] text-emerald-400 font-bold">বাড়ান / কমান</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: Math.max(0, p.salePricePerUnit - 5) }))}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-bold text-xs"
                          title="৫ টাকা কমান"
                        >
                          -৫
                        </button>
                        <button
                          type="button"
                          onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: Math.max(0, p.salePricePerUnit - 1) }))}
                          className="px-1.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                          title="১ টাকা কমান"
                        >
                          -১
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={saleForm.salePricePerUnit}
                          onChange={e => setSaleForm(p => ({ ...p, salePricePerUnit: parseFloat(e.target.value) || 0 }))}
                          className="flex-1 min-w-[60px] px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold font-mono text-center focus:outline-none focus:border-emerald-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: p.salePricePerUnit + 1 }))}
                          className="px-1.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                          title="১ টাকা বাড়ান"
                        >
                          +১
                        </button>
                        <button
                          type="button"
                          onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: p.salePricePerUnit + 5 }))}
                          className="px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs"
                          title="৫ টাকা বাড়ান"
                        >
                          +৫
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1 text-xs">
                        সর্বমোট প্রদেয় বিক্রয় মূল্য
                      </label>
                      <div className="py-1 text-lg font-extrabold text-emerald-400 font-mono">
                        ৳{saleForm.quantity * saleForm.salePricePerUnit}
                      </div>
                    </div>
                  </div>
                  <details className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-900">
                    <summary className="cursor-pointer hover:text-neutral-400 select-none">
                      🔒 অ্যাডমিন ক্রয় রেট অ্যাডজাস্ট (ঐচ্ছিক)
                    </summary>
                    <div className="mt-2 grid grid-cols-2 gap-3 p-2 rounded bg-neutral-900/50">
                      <div>
                        <span className="text-neutral-400">একক ক্রয় রেট:</span>
                        <input
                          type="number"
                          min="0"
                          value={saleForm.buyPricePerUnit}
                          onChange={e => setSaleForm(p => ({ ...p, buyPricePerUnit: parseFloat(e.target.value) || 0 }))}
                          className="w-full mt-1 px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-red-300 font-mono"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-neutral-400">অনুমিত লাভ:</span>
                        <div className="text-emerald-400 font-mono font-bold mt-1">
                          +৳{(saleForm.quantity * saleForm.salePricePerUnit) - (saleForm.quantity * saleForm.buyPricePerUnit)}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1 text-xs">
                      একক ক্রয় রেট (৳)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, buyPricePerUnit: Math.max(0, p.buyPricePerUnit - 5) }))}
                        className="px-1.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-red-300 font-bold text-xs"
                      >
                        -৫
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={saleForm.buyPricePerUnit}
                        onChange={e => setSaleForm(p => ({ ...p, buyPricePerUnit: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-red-300 font-bold font-mono text-center focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, buyPricePerUnit: p.buyPricePerUnit + 5 }))}
                        className="px-1.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                      >
                        +৫
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-neutral-400 font-semibold text-xs">
                        একক বিক্রয় রেট (৳)
                      </label>
                      <span className="text-[10px] text-emerald-400 font-bold">বাড়ান / কমান</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: Math.max(0, p.salePricePerUnit - 5) }))}
                        className="px-1.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-bold text-xs"
                        title="৫ টাকা কমান"
                      >
                        -৫
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: Math.max(0, p.salePricePerUnit - 1) }))}
                        className="px-1 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                        title="১ টাকা কমান"
                      >
                        -১
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={saleForm.salePricePerUnit}
                        onChange={e => setSaleForm(p => ({ ...p, salePricePerUnit: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold font-mono text-center focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: p.salePricePerUnit + 1 }))}
                        className="px-1 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                        title="১ টাকা বাড়ান"
                      >
                        +১
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleForm(p => ({ ...p, salePricePerUnit: p.salePricePerUnit + 5 }))}
                        className="px-1.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs"
                        title="৫ টাকা বাড়ান"
                      >
                        +৫
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1 text-xs">
                      মোট বিক্রয় মূল্য
                    </label>
                    <div className="py-2 text-sm font-extrabold text-white font-mono">
                      ৳{saleForm.quantity * saleForm.salePricePerUnit}
                    </div>
                  </div>

                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1 text-xs">
                      মোট নিট লাভ / মুনাফা
                    </label>
                    <div className="py-2 text-sm font-extrabold text-emerald-400 font-mono">
                      +৳{(saleForm.quantity * saleForm.salePricePerUnit) - (saleForm.quantity * saleForm.buyPricePerUnit)}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 3: Deed Type & Serial Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    দলিলের ধরন / উদ্দেশ্য
                  </label>
                  <input
                    type="text"
                    placeholder="দোকান ভাড়ানামা, বায়না দলিল, হলফনামা..."
                    value={saleForm.deedType}
                    onChange={e => setSaleForm(p => ({ ...p, deedType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>স্ট্যাম্পের ক্রমিক নম্বর (Serial No)</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-normal">রেজিস্টার এন্ট্রি</span>
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: খ গ ১৮৭৩২১ - ১৮৭৩২৫"
                    value={saleForm.serialNumbers}
                    onChange={e => setSaleForm(p => ({ ...p, serialNumbers: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-amber-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Row 4: Customer Details & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    ক্রেতা / মক্কেলের নাম
                  </label>
                  <input
                    type="text"
                    placeholder="নাম লিখুন..."
                    value={saleForm.customerName}
                    onChange={e => setSaleForm(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    value={saleForm.customerPhone}
                    onChange={e => setSaleForm(p => ({ ...p, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    পেমেন্ট মাধ্যম
                  </label>
                  <select
                    value={saleForm.paymentMethod}
                    onChange={e => setSaleForm(p => ({ ...p, paymentMethod: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cash">নগদ টাকা (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad App)</option>
                    <option value="bank">ব্যাংক / কার্ড</option>
                    <option value="due">বাকি (Due)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Date, Operator & Sync */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={saleForm.date}
                    onChange={e => setSaleForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {!editingSale && (
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="syncLedger"
                      checked={saleForm.syncToLedger}
                      onChange={e => setSaleForm(p => ({ ...p, syncToLedger: e.target.checked }))}
                      className="w-4 h-4 rounded text-emerald-600 bg-neutral-950 border-neutral-700"
                    />
                    <label htmlFor="syncLedger" className="text-neutral-300 font-medium cursor-pointer">
                      দোকানের দৈনিক হিসাব খাতায় (Daily Shop Ledger) আয় হিসেবে যোগ করুন
                    </label>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddSaleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingSale ? 'আপডেট সম্পন্ন করুন' : 'বিক্রি সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK PURCHASE (INWARD) */}
      {isAddPurchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddPurchaseOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Package className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">নতুন স্ট্যাম্প / কার্টিজ স্টক ইনওয়ার্ড</h3>
                <p className="text-xs text-neutral-400">ট্রেজারি অফিস বা ভেন্ডার থেকে স্ট্যাম্প ক্রয় এন্ট্রি</p>
              </div>
            </div>

            <form onSubmit={handleSavePurchase} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  আইটেম নির্বাচন করুন <span className="text-red-400">*</span>
                </label>
                <select
                  value={purchaseForm.itemType}
                  onChange={e => {
                    const c = stampConfigs.find(item => item.id === e.target.value);
                    setPurchaseForm(p => ({
                      ...p,
                      itemType: e.target.value,
                      buyPricePerUnit: c ? c.defaultBuyPrice : p.buyPricePerUnit
                    }));
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium focus:outline-none focus:border-amber-500"
                  required
                >
                  {stampConfigs.filter(c => c.category !== 'service').map(item => (
                    <option key={item.id} value={item.id}>
                      {item.nameBn} (বর্তমান স্টক: {item.currentStock} পিস)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    ক্রয়ের পরিমাণ (পিস) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={purchaseForm.quantity}
                    onChange={e => setPurchaseForm(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-semibold mb-1">
                    একক ক্রয় রেট (৳) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={purchaseForm.buyPricePerUnit}
                    onChange={e => setPurchaseForm(p => ({ ...p, buyPricePerUnit: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">মোট ক্রয় খরচ:</span>
                <span className="text-base font-extrabold text-red-400 font-mono">
                  ৳{purchaseForm.quantity * purchaseForm.buyPricePerUnit}
                </span>
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  স্ট্যাম্পের ক্রমিক নম্বর রেঞ্জ (Serial Range)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ক ঘ ৫৯২৩০১ - ৫৯২৩৮০"
                  value={purchaseForm.serialRange}
                  onChange={e => setPurchaseForm(p => ({ ...p, serialRange: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  ভেন্ডার / ট্রেজারি সোর্স
                </label>
                <input
                  type="text"
                  placeholder="ডিস্ট্রিক্ট ট্রেজারি ভেন্ডার পয়েন্ট"
                  value={purchaseForm.vendorSource}
                  onChange={e => setPurchaseForm(p => ({ ...p, vendorSource: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">তারিখ</label>
                <input
                  type="date"
                  value={purchaseForm.date}
                  onChange={e => setPurchaseForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddPurchaseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-900/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>স্টক যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ITEM PRICING & STOCK SETTINGS (ADD/EDIT/REMOVE ITEMS) */}
      <StampSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        stampConfigs={stampConfigs}
        updateStampConfig={updateStampConfig}
        addStampConfig={addStampConfig}
        deleteStampConfig={deleteStampConfig}
      />

      {/* MODAL: PROFESSIONAL PRINTABLE / PDF REPORT (SHOP NAME & MONTHLY/DAILY STATEMENT) */}
      <StampPrintableReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        sales={filteredSales}
        settings={settings}
        stats={stats}
        totalStockPurchasesCost={totalStockPurchasesCost}
        dateFilter={dateFilter}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        configs={stampConfigs}
        purchases={stampPurchases}
      />

      {/* MODAL: PRINT CASH MEMO / RECEIPT */}
      {selectedSaleForMemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl bg-white text-neutral-900 w-full max-w-md p-6 shadow-2xl relative font-sans">
            <button
              onClick={() => setSelectedSaleForMemo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Memo Header */}
            <div className="text-center pb-4 border-b border-dashed border-neutral-300">
              <h2 className="text-xl font-bold text-neutral-900">{settings.businessNameBn || 'সাইফুল এন্টারপ্রাইজ'}</h2>
              <p className="text-xs text-neutral-600 mt-0.5">{settings.addressBn || '২০/১, সাগর-সৈকত মার্কেট, ইন্দিরা রোড, তেজগাঁও, ঢাকা'}</p>
              <p className="text-xs font-mono font-semibold text-neutral-700 mt-0.5">মোবাইল: {settings.phonePrimary || '01540004966'}</p>
              <div className="inline-block mt-2 px-3 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800">
                স্ট্যাম্প বিক্রয় ক্যাশ মেমো
              </div>
            </div>

            {/* Memo Details */}
            <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">মেমো নং:</span>
                <span className="font-mono font-bold text-neutral-800">#{selectedSaleForMemo.id.replace('st_sale_', 'STM-')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">তারিখ ও সময়:</span>
                <span className="font-medium text-neutral-800">{selectedSaleForMemo.date} ({selectedSaleForMemo.time || '10:00 AM'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ক্রেতার নাম:</span>
                <span className="font-bold text-neutral-800">{selectedSaleForMemo.customerName || 'নগদ ক্রেতা'}</span>
              </div>
              {selectedSaleForMemo.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">মোবাইল:</span>
                  <span className="font-mono text-neutral-800">{selectedSaleForMemo.customerPhone}</span>
                </div>
              )}
              {selectedSaleForMemo.deedType && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">দলিলের ধরন:</span>
                  <span className="font-semibold text-neutral-800">{selectedSaleForMemo.deedType}</span>
                </div>
              )}
              {selectedSaleForMemo.serialNumbers && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">স্ট্যাম্প ক্রমিক নং:</span>
                  <span className="font-mono font-bold text-neutral-900">{selectedSaleForMemo.serialNumbers}</span>
                </div>
              )}
            </div>

            {/* Item Table */}
            <table className="w-full my-3 text-xs">
              <thead>
                <tr className="border-b border-neutral-300 text-neutral-600 font-bold">
                  <th className="py-1 text-left">আইটেম</th>
                  <th className="py-1 text-center">পরিমাণ</th>
                  <th className="py-1 text-right">রেট</th>
                  <th className="py-1 text-right">মোট টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="py-2 font-medium">{selectedSaleForMemo.itemNameBn}</td>
                  <td className="py-2 text-center font-bold">{selectedSaleForMemo.quantity}</td>
                  <td className="py-2 text-right font-mono">৳{selectedSaleForMemo.salePricePerUnit}</td>
                  <td className="py-2 text-right font-mono font-bold">৳{selectedSaleForMemo.totalSaleAmount}</td>
                </tr>
              </tbody>
            </table>

            {/* Total Block */}
            <div className="pt-2 border-t-2 border-neutral-900 flex justify-between items-center">
              <span className="text-sm font-bold text-neutral-900">সর্বমোট প্রদেয়:</span>
              <span className="text-lg font-extrabold text-neutral-900 font-mono">৳{selectedSaleForMemo.totalSaleAmount}</span>
            </div>

            <div className="mt-6 text-center text-[10px] text-neutral-500 border-t border-dashed border-neutral-300 pt-3">
              ধন্যবাদ! সাইফুল এন্টারপ্রাইজের সাথেই থাকুন।
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setSelectedSaleForMemo(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold text-xs"
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
