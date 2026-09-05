import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useData } from '../../../context/DataContext';
import { User as UserType } from '../../../types';
import { OperatorProfitShareModal } from '../ledger/OperatorProfitShareModal';
import {
  Coins,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface OperatorProfitShareWidgetProps {
  onNavigateToLedger?: () => void;
}

export const OperatorProfitShareWidget: React.FC<OperatorProfitShareWidgetProps> = ({
  onNavigateToLedger
}) => {
  const { language } = useLanguage();
  const { staff, operatorLedgers, syncOperatorProfitToShopLedger } = useData();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOperatorForModal, setSelectedOperatorForModal] = useState<UserType | null>(null);

  // Filter ledgers for active date
  const dateLedgers = useMemo(() => {
    return operatorLedgers.filter(l => l.date === selectedDate);
  }, [operatorLedgers, selectedDate]);

  // Aggregate totals
  const totals = useMemo(() => {
    const gross = dateLedgers.reduce((sum, l) => sum + (l.grossServiceSales || 0), 0);
    const exp = dateLedgers.reduce((sum, l) => sum + (l.operatorExpenses || 0), 0);
    const net = Math.max(0, gross - exp);
    const ownerShare = dateLedgers.reduce((sum, l) => {
      if (l.ownerShareAmount !== undefined) return sum + l.ownerShareAmount;
      const pct = l.ownerSharePercentage ?? l.deductionPercentage ?? 60;
      const singleNet = Math.max(0, (l.grossServiceSales || 0) - (l.operatorExpenses || 0));
      return sum + Math.round((singleNet * pct) / 100);
    }, 0);
    const workerShare = dateLedgers.reduce((sum, l) => {
      if (l.workerShareAmount !== undefined) return sum + l.workerShareAmount;
      const pct = l.workerSharePercentage ?? (100 - (l.ownerSharePercentage ?? 60));
      const singleNet = Math.max(0, (l.grossServiceSales || 0) - (l.operatorExpenses || 0));
      return sum + Math.round((singleNet * pct) / 100);
    }, 0);
    const cashInHand = dateLedgers.reduce((sum, l) => sum + (l.cashDepositedToOwner ?? l.grossServiceSales ?? 0), 0);
    const syncedCount = dateLedgers.filter(l => l.syncedToShopLedger).length;

    return {
      gross,
      exp,
      net,
      ownerShare,
      workerShare,
      cashInHand,
      syncedCount,
      totalEntries: dateLedgers.length
    };
  }, [dateLedgers]);

  // All eligible operators/staff (All shop service operators and staff)
  const activeOperators = useMemo(() => {
    return staff.filter(s => s.role !== 'customer');
  }, [staff]);

  return (
    <div className="bg-neutral-900 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-lg shadow-emerald-950/60">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center text-emerald-400 font-black text-xs sm:text-sm">
              60/40
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'bn' ? 'কর্মীদের দৈনিক হিসাব ও ৬০/৪০ মুনাফা ফরম্যাট' : 'Operator 60/40 Profit Share & Daily Split'}</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                {language === 'bn' ? 'দোকানের খাতায় সিঙ্ক' : 'Shop Ledger Synced'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'bn'
                ? 'কর্মীদের দৈনিক সেবা আয় ও খরচ হিসাব; ৬০% মালিকের লাভ হিসেবে দোকানের দৈনিক হিসাব খাতায় যুক্ত হয়।'
                : '60% of net turnover automatically credited to the Daily Shop Ledger, 40% reserved for operator commission.'}
            </p>
          </div>
        </div>

        {/* Date filter & actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setSelectedOperatorForModal(activeOperators[0] || null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হিসাব যুক্ত করুন' : 'Record Shift'}</span>
          </button>

          {onNavigateToLedger && (
            <button
              onClick={onNavigateToLedger}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 text-xs font-bold border border-neutral-700 transition-colors"
            >
              <span>{language === 'bn' ? 'দোকানের হিসাব খাতা' : 'Daily Ledger'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Main Bento Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {/* Card 1: Owner's 60% Share */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-neutral-950 border border-emerald-500/50 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'মালিকের ৬০% মুনাফা' : 'Owner 60% Share'}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
              60%
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
            ৳{totals.ownerShare.toLocaleString()}
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-neutral-300">
            <span className="text-emerald-300/90 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{language === 'bn' ? 'দোকানের খাতায় সিঙ্ক হয়েছে' : 'Credited to shop ledger'}</span>
            </span>
            <span className="font-mono font-bold text-white">{totals.syncedCount} এন্ট্রি</span>
          </div>
        </div>

        {/* Card 2: Workers' 40% Commission */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-neutral-900 to-neutral-950 border border-indigo-500/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>{language === 'bn' ? 'কর্মীদের ৪০% কমিশন' : 'Worker 40% Share'}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold font-mono">
              40%
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-300 font-mono tracking-tight">
            ৳{totals.workerShare.toLocaleString()}
          </div>
          <div className="mt-2 pt-2 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-neutral-400">
            <span>{language === 'bn' ? 'কর্মীদের নিট পারিশ্রমিক' : 'Net worker payout'}</span>
            <span className="font-mono text-indigo-300 font-bold">{activeOperators.length} অপারেটর</span>
          </div>
        </div>

        {/* Card 3: Gross Work & Expenses */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold text-neutral-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span>{language === 'bn' ? 'মোট কাজ ও নিট সেবা' : 'Gross & Net Turnover'}</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              ব্যয়: -৳{totals.exp.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            ৳{totals.gross.toLocaleString()}
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
            <span>{language === 'bn' ? 'নিট সেবা আয় (খরচ বাদে):' : 'Net after exp:'}</span>
            <span className="font-mono text-teal-300 font-bold">৳{totals.net.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: Cash in Hand Deposited to Shop */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 via-neutral-900 to-neutral-950 border border-amber-500/30 shadow-md">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'কাউন্টারে নগদ ক্যাশ জমা' : 'Cash Deposited to Shop'}</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              নগদ
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
            ৳{totals.cashInHand.toLocaleString()}
          </div>
          <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-neutral-400">
            <span>{language === 'bn' ? 'দোকানের ক্যাশ ড্রয়ারে জমা' : 'Drawer cash balance'}</span>
            <span className="font-mono text-amber-300 font-bold">নিশ্চিত ক্যাশ</span>
          </div>
        </div>
      </div>

      {/* Operator Photo Buttons Strip (ছবিসহ প্রতিটি কর্মীর বাটন) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-neutral-300 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'প্রতিটি কর্মীর ছবিসহ বাটন (ক্লিক করে ৬০/৪০ হিসাব ও আয়-ব্যয় ইনপুট করুন):' : 'Click operator photo to calculate & settle 60/40 shift:'}</span>
          </span>
          <span className="text-[11px] text-neutral-500">
            {language === 'bn' ? 'মোট সক্রিয় কর্মী: ' : 'Active Staff: '}{activeOperators.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {activeOperators.map(operator => {
            const opShift = dateLedgers.find(l => l.operatorId === operator.id);
            const gross = opShift?.grossServiceSales || 0;
            const exp = opShift?.operatorExpenses || 0;
            const net = Math.max(0, gross - exp);
            const owner60 = opShift?.ownerShareAmount ?? Math.round((net * 60) / 100);
            const worker40 = opShift?.workerShareAmount ?? Math.max(0, net - owner60);
            const cashInHand = opShift?.cashDepositedToOwner ?? gross;

            return (
              <button
                key={operator.id}
                type="button"
                onClick={() => {
                  setSelectedOperatorForModal(operator);
                  setIsModalOpen(true);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                  opShift
                    ? 'bg-neutral-950/90 hover:bg-neutral-800/90 border-emerald-500/50 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-neutral-950/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {operator.avatar ? (
                        <img
                          src={operator.avatar}
                          alt={operator.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all shadow-md shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white font-bold flex items-center justify-center border-2 border-emerald-500/40 text-sm shadow-md shrink-0">
                          {operator.name.charAt(0)}
                        </div>
                      )}
                      {opShift && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-neutral-950 flex items-center justify-center text-black">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-emerald-300 transition-colors">
                          {language === 'bn' && operator.nameBn ? operator.nameBn : operator.name}
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                          opShift ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {opShift ? (language === 'bn' ? 'হিসাব সম্পন্ন' : 'Settled') : (language === 'bn' ? 'শিফট বাকি' : 'Pending')}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-400/90 truncate font-medium">
                        {operator.designationBn || operator.designation || operator.role}
                      </p>
                      {operator.shift && (
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                          <span>{operator.shift}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 60/40 Split Preview for this operator */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80 grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
                      <span className="text-[9px] text-neutral-400 block">{language === 'bn' ? 'মোট কাজ' : 'Gross'}</span>
                      <span className="font-mono font-bold text-white text-[11px]">৳{gross.toLocaleString()}</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                      <span className="text-[9px] text-emerald-400 font-bold block">{language === 'bn' ? 'মালিক ৬০%' : 'Owner 60%'}</span>
                      <span className="font-mono font-extrabold text-emerald-300 text-[11px]">৳{owner60.toLocaleString()}</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                      <span className="text-[9px] text-indigo-400 font-bold block">{language === 'bn' ? 'কর্মী ৪০%' : 'Worker 40%'}</span>
                      <span className="font-mono font-extrabold text-indigo-300 text-[11px]">৳{worker40.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-amber-300 font-mono font-semibold">
                    {language === 'bn' ? 'ক্যাশ জমা: ' : 'Cash: '}৳{cashInHand.toLocaleString()}
                  </span>
                  <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                    <span>{opShift ? (language === 'bn' ? 'হিসাব পরিবর্তন' : 'Edit') : (language === 'bn' ? 'হিসাব করুন' : 'Settle')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operator Profit Share & Settlement Modal */}
      {isModalOpen && (
        <OperatorProfitShareModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOperatorForModal(null);
          }}
          operator={selectedOperatorForModal}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
};
