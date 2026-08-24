import React, { useEffect, useCallback } from 'react';
import {
  X,
  Copy,
  Check,
  Calendar,
  Truck,
  Box,
  Printer,
  RefreshCw,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Order, OrderItem } from '../../types';
import { Image } from '../common/Image';
import { OrderFeedbackForm } from './OrderFeedbackForm';

interface OrderQuickViewModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder: (order: Order, specificItem?: OrderItem) => void;
  onOpenInvoice: (order: Order) => void;
  onOpenTracker?: (orderNumber: string) => void;
  onSubmitReview: (orderId: string, rating: number, feedback: string) => void;
  onSimulateStatus?: (orderId: string, status: 'ready' | 'delivered') => void;
}

const TIMELINE_STAGES = [
  { key: 'pending', titleBn: 'অর্ডার দাখিল', titleEn: 'Placed', icon: Clock },
  { key: 'confirmed', titleBn: 'যাচাই ও নিশ্চিত', titleEn: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', titleBn: 'কাগজ কাটিং ও প্রস্তুত', titleEn: 'Processing', icon: Box },
  { key: 'ready', titleBn: 'ডেলিভারিতে প্রেরিত', titleEn: 'Out for Delivery', icon: Truck },
  { key: 'delivered', titleBn: 'ডেলিভারি সম্পন্ন', titleEn: 'Delivered', icon: CheckCircle2 }
];

const getStatusIndex = (status: string): number => {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'processing': return 2;
    case 'ready': return 3;
    case 'delivered': return 4;
    case 'cancelled': return -1;
    default: return 0;
  }
};

