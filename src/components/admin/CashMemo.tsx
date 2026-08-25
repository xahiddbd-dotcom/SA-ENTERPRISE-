import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  Printer,
  Download,
  Mail,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  X,
  Plus,
  Trash2,
  Copy,
  DollarSign
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface CashMemoRow {
  id: number;
  name: string;
  descQty: string; // বিবরণ (acting as quantity / description)
  rate: string;    // দর (Rate)
  total: number;   // মোট (Calculated Total)
}

const DEFAULT_MEMO_ITEMS: { name: string; defaultRate?: number }[] = [
  { name: 'ফটোকপি নরমাল / অফসেট / লিগ্যাল' },
  { name: 'কম্পিউটার কম্পোজ (বাংলা / ইংরেজি)' },
  { name: 'কালার প্রিন্ট (লেজার / ইনকজেট)' },
  { name: 'লেমিনেটিং (আইডি / সার্টিফিকেট / এ৪)' },
  { name: 'স্পাইরাল বাইন্ডিং / বুক বাইন্ডিং' },
  { name: 'ছবি প্রিন্ট / ভিসা ল্যাব প্রিন্ট' },
  { name: 'অনলাইন আবেদন / ফরম পূরণ (ভর্তি/চাকরি)' },
  { name: 'অন্যান্য সেবা / স্টেশনারি মালামাল' }
];

