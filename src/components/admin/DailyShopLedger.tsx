import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  DailyCounterSale,
  StoreExpenseRecord,
  OperatorDailyLedger,
  CustomLedgerCategory,
  DailyCashReconciliation,
  CashNoteCount,
  User as UserType
} from '../../types';
import { OperatorQuickButtonsBar } from './ledger/OperatorQuickButtonsBar';
import { OperatorProfitShareModal } from './ledger/OperatorProfitShareModal';
import {
  BookOpen,
  Plus,
  Minus,
  Calculator,
  Printer,
  Calendar,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Settings,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Clock,
  Shield,
  FileSpreadsheet,
  Coins,
  ChevronRight,
  Save,
  X,
  Sparkles,
  ArrowRight,
  Tag,
  Palette,
  Eye
} from 'lucide-react';

interface DailyShopLedgerProps {
  onNavigate?: (tab: string) => void;
  isEmbedded?: boolean;
}

export const DailyShopLedger: React.FC<DailyShopLedgerProps> = ({ onNavigate, isEmbedded = false }) => {
  const { language, t } = useLanguage();
  const { currentUser, isStaffOrAdmin, isAdmin } = useAuth();
  const {
    dailyCounterSales,
    addDailyCounterSale,
    updateDailyCounterSale,
    deleteDailyCounterSale,
    storeExpenses,
    addStoreExpense,
    updateStoreExpense,
    deleteStoreExpense,
    operatorLedgers,
    saveOperatorLedger,
    deleteOperatorLedger,
    cashReconciliations,
    saveCashReconciliation,
    ledgerSettings,
    updateLedgerSettings,
    addCustomCategory,
    deleteCustomCategory,
    staff,
    settings,
    syncOperatorProfitToShopLedger
  } = useData();

  // Selected Date Filter (Default: Today's date YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [dateFilterMode, setDateFilterMode] = useState<'today' | 'yesterday' | 'all' | 'custom'>('today');

  // Sub-tabs: 'journal' | 'calculator' | 'operators' | 'customize' | 'reports'
  const [activeLedgerTab, setActiveLedgerTab] = useState<'journal' | 'calculator' | 'operators' | 'customize'>('journal');

  // Operator 60/40 Split Modal State
  const [selectedOperatorForModal, setSelectedOperatorForModal] = useState<UserType | null>(null);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState<boolean>(false);

  // Search & category filter inside journal
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Modal States
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<{
    type: 'income' | 'expense';
    data: DailyCounterSale | StoreExpenseRecord;
  } | null>(null);

  // Income Form State
  const [incomeForm, setIncomeForm] = useState<{
    date: string;
    time: string;
    category: string;
    title: string;
    customerName: string;
    customerPhone: string;
    paymentMethod: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';
    amount: number;
    operatorId: string;
    operatorName: string;
    counterNo: string;
    voucherNo: string;
    notes: string;
  }>({
    date: todayStr,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: 'cat_inc_photocopy',
    title: '',
    customerName: '',
    customerPhone: '',
    paymentMethod: 'cash',
    amount: 0,
    operatorId: currentUser?.id || 'usr_admin',
    operatorName: currentUser?.name || 'Saiful Islam',
    counterNo: 'Counter-1',
    voucherNo: `VCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    notes: ''
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState<{
    date: string;
    time: string;
    category: string;
    title: string;
    amount: number;
    paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank';
    voucherNo: string;
    paidBy: string;
    paidTo: string;
    note: string;
  }>({
    date: todayStr,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    category: 'cat_exp_tea',
    title: '',
    amount: 0,
    paymentMethod: 'cash',
    voucherNo: `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    paidBy: currentUser?.name || 'Saiful Islam',
    paidTo: '',
    note: ''
  });

  // Category Add Form State
  const [newCategoryForm, setNewCategoryForm] = useState<{
    name: string;
    nameBn: string;
    type: 'income' | 'expense';
    color: string;
  }>({
    name: '',
    nameBn: '',
    type: 'income',
    color: 'emerald'
  });

  // Interactive Denomination Note Counter State
  const [noteCounts, setNoteCounts] = useState<CashNoteCount>({
    note1000: 0,
    note500: 0,
    note200: 0,
    note100: 0,
    note50: 0,
    note20: 0,
    note10: 0,
    note5: 0,
    coins: 0
  });
  const [reconciliationNotes, setReconciliationNotes] = useState('');

  // Operator Ledger Form State
  const [operatorForm, setOperatorForm] = useState<{
    operatorId: string;
    operatorName: string;
    shift: 'morning' | 'evening' | 'full_day' | 'night';
    grossSales: number;
    cashInHand: number;
    digitalSales: number;
    deductionPct: number;
    pagesPrinted: number;
    paperReams: number;
    notes: string;
  }>({
    operatorId: currentUser?.id || 'usr_operator',
    operatorName: currentUser?.name || 'Tanvir Ahmed',
    shift: 'morning',
    grossSales: 0,
    cashInHand: 0,
    digitalSales: 0,
    deductionPct: ledgerSettings.defaultDeductionPercentage || 60,
    pagesPrinted: 0,
    paperReams: 0,
    notes: ''
  });

  // Handle Date Preset Switch
  const handleDatePreset = (mode: 'today' | 'yesterday' | 'all' | 'custom', customVal?: string) => {
    setDateFilterMode(mode);
    if (mode === 'today') {
      setSelectedDate(todayStr);
    } else if (mode === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setSelectedDate(yesterday.toISOString().split('T')[0]);
    } else if (mode === 'custom' && customVal) {
      setSelectedDate(customVal);
    }
  };

  // Filtered Income & Expenses for current date filter
  const filteredSales = useMemo(() => {
    return dailyCounterSales.filter(s => {
      if (dateFilterMode !== 'all' && s.date !== selectedDate) return false;
      if (selectedCategoryFilter !== 'all' && s.category !== selectedCategoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchCust = (s.customerName || '').toLowerCase().includes(q);
        const matchVoucher = (s.voucherNo || '').toLowerCase().includes(q);
        const matchNotes = (s.notes || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCust && !matchVoucher && !matchNotes) return false;
      }
      return true;
    });
  }, [dailyCounterSales, selectedDate, dateFilterMode, selectedCategoryFilter, searchQuery]);

  const filteredExpenses = useMemo(() => {
    return storeExpenses.filter(e => {
      if (dateFilterMode !== 'all' && e.date !== selectedDate) return false;
      if (selectedCategoryFilter !== 'all' && e.category !== selectedCategoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchTo = (e.paidTo || '').toLowerCase().includes(q);
        const matchVoucher = (e.voucherNo || '').toLowerCase().includes(q);
        const matchNote = (e.note || '').toLowerCase().includes(q);
        if (!matchTitle && !matchTo && !matchVoucher && !matchNote) return false;
      }
      return true;
    });
  }, [storeExpenses, selectedDate, dateFilterMode, selectedCategoryFilter, searchQuery]);

  // Financial Metrics Calculation for selected date
  const metrics = useMemo(() => {
    // Totals for selected date (regardless of search filters for top cards)
    const daySales = dailyCounterSales.filter(s => dateFilterMode === 'all' || s.date === selectedDate);
    const dayExpenses = storeExpenses.filter(e => dateFilterMode === 'all' || e.date === selectedDate);

    const totalIncome = daySales.reduce((sum, s) => sum + s.amount, 0);
    const cashIncome = daySales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.amount, 0);
    const digitalIncome = daySales.filter(s => s.paymentMethod !== 'cash').reduce((sum, s) => sum + s.amount, 0);

    const totalExpense = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const cashExpense = dayExpenses.filter(e => e.paymentMethod === 'cash').reduce((sum, e) => sum + e.amount, 0);
    const digitalExpense = dayExpenses.filter(e => e.paymentMethod !== 'cash').reduce((sum, e) => sum + e.amount, 0);

    const openingCash = ledgerSettings.defaultOpeningCash || 3500;
    const expectedDrawerCash = openingCash + cashIncome - cashExpense;
    const netProfit = totalIncome - totalExpense;

    // Commission / Share calculation
    const shopSharePct = ledgerSettings.defaultDeductionPercentage || 60;
    const estimatedShopShare = Math.round((totalIncome * shopSharePct) / 100);
    const estimatedOperatorShare = totalIncome - estimatedShopShare;

    return {
      totalIncome,
      cashIncome,
      digitalIncome,
      totalExpense,
      cashExpense,
      digitalExpense,
      openingCash,
      expectedDrawerCash,
      netProfit,
      shopSharePct,
      estimatedShopShare,
      estimatedOperatorShare
    };
  }, [dailyCounterSales, storeExpenses, selectedDate, dateFilterMode, ledgerSettings]);

  // Note Counter Total Calculation
  const noteSum = useMemo(() => {
    return (
      (noteCounts.note1000 || 0) * 1000 +
      (noteCounts.note500 || 0) * 500 +
      (noteCounts.note200 || 0) * 200 +
      (noteCounts.note100 || 0) * 100 +
      (noteCounts.note50 || 0) * 50 +
      (noteCounts.note20 || 0) * 20 +
      (noteCounts.note10 || 0) * 10 +
      (noteCounts.note5 || 0) * 5 +
      (noteCounts.coins || 0) * 1
    );
  }, [noteCounts]);

  const discrepancy = noteSum - metrics.expectedDrawerCash;

  // Combined chronological journal entries
  interface JournalEntry {
    id: string;
    type: 'income' | 'expense';
    date: string;
    time: string;
    category: string;
    title: string;
    party: string; // customer or recipient
    paymentMethod: string;
    amount: number;
    voucherNo?: string;
    operatorName?: string;
    raw: DailyCounterSale | StoreExpenseRecord;
  }

  const combinedJournal: JournalEntry[] = useMemo(() => {
    const entries: JournalEntry[] = [];

    if (selectedTypeFilter === 'all' || selectedTypeFilter === 'income') {
      filteredSales.forEach(s => {
        entries.push({
          id: s.id,
          type: 'income',
          date: s.date,
          time: s.time,
          category: s.category,
          title: s.title,
          party: s.customerName || 'খুচরা কাস্টমার',
          paymentMethod: s.paymentMethod,
          amount: s.amount,
          voucherNo: s.voucherNo,
          operatorName: s.operatorName,
          raw: s
        });
      });
    }

    if (selectedTypeFilter === 'all' || selectedTypeFilter === 'expense') {
      filteredExpenses.forEach(e => {
        entries.push({
          id: e.id,
          type: 'expense',
          date: e.date,
          time: e.time,
          category: e.category,
          title: e.title,
          party: e.paidTo || 'দোকান বিল/ক্রয়',
          paymentMethod: e.paymentMethod,
          amount: e.amount,
          voucherNo: e.voucherNo,
          operatorName: e.paidBy,
          raw: e
        });
      });
    }

    // Sort descending by time or ID
    return entries.sort((a, b) => b.id.localeCompare(a.id));
  }, [filteredSales, filteredExpenses, selectedTypeFilter]);

  // Categories helper
  const allCategories = ledgerSettings.customCategories || [];
  const getCategoryInfo = (catId: string) => {
    const found = allCategories.find(c => c.id === catId);
    if (found) return found;
    return {
      id: catId,
      name: catId,
      nameBn: catId,
      type: 'income' as const,
      color: 'slate',
      isCustom: false
    };
  };

  // Submit Handlers
  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.title || incomeForm.amount <= 0) return;

    addDailyCounterSale({
      date: incomeForm.date,
      time: incomeForm.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: incomeForm.category,
      title: incomeForm.title,
      customerName: incomeForm.customerName || 'কাউন্টার সেবা গ্রাহক',
      customerPhone: incomeForm.customerPhone,
      paymentMethod: incomeForm.paymentMethod,
      amount: Number(incomeForm.amount),
      operatorId: incomeForm.operatorId,
      operatorName: incomeForm.operatorName,
      counterNo: incomeForm.counterNo,
      voucherNo: incomeForm.voucherNo || `VCH-${Date.now().toString().slice(-4)}`,
      notes: incomeForm.notes
    });

    // Reset and close
    setIncomeForm({
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: allCategories.find(c => c.type === 'income')?.id || 'cat_inc_photocopy',
      title: '',
      customerName: '',
      customerPhone: '',
      paymentMethod: 'cash',
      amount: 0,
      operatorId: currentUser?.id || 'usr_admin',
      operatorName: currentUser?.name || 'Saiful Islam',
      counterNo: 'Counter-1',
      voucherNo: `VCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: ''
    });
    setIsAddIncomeOpen(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || expenseForm.amount <= 0) return;

    addStoreExpense({
      date: expenseForm.date,
      time: expenseForm.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: expenseForm.category,
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      paymentMethod: expenseForm.paymentMethod,
      voucherNo: expenseForm.voucherNo || `EXP-${Date.now().toString().slice(-4)}`,
      paidBy: expenseForm.paidBy || 'Saiful Islam',
      paidTo: expenseForm.paidTo || 'দোকান বিল',
      note: expenseForm.note
    });

    // Reset and close
    setExpenseForm({
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: allCategories.find(c => c.type === 'expense')?.id || 'cat_exp_tea',
      title: '',
      amount: 0,
      paymentMethod: 'cash',
      voucherNo: `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      paidBy: currentUser?.name || 'Saiful Islam',
      paidTo: '',
      note: ''
    });
    setIsAddExpenseOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryForm.name && !newCategoryForm.nameBn) return;

    addCustomCategory({
      name: newCategoryForm.name || newCategoryForm.nameBn,
      nameBn: newCategoryForm.nameBn || newCategoryForm.name,
      type: newCategoryForm.type,
      color: newCategoryForm.color,
      isCustom: true
    });

    setNewCategoryForm({
      name: '',
      nameBn: '',
      type: 'income',
      color: 'emerald'
    });
    setIsAddCategoryOpen(false);
  };

  const handleSaveReconciliation = () => {
    const status = discrepancy === 0 ? 'balanced' : discrepancy < 0 ? 'shortage' : 'excess';
    saveCashReconciliation({
      date: selectedDate,
      openingCash: metrics.openingCash,
      totalCashIn: metrics.cashIncome,
      totalCashOut: metrics.cashExpense,
      digitalIn: metrics.digitalIncome,
      closingCashExpected: metrics.expectedDrawerCash,
      actualCashCounted: noteSum,
      discrepancy,
      noteCounts,
      status,
      closedBy: currentUser?.name || 'Saiful Islam',
      notes: reconciliationNotes || 'Daily cash physical tally saved.'
    });
    alert(
      language === 'bn'
        ? `ক্যাশ ড্রয়ার হিসাব সফলভাবে সেভ হয়েছে! (স্ট্যাটাস: ${status === 'balanced' ? 'সঠিক মিলেছে' : status === 'shortage' ? 'ঘাটতি' : 'উদ্বৃত্ত'})`
        : `Cash reconciliation saved successfully! Status: ${status}`
    );
  };

  const handleSaveOperatorShift = (e: React.FormEvent) => {
    e.preventDefault();
    const deductionAmt = Math.round((operatorForm.grossSales * operatorForm.deductionPct) / 100);
    const netShare = operatorForm.grossSales - deductionAmt;

    saveOperatorLedger({
      date: selectedDate,
      operatorId: operatorForm.operatorId,
      operatorName: operatorForm.operatorName,
      operatorPhone: '01700000000',
      counterNo: 'Counter-1',
      shift: operatorForm.shift,
      grossServiceSales: Number(operatorForm.grossSales),
      counterCashInHand: Number(operatorForm.cashInHand),
      digitalCollection: Number(operatorForm.digitalSales),
      deductionPercentage: Number(operatorForm.deductionPct),
      deductionAmount: deductionAmt,
      netAfterDeduction: netShare,
      pagesPrintedCount: Number(operatorForm.pagesPrinted),
      paperReamsUsed: Number(operatorForm.paperReams),
      status: 'verified',
      verifiedBy: currentUser?.name || 'Saiful Islam',
      notes: operatorForm.notes
    });

    alert(language === 'bn' ? 'অপারেটর শিফট লেজার সফলভাবে সংরক্ষণ করা হয়েছে!' : 'Operator shift ledger saved!');
  };

  // Color helper for category pill
  const getBadgeColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'teal':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'cyan':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'indigo':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'red':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'yellow':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div id="daily-shop-ledger-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডিজিটাল দোকানের হিসাব খাতা' : 'Digital Store Accounts & Tally Khata'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{language === 'bn' ? 'দৈনিক দোকানের হিসাব খাতা' : 'Daily Shop Ledger & Drawer Tally'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'কাউন্টার নগদ সেবা আয়, দোকান ভাউচার ও খরচ, ক্যাশ ড্রয়ার মিলকরণ এবং অপারেটর কমিশন হিসাবের স্বয়ংক্রিয় খাতা।'
                : 'Automated daily revenue journal, shop expense vouchers, cash note counting, drawer reconciliation and operator commission tracker.'}
            </p>
          </div>

          {/* Quick Action Special Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Add Daily Income / Counter Sale Button */}
            <button
              id="ledger-add-income-btn"
              onClick={() => setIsAddIncomeOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নগদ জমা / আয় লিখুন' : 'Add Cash / Income'}</span>
            </button>

            {/* 2. Add Store Expense Button */}
            <button
              id="ledger-add-expense-btn"
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/60 border border-rose-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <Minus className="w-4 h-4" />
              <span>{language === 'bn' ? 'দোকান খরচ / ভাউচার' : 'Add Expense / Voucher'}</span>
            </button>

            {/* 3. Cash Drawer Reconciliation Calculator */}
            <button
              id="ledger-reconcile-drawer-btn"
              onClick={() => setActiveLedgerTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                activeLedgerTab === 'calculator'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-950/40'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-amber-300 border-amber-500/30'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{language === 'bn' ? 'ক্যাশ ড্রয়ার মিলকরণ' : 'Drawer Note Count'}</span>
            </button>

            {/* 4. Customize Categories & Settings Button */}
            <button
              id="ledger-customize-btn"
              onClick={() => setActiveLedgerTab('customize')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                activeLedgerTab === 'customize'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-950/40'
                  : 'bg-neutral-800/80 hover:bg-neutral-700 text-indigo-300 border-indigo-500/30'
              }`}
              title="খাতা কাস্টমাইজেশন ও ক্যাটাগরি সেটিংস"
            >
              <Settings className="w-4 h-4" />
              <span>{language === 'bn' ? 'কাস্টমাইজেশন' : 'Customize'}</span>
            </button>

            {/* 5. Operators 60/40 Split & Photo Buttons */}
            <button
              id="ledger-operators-tab-btn"
              onClick={() => setActiveLedgerTab('operators')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                activeLedgerTab === 'operators'
                  ? 'bg-teal-500 text-black border-teal-400 shadow-lg shadow-teal-950/40'
                  : 'bg-gradient-to-r from-teal-950/80 to-emerald-950/80 hover:from-teal-900 hover:to-emerald-900 text-teal-200 border-teal-500/40 shadow-md'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'কর্মীদের হিসাব ও ৬০/৪০ বন্টন' : 'Operator 60/40 Split'}</span>
            </button>
          </div>
        </div>

        {/* Date Filter Pills Bar */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400 font-medium flex items-center gap-1.5 mr-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'তারিখ নির্বাচন:' : 'Date Filter:'}</span>
            </span>

            <button
              id="date-filter-today-btn"
              onClick={() => handleDatePreset('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilterMode === 'today'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {language === 'bn' ? 'আজকের খাতা (Today)' : 'Today'}
            </button>

            <button
              id="date-filter-yesterday-btn"
              onClick={() => handleDatePreset('yesterday')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilterMode === 'yesterday'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {language === 'bn' ? 'গতকালের খাতা' : 'Yesterday'}
            </button>

            <button
              id="date-filter-all-btn"
              onClick={() => handleDatePreset('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                dateFilterMode === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {language === 'bn' ? 'সকল লেনদেন' : 'All Dates'}
            </button>

            <div className="flex items-center gap-1.5 bg-neutral-800/90 px-2.5 py-1 rounded-lg border border-neutral-700">
              <span className="text-[11px] text-neutral-400">{language === 'bn' ? 'নির্দিষ্ট দিন:' : 'Custom:'}</span>
              <input
                id="date-filter-custom-input"
                type="date"
                value={selectedDate}
                onChange={e => handleDatePreset('custom', e.target.value)}
                className="bg-transparent text-xs text-white border-0 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="text-neutral-400 text-xs flex items-center gap-2">
            <span>
              {language === 'bn' ? 'বর্তমান নির্বাচিত তারিখ:' : 'Active Date:'}{' '}
              <strong className="text-emerald-400 font-mono">{selectedDate}</strong>
            </span>
          </div>
        </div>

        {/* Operator Quick Buttons Bar (ছবিসহ প্রতিটি কর্মীর বাটন ও হিসাব) */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'প্রতিটি কর্মীর বাটন (ছবিতে ক্লিক করে হিসাব ও ৬০/৪০ বন্টন করুন):' : 'Operator Photo Buttons (Click photo to view 60/40 accounts):'}</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveLedgerTab('operators')}
              className="text-[11px] text-teal-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'সকল কর্মীর বিস্তারিত লেজার ও সামারি দেখুন →' : 'View Full Operators Ledger →'}</span>
            </button>
          </div>
          <OperatorQuickButtonsBar
            selectedDate={selectedDate}
            onSelectOperator={(op) => {
              setSelectedOperatorForModal(op);
              setIsOperatorModalOpen(true);
            }}
            compact={true}
          />
        </div>
      </div>

      {/* Executive Financial Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue / Income */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? 'মোট সেবা ও কাউন্টার আয়' : 'Total Revenue (Inflow)'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ৳{metrics.totalIncome.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
              <span>নগদ (Cash): <strong className="text-white">৳{metrics.cashIncome}</strong></span>
              <span>ডিজিটাল (bKash/Nagad): <strong className="text-teal-400">৳{metrics.digitalIncome}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Store Expenses */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-rose-500/40 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? 'মোট দোকান খরচ ও ভাউচার' : 'Operational Outflow'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
              ৳{metrics.totalExpense.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
              <span>নগদ ড্রয়ার খরচ: <strong className="text-white">৳{metrics.cashExpense}</strong></span>
              <span>ভাউচার সংখ্যা: <strong className="text-rose-400">{filteredExpenses.length} টি</strong></span>
            </div>
          </div>
        </div>

        {/* Card 3: In-Drawer Expected Cash */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? 'ক্যাশ ড্রয়ারে থাকা উচিত' : 'Expected Drawer Cash'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              ৳{metrics.expectedDrawerCash.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
              <span>শুরুর ক্যাশ (Opening): <strong className="text-white">৳{metrics.openingCash}</strong></span>
              <span>ড্রয়ার ক্যাশ প্রবাহ: <strong className={metrics.cashIncome >= metrics.cashExpense ? 'text-emerald-400' : 'text-rose-400'}>
                {metrics.cashIncome >= metrics.cashExpense ? '+' : ''}৳{metrics.cashIncome - metrics.cashExpense}
              </strong></span>
            </div>
          </div>
        </div>

        {/* Card 4: Shop Net Share & Operator Commission */}
        <div className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 transition-all rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {language === 'bn' ? `দোকান নেট লাভ (${metrics.shopSharePct}%)` : `Shop Net Profit (${metrics.shopSharePct}%)`}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-indigo-300 tracking-tight">
              ৳{(metrics.netProfit > 0 ? Math.round(metrics.netProfit * (metrics.shopSharePct / 100)) : 0).toLocaleString()}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
              <span>সার্বিক নিট লাভ: <strong className="text-emerald-400">৳{metrics.netProfit}</strong></span>
              <span>অপারেটর ভাগ: <strong className="text-indigo-400">৳{metrics.estimatedOperatorShare}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for the Ledger */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
          <button
            id="subtab-journal-btn"
            onClick={() => setActiveLedgerTab('journal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeLedgerTab === 'journal'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{language === 'bn' ? 'দৈনিক খাতা জার্নাল (জমা-খরচ)' : 'Daily Transactions Journal'}</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-950/60 font-mono">
              {combinedJournal.length}
            </span>
          </button>

          <button
            id="subtab-calculator-btn"
            onClick={() => setActiveLedgerTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeLedgerTab === 'calculator'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{language === 'bn' ? 'ক্যাশ ড্রয়ার মিলকরণ ও নোট কাউন্টার' : 'Physical Cash Reconcile'}</span>
          </button>

          <button
            id="subtab-operators-btn"
            onClick={() => setActiveLedgerTab('operators')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeLedgerTab === 'operators'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'bn' ? 'অপারেটর শিফট ও শেয়ার লেজার' : 'Operator Shift Share'}</span>
          </button>

          <button
            id="subtab-customize-btn"
            onClick={() => setActiveLedgerTab('customize')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeLedgerTab === 'customize'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{language === 'bn' ? 'কাস্টমাইজেশন ও ক্যাটাগরি' : 'Customize & Categories'}</span>
          </button>
        </div>

        {/* Print / Export Report Button */}
        <button
          id="ledger-print-report-btn"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-xs sm:text-sm font-semibold text-neutral-200 transition-colors"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>{language === 'bn' ? 'দৈনিক খাতা প্রিন্ট করুন' : 'Print Statement'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DAILY TRANSACTIONS JOURNAL (জমা ও খরচ সার্বিক তালিকা)             */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'journal' && (
        <div className="space-y-4">
          {/* Search and Category Filter Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="journal-search-input"
                  type="text"
                  placeholder={language === 'bn' ? 'খাতায় ভাউচার, গ্রাহক বা সেবার নাম খুঁজুন...' : 'Search voucher, item, customer...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Type Filter Pill (All / Income / Expense) */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  id="filter-type-all"
                  onClick={() => setSelectedTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedTypeFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'সব' : 'All'}
                </button>
                <button
                  id="filter-type-income"
                  onClick={() => setSelectedTypeFilter('income')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedTypeFilter === 'income' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'শুধু জমা (Income)' : 'Income'}
                </button>
                <button
                  id="filter-type-expense"
                  onClick={() => setSelectedTypeFilter('expense')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedTypeFilter === 'expense' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-white'
                  }`}
                >
                  {language === 'bn' ? 'শুধু খরচ (Expense)' : 'Expense'}
                </button>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-neutral-400 whitespace-nowrap">{language === 'bn' ? 'ক্যাটাগরি:' : 'Category:'}</span>
              <select
                id="journal-category-filter-select"
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                <optgroup label={language === 'bn' ? 'আয়ের খাত' : 'Income Categories'}>
                  {allCategories
                    .filter(c => c.type === 'income')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {language === 'bn' ? c.nameBn || c.name : c.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label={language === 'bn' ? 'খরচের খাত' : 'Expense Categories'}>
                  {allCategories
                    .filter(c => c.type === 'expense')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {language === 'bn' ? c.nameBn || c.name : c.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Combined Journal Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 font-semibold">
                    <th className="py-3.5 px-4">{language === 'bn' ? 'ভাউচার ও সময়' : 'Voucher & Time'}</th>
                    <th className="py-3.5 px-4">{language === 'bn' ? 'ধরন' : 'Type'}</th>
                    <th className="py-3.5 px-4">{language === 'bn' ? 'খাত / ক্যাটাগরি' : 'Category'}</th>
                    <th className="py-3.5 px-4">{language === 'bn' ? 'বিবরণ / সেবার বিবরণ' : 'Description'}</th>
                    <th className="py-3.5 px-4">{language === 'bn' ? 'গ্রাহক / প্রাপক' : 'Party'}</th>
                    <th className="py-3.5 px-4">{language === 'bn' ? 'মাধ্যম' : 'Method'}</th>
                    <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                    <th className="py-3.5 px-4 text-center">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {combinedJournal.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-500">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>{language === 'bn' ? 'নির্বাচিত দিনে কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No journal records found for selected filter.'}</p>
                        <button
                          onClick={() => setIsAddIncomeOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'প্রথম লেনদেন লিখুন' : 'Record First Entry'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    combinedJournal.map(item => {
                      const cat = getCategoryInfo(item.category);
                      const isIncome = item.type === 'income';

                      return (
                        <tr
                          key={`${item.type}_${item.id}`}
                          className="hover:bg-neutral-800/40 transition-colors group"
                        >
                          {/* Voucher & Time */}
                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-white text-xs">{item.voucherNo || '-'}</div>
                            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              <span>{item.time}</span>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                isIncome
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              <span>{isIncome ? (language === 'bn' ? 'জমা' : 'Income') : (language === 'bn' ? 'খরচ' : 'Expense')}</span>
                            </span>
                          </td>

                          {/* Category Badge */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${getBadgeColorClasses(
                                cat.color
                              )}`}
                            >
                              {language === 'bn' ? cat.nameBn || cat.name : cat.name}
                            </span>
                          </td>

                          {/* Description & Notes */}
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-semibold text-white truncate">{item.title}</div>
                            {item.operatorName && (
                              <div className="text-[11px] text-neutral-400">
                                {language === 'bn' ? 'অপারেটর: ' : 'Op: '}
                                <span className="text-neutral-300">{item.operatorName}</span>
                              </div>
                            )}
                          </td>

                          {/* Party */}
                          <td className="py-3 px-4 text-neutral-300">
                            <div className="truncate max-w-[140px]">{item.party}</div>
                          </td>

                          {/* Payment Method */}
                          <td className="py-3 px-4">
                            <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                              {item.paymentMethod}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-4 text-right font-mono font-bold">
                            <span className={isIncome ? 'text-emerald-400 text-sm' : 'text-rose-400 text-sm'}>
                              {isIncome ? '+' : '-'}৳{item.amount.toLocaleString()}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                              {/* Print Mini Voucher */}
                              <button
                                id={`voucher-view-${item.id}`}
                                onClick={() => setSelectedVoucherForPrint({ type: item.type, data: item.raw })}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                title="ভাউচার মেমো প্রিন্ট করুন"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Button */}
                              <button
                                id={`delete-entry-${item.id}`}
                                onClick={() => {
                                  if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই রেকর্ডটি ডিলিট করতে চান?' : 'Are you sure you want to delete this record?')) {
                                    if (isIncome) deleteDailyCounterSale(item.id);
                                    else deleteStoreExpense(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                                title="ডিলিট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                {/* Footer totals */}
                {combinedJournal.length > 0 && (
                  <tfoot className="bg-neutral-950/90 font-bold border-t-2 border-neutral-800">
                    <tr>
                      <td colSpan={6} className="py-3.5 px-4 text-neutral-300">
                        {language === 'bn' ? 'নির্বাচিত তালিকার সার্বিক যোগফল (Total Summary):' : 'Total Filtered Summary:'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-base">
                        <div className="text-emerald-400">+৳{metrics.totalIncome.toLocaleString()}</div>
                        <div className="text-rose-400 text-xs font-normal">-৳{metrics.totalExpense.toLocaleString()}</div>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PHYSICAL CASH DRAWER RECONCILIATION & NOTE COUNTER                 */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Note Counting Denomination Table */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span>{language === 'bn' ? 'নোট গননা ও ক্যাশ ড্রয়ার মিলকরণ' : 'Bangladeshi Currency Note Counter'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn' ? 'দোকানের ক্যাশ ড্রয়ারে থাকা কাগজের নোট ও কয়েন সংখ্যা লিখুন।' : 'Input physical count of each banknote denomination.'}
                </p>
              </div>

              <button
                id="reset-note-counts-btn"
                onClick={() =>
                  setNoteCounts({
                    note1000: 0,
                    note500: 0,
                    note200: 0,
                    note100: 0,
                    note50: 0,
                    note20: 0,
                    note10: 0,
                    note5: 0,
                    coins: 0
                  })
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            </div>

            {/* Currency Inputs */}
            <div className="space-y-3 font-mono">
              {[
                { key: 'note1000', label: '১০০০ টাকার নোট', mult: 1000, color: 'text-purple-400' },
                { key: 'note500', label: '৫০০ টাকার নোট', mult: 500, color: 'text-teal-400' },
                { key: 'note200', label: '২০০ টাকার নোট', mult: 200, color: 'text-amber-400' },
                { key: 'note100', label: '১০০ টাকার নোট', mult: 100, color: 'text-blue-400' },
                { key: 'note50', label: '৫০ টাকার নোট', mult: 50, color: 'text-pink-400' },
                { key: 'note20', label: '২০ টাকার নোট', mult: 20, color: 'text-green-400' },
                { key: 'note10', label: '১০ টাকার নোট', mult: 10, color: 'text-rose-400' },
                { key: 'note5', label: '৫ টাকার নোট', mult: 5, color: 'text-yellow-400' },
                { key: 'coins', label: 'খুচরা পয়সা ও কয়েন (মোট)', mult: 1, color: 'text-neutral-300' }
              ].map(note => {
                const count = noteCounts[note.key as keyof CashNoteCount] || 0;
                const total = count * note.mult;

                return (
                  <div
                    key={note.key}
                    className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                  >
                    <div className="w-44 text-xs font-sans font-bold text-neutral-200 flex items-center gap-2">
                      <span className={`font-mono font-black ${note.color}`}>
                        {note.mult === 1 ? 'COIN' : `৳${note.mult}`}
                      </span>
                      <span className="text-neutral-400 text-[11px]">({note.label})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500 text-xs">x</span>
                      <input
                        id={`input-${note.key}`}
                        type="number"
                        min="0"
                        placeholder="0"
                        value={count === 0 ? '' : count}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10) || 0;
                          setNoteCounts(prev => ({ ...prev, [note.key]: Math.max(0, val) }));
                        }}
                        className="w-24 text-right px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="w-28 text-right font-mono font-bold text-white text-sm">
                      = ৳{total.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Physical Cash Calculated */}
            <div className="p-4 rounded-2xl bg-neutral-950 border-2 border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 font-sans">{language === 'bn' ? 'ড্রয়ারে মোট গণনাকৃত নগদ টাকা:' : 'Total Physical Drawer Cash:'}</span>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  ৳{noteSum.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 font-sans">{language === 'bn' ? 'হিসাব মতে থাকা উচিত:' : 'Expected Drawer Cash:'}</span>
                <div className="text-lg font-bold text-white font-mono">
                  ৳{metrics.expectedDrawerCash.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Reconciliation Status & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Status Card */}
            <div
              className={`border rounded-3xl p-6 space-y-4 shadow-xl ${
                discrepancy === 0
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : discrepancy < 0
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {discrepancy === 0 ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-400" />
                )}
                <div>
                  <h4 className="font-bold text-lg text-white">
                    {discrepancy === 0
                      ? language === 'bn'
                        ? '✅ ক্যাশ ড্রয়ার শতভাগ মিলেছে (Balanced)'
                        : '✅ Cash Drawer Perfectly Balanced'
                      : discrepancy < 0
                      ? language === 'bn'
                        ? '⚠️ ক্যাশে ঘাটতি রয়েছে (Cash Shortage)'
                        : '⚠️ Cash Shortage Detected'
                      : language === 'bn'
                      ? '🎉 ক্যাশে উদ্বৃত্ত রয়েছে (Cash Excess)'
                      : '🎉 Cash Surplus Detected'}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn' ? 'তারিখ: ' + selectedDate : 'Date: ' + selectedDate}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">প্রারম্ভিক ক্যাশ (Opening):</span>
                  <span className="text-white">৳{metrics.openingCash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">(+) আজকের নগদ জমা:</span>
                  <span className="text-emerald-400">+৳{metrics.cashIncome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">(-) আজকের নগদ খরচ:</span>
                  <span className="text-rose-400">-৳{metrics.cashExpense}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex items-center justify-between font-bold">
                  <span className="text-neutral-300">প্রত্যাশিত মোট ক্যাশ:</span>
                  <span className="text-white">৳{metrics.expectedDrawerCash}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-neutral-300">শারীরিক গণনাকৃত ক্যাশ:</span>
                  <span className="text-amber-300">৳{noteSum}</span>
                </div>
                <div className="border-t border-neutral-800 pt-2 flex items-center justify-between text-sm font-black">
                  <span>পার্থক্য / ঘাটতি / উদ্বৃত্ত:</span>
                  <span
                    className={
                      discrepancy === 0
                        ? 'text-emerald-400'
                        : discrepancy < 0
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }
                  >
                    {discrepancy >= 0 ? '+' : ''}৳{discrepancy}
                  </span>
                </div>
              </div>

              {/* Note / Remarks for Reconciliation */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {language === 'bn' ? 'ড্রয়ার হিসাব ক্লোজিং নোট বা মন্তব্য:' : 'Closing Note / Remarks:'}
                </label>
                <textarea
                  id="reconcile-notes-textarea"
                  rows={2}
                  value={reconciliationNotes}
                  onChange={e => setReconciliationNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'উদা: সন্ধ্যার শিফট ক্লোজিং সম্পন্ন, ক্যাশ ঠিক আছে।' : 'e.g. Evening shift closed properly.'}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                id="save-reconciliation-btn"
                onClick={handleSaveReconciliation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs sm:text-sm shadow-xl shadow-amber-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'bn' ? 'ড্রয়ার হিসাব সেভ ও লক করুন' : 'Save & Lock Drawer Tally'}</span>
              </button>
            </div>

            {/* Past Reconciliations History */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {language === 'bn' ? 'পূর্ববর্তী ড্রয়ার মিলকরণ হিস্টোরি' : 'Past Drawer Reconciliations'}
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cashReconciliations.map(rec => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{rec.date}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            rec.status === 'balanced'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        গণনা: ৳{rec.actualCashCounted} | প্রত্যাশিত: ৳{rec.closingCashExpected}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-white">৳{rec.actualCashCounted}</div>
                      <div className="text-[10px] text-neutral-500">{rec.closedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OPERATOR SHIFT & SHARE SETTLEMENT (কর্মীদের হিসাব ও ৬০/৪০ বন্টন)   */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'operators' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Operator Photo Buttons Section */}
          <OperatorQuickButtonsBar
            selectedDate={selectedDate}
            onSelectOperator={(op) => {
              setSelectedOperatorForModal(op);
              setIsOperatorModalOpen(true);
            }}
          />

          {/* 60% Owner & 40% Worker Executive Summary Banner */}
          {(() => {
            const dateLedgers = operatorLedgers.filter(l => selectedDate ? l.date === selectedDate : true);
            const totalGross = dateLedgers.reduce((acc, l) => acc + (l.grossServiceSales || 0), 0);
            const totalExpenses = dateLedgers.reduce((acc, l) => acc + (l.operatorExpenses || 0), 0);
            const totalNet = Math.max(0, totalGross - totalExpenses);
            const totalOwner60 = dateLedgers.reduce(
              (acc, l) => acc + (l.ownerShareAmount || Math.round((((l.grossServiceSales || 0) - (l.operatorExpenses || 0)) * (l.ownerSharePercentage || 60)) / 100)),
              0
            );
            const totalWorker40 = dateLedgers.reduce(
              (acc, l) => acc + (l.workerShareAmount || Math.round((((l.grossServiceSales || 0) - (l.operatorExpenses || 0)) * (l.workerSharePercentage || 40)) / 100)),
              0
            );
            const totalCashInHand = dateLedgers.reduce((acc, l) => acc + (l.cashDepositedToOwner ?? l.grossServiceSales ?? 0), 0);

            return (
              <div className="p-5 rounded-3xl bg-neutral-900 border-2 border-emerald-500/40 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-950">
                      60/40
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">
                        {language === 'bn' ? `তারিখের সারাংশ: ${selectedDate}` : `Summary for ${selectedDate}`}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {language === 'bn'
                          ? 'কর্মীভিত্তিক আয়-ব্যয়, ক্যাশ জমা এবং দোকানে ৬০% মুনাফা অন্তর্ভুক্তি'
                          : 'Operator service turnover, net collection, and 60% owner profit integration'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOperatorForModal(staff[0] || null);
                      setIsOperatorModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all hover:scale-105 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'bn' ? 'নতুন কর্মীর হিসাব যুক্ত করুন' : 'Add Operator Shift'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'মোট কাজ (Gross):' : 'Gross Turnover:'}</span>
                    <div className="text-lg font-black text-white font-mono mt-1">৳{totalGross.toLocaleString()}</div>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-rose-900/30">
                    <span className="text-[11px] text-rose-400 block">{language === 'bn' ? 'কর্মীদের খরচ (Exp):' : 'Expenses:'}</span>
                    <div className="text-lg font-black text-rose-300 font-mono mt-1">-৳{totalExpenses.toLocaleString()}</div>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-xl border border-teal-900/30">
                    <span className="text-[11px] text-teal-400 block">{language === 'bn' ? 'নিট সেবা আয় (Net):' : 'Net Turnover:'}</span>
                    <div className="text-lg font-black text-teal-300 font-mono mt-1">৳{totalNet.toLocaleString()}</div>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40">
                    <span className="text-[11px] text-emerald-400 font-bold block">{language === 'bn' ? 'মালিকের ৬০% লাভ:' : 'Owner 60%:'}</span>
                    <div className="text-lg font-black text-emerald-300 font-mono mt-1">৳{totalOwner60.toLocaleString()}</div>
                    <span className="text-[9px] text-emerald-400/80 block mt-0.5">দোকানের খাতায় যুক্ত ✅</span>
                  </div>

                  <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/40">
                    <span className="text-[11px] text-indigo-400 font-bold block">{language === 'bn' ? 'কর্মীদের ৪০% কমিশন:' : 'Worker 40%:'}</span>
                    <div className="text-lg font-black text-indigo-300 font-mono mt-1">৳{totalWorker40.toLocaleString()}</div>
                    <span className="text-[9px] text-indigo-400/80 block mt-0.5">কর্মীদের পারিশ্রমিক</span>
                  </div>

                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40">
                    <span className="text-[11px] text-amber-400 font-bold block">{language === 'bn' ? 'মোট ক্যাশে জমা:' : 'Cash Deposited:'}</span>
                    <div className="text-lg font-black text-amber-300 font-mono mt-1">৳{totalCashInHand.toLocaleString()}</div>
                    <span className="text-[9px] text-amber-400/80 block mt-0.5">কাউন্টারে নগদ</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Past Operator Shift Records with Avatars, 60/40 format, and sync actions */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-white text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'কর্মীদের দৈনিক হিসাব ও ৬০/৪০ বন্টন তালিকা' : 'Operator Daily Shift & 60/40 Register'}</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {language === 'bn'
                    ? 'প্রতিটি এন্ট্রির পাশে ছবিসহ কর্মীর তথ্য, আয়, ব্যয়, ৬০% মালিক ও ৪০% কর্মী মুনাফা এবং সিঙ্ক স্ট্যাটাস।'
                    : 'Individual shift records with avatars, turnover, expenses, 60/40 split and ledger synchronization.'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-mono font-bold text-neutral-300">
                মোট রেকর্ড: {operatorLedgers.length}টি
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-950/90 border-b border-neutral-800 text-neutral-400">
                    <th className="py-3.5 px-4">তারিখ ও শিফট</th>
                    <th className="py-3.5 px-4">কর্মী / অপারেটর</th>
                    <th className="py-3.5 px-4 text-right">মোট কাজ</th>
                    <th className="py-3.5 px-4 text-right">খরচ</th>
                    <th className="py-3.5 px-4 text-right">নিট আয়</th>
                    <th className="py-3.5 px-4 text-right bg-emerald-950/20 text-emerald-400 font-bold">মালিক ৬০%</th>
                    <th className="py-3.5 px-4 text-right bg-indigo-950/20 text-indigo-400 font-bold">কর্মী ৪০%</th>
                    <th className="py-3.5 px-4 text-right">ক্যাশে জমা</th>
                    <th className="py-3.5 px-4 text-center">দোকান সিঙ্ক</th>
                    <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {operatorLedgers.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-neutral-500 font-sans">
                        {language === 'bn' ? 'এখনও কোন কর্মীর শিফট হিসাব যোগ করা হয়নি।' : 'No operator shift records found yet.'}
                      </td>
                    </tr>
                  ) : (
                    operatorLedgers.map(odl => {
                      const net = odl.netServiceIncome ?? Math.max(0, (odl.grossServiceSales || 0) - (odl.operatorExpenses || 0));
                      const ownerPct = odl.ownerSharePercentage ?? odl.deductionPercentage ?? 60;
                      const workerPct = odl.workerSharePercentage ?? (100 - ownerPct);
                      const ownerAmt = odl.ownerShareAmount ?? odl.deductionAmount ?? Math.round((net * ownerPct) / 100);
                      const workerAmt = odl.workerShareAmount ?? odl.netAfterDeduction ?? Math.max(0, net - ownerAmt);
                      const cashInHand = odl.cashDepositedToOwner ?? odl.grossServiceSales ?? 0;
                      const matchedStaff = staff.find(s => s.id === odl.operatorId);
                      const avatar = odl.operatorAvatar || matchedStaff?.avatar;

                      return (
                        <tr key={odl.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4 font-sans">
                            <div className="font-bold text-white">{odl.date}</div>
                            <div className="text-[10px] text-teal-400 capitalize">
                              {odl.shift === 'full_day' ? 'পূর্ণ দিবস' : odl.shift === 'morning' ? 'সকাল' : odl.shift === 'evening' ? 'বিকাল' : odl.shift}
                            </div>
                          </td>

                          <td className="py-3 px-4 font-sans">
                            <div className="flex items-center gap-2.5">
                              {avatar ? (
                                <img
                                  src={avatar}
                                  alt={odl.operatorName}
                                  referrerPolicy="no-referrer"
                                  className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                                  {odl.operatorName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-bold text-white truncate">{odl.operatorName}</div>
                                <div className="text-[10px] text-neutral-400 truncate">{odl.operatorDesignation || odl.counterNo}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-white">
                            ৳{odl.grossServiceSales.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 text-right text-rose-400">
                            {odl.operatorExpenses && odl.operatorExpenses > 0 ? `-৳${odl.operatorExpenses.toLocaleString()}` : '৳০'}
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-teal-300">
                            ৳{net.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 text-right font-black text-emerald-400 bg-emerald-950/20">
                            ৳{ownerAmt.toLocaleString()}
                            <div className="text-[9px] text-emerald-300 font-sans font-normal">({ownerPct}%)</div>
                          </td>

                          <td className="py-3 px-4 text-right font-black text-indigo-300 bg-indigo-950/20">
                            ৳{workerAmt.toLocaleString()}
                            <div className="text-[9px] text-indigo-400 font-sans font-normal">({workerPct}%)</div>
                          </td>

                          <td className="py-3 px-4 text-right font-bold text-amber-300">
                            ৳{cashInHand.toLocaleString()}
                          </td>

                          <td className="py-3 px-4 text-center font-sans">
                            {odl.syncedToShopLedger ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>দোকানে সিঙ্ক</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => syncOperatorProfitToShopLedger(odl)}
                                className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black text-[10px] font-bold border border-amber-500/40 transition-all"
                                title="দোকানের দৈনিক হিসাবে ৬০% মুনাফা যোগ করুন"
                              >
                                সিঙ্ক করুন +
                              </button>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  const targetOp = staff.find(s => s.id === odl.operatorId) || {
                                    id: odl.operatorId,
                                    name: odl.operatorName,
                                    role: 'staff' as const,
                                    avatar: odl.operatorAvatar,
                                    phone: odl.operatorPhone || '',
                                    designation: odl.operatorDesignation
                                  };
                                  setSelectedOperatorForModal(targetOp as any);
                                  setIsOperatorModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-emerald-950 text-neutral-300 hover:text-emerald-400 transition-colors"
                                title="হিসাব সম্পাদনা বা বিস্তারিত দেখুন"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => deleteOperatorLedger(odl.id)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CUSTOMIZE CATEGORIES & LEDGER SETTINGS                             */}
      {/* ========================================================================= */}
      {activeLedgerTab === 'customize' && (
        <div className="space-y-6">
          {/* Shop Ledger Parameters Customization */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-400" />
                  <span>{language === 'bn' ? 'হিসাব খাতা কাস্টমাইজেশন ও নিয়মাবলী' : 'Ledger Parameters & General Settings'}</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn'
                    ? 'দোকানের ক্যাশ ড্রয়ার খোলার ডিফল্ট প্রারম্ভিক টাকা, দোকান শেয়ার %, ভাউচার প্রিফিক্স পরিবর্তন করুন।'
                    : 'Customize shop opening balance, default share percentage, voucher prefixes, and billing labels.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {language === 'bn' ? 'ডিফল্ট প্রারম্ভিক ক্যাশ (Opening Cash):' : 'Default Opening Cash:'}
                </label>
                <input
                  id="settings-opening-cash"
                  type="number"
                  value={ledgerSettings.defaultOpeningCash}
                  onChange={e => updateLedgerSettings({ defaultOpeningCash: Number(e.target.value) })}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {language === 'bn' ? 'দোকান শেয়ার ডিফল্ট হার (Shop Share %):' : 'Shop Share %:'}
                </label>
                <input
                  id="settings-shop-share-pct"
                  type="number"
                  min="0"
                  max="100"
                  value={ledgerSettings.defaultDeductionPercentage}
                  onChange={e => updateLedgerSettings({ defaultDeductionPercentage: Number(e.target.value) })}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {language === 'bn' ? 'ভাউচার নাম্বার প্রিফিক্স:' : 'Voucher Number Prefix:'}
                </label>
                <input
                  id="settings-voucher-prefix"
                  type="text"
                  value={ledgerSettings.voucherPrefix}
                  onChange={e => updateLedgerSettings({ voucherPrefix: e.target.value })}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Custom Categories Manager */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Categories */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="font-bold text-white text-sm">
                    {language === 'bn' ? 'আয়ের খাত / ক্যাটাগরি তালিকা' : 'Income Categories'}
                  </h4>
                </div>

                <button
                  id="add-income-cat-btn"
                  onClick={() => {
                    setNewCategoryForm({ name: '', nameBn: '', type: 'income', color: 'emerald' });
                    setIsAddCategoryOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'নতুন আয় খাত যোগ' : 'Add Category'}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allCategories
                  .filter(c => c.type === 'income')
                  .map(cat => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getBadgeColorClasses(cat.color)}`}>
                          {cat.color}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{cat.nameBn || cat.name}</div>
                          <div className="text-[10px] text-neutral-400 font-sans">{cat.name}</div>
                        </div>
                      </div>

                      {cat.isCustom && (
                        <button
                          onClick={() => deleteCustomCategory(cat.id)}
                          className="p-1 rounded-lg hover:bg-rose-950 text-neutral-500 hover:text-rose-400"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Expense Categories */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h4 className="font-bold text-white text-sm">
                    {language === 'bn' ? 'দোকান খরচের খাত / ক্যাটাগরি তালিকা' : 'Expense Categories'}
                  </h4>
                </div>

                <button
                  id="add-expense-cat-btn"
                  onClick={() => {
                    setNewCategoryForm({ name: '', nameBn: '', type: 'expense', color: 'rose' });
                    setIsAddCategoryOpen(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'নতুন খরচ খাত যোগ' : 'Add Category'}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allCategories
                  .filter(c => c.type === 'expense')
                  .map(cat => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getBadgeColorClasses(cat.color)}`}>
                          {cat.color}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white">{cat.nameBn || cat.name}</div>
                          <div className="text-[10px] text-neutral-400 font-sans">{cat.name}</div>
                        </div>
                      </div>

                      {cat.isCustom && (
                        <button
                          onClick={() => deleteCustomCategory(cat.id)}
                          className="p-1 rounded-lg hover:bg-rose-950 text-neutral-500 hover:text-rose-400"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD DAILY INCOME / COUNTER SALE                                  */}
      {/* ========================================================================= */}
      {isAddIncomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {language === 'bn' ? 'নগদ জমা / কাউন্টার সেবা আয় যোগ করুন' : 'Record Counter Revenue'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddIncomeOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIncome} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">তারিখ (Date):</label>
                  <input
                    type="date"
                    value={incomeForm.date}
                    onChange={e => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">ভাউচার নং:</label>
                  <input
                    type="text"
                    value={incomeForm.voucherNo}
                    onChange={e => setIncomeForm(prev => ({ ...prev, voucherNo: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">আয়ের খাত / ক্যাটাগরি:</label>
                <select
                  value={incomeForm.category}
                  onChange={e => setIncomeForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  {allCategories
                    .filter(c => c.type === 'income')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn || c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">কাজের বিবরণ / সেবার নাম:</label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'উদা: তেজগাঁও কলেজ লেকচার শিট ফটোকপি (১২০ পাতা)' : 'Description'}
                  value={incomeForm.title}
                  onChange={e => setIncomeForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">জমা টাকার পরিমাণ (৳):</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={incomeForm.amount === 0 ? '' : incomeForm.amount}
                    onChange={e => setIncomeForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">পেমেন্ট মাধ্যম:</label>
                  <select
                    value={incomeForm.paymentMethod}
                    onChange={e => setIncomeForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cash">নগদ ক্যাশ (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="rocket">রকেট (Rocket)</option>
                    <option value="bank">ব্যাংক ট্রান্সফার (Bank)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">গ্রাহকের নাম (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    placeholder="গ্রাহকের নাম"
                    value={incomeForm.customerName}
                    onChange={e => setIncomeForm(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">মোবাইল নং (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    value={incomeForm.customerPhone}
                    onChange={e => setIncomeForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">অতিরিক্ত নোট:</label>
                <input
                  type="text"
                  placeholder="নোট..."
                  value={incomeForm.notes}
                  onChange={e => setIncomeForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950"
                >
                  জমা সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD STORE EXPENSE / OPERATIONAL VOUCHER                          */}
      {/* ========================================================================= */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Minus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">
                  {language === 'bn' ? 'দোকানের খরচ ও ভাউচার লিখুন' : 'Record Shop Expense Voucher'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">তারিখ (Date):</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={e => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">ভাউচার নং:</label>
                  <input
                    type="text"
                    value={expenseForm.voucherNo}
                    onChange={e => setExpenseForm(prev => ({ ...prev, voucherNo: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">খরচের খাত / ক্যাটাগরি:</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                >
                  {allCategories
                    .filter(c => c.type === 'expense')
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nameBn || c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">খরচের বিবরণ:</label>
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'উদা: সকালের নাস্তা ও চা (স্টাফ)' : 'Title'}
                  value={expenseForm.title}
                  onChange={e => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">টাকার পরিমাণ (৳):</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={expenseForm.amount === 0 ? '' : expenseForm.amount}
                    onChange={e => setExpenseForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-rose-400 font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">পেমেন্ট মাধ্যম:</label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={e => setExpenseForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="cash">নগদ ক্যাশ ড্রয়ার (Cash)</option>
                    <option value="bkash">বিকাশ (bKash)</option>
                    <option value="nagad">নগদ (Nagad)</option>
                    <option value="bank">ব্যাংক (Bank)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">প্রাপক / কাকে দেওয়া হলো:</label>
                  <input
                    type="text"
                    placeholder="উদা: ইন্দিরারোড চায়ের দোকান"
                    value={expenseForm.paidTo}
                    onChange={e => setExpenseForm(prev => ({ ...prev, paidTo: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">পরিশোধকারী (Staff):</label>
                  <input
                    type="text"
                    value={expenseForm.paidBy}
                    onChange={e => setExpenseForm(prev => ({ ...prev, paidBy: e.target.value }))}
                    className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">মন্তব্য:</label>
                <input
                  type="text"
                  placeholder="নোট..."
                  value={expenseForm.note}
                  onChange={e => setExpenseForm(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-950"
                >
                  খরচ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD CUSTOM CATEGORY                                              */}
      {/* ========================================================================= */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {language === 'bn' ? 'নতুন ক্যাটাগরি তৈরি করুন' : 'Add Custom Category'}
              </h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">ক্যাটাগরি ধরন:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategoryForm(p => ({ ...p, type: 'income', color: 'emerald' }))}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      newCategoryForm.type === 'income'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    আয়ের খাত (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategoryForm(p => ({ ...p, type: 'expense', color: 'rose' }))}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      newCategoryForm.type === 'expense'
                        ? 'bg-rose-600 text-white border-rose-400'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    খরচের খাত (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">বাংলা নাম (Bangla Name):</label>
                <input
                  type="text"
                  placeholder="উদা: ফটোকপি সেবা / চা নাস্তা"
                  value={newCategoryForm.nameBn}
                  onChange={e => setNewCategoryForm(prev => ({ ...prev, nameBn: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">ইংরেজি নাম (English Name):</label>
                <input
                  type="text"
                  placeholder="e.g. Photocopy Sales"
                  value={newCategoryForm.name}
                  onChange={e => setNewCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">রং / কালার ট্যাগ:</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['emerald', 'teal', 'cyan', 'blue', 'indigo', 'amber', 'rose', 'purple', 'yellow', 'slate'].map(
                    col => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewCategoryForm(p => ({ ...p, color: col }))}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize transition-all ${
                          newCategoryForm.color === col
                            ? 'ring-2 ring-white ' + getBadgeColorClasses(col)
                            : getBadgeColorClasses(col)
                        }`}
                      >
                        {col}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-950"
                >
                  ক্যাটাগরি সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PRINT VOUCHER MEMO PREVIEW                                       */}
      {/* ========================================================================= */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-neutral-900 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black">{settings.businessNameBn}</h2>
              <p className="text-xs text-neutral-600">{settings.addressBn}</p>
              <p className="text-xs font-mono text-neutral-600">ফোন: {settings.phonePrimary}</p>
              <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-neutral-100 text-xs font-bold uppercase border">
                {selectedVoucherForPrint.type === 'income' ? 'নগদ জমার ভাউচার (Income Receipt)' : 'দোকান খরচ ভাউচার (Expense Voucher)'}
              </div>
            </div>

            <div className="text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">ভাউচার নং:</span>
                <span className="font-bold">{selectedVoucherForPrint.data.voucherNo || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">তারিখ ও সময়:</span>
                <span>{selectedVoucherForPrint.data.date} | {selectedVoucherForPrint.data.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">খাত / বিবরণ:</span>
                <span className="font-bold max-w-[200px] text-right truncate">{selectedVoucherForPrint.data.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">পেমেন্ট মাধ্যম:</span>
                <span className="capitalize">{selectedVoucherForPrint.data.paymentMethod}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-black">
                <span>মোট টাকা:</span>
                <span>৳{selectedVoucherForPrint.data.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t pt-4 flex items-center justify-between text-neutral-400 text-[10px]">
              <div>গ্রহীতার স্বাক্ষর</div>
              <div>কর্তৃপক্ষের স্বাক্ষর</div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operator Profit Share & 60/40 Settlement Modal */}
      {isOperatorModalOpen && (
        <OperatorProfitShareModal
          isOpen={isOperatorModalOpen}
          onClose={() => {
            setIsOperatorModalOpen(false);
            setSelectedOperatorForModal(null);
          }}
          operator={selectedOperatorForModal}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
};