export const OrderQuickViewModal: React.FC<OrderQuickViewModalProps> = React.memo(({
  order,
  onClose,
  onReorder,
  onOpenInvoice,
  onOpenTracker,
  onSubmitReview,
  onSimulateStatus
}) => {
  const { language } = useLanguage();
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (order) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [order, onClose]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  }, []);

  if (!order) return null;

  const currentStepIdx = getStatusIndex(order.orderStatus);

  return (
    <div
      id="order-quick-view-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-quick-view-title"
    >
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-neutral-950/80 border-b border-neutral-800 flex items-start justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-neutral-400 font-mono">
                {language === 'bn' ? 'অর্ডার কুইক ভিউ:' : 'Order Quick View:'}
              </span>
              <h3 id="order-quick-view-title" className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
                {order.orderNumber}
              </h3>

              <button
                type="button"
                onClick={() => handleCopy(order.orderNumber)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-700 transition-colors"
                title="Copy Order ID"
              >
                {copiedText === order.orderNumber ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${
                  order.orderStatus === 'delivered'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : order.orderStatus === 'ready'
                    ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                    : order.orderStatus === 'processing'
                    ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                    : order.orderStatus === 'confirmed'
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                    : order.orderStatus === 'cancelled'
                    ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                    : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-neutral-400 pt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </span>
              <span>•</span>
              <span className="capitalize">
                {order.deliveryType === 'pickup'
                  ? language === 'bn' ? 'কাউন্টার সংগ্রহ (Pickup)' : 'Counter Pickup'
                  : language === 'bn' ? 'হোম ডেলিভারি (Home Delivery)' : 'Home Delivery'}
              </span>
              <span>•</span>
              <span className="uppercase font-semibold text-emerald-400">
                {order.paymentMethod} {order.paymentTrxId ? `(${order.paymentTrxId})` : ''}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            title="Close Quick View Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto divide-y divide-neutral-800/60">
          {/* Section 1: Visual Delivery Progress Bar */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  {language === 'bn' ? 'ডেলিভারি ট্র্যাকিং স্ট্যাটাস' : 'Delivery Progress'}
                </h4>
              </div>

              {onOpenTracker && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTracker(order.orderNumber);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold hover:underline"
                >
                  <span>{language === 'bn' ? 'লাইভ ট্র্যাকারে দেখুন' : 'Open in Live Tracker'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {order.orderStatus === 'cancelled' ? (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs">
                  {language === 'bn'
                    ? 'অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে হেল্পলাইনে যোগাযোগ করুন।'
                    : 'This order was cancelled. Please contact support for any refund or query.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2 pt-2">
                {TIMELINE_STAGES.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const IconComponent = step.icon;

                  return (
                    <div key={step.key} className="text-center space-y-1.5 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-500 text-neutral-950 ring-4 ring-emerald-500/20 font-bold scale-105 shadow-lg shadow-emerald-500/40'
                            : isCompleted
                            ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400'
                            : 'bg-neutral-950 border border-neutral-800 text-neutral-600'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold leading-tight line-clamp-1 ${
                          isCurrent
                            ? 'text-emerald-400 font-bold'
                            : isCompleted
                            ? 'text-neutral-300'
                            : 'text-neutral-600'
                        }`}
                      >
                        {language === 'bn' ? step.titleBn : step.titleEn}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Itemized Ordered Products */}
          <div className="space-y-3 pt-5">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'অর্ডারকৃত পেপার ও স্টেশনারি পণ্য' : 'Itemized Ordered Items'}</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </span>
            </h4>

            <div className="divide-y divide-neutral-800/80 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950/70">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                        aspectRatio="1/1"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-neutral-500 shrink-0 border border-neutral-800">
                        <Box className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {language === 'bn' && item.productNameBn ? item.productNameBn : item.productName}
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                        {item.gsm && (
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-teal-300 font-mono font-bold">
                            {item.gsm} GSM
                          </span>
                        )}
                        <span>পরিমাণ: {item.quantity}</span>
                        <span>•</span>
                        <span>দর: ৳{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                    <div className="text-right font-mono font-extrabold text-white text-sm sm:text-base">
                      ৳{item.total}
                    </div>

                    <button
                      type="button"
                      onClick={() => onReorder(order, item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105"
                      title={language === 'bn' ? 'শুধুমাত্র এই পণ্যটি কার্টে যোগ করুন' : 'Add this item to cart'}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'bn' ? 'পুনরায় যোগ' : 'Reorder Item'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Delivery Info & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            {/* Delivery Info */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-neutral-300 block uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'ডেলিভারি ও যোগাযোগের তথ্য' : 'Delivery & Customer Info'}</span>
              </span>

              <div className="space-y-1 pt-1 text-neutral-300">
                <p>
                  <strong>{language === 'bn' ? 'গ্রাহক:' : 'Recipient:'}</strong> {order.customerName}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  <span>{order.customerPhone}</span>
                </p>
                <p>
                  <strong>{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {order.deliveryAddress}
                </p>
                {order.notes && (
                  <p className="text-amber-400/90 italic pt-1">
                    <strong>{language === 'bn' ? 'নোট:' : 'Notes:'}</strong> "{order.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-neutral-300 block uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'বিল ও পেমেন্ট বিবরণী' : 'Payment Breakdown'}</span>
              </span>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'bn' ? 'সাবটোটাল (পণ্যমূল্য):' : 'Subtotal:'}</span>
                  <span className="font-mono text-white">৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'bn' ? 'ডেলিভারি ফি:' : 'Delivery Fee:'}</span>
                  <span className="font-mono text-white">৳{order.deliveryFee}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{language === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                    <span className="font-mono">-৳{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-emerald-400 pt-2 border-t border-neutral-800">
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                  <span className="font-mono text-base">৳{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Star Rating and Customer Feedback for Delivered Orders */}
          {order.orderStatus === 'delivered' && (
            <div className="space-y-3 pt-5">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider">
                {language === 'bn' ? 'গ্রাহক রিভিউ ও স্টার রেটিং' : 'Customer Review & Feedback'}
              </h4>
              <OrderFeedbackForm
                order={order}
                onSubmitReview={onSubmitReview}
                compact={false}
              />
            </div>
          )}

          {/* Optional Status Simulation for testing in Quick View */}
          {onSimulateStatus && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-xs">
              <span className="text-neutral-400">
                {language === 'bn' ? 'স্ট্যাটাস ট্রানজিশন সিমুলেশন:' : 'Status Transition Test:'}
              </span>
              <div className="flex items-center gap-2">
                {order.orderStatus !== 'ready' && (
                  <button
                    type="button"
                    onClick={() => onSimulateStatus(order.id, 'ready')}
                    className="px-2.5 py-1 rounded-lg bg-teal-950 border border-teal-500/40 text-teal-300 font-semibold hover:bg-teal-900"
                  >
                    Mark Shipped
                  </button>
                )}
                {order.orderStatus !== 'delivered' && (
                  <button
                    type="button"
                    onClick={() => onSimulateStatus(order.id, 'delivered')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold hover:bg-emerald-900"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 sm:p-5 bg-neutral-950/90 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-20">
          <button
            type="button"
            onClick={() => onOpenInvoice(order)}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-2 border border-neutral-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'ক্যাশ মেমো / ইনভয়েস' : 'View Cash Memo'}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>

            <button
              type="button"
              onClick={() => onReorder(order)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950/80 transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? `সকল পণ্য পুনরায় অর্ডার (${order.items.length}টি)`
                  : `Reorder All (${order.items.length})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

OrderQuickViewModal.displayName = 'OrderQuickViewModal';
