import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { User, OperatorDailyLedger } from '../../../types';
import {
  User as UserIcon,
  X,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Printer,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Percent,
  Check,
  RefreshCw,
  Sparkles,
  Phone,
  Layers,
  ArrowRight
} from 'lucide-react';

interface OperatorProfitShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: User | null;
  initialDate?: string;
  onSuccess?: () => void;
}

export const OperatorProfitShareModal: React.FC<OperatorProfitShareModalProps> = ({
  isOpen,
  onClose,
  operator,
  initialDate,
  onSuccess
}) => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const {
    operatorLedgers,
    saveOperatorLedger,
    updateOperatorLedger,
    ledgerSettings,
    staff
  } = useData();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const activeDate = initialDate || todayStr;

  // Selected operator in modal (allows switching operator directly inside modal)
  const [selectedOpId, setSelectedOpId] = useState<string>(operator?.id || '');
  const activeOperator = useMemo(() => {
    return staff.find(s => s.id === selectedOpId) || operator;
  }, [staff, selectedOpId, operator]);

  useEffect(() => {
    if (operator) {
      setSelectedOpId(operator.id);
    }
  }, [operator]);

  // Shift & Date
  const [date, setDate] = useState<string>(activeDate);
  const [shift, setShift] = useState<'morning' | 'evening' | 'full_day' | 'night'>('full_day');

  // Form Fields
  const [grossServiceSales, setGrossServiceSales] = useState<number | ''>('');
  const [operatorExpenses, setOperatorExpenses] = useState<number | ''>('');
  const [cashDepositedToOwner, setCashDepositedToOwner] = useState<number | ''>('');
  const [ownerSharePercentage, setOwnerSharePercentage] = useState<number>(60);
  const [pagesPrinted, setPagesPrinted] = useState<number | ''>('');
  const [paperReams, setPaperReams] = useState<number | ''>('');
  const [notes, setNotes] = useState<string>('');
  const [syncToShopLedger, setSyncToShopLedger] = useState<boolean>(true);

  // Quick service item breakdown (optional helper fields)
  const [showItemBreakdown, setShowItemBreakdown] = useState<boolean>(false);
  const [typingSales, setTypingSales] = useState<number | ''>('');
  const [photocopySales, setPhotocopySales] = useState<number | ''>('');
  const [onlineFormSales, setOnlineFormSales] = useState<number | ''>('');
  const [laminatingSales, setLaminatingSales] = useState<number | ''>('');
  const [otherServiceSales, setOtherServiceSales] = useState<number | ''>('');

  // Auto sum breakdown into gross sales
  useEffect(() => {
    if (showItemBreakdown) {
      const sum =
        Number(typingSales || 0) +
        Number(photocopySales || 0) +
        Number(onlineFormSales || 0) +
        Number(laminatingSales || 0) +
        Number(otherServiceSales || 0);
      setGrossServiceSales(sum > 0 ? sum : '');
    }
  }, [typingSales, photocopySales, onlineFormSales, laminatingSales, otherServiceSales, showItemBreakdown]);

  // Find existing ledger entry for this operator and date & shift
  const existingLedger = useMemo(() => {
    if (!activeOperator) return null;
    return operatorLedgers.find(
      l => l.operatorId === activeOperator.id && l.date === date && l.shift === shift
    ) || operatorLedgers.find(
      l => l.operatorId === activeOperator.id && l.date === date
    ) || null;
  }, [operatorLedgers, activeOperator, date, shift]);

  // Populate form when existing ledger or operator changes
  useEffect(() => {
    if (existingLedger) {
      setGrossServiceSales(existingLedger.grossServiceSales || '');
      setOperatorExpenses(existingLedger.operatorExpenses || '');
      setCashDepositedToOwner(existingLedger.cashDepositedToOwner ?? existingLedger.grossServiceSales);
      setOwnerSharePercentage(existingLedger.ownerSharePercentage ?? 60);
      setPagesPrinted(existingLedger.pagesPrintedCount || '');
      setPaperReams(existingLedger.paperReamsUsed || '');
      setNotes(existingLedger.notes || '');
      setSyncToShopLedger(existingLedger.syncedToShopLedger ?? true);
      setShift(existingLedger.shift);
    } else {
      // Default reset
      setGrossServiceSales('');
      setOperatorExpenses('');
      setCashDepositedToOwner('');
      setOwnerSharePercentage(ledgerSettings.defaultDeductionPercentage || 60);
      setPagesPrinted('');
      setPaperReams('');
      setNotes('');
      setSyncToShopLedger(true);
    }
  }, [existingLedger, activeOperator, date, ledgerSettings]);

  // Derived Calculations
  const grossNum = Number(grossServiceSales || 0);
  const expNum = Number(operatorExpenses || 0);
  const netIncome = Math.max(0, grossNum - expNum);

  const ownerPct = ownerSharePercentage;
  const workerPct = Math.max(0, 100 - ownerPct);

  // 60% Owner, 40% Worker calculations
  const ownerShareAmount = Math.round((netIncome * ownerPct) / 100);
  const workerShareAmount = Math.max(0, netIncome - ownerShareAmount);

  // Auto-populate cash deposited if not explicitly modified
  const cashDepositedNum = cashDepositedToOwner === '' ? netIncome : Number(cashDepositedToOwner);

  // Cash discrepancy / remaining balance
  // If worker deposits all net collection to owner, worker is owed workerShareAmount (or took it)
  const cashSurplusOrDue = cashDepositedNum - ownerShareAmount;

  // Print slip mode
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  if (!isOpen || !activeOperator) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (grossNum <= 0) {
      alert(language === 'bn' ? 'অনুগ্রহ করে মোট কাজের পরিমাণ লিখুন।' : 'Please enter gross service sales amount.');
      return;
    }

    const payload = {
      date,
      operatorId: activeOperator.id,
      operatorName: activeOperator.name,
      operatorAvatar: activeOperator.avatar,
      operatorDesignation: activeOperator.designation || activeOperator.role,
      operatorPhone: activeOperator.phone || '01700000000',
      counterNo: activeOperator.role === 'staff' ? 'কাউন্টার-২' : 'কাউন্টার-১',
      shift,
      grossServiceSales: grossNum,
      operatorExpenses: expNum,
      netServiceIncome: netIncome,
      ownerSharePercentage: ownerPct,
      ownerShareAmount,
      workerSharePercentage: workerPct,
      workerShareAmount,
      cashDepositedToOwner: cashDepositedNum,
      deductionPercentage: ownerPct,
      deductionAmount: ownerShareAmount,
      netAfterDeduction: workerShareAmount,
      pagesPrintedCount: Number(pagesPrinted || 0),
      paperReamsUsed: Number(paperReams || 0),
      syncedToShopLedger: syncToShopLedger,
      shopLedgerSaleId: existingLedger?.shopLedgerSaleId,
      status: 'verified' as const,
      verifiedBy: currentUser?.name || 'Saiful Islam (মালিক)',
      notes
    };

    if (existingLedger) {
      updateOperatorLedger(existingLedger.id, payload, syncToShopLedger);
    } else {
      saveOperatorLedger(payload, syncToShopLedger);
    }

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-white font-sans my-auto">
        {/* Modal Header with Operator Avatar & Selection */}
        <div className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative shrink-0">
              {activeOperator.avatar ? (
                <img
                  src={activeOperator.avatar}
                  alt={activeOperator.name}
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shadow-emerald-950"
                />
              ) : (
                <div className="w-13 h-13 rounded-2xl bg-emerald-900/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 font-black text-lg shadow-md">
                  {activeOperator.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg sm:text-xl text-white truncate">
                  {activeOperator.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  {activeOperator.designation || (activeOperator.role === 'admin' ? 'মালিক ও সুপারভাইজার' : 'কম্পিউটার ও ফটোকপি অপারেটর')}
                </span>
                {existingLedger && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>আজকের হিসাব সংরক্ষিত</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                {activeOperator.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-neutral-500" />
                    {activeOperator.phone}
                  </span>
                )}
                <span>•</span>
                <span className="text-neutral-400">
                  {language === 'bn' ? '৬০% মালিক ও ৪০% কর্মী হিসাব নিকাশ ফরম্যাট' : '60/40 Owner & Worker Settlement'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Switch Worker dropdown */}
            <div className="hidden sm:block">
              <select
                value={selectedOpId}
                onChange={e => setSelectedOpId(e.target.value)}
                className="bg-neutral-800 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-neutral-700 text-neutral-200 focus:outline-none focus:border-emerald-500"
              >
                {staff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.designation || s.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsPrintMode(!isPrintMode)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title={language === 'bn' ? 'দৈনিক হিসাব স্লিপ প্রিন্ট করুন' : 'Print Shift Slip'}
            >
              <Printer className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Preview (If Print Mode Toggled) */}
        {isPrintMode && (
          <div className="p-6 bg-white text-neutral-900 rounded-2xl m-6 border border-neutral-300 shadow-xl font-mono text-xs">
            <div className="text-center pb-4 border-b border-dashed border-neutral-300">
              <h2 className="text-base font-black uppercase tracking-wider">সাইফুল এন্টারপ্রাইজ</h2>
              <p className="text-[11px] text-neutral-600">তেজগাঁও কলেজ সংলগ্ন, ইন্দিরা রোড, ফার্মগেট, ঢাকা</p>
              <p className="text-[11px] font-bold mt-1 bg-neutral-100 inline-block px-3 py-1 rounded">
                কর্মী দৈনিক হিসাব ও ৬০/৪০ বন্টন স্লিপ
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-[11px]">
              <div>
                <span>কর্মী / অপারেটর: <strong>{activeOperator.name}</strong></span>
              </div>
              <div className="text-right">
                <span>তারিখ: <strong>{date}</strong> ({shift === 'morning' ? 'সকাল' : shift === 'evening' ? 'বিকাল' : 'পূর্ণ দিবস'})</span>
              </div>
            </div>

            <table className="w-full text-[11px] my-3 border-t border-b border-neutral-300">
              <tbody>
                <tr className="border-b border-neutral-200">
                  <td className="py-1.5 font-sans">মোট সেবা ও কাজের বিল (Gross Work):</td>
                  <td className="py-1.5 text-right font-bold">৳{grossNum.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-neutral-200 text-rose-700">
                  <td className="py-1.5 font-sans">(-) কর্মীর খরচ / ব্যয় (Expenses):</td>
                  <td className="py-1.5 text-right font-bold">-৳{expNum.toLocaleString()}</td>
                </tr>
                <tr className="border-b-2 border-neutral-900 font-bold bg-neutral-50">
                  <td className="py-1.5 font-sans">(=) নিট সেবা আয় (Net Revenue):</td>
                  <td className="py-1.5 text-right text-emerald-800 font-black">৳{netIncome.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-neutral-200 bg-emerald-50/50">
                  <td className="py-1.5 font-sans">★ মালিকের ৬০% মুনাফা (Owner Share):</td>
                  <td className="py-1.5 text-right font-black text-emerald-900">৳{ownerShareAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-neutral-200 bg-indigo-50/50">
                  <td className="py-1.5 font-sans">★ কর্মীর ৪০% পারিশ্রমিক (Worker Share):</td>
                  <td className="py-1.5 text-right font-black text-indigo-900">৳{workerShareAmount.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="py-1.5 font-sans">কাউন্টার নগদ ক্যাশে জমা (Cash to Owner):</td>
                  <td className="py-1.5 text-right font-bold">৳{cashDepositedNum.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between pt-8 text-[10px] text-neutral-500">
              <div className="text-center">
                <div className="w-28 border-t border-neutral-400 mb-1"></div>
                <span>কর্মীর স্বাক্ষর</span>
              </div>
              <div className="text-center">
                <div className="w-28 border-t border-neutral-400 mb-1"></div>
                <span>মালিকের স্বাক্ষর</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-bold hover:bg-neutral-800"
              >
                প্রিন্ট করুন
              </button>
              <button
                onClick={() => setIsPrintMode(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-200 text-neutral-800 font-bold hover:bg-neutral-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Top Selection: Date & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 text-xs">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'হিসাবের তারিখ:' : 'Date:'}</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'bn' ? 'কাজের শিফট:' : 'Shift:'}</span>
              </label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value as any)}
                className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="full_day">{language === 'bn' ? 'পূর্ণ দিবস (Full Day)' : 'Full Day'}</option>
                <option value="morning">{language === 'bn' ? 'সকাল শিফট (Morning)' : 'Morning'}</option>
                <option value="evening">{language === 'bn' ? 'বিকাল শিফট (Evening)' : 'Evening'}</option>
                <option value="night">{language === 'bn' ? 'রাত্রিকালীন (Night)' : 'Night'}</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'bn' ? 'মালিক ও কর্মী অনুপাত:' : 'Split Ratio:'}</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOwnerSharePercentage(60)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    ownerSharePercentage === 60
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  ৬০% / ৪০%
                </button>
                <button
                  type="button"
                  onClick={() => setOwnerSharePercentage(50)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    ownerSharePercentage === 50
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  ৫০% / ৫০%
                </button>
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{language === 'bn' ? 'যাচাইকারী:' : 'Verified By:'}</span>
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.name || 'Saiful Islam (মালিক)'}
                className="w-full p-2 bg-neutral-900/60 border border-neutral-800 rounded-xl text-neutral-300 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Section 1: Income and Expense Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Input 1: Gross Sales */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 relative">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'bn' ? '১. মোট কাজের বিল / সেবা বিক্রয়:' : 'Gross Service Sales:'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowItemBreakdown(!showItemBreakdown)}
                  className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>{showItemBreakdown ? 'সংক্ষিপ্ত ভিউ' : 'ভেঙ্গে লিখুন'}</span>
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-500 font-mono font-bold text-sm">৳</span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={grossServiceSales}
                  onChange={e => setGrossServiceSales(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-neutral-900 border border-emerald-500/40 rounded-xl text-white text-lg font-mono font-black focus:outline-none focus:border-emerald-400 shadow-inner"
                  required
                />
              </div>

              <p className="text-[11px] text-neutral-400 mt-1.5">
                {language === 'bn' ? 'কম্পিউটার, ফটোকপি, টাইপিং, অনলাইন কাজ' : 'All service billings completed by operator'}
              </p>

              {/* Optional Item breakdown fields */}
              {showItemBreakdown && (
                <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">কম্পিউটার কম্পোজ / টাইপিং:</span>
                    <input
                      type="number"
                      placeholder="৳ ০"
                      value={typingSales}
                      onChange={e => setTypingSales(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-24 p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-right text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">ফটোকপি ও প্রিন্টিং বিল:</span>
                    <input
                      type="number"
                      placeholder="৳ ০"
                      value={photocopySales}
                      onChange={e => setPhotocopySales(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-24 p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-right text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">অনলাইন আবেদন ও সরকারি ফি:</span>
                    <input
                      type="number"
                      placeholder="৳ ০"
                      value={onlineFormSales}
                      onChange={e => setOnlineFormSales(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-24 p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-right text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-neutral-400">লেমিনেশন ও স্ক্যানিং:</span>
                    <input
                      type="number"
                      placeholder="৳ ০"
                      value={laminatingSales}
                      onChange={e => setLaminatingSales(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-24 p-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-right text-white font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input 2: Operator Expenses */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800">
              <label className="block text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                <span>{language === 'bn' ? '২. কর্মীর নিজস্ব ব্যয় / খরচ (Expenses):' : 'Operator Expenses:'}</span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-500 font-mono font-bold text-sm">৳</span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={operatorExpenses}
                  onChange={e => setOperatorExpenses(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-neutral-900 border border-rose-500/40 rounded-xl text-white text-lg font-mono font-bold focus:outline-none focus:border-rose-400 shadow-inner"
                />
              </div>

              <p className="text-[11px] text-neutral-400 mt-1.5">
                {language === 'bn' ? 'কাগজ কেনা, জরুরি স্টেশনারি, কনভেয়েন্স ইত্যাদি' : 'Operational costs deducted before 60/40 split'}
              </p>
            </div>

            {/* Input 3: Net Revenue Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  {language === 'bn' ? '৩. নিট সেবা কাজ (Net Work):' : 'Net Service Turnover:'}
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">মোট কাজ - খরচ</p>
              </div>

              <div className="my-2">
                <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                  ৳{netIncome.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  (৳{grossNum.toLocaleString()} - ৳{expNum.toLocaleString()})
                </div>
              </div>

              <div className="text-[10px] text-teal-400/80 font-mono">
                এই নিট টাকার উপর ৬০% ও ৪০% হিসাব প্রযোজ্য
              </div>
            </div>
          </div>

          {/* Section 2: THE 60% OWNER & 40% WORKER CALCULATION FORMAT (CORE USER REQUIREMENT) */}
          <div className="p-5 rounded-2xl bg-neutral-950 border-2 border-emerald-500/50 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                  60/40
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    {language === 'bn' ? '৬০% মালিক ও ৪০% কর্মীর হিসাব ফরম্যাট' : '60% Owner & 40% Worker Share Format'}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'bn'
                      ? 'নিট আয় ৳' + netIncome.toLocaleString() + ' এর বন্টন হিসাব'
                      : `Breakdown of net revenue ৳${netIncome.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {/* Slider for quick tuning */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400">মালিক %:</span>
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="5"
                  value={ownerSharePercentage}
                  onChange={e => setOwnerSharePercentage(Number(e.target.value))}
                  className="w-24 accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-emerald-400">{ownerSharePercentage}%</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">কর্মী:</span>
                <span className="font-mono font-bold text-indigo-400">{workerPct}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Owner 60% Share */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-neutral-900 border border-emerald-500/40 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                      {language === 'bn' ? `মালিকের ${ownerPct}% মুনাফা (দোকান অংশ)` : `Owner's ${ownerPct}% Share`}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                    {ownerPct}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                    ৳{ownerShareAmount.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {language === 'bn'
                      ? `নিট আয় ৳${netIncome.toLocaleString()} × ${ownerPct}% = ৳${ownerShareAmount.toLocaleString()}`
                      : `Net ৳${netIncome} × ${ownerPct}% = ৳${ownerShareAmount}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs text-emerald-200">
                  <span>দোকানের ক্যাশ বক্সে যুক্ত হবে</span>
                  <span className="font-bold text-emerald-400">দোকানের নিট লাভ</span>
                </div>
              </div>

              {/* Card 2: Worker 40% Share */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-neutral-900 border border-indigo-500/40 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                      {language === 'bn' ? `কর্মীর ${workerPct}% কমিশন / পারিশ্রমিক` : `Worker's ${workerPct}% Commission`}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[11px]">
                    {workerPct}%
                  </span>
                </div>

                <div className="mt-3">
                  <div className="text-3xl sm:text-4xl font-black text-indigo-300 font-mono tracking-tight">
                    ৳{workerShareAmount.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {language === 'bn'
                      ? `নিট আয় ৳${netIncome.toLocaleString()} × ${workerPct}% = ৳${workerShareAmount.toLocaleString()}`
                      : `Net ৳${netIncome} × ${workerPct}% = ৳${workerShareAmount}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between text-xs text-indigo-200">
                  <span>অপারেটর {activeOperator.name} এর প্রাপ্য</span>
                  <span className="font-bold text-indigo-400">কমিশন বিল</span>
                </div>
              </div>
            </div>

            {/* Section 3: CASH DEPOSIT RECONCILIATION */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? 'কর্মী কত টাকা ক্যাশে জমা দিচ্ছে:' : 'Cash Deposited to Owner (BDT):'}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono font-bold text-sm">৳</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cashDepositedToOwner}
                    onChange={e => setCashDepositedToOwner(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setCashDepositedToOwner(netIncome)}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    সম্পূর্ণ নিট টাকা (৳{netIncome})
                  </button>
                  <span className="text-neutral-600">•</span>
                  <button
                    type="button"
                    onClick={() => setCashDepositedToOwner(ownerShareAmount)}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    শুধুমাত্র মালিকের ৬০% (৳{ownerShareAmount})
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400">ক্যাশ নিষ্পত্তি অবস্থা:</span>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                  {cashSurplusOrDue >= 0 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        মালিকের ৬০% (৳{ownerShareAmount.toLocaleString()}) আদায় সম্পন্ন
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-rose-400">
                        ঘাটতি: ৳{Math.abs(cashSurplusOrDue).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  কর্মী ক্যাশে জমা দিয়েছে: ৳{cashDepositedNum.toLocaleString()}
                </p>
              </div>
            </div>

            {/* DIRECT SYNC TO DAILY SHOP LEDGER (EXPLICIT USER INSTRUCTION) */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  id="sync-to-shop-ledger-check"
                  type="checkbox"
                  checked={syncToShopLedger}
                  onChange={e => setSyncToShopLedger(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="sync-to-shop-ledger-check" className="font-bold text-xs sm:text-sm text-white cursor-pointer block">
                    {language === 'bn'
                      ? 'মালিকের ৬০% মুনাফা (৳' + ownerShareAmount.toLocaleString() + ') দৈনিক দোকানের হিসাব খাতায় যুক্ত করুন'
                      : `Add Owner's ${ownerPct}% profit (৳${ownerShareAmount.toLocaleString()}) to Daily Shop Ledger`}
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'bn'
                      ? 'এটি স্বয়ংক্রিয়ভাবে দৈনিক কাউন্টার আয় ও ক্যাশ ড্রয়ারে রেকর্ড হিসেবে জমা হবে।'
                      : 'Automatically recorded under Shop Daily Accounts income register.'}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                {syncToShopLedger ? 'অটো-সিঙ্ক সক্রিয় ✅' : 'সিঙ্ক নিষ্ক্রিয়'}
              </span>
            </div>
          </div>

          {/* Optional Counters: Paper Reams & Printed Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'bn' ? 'কপি বা পাতা সংখ্যা (Pages Printed):' : 'Pages Printed:'}
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={pagesPrinted}
                onChange={e => setPagesPrinted(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'bn' ? 'ব্যবহৃত কাগজের রিম (Reams Used):' : 'Paper Reams Used:'}
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={paperReams}
                onChange={e => setPaperReams(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {language === 'bn' ? 'শিফট বা কাজের মন্তব্য (Notes):' : 'Notes / Remarks:'}
              </label>
              <input
                type="text"
                placeholder={language === 'bn' ? 'উদা: ফটোকপি রোলার পরিষ্কার, ক্যাশ জমা' : 'Remarks'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {language === 'bn'
                  ? `অপারেটর: ${activeOperator.name} • তারিখ: ${date}`
                  : `Operator: ${activeOperator.name} • ${date}`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs sm:text-sm transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>
                  {existingLedger
                    ? (language === 'bn' ? 'হিসাব আপডেট ও দোকানে সিঙ্ক করুন' : 'Update & Sync to Ledger')
                    : (language === 'bn' ? '৬০/৪০ হিসাব সেভ ও দোকানে যোগ করুন' : 'Save 60/40 & Add to Shop')}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