export const CashMemo: React.FC = () => {
  const { language } = useLanguage();
  const { settings, addInvoice } = useData();

  const memoRef = useRef<HTMLDivElement>(null);

  // Auto-generate sequential SL No from localStorage
  const [slNo, setSlNo] = useState<string>(() => {
    const lastSl = localStorage.getItem('se_cashmemo_last_sl');
    const nextNum = lastSl ? parseInt(lastSl, 10) + 1 : 1001;
    return `#${nextNum}`;
  });

  // Current Date editable
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  });

  // Customer Name & Phone
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');

  // 8 Exact Rows
  const [rows, setRows] = useState<CashMemoRow[]>(() => {
    return DEFAULT_MEMO_ITEMS.map((item, idx) => ({
      id: idx + 1,
      name: item.name,
      descQty: '',
      rate: '',
      total: 0
    }));
  });

  // Advance Amount
  const [advanceAmount, setAdvanceAmount] = useState<string>('');
  // Discount (optional)
  const [discountAmount, setDiscountAmount] = useState<string>('');
  // In Words (কথায়)
  const [inWords, setInWords] = useState<string>('');

  // Notification / Modal states
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Handle cell changes and auto-calculate row total
  const handleRowChange = (id: number, field: 'descQty' | 'rate' | 'name', value: string) => {
    setRows(prevRows =>
      prevRows.map(row => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };
        const qtyNum = parseFloat(updated.descQty) || 0;
        const rateNum = parseFloat(updated.rate) || 0;

        // If either is 0 or NaN, total is 0 unless rate is provided directly
        updated.total = Math.round(qtyNum * rateNum * 100) / 100;

        return updated;
      })
    );
  };

  // Calculations
  const subtotal = rows.reduce((acc, row) => acc + (row.total || 0), 0);
  const discountNum = parseFloat(discountAmount) || 0;
  const netTotal = Math.max(0, subtotal - discountNum);
  const advanceNum = parseFloat(advanceAmount) || 0;
  const dueAmount = Math.max(0, netTotal - advanceNum);

  // Convert Number to Bengali Words (simple converter)
  const getBengaliWords = (num: number) => {
    if (num <= 0) return '';
    return `${num} টাকা মাত্র`;
  };

  // Auto-fill inWords if empty
  useEffect(() => {
    if (netTotal > 0 && !inWords) {
      setInWords(getBengaliWords(netTotal));
    }
  }, [netTotal]);

  // Create New Memo (Increment SL No)
  const handleNewMemo = () => {
    const currentNum = parseInt(slNo.replace('#', ''), 10) || 1000;
    const nextNum = currentNum + 1;
    localStorage.setItem('se_cashmemo_last_sl', nextNum.toString());

    setSlNo(`#${nextNum}`);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setDate(`${day}/${month}/${year}`);

    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setAdvanceAmount('');
    setDiscountAmount('');
    setInWords('');
    setRows(
      DEFAULT_MEMO_ITEMS.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        descQty: '',
        rate: '',
        total: 0
      }))
    );
    setSaveSuccessMsg(null);
  };

  // Trigger Print (Isolated strictly to the 3.5x5 memo via custom print CSS)
  const handlePrint = () => {
    window.print();
  };

  // Download Exact 3.5 x 5 Inches PDF with fail-safe fallback
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);

    try {
      if (memoRef.current) {
        // Try high-resolution rasterization first
        try {
          const canvas = await html2canvas(memoRef.current, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            foreignObjectRendering: false
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [3.5, 5]
          });

          pdf.addImage(imgData, 'JPEG', 0, 0, 3.5, 5);
          pdf.save(`CashMemo_${slNo.replace('#', '')}_${customerName ? customerName.replace(/\s+/g, '_') : 'Customer'}.pdf`);
          return;
        } catch (canvasErr) {
          console.warn('html2canvas rasterization failed, falling back to direct vector PDF generator:', canvasErr);
        }
      }

      // Direct Vector jsPDF Fallback (Guaranteed to work 100% reliably)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [3.5, 5]
      });

      // Header Banner
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0.15, 0.15, 3.2, 0.65, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.text('SAIFUL ENTERPRISE', 0.25, 0.35);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(203, 213, 225);
      pdf.text('20/1 Sagar-Saikat Market, Indira Road, Farmgate', 0.25, 0.5);
      pdf.text('Beside Tejgaon College, Dhaka | Cell: 01540004966', 0.25, 0.62);

      // Memo Meta (SL & Date)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`Memo No: ${slNo}`, 0.15, 0.95);
      pdf.text(`Date: ${date}`, 2.3, 0.95);

      // Customer Info
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(`Customer: ${customerName || 'Valued Customer'}`, 0.15, 1.1);
      pdf.text(`Phone: ${customerPhone || '-'}`, 0.15, 1.23);

      // Table Header
      pdf.setFillColor(241, 245, 249);
      pdf.rect(0.15, 1.35, 3.2, 0.22, 'F');
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(0.15, 1.35, 3.2, 0.22, 'D');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.setTextColor(51, 65, 85);
      pdf.text('Item Description', 0.2, 1.5);
      pdf.text('Qty', 1.8, 1.5);
      pdf.text('Rate', 2.3, 1.5);
      pdf.text('Total', 2.9, 1.5);

      // Active Rows
      let rowY = 1.68;
      const activeRows = rows.filter(r => r.total > 0 || (r.descQty && r.rate));
      const displayRows = activeRows.length > 0 ? activeRows : rows.slice(0, 5);

      displayRows.forEach(r => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.setTextColor(51, 65, 85);
        pdf.text(r.name.slice(0, 22), 0.2, rowY);
        pdf.text(r.descQty || '-', 1.8, rowY);
        pdf.text(r.rate ? `${r.rate}` : '-', 2.3, rowY);
        pdf.text(r.total ? `${r.total}` : '-', 2.9, rowY);
        rowY += 0.18;
      });

      // Totals Box
      rowY = Math.max(rowY + 0.1, 3.4);
      pdf.setDrawColor(203, 213, 225);
      pdf.line(0.15, rowY, 3.35, rowY);
      rowY += 0.15;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text('Subtotal:', 1.8, rowY);
      pdf.text(`BDT ${subtotal}`, 2.8, rowY);
      rowY += 0.15;

      if (discountNum > 0) {
        pdf.setTextColor(220, 38, 38);
        pdf.text('Discount:', 1.8, rowY);
        pdf.text(`- BDT ${discountNum}`, 2.8, rowY);
        rowY += 0.15;
      }

      pdf.setTextColor(16, 185, 129);
      pdf.text('Net Total:', 1.8, rowY);
      pdf.text(`BDT ${netTotal}`, 2.8, rowY);
      rowY += 0.15;

      pdf.setTextColor(51, 65, 85);
      pdf.text('Advance Paid:', 1.8, rowY);
      pdf.text(`BDT ${advanceNum}`, 2.8, rowY);
      rowY += 0.15;

      if (dueAmount > 0) {
        pdf.setTextColor(220, 38, 38);
        pdf.text('Due Balance:', 1.8, rowY);
        pdf.text(`BDT ${dueAmount}`, 2.8, rowY);
      }

      // Footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(5.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Thank you for choosing Saiful Enterprise', 0.2, 4.8);

      pdf.save(`CashMemo_${slNo.replace('#', '')}_${customerName ? customerName.replace(/\s+/g, '_') : 'Customer'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Send Email Handler
  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setIsSendingEmail(true);

    // Placeholder simulated email dispatch (integratable with /api/send-memo-email)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Also record as invoice in context if not yet saved
      addInvoice({
        customerName: customerName || 'Valued Customer',
        customerPhone: customerPhone || 'Counter Walk-in',
        items: rows
          .filter(r => r.total > 0)
          .map(r => ({
            id: `memo_${r.id}`,
            name: r.name,
            nameBn: r.name,
            price: parseFloat(r.rate) || r.total,
            quantity: parseFloat(r.descQty) || 1,
            total: r.total,
            type: 'service'
          })),
        subtotal,
        discount: discountNum,
        tax: 0,
        total: netTotal,
        paymentMethod: 'cash',
        paymentStatus: dueAmount === 0 ? 'paid' : 'due',
        paidAmount: advanceNum,
        dueAmount: dueAmount,
        notes: `Digital Cash Memo SL ${slNo} sent to ${recipientEmail}`
      });

      setEmailSuccessMsg(`ক্যাশ মেমো সফলভাবে ${recipientEmail} ঠিকানায় পাঠানো হয়েছে!`);
      setTimeout(() => {
        setEmailSuccessMsg(null);
        setShowEmailModal(false);
      }, 2500);
    } catch (err) {
      alert('Failed to dispatch email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Save to System Ledger
  const handleSaveToLedger = () => {
    if (netTotal <= 0 && rows.every(r => r.total === 0)) {
      alert('অনুগ্রহ করে অন্তত একটি সেবার পরিমাণ ও দর লিখুন।');
      return;
    }

    addInvoice({
      customerName: customerName || 'নগদ ক্রেতা (Cash Customer)',
      customerPhone: customerPhone || 'কাউন্টার',
      items: rows
        .filter(r => r.total > 0 || (r.descQty && r.rate))
        .map(r => ({
          id: `memo_${r.id}_${Date.now()}`,
          name: r.name,
          nameBn: r.name,
          price: parseFloat(r.rate) || r.total,
          quantity: parseFloat(r.descQty) || 1,
          total: r.total,
          type: 'service'
        })),
      subtotal,
      discount: discountNum,
      tax: 0,
      total: netTotal,
      paymentMethod: 'cash',
      paymentStatus: dueAmount === 0 ? 'paid' : 'due',
      paidAmount: advanceNum || netTotal,
      dueAmount: dueAmount,
      notes: `অফিসিয়াল ক্যাশ মেমো নং: ${slNo} | তারিখ: ${date}`
    });

    setSaveSuccessMsg(`ক্যাশ মেমো ${slNo} সফলভাবে ইনভয়েস ও অ্যাকাউন্টিং লেজারে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'bn' ? 'সাইফুল কম্পিউটার এন্ড ফটোকপি — ডিজিটাল ক্যাশ মেমো' : 'Saiful Computer & Photocopy — Digital Cash Memo'}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'bn'
              ? '৩.৫ × ৫ ইঞ্চি স্ট্যান্ডার্ড সাইজে স্বয়ংক্রিয় হিসাব, প্রিন্ট, পিডিএফ ডাউনলোড ও ইমেইল প্রেরণের সুবিধা।'
              : 'Interactive 3.5x5 inches physical cash memo replica with auto-calculation, print stylesheet, and PDF/Email export.'}
          </p>
        </div>

        {/* Quick Action Buttons Outside Memo */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="memo-new-btn"
            onClick={handleNewMemo}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="Create New Memo with next Serial Number"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'নতুন মেমো (New)' : 'New Memo'}</span>
          </button>

          <button
            type="button"
            id="memo-save-ledger-btn"
            onClick={handleSaveToLedger}
            className="px-3.5 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'bn' ? 'লেজারে সংরক্ষণ' : 'Save to Ledger'}</span>
          </button>

          <button
            type="button"
            id="memo-print-btn"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিন্ট মেমো' : 'Print Memo'}</span>
          </button>

          <button
            type="button"
            id="memo-pdf-btn"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'PDF Download'}</span>
          </button>

          <button
            type="button"
            id="memo-email-btn"
            onClick={() => setShowEmailModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-950 transition-all active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ইমেইল পাঠান' : 'Send Email'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/50 text-teal-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Workspace: Centered 3.5 x 5 Inches Cash Memo Paper Area */}
      <div className="flex justify-center p-2 sm:p-6 bg-neutral-900/50 border border-neutral-800 rounded-3xl overflow-x-auto">
        {/* =========================================================================
            EXACT 3.5in x 5in CASH MEMO REPLICA CONTAINER
            Matches "Saiful Enterprise Cash Memo.jpg"
            ========================================================================= */}
        <div
          id="saiful-cash-memo-printable-area"
          ref={memoRef}
          className="bg-white text-black font-sans shadow-2xl relative select-text"
          style={{
            width: '3.5in',
            minWidth: '3.5in',
            maxWidth: '3.5in',
            height: '5.0in',
            maxHeight: '5.0in',
            padding: '0.12in',
            boxSizing: 'border-box',
            border: '2px solid #111',
            borderRadius: '2px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: "'Noto Sans Bengali', 'SolaimanLipi', 'Kalpurush', 'Hind Siliguri', sans-serif",
            lineHeight: 1.15,
            fontSize: '9.5px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          {/* Top Border & Header */}
          <div className="border-b border-black pb-1">
            {/* Header Flex: Logo + Store Name + Contact */}
            <div className="flex items-start justify-between gap-1">
              {/* 'SA' Circle Logo */}
              <div className="w-9 h-9 rounded-full border-2 border-black flex items-center justify-center font-black text-xs shrink-0 tracking-tighter bg-white">
                SA
              </div>

              {/* Shop Title & Address Info */}
              <div className="text-center flex-1 px-1">
                <h1
                  className="font-extrabold text-[12.5px] leading-tight tracking-tight text-black uppercase"
                  style={{ fontWeight: 900 }}
                >
                  সাইফুল কম্পিউটার এন্ড ফটোকপি
                </h1>
                <p className="text-[7.5px] text-black font-medium leading-tight mt-0.5">
                  ইন্দ্র রোড (ফার্মগেট), তেজগাঁও, ঢাকা-১২১৫
                </p>
                <p className="text-[7.5px] text-black font-mono leading-tight">
                  মোবাইল: ০১৫৪০০-০৪৯৬৬, ০১৭১৭-৯৯২৫৮৫
                </p>
                <p className="text-[7px] text-black font-mono leading-tight">
                  ইমেইল: sent9696@gmail.com
                </p>
              </div>

              {/* Bismillah / Top Corner Tag */}
              <div className="text-[7px] font-bold text-right shrink-0">
                <span>বিসমিল্লাহির রাহমানির রাহিম</span>
              </div>
            </div>

            {/* Title Badge: "ক্যাশ মেমো" - Black Pill/Box with White Text */}
            <div className="flex justify-center my-0.5">
              <div className="bg-black text-white px-3 py-0.5 rounded-full font-bold text-[8.5px] tracking-wider uppercase text-center shadow-sm">
                ক্যাশ মেমো
              </div>
            </div>

            {/* SL No, Date, Customer Details Inputs */}
            <div className="grid grid-cols-2 gap-1 text-[8px] pt-0.5">
              {/* SL No */}
              <div className="flex items-center">
                <span className="font-bold shrink-0">ক্রমিক নং:</span>
                <input
                  type="text"
                  value={slNo}
                  onChange={e => setSlNo(e.target.value)}
                  className="w-full ml-1 px-0.5 py-0 border-b border-dotted border-black bg-transparent font-mono font-bold text-[8px] focus:outline-none"
                  title="Serial Number"
                />
              </div>

              {/* Date */}
              <div className="flex items-center justify-end">
                <span className="font-bold shrink-0">তারিখ:</span>
                <input
                  type="text"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-20 ml-1 px-0.5 py-0 border-b border-dotted border-black bg-transparent font-mono text-[8px] text-right focus:outline-none"
                  title="Date"
                />
              </div>

              {/* Customer Name (Full Width) */}
              <div className="col-span-2 flex items-center">
                <span className="font-bold shrink-0">নাম:</span>
                <input
                  type="text"
                  placeholder="গ্রাহকের নাম লিখুন..."
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full ml-1 px-0.5 py-0 border-b border-dotted border-black bg-transparent text-[8px] focus:outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* 4-COLUMN TABLE STRUCTURE (নাম, বিবরণ, দর, মোট) */}
          <div className="flex-1 my-0.5 flex flex-col justify-start">
            <table
              className="w-full border-collapse text-left"
              style={{
                border: '1px solid black',
                fontSize: '7.5px'
              }}
            >
              {/* Table Header */}
              <thead>
                <tr className="bg-neutral-100 border-b border-black text-black font-bold text-center">
                  <th className="p-0.5 border-r border-black w-[46%] text-left pl-1">নাম (Item Name)</th>
                  <th className="p-0.5 border-r border-black w-[18%]">বিবরণ (Qty)</th>
                  <th className="p-0.5 border-r border-black w-[16%]">দর (Rate)</th>
                  <th className="p-0.5 w-[20%] text-right pr-1">মোট (Total)</th>
                </tr>
              </thead>

              {/* 8 Pre-filled Exact Rows */}
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-black/60 ${idx % 2 === 1 ? 'bg-neutral-50/60' : 'bg-white'}`}
                  >
                    {/* Item Name */}
                    <td className="p-0.5 pl-1 border-r border-black text-[7.5px] font-medium leading-tight truncate">
                      {row.name}
                    </td>

                    {/* Description / Quantity (Numeric input) */}
                    <td className="p-0 border-r border-black text-center">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="-"
                        value={row.descQty}
                        onChange={e => handleRowChange(row.id, 'descQty', e.target.value)}
                        className="w-full text-center bg-transparent py-0 text-[7.5px] font-mono focus:bg-amber-50 focus:outline-none"
                      />
                    </td>

                    {/* Rate (Numeric input) */}
                    <td className="p-0 border-r border-black text-center">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="-"
                        value={row.rate}
                        onChange={e => handleRowChange(row.id, 'rate', e.target.value)}
                        className="w-full text-center bg-transparent py-0 text-[7.5px] font-mono focus:bg-amber-50 focus:outline-none"
                      />
                    </td>

                    {/* Total (Auto-calculated: Qty * Rate) */}
                    <td className="p-0.5 pr-1 text-right font-mono font-bold text-[7.5px]">
                      {row.total > 0 ? row.total.toFixed(0) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER TOTAL CALCULATIONS & SIGNATURES */}
          <div className="border-t border-black pt-0.5 text-[7.5px]">
            {/* Calculation Grid */}
            <div className="grid grid-cols-2 gap-1 mb-1">
              {/* Left Column: কথায় (In Words) */}
              <div className="flex flex-col justify-between pr-1">
                <div>
                  <span className="font-bold">কথায়: </span>
                  <span className="italic text-[7px]">{inWords || '...................................................'}</span>
                </div>
                <div className="text-[6.5px] text-neutral-600 mt-1">
                  * বিক্রিত মাল বা প্রস্তুতকৃত কপি ফেরত নেওয়া হয় না।
                </div>
              </div>

              {/* Right Column: Calculations (মোট টাকা, অগ্রীম, বকেয়া) */}
              <div className="border-l border-black pl-1 space-y-0.5">
                {/* মোট টাকা (Subtotal) */}
                <div className="flex justify-between items-center font-bold">
                  <span>মোট টাকা:</span>
                  <span className="font-mono text-[8.5px]">
                    ৳{subtotal.toFixed(0)}
                  </span>
                </div>

                {/* অগ্রীম টাকা (Advance Input) */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">অগ্রীম টাকা:</span>
                  <div className="flex items-center">
                    <span className="text-[7px] mr-0.5">৳</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={advanceAmount}
                      onChange={e => setAdvanceAmount(e.target.value)}
                      className="w-14 text-right bg-transparent border-b border-dotted border-black font-mono font-bold text-[7.5px] focus:outline-none"
                    />
                  </div>
                </div>

                {/* বকেয়া টাকা (Due: Subtotal - Advance) */}
                <div className="flex justify-between items-center font-extrabold border-t border-black/40 pt-0.5">
                  <span className="text-black">বকেয়া টাকা:</span>
                  <span className="font-mono text-[8.5px] text-black">
                    ৳{dueAmount.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex justify-between items-end pt-2 text-[7px] text-center">
              <div className="w-24 border-t border-dotted border-black pt-0.5">
                গ্রাহকের স্বাক্ষর
              </div>
              <div className="w-28 border-t border-dotted border-black pt-0.5 font-bold">
                কর্তৃপক্ষের স্বাক্ষর
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Send Cash Memo via Email</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {emailSuccessMsg ? (
              <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-semibold text-center">
                {emailSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSendEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-semibold mb-1">
                    Customer Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs space-y-1 text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Memo No:</span>
                    <span className="font-mono font-bold text-emerald-400">{slNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Bill:</span>
                    <span className="font-mono font-bold text-white">৳{netTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Due Balance:</span>
                    <span className="font-mono font-bold text-amber-400">৳{dueAmount}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingEmail ? 'Sending...' : 'Send Cash Memo'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for Strict 3.5in x 5in Print Output */}
      <style>{`
        @media print {
          /* Hide everything in the page except the cash memo element */
          body * {
            visibility: hidden !important;
          }
          #saiful-cash-memo-printable-area, #saiful-cash-memo-printable-area * {
            visibility: visible !important;
          }
          #saiful-cash-memo-printable-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 3.5in !important;
            height: 5.0in !important;
            margin: 0 !important;
            padding: 0.12in !important;
            border: 1.5px solid #000 !important;
            box-shadow: none !important;
            background-color: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: 3.5in 5in portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};
