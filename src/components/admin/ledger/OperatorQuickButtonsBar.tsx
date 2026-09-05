import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useData } from '../../../context/DataContext';
import { User, OperatorDailyLedger } from '../../../types';
import {
  User as UserIcon,
  Plus,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Calculator,
  ShieldCheck,
  RefreshCw,
  Coins
} from 'lucide-react';

interface OperatorQuickButtonsBarProps {
  selectedDate: string;
  onSelectOperator: (operator: User) => void;
  className?: string;
  compact?: boolean;
}

export const OperatorQuickButtonsBar: React.FC<OperatorQuickButtonsBarProps> = ({
  selectedDate,
  onSelectOperator,
  className = '',
  compact = false
}) => {
  const { language } = useLanguage();
  const { staff, operatorLedgers, syncOperatorProfitToShopLedger } = useData();

  // Filter staff who are operators/staff (or include all working staff)
  const operatorStaff = staff.filter(s => s.role !== 'customer');

  // Compute stats for selected date
  const dateOperatorLedgers = operatorLedgers.filter(l => l.date === selectedDate);

  const totalGrossToday = dateOperatorLedgers.reduce((acc, l) => acc + (l.grossServiceSales || 0), 0);
  const totalOwner60Today = dateOperatorLedgers.reduce((acc, l) => acc + (l.ownerShareAmount || Math.round((((l.grossServiceSales || 0) - (l.operatorExpenses || 0)) * (l.ownerSharePercentage || 60)) / 100)), 0);
  const totalWorker40Today = dateOperatorLedgers.reduce((acc, l) => acc + (l.workerShareAmount || Math.round((((l.grossServiceSales || 0) - (l.operatorExpenses || 0)) * (l.workerSharePercentage || 40)) / 100)), 0);
  const totalCashDepositedToday = dateOperatorLedgers.reduce((acc, l) => acc + (l.cashDepositedToOwner ?? l.grossServiceSales ?? 0), 0);

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {operatorStaff.map(worker => {
          const workerLedger = dateOperatorLedgers.find(l => l.operatorId === worker.id);
          const hasLedger = !!workerLedger;
          const gross = workerLedger?.grossServiceSales || 0;
          const owner60 = workerLedger?.ownerShareAmount || (hasLedger ? Math.round(((gross - (workerLedger.operatorExpenses || 0)) * 60) / 100) : 0);

          return (
            <button
              key={worker.id}
              onClick={() => onSelectOperator(worker)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs active:scale-95 ${
                hasLedger
                  ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/40 text-white shadow-sm'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-300'
              }`}
            >
              <div className="relative shrink-0">
                {worker.avatar ? (
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-neutral-700 group-hover:border-emerald-400 transition-colors"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    {worker.name.charAt(0)}
                  </div>
                )}
                {hasLedger && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-neutral-950" />
                )}
              </div>

              <div className="text-left min-w-0">
                <div className="font-bold truncate max-w-[120px] text-white flex items-center gap-1">
                  <span>{worker.name.split(' ')[0]}</span>
                  {hasLedger && <span className="text-[9px] text-emerald-400 font-mono">৳{gross}</span>}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {hasLedger ? (
                    <span className="text-emerald-300 font-bold">মালিক ৬০%: ৳{owner60}</span>
                  ) : (
                    <span>হিসাব লিখুন +</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4 ${className}`}>
      {/* Top Header of the Operator Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/60">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                {language === 'bn' ? 'প্রতিটি কর্মীর বাটন ও দৈনিক ক্যাশ হিসাব' : 'Operator Daily Collection & Cash Bar'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                ৬০% মালিক • ৪০% কর্মী
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'bn'
                ? 'ছবিসহ প্রতিটি কর্মীর বাটনে ক্লিক করে কাজের হিসাব, খরচ ও ৬০/৪০ বন্টন যুক্ত করুন।'
                : 'Click any operator button to record turnover, expenses & calculate 60% owner / 40% worker split.'}
            </p>
          </div>
        </div>

        {/* Aggregate Quick Badges for Selected Date */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">{language === 'bn' ? 'মোট কাজ:' : 'Gross:'}</span>
            <strong className="text-emerald-400 font-mono">৳{totalGrossToday.toLocaleString()}</strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-center gap-2 shadow-sm">
            <span className="text-[11px] text-emerald-400 font-semibold">{language === 'bn' ? 'মালিকের ৬০% মুনাফা:' : 'Owner 60%:'}</span>
            <strong className="text-emerald-300 font-mono font-black">৳{totalOwner60Today.toLocaleString()}</strong>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-200 flex items-center gap-2">
            <span className="text-[11px] text-indigo-400">{language === 'bn' ? 'কর্মী ৪০% কমিশন:' : 'Worker 40%:'}</span>
            <strong className="text-indigo-300 font-mono">৳{totalWorker40Today.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Operator Photo Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {operatorStaff.map(worker => {
          const workerLedger = dateOperatorLedgers.find(l => l.operatorId === worker.id);
          const hasLedger = !!workerLedger;
          const gross = workerLedger?.grossServiceSales || 0;
          const expenses = workerLedger?.operatorExpenses || 0;
          const net = workerLedger?.netServiceIncome || Math.max(0, gross - expenses);
          const ownerPct = workerLedger?.ownerSharePercentage ?? 60;
          const workerPct = workerLedger?.workerSharePercentage ?? (100 - ownerPct);
          const owner60 = workerLedger?.ownerShareAmount || (hasLedger ? Math.round((net * ownerPct) / 100) : 0);
          const worker40 = workerLedger?.workerShareAmount || (hasLedger ? Math.max(0, net - owner60) : 0);
          const cashDeposited = workerLedger?.cashDepositedToOwner ?? (hasLedger ? gross : 0);
          const isSynced = workerLedger?.syncedToShopLedger ?? true;

          return (
            <div
              key={worker.id}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                hasLedger
                  ? 'bg-neutral-950/90 border-emerald-500/40 hover:border-emerald-400 shadow-lg'
                  : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Operator Button Top Row: Photo + Name + Designation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectOperator(worker)}
                  className="flex items-center gap-3 text-left min-w-0 group-hover:opacity-90 transition-opacity"
                >
                  <div className="relative shrink-0">
                    {worker.avatar ? (
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-neutral-700 group-hover:border-emerald-400 transition-colors shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-base">
                        {worker.name.charAt(0)}
                      </div>
                    )}
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-neutral-950 ${hasLedger ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                      {language === 'bn' && worker.nameBn ? worker.nameBn : worker.name}
                    </h4>
                    <p className="text-[11px] text-emerald-400/90 truncate font-medium">
                      {worker.designationBn || worker.designation || (worker.role === 'admin' ? 'মালিক ও সুপারভাইজার' : 'কম্পিউটার অপারেটর')}
                    </p>
                    {worker.shift && (
                      <p className="text-[10px] text-neutral-400 truncate">
                        {worker.shift}
                      </p>
                    )}
                    {worker.phone && (
                      <p className="text-[10px] text-neutral-500 font-mono">
                        {worker.phone}
                      </p>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectOperator(worker)}
                  className={`shrink-0 p-2 rounded-xl border text-xs font-bold transition-all ${
                    hasLedger
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-950'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700 hover:border-emerald-500/50'
                  }`}
                  title={hasLedger ? 'হিসাব পরিবর্তন বা দেখুন' : 'হিসাব যুক্ত করুন'}
                >
                  {hasLedger ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সম্পন্ন</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>হিসাব দিন</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Breakdown Cards if Shift Recorded */}
              {hasLedger ? (
                <div className="mt-3.5 pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
                  {/* Gross Work & Expenses */}
                  <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                    <span>মোট কাজ: <strong className="text-white font-mono">৳{gross.toLocaleString()}</strong></span>
                    <span>খরচ: <strong className="text-rose-400 font-mono">৳{expenses.toLocaleString()}</strong></span>
                    <span>নিট: <strong className="text-teal-400 font-mono">৳{net.toLocaleString()}</strong></span>
                  </div>

                  {/* 60% Owner & 40% Worker Share Format */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">মালিকের ৬০% অংশ</div>
                      <div className="text-sm font-black text-white font-mono">৳{owner60.toLocaleString()}</div>
                      <div className="text-[9px] text-emerald-300 mt-0.5">দোকানের খাতায় যুক্ত ✅</div>
                    </div>

                    <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                      <div className="text-[10px] text-indigo-400 font-bold uppercase">কর্মীর ৪০% কমিশন</div>
                      <div className="text-sm font-black text-indigo-200 font-mono">৳{worker40.toLocaleString()}</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">প্রাপ্য পারিশ্রমিক</div>
                    </div>
                  </div>

                  {/* Cash Deposited to Owner */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                    <span>ক্যাশে জমা: <strong className="text-amber-300 font-mono font-bold">৳{cashDeposited.toLocaleString()}</strong></span>
                    <button
                      type="button"
                      onClick={() => onSelectOperator(worker)}
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold flex items-center gap-0.5"
                    >
                      <span>বিস্তারিত স্লিপ</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
                  <span>আজকের হিসাব এখনও জমা হয়নি</span>
                  <button
                    type="button"
                    onClick={() => onSelectOperator(worker)}
                    className="text-emerald-400 hover:underline font-semibold text-[11px]"
                  >
                    হিসাব যুক্ত করুন +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
