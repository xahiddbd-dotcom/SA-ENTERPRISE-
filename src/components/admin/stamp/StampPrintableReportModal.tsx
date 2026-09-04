import React from 'react';
import { StampSaleRecord, WebsiteSettings } from '../../../types';
import { X, Printer, Download } from 'lucide-react';

interface StampPrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales?: StampSaleRecord[];
  settings?: Partial<WebsiteSettings>;
  stats?: {
    totalSalesAmount: number;
    totalBuyCost: number;
    totalProfit: number;
    totalQuantity: number;
    stamp50Count: number;
    stamp100Count: number;
    cartridgeCount: number;
    otherCount: number;
  };
  totalStockPurchasesCost?: number;
  dateFilter?: string;
  customStartDate?: string;
  customEndDate?: string;
  configs?: any[];
  purchases?: any[];
}

export const StampPrintableReportModal: React.FC<StampPrintableReportModalProps> = ({
  isOpen,
  onClose,
  sales = [],
  settings: rawSettings = {},
  stats: incomingStats,
  totalStockPurchasesCost = 0,
  dateFilter = 'all'
}) => {
  if (!isOpen) return null;

  const settings = rawSettings as Partial<WebsiteSettings>;

  // Fallback stats computation if not passed
  const stats = incomingStats || {
    totalSalesAmount: sales.reduce((sum, s) => sum + (s.totalSaleAmount || 0), 0),
    totalBuyCost: sales.reduce((sum, s) => sum + (s.totalBuyCost || 0), 0),
    totalProfit: sales.reduce((sum, s) => sum + (s.totalProfit || 0), 0),
    totalQuantity: sales.reduce((sum, s) => sum + (s.quantity || 0), 0),
    stamp50Count: sales.filter(s => s.itemType === 'stamp_50').reduce((sum, s) => sum + (s.quantity || 0), 0),
    stamp100Count: sales.filter(s => s.itemType === 'stamp_100').reduce((sum, s) => sum + (s.quantity || 0), 0),
    cartridgeCount: sales.filter(s => s.itemType === 'cartridge_paper').reduce((sum, s) => sum + (s.quantity || 0), 0),
    otherCount: sales.filter(s => !['stamp_50', 'stamp_100', 'cartridge_paper'].includes(s.itemType)).reduce((sum, s) => sum + (s.quantity || 0), 0)
  };

  const getBengaliMonthAndDate = () => {
    const d = new Date();
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const mIndex = d.getMonth();
    const year = d.getFullYear();
    const day = d.getDate();
    return {
      monthBn: `${monthsBn[mIndex]} ${year}`,
      dateBn: `${day} ${monthsBn[mIndex]}, ${year}`,
      timeBn: d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { monthBn, dateBn, timeBn } = getBengaliMonthAndDate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="rounded-2xl bg-white text-neutral-900 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto overflow-hidden">
        {/* Modal Actions Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-100 border-b border-neutral-200 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-neutral-800">
              জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার বিক্রয় ও ক্রয় রিপোর্ট (প্রিন্ট ভিউ)
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 font-semibold">
              মাস: {monthBn}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / PDF হিসেবে সংরক্ষণ</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-6 lg:p-8 overflow-y-auto flex-1 font-sans text-neutral-900 print:p-0 print:overflow-visible">
          {/* Shop Header */}
          <div className="text-center pb-5 border-b-2 border-neutral-800">
            <h1 className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight">
              {settings.businessNameBn || 'সাইফুল এন্টারপ্রাইজ'}
            </h1>
            <p className="text-sm text-neutral-700 font-medium mt-1">
              {settings.businessName || 'Saiful Enterprise'} - কম্পিউটার কম্পোজ, প্রিন্ট, অনলাইন সেবা ও স্ট্যাম্প ভেন্ডার পয়েন্ট
            </p>
            <p className="text-xs text-neutral-600 mt-0.5">
              ঠিকানা: {settings.addressBn || '২০/১, সাগর-সৈকত মার্কেট, ইন্দিরা রোড, ফার্মগেট/তেজগাঁও, ঢাকা-১২১৫'}
            </p>
            <p className="text-xs font-mono font-semibold text-neutral-800 mt-0.5">
              মোবাইল: {settings.phonePrimary || '০১৫৪০০০৪৯৬৬'} | ইমেইল: saifulenterprise2020@gmail.com
            </p>

            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
              জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার বিক্রয়, ক্রয় ব্যয় ও মুনাফা রেজিস্টার
            </div>
          </div>

          {/* Month, Date & Period Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-b border-neutral-300 text-xs text-neutral-700 bg-neutral-50 px-3 rounded-lg mt-3">
            <div>
              <span className="text-neutral-500">রিপোর্টের মাস:</span>{' '}
              <strong className="text-neutral-900 font-bold">{monthBn}</strong>
            </div>
            <div>
              <span className="text-neutral-500">রিপোর্ট তৈরির তারিখ:</span>{' '}
              <strong className="text-neutral-900">{dateBn} ({timeBn})</strong>
            </div>
            <div>
              <span className="text-neutral-500">ফিল্টার মেয়াদ:</span>{' '}
              <strong className="text-neutral-900 uppercase">{dateFilter}</strong>
            </div>
            <div className="text-right">
              <span className="text-neutral-500">রেকর্ড সংখ্যা:</span>{' '}
              <strong className="text-neutral-900 font-bold">{sales.length} টি</strong>
            </div>
          </div>

          {/* Financial Summary Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50">
              <div className="text-[11px] text-neutral-500 font-semibold">মোট বিক্রয় মূল্য (Total Sales)</div>
              <div className="text-xl font-bold font-mono text-neutral-900 mt-0.5">
                ৳{stats.totalSalesAmount.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">বিক্রিত মোট মূল্য</div>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50">
              <div className="text-[11px] text-neutral-500 font-semibold">মোট ক্রয় ব্যয় (Total Cost)</div>
              <div className="text-xl font-bold font-mono text-red-600 mt-0.5">
                ৳{stats.totalBuyCost.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">বিক্রিত স্ট্যাম্পের ক্রয় ব্যয়</div>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50">
              <div className="text-[11px] text-emerald-800 font-bold">মোট নিট মুনাফা (Net Profit)</div>
              <div className="text-xl font-black font-mono text-emerald-700 mt-0.5">
                +৳{stats.totalProfit.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                মার্জিন: {stats.totalSalesAmount > 0 ? Math.round((stats.totalProfit / stats.totalSalesAmount) * 100) : 0}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-300 bg-neutral-50">
              <div className="text-[11px] text-neutral-500 font-semibold">স্টক ক্রয় খরচ ও বিক্রিত পিস</div>
              <div className="text-base font-bold font-mono text-neutral-900 mt-0.5">
                মোট {stats.totalQuantity} পিস
              </div>
              <div className="text-[10px] text-neutral-600 mt-1">
                ৫০৳: {stats.stamp50Count} | ১০০৳: {stats.stamp100Count} | কার্টিজ: {stats.cartridgeCount}
              </div>
            </div>
          </div>

          {/* Detailed Table with Serial Numbers */}
          <div className="border border-neutral-300 rounded-lg overflow-hidden mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 text-neutral-700 font-bold">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">তারিখ</th>
                  <th className="py-2.5 px-3">আইটেম / স্ট্যাম্প</th>
                  <th className="py-2.5 px-3">স্ট্যাম্পের ক্রমিক নং (Serial No)</th>
                  <th className="py-2.5 px-2 text-center">পরিমাণ</th>
                  <th className="py-2.5 px-2 text-right">একক ক্রয়</th>
                  <th className="py-2.5 px-2 text-right">একক বিক্রয়</th>
                  <th className="py-2.5 px-3 text-right">মোট বিক্রয়</th>
                  <th className="py-2.5 px-3 text-right">মোট ব্যয়</th>
                  <th className="py-2.5 px-3 text-right">অর্জিত মুনাফা</th>
                  <th className="py-2.5 px-3">দলিলের বিবরণ ও ক্রেতা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-neutral-500">
                      কোনো বিক্রয় রেকর্ড পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  sales.map((sale, idx) => (
                    <tr key={sale.id} className="hover:bg-neutral-50 text-[11px]">
                      <td className="py-2 px-3 font-mono text-neutral-500">{idx + 1}</td>
                      <td className="py-2 px-3 whitespace-nowrap font-medium">{sale.date}</td>
                      <td className="py-2 px-3 font-semibold text-neutral-900">{sale.itemNameBn}</td>
                      <td className="py-2 px-3 font-mono text-neutral-800 font-bold">
                        {sale.serialNumbers || '-'}
                      </td>
                      <td className="py-2 px-2 text-center font-bold">{sale.quantity}</td>
                      <td className="py-2 px-2 text-right font-mono text-neutral-600">৳{sale.buyPricePerUnit}</td>
                      <td className="py-2 px-2 text-right font-mono text-neutral-900">৳{sale.salePricePerUnit}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-neutral-900">৳{sale.totalSaleAmount}</td>
                      <td className="py-2 px-3 text-right font-mono text-red-600">৳{sale.totalBuyCost}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/50">
                        +৳{sale.totalProfit}
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-neutral-900">{sale.deedType || '-'}</div>
                        <div className="text-[10px] text-neutral-500">{sale.customerName || 'নগদ ক্রেতা'} {sale.customerPhone ? `(${sale.customerPhone})` : ''}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="border-t-2 border-neutral-800 bg-neutral-100 font-bold text-xs">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-right">সর্বমোট যোগফল:</td>
                  <td className="py-2.5 px-2 text-center font-bold">{stats.totalQuantity}</td>
                  <td colSpan={2}></td>
                  <td className="py-2.5 px-3 text-right font-mono text-neutral-900 font-extrabold">৳{stats.totalSalesAmount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-700 font-extrabold">৳{stats.totalBuyCost.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-extrabold">+৳{stats.totalProfit.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-xs text-neutral-700">
            <div className="text-center border-t border-neutral-400 pt-2">
              <p className="font-bold text-neutral-900">প্রস্তুতকারক ও স্ট্যাম্প ভেন্ডার স্বাক্ষর</p>
              <p className="text-[10px] text-neutral-500">সাইফুল ইসলাম (স্বত্বাধিকারী)</p>
            </div>
            <div className="text-center border-t border-neutral-400 pt-2">
              <p className="font-bold text-neutral-900">কর্তৃপক্ষের সিল ও অনুমোদন</p>
              <p className="text-[10px] text-neutral-500">সাইফুল এন্টারপ্রাইজ - ঢাকা</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
