import React from 'react';
import {
  Calendar,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Truck,
  Box,
  Printer,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import { Order, OrderItem } from '../../types';
import { Image } from '../common/Image';
import { OrderFeedbackForm } from './OrderFeedbackForm';

export interface OrderItemCardProps {
  order: Order;
  isExpanded: boolean;
  copiedId: string | null;
  language: 'bn' | 'en';
  onToggleExpand: (orderId: string) => void;
  onQuickView: (order: Order) => void;
  onReorder: (order: Order, specificItem?: OrderItem) => void;
  onOpenInvoice: (order: Order) => void;
  onCopy: (text: string) => void;
  onOpenTracker?: (orderNumber: string) => void;
  onSimulateStatus?: (orderId: string, status: 'ready' | 'delivered') => void;
  onSubmitReview: (orderId: string, rating: number, feedback: string) => void;
}

const ORDER_TIMELINE_STEPS = [
  {
    key: 'pending',
    titleBn: 'অর্ডার দাখিল ও যাচাই প্রক্রিয়াধীন',
    titleEn: 'Order Placed & Awaiting Verification',
    descBn: 'অনলাইন অর্ডারটি সিস্টেমে দাখিল হয়েছে। আমাদের প্রতিনিধি দ্রুত পর্যালোচনা করছেন।',
    descEn: 'Order received in digital desk. Verification in progress.',
    icon: Clock
  },
  {
    key: 'confirmed',
    titleBn: 'অর্ডার নিশ্চিত ও পেমেন্ট গৃহীত',
    titleEn: 'Order Confirmed & Payment Verified',
    descBn: 'পেমেন্ট ও স্টক নিশ্চিত করে অর্ডারটি বুকিং কনফার্ম করা হয়েছে।',
    descEn: 'Payment and stock availability verified. Invoice queued.',
    icon: CheckCircle2
  },
  {
    key: 'processing',
    titleBn: 'কাগজ কাটিং, প্রিন্টিং ও প্যাকেজিং',
    titleEn: 'Paper Cutting & Order Packaging',
    descBn: 'নির্দিষ্ট সাইজ ও জিএসএম অনুযায়ী রিম প্রস্তুত ও সুরক্ষিত কার্টনে প্যাকেট হচ্ছে।',
    descEn: 'Paper sheets cut to custom dimension, inspected, and packed.',
    icon: Box
  },
  {
    key: 'ready',
    titleBn: 'ডেলিভারির জন্য প্রেরিত (Out for Delivery)',
    titleEn: 'Dispatched & Out for Delivery',
    descBn: 'আমাদের নিজস্ব রাইডার বা কুরিয়ার পার্সেলটি নিয়ে গন্তব্যের পথে রওনা হয়েছে।',
    descEn: 'Handed to express logistics rider. On the way to delivery address.',
    icon: Truck
  },
  {
    key: 'delivered',
    titleBn: 'ডেলিভারি সম্পন্ন (Delivered)',
    titleEn: 'Order Delivered & Completed',
    descBn: 'গ্রাহকের নিকট সফলভাবে পণ্য পৌঁছে দেওয়া হয়েছে। ধন্যবাদ!',
    descEn: 'Products successfully received by customer. Thank you for choosing us!',
    icon: CheckCircle2
  }
];

const getStatusStepIndex = (status: string): number => {
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

export const OrderItemCard: React.FC<OrderItemCardProps> = React.memo(({
  order,
  isExpanded,
  copiedId,
  language,
  onToggleExpand,
  onQuickView,
  onReorder,
  onOpenInvoice,
  onCopy,
  onOpenTracker,
  onSimulateStatus,
  onSubmitReview
}) => {
  const currentStepIdx = getStatusStepIndex(order.orderStatus);

  return (
    <div
      id={`order-card-${order.id}`}
      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-3xl overflow-hidden shadow-2xl transition-all"
    >
      {/* Order Top Bar / Summary Header */}
      <div className="p-5 sm:p-6 bg-neutral-950/60 border-b border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">
              {language === 'bn' ? 'অর্ডার নম্বর:' : 'Order ID:'}
            </span>
            <span className="text-base font-extrabold text-white font-mono tracking-tight">
              {order.orderNumber}
            </span>

            <button
              type="button"
              onClick={() => onCopy(order.orderNumber)}
              className="p-1 rounded-md text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
              title="Copy Order Number"
            >
              {copiedId === order.orderNumber ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {order.paymentTrxId && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono">
                TrxID: {order.paymentTrxId}
              </span>
            )}

            {/* Quick View Button on Card Header */}
            <button
              type="button"
              onClick={() => onQuickView(order)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all hover:scale-105"
              title={language === 'bn' ? 'অর্ডার কুইক ভিউ মডাল দেখুন' : 'Open Order Quick View Modal'}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'কুইক ভিউ' : 'Quick View'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
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
                ? language === 'bn' ? 'দোকান থেকে সংগ্রহ (Pickup)' : 'Counter Pickup'
                : language === 'bn' ? 'হোম ডেলিভারি (Home Delivery)' : 'Home Delivery'}
            </span>
            <span>•</span>
            <span className="uppercase font-semibold text-emerald-400">
              {order.paymentMethod}
            </span>
            {order.review && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{order.review.rating}.0</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right Summary: Grand Total & Status Badge */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800/80">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
              {language === 'bn' ? 'সর্বমোট মূল্য' : 'Grand Total'}
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
              ৳{order.total}
            </span>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border capitalize ${
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

            {/* Primary Reorder Button */}
            <button
              type="button"
              onClick={() => onReorder(order)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 ${
                order.orderStatus === 'delivered'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/80 border border-emerald-400/40 ring-1 ring-emerald-500/30'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
              title={
                language === 'bn'
                  ? 'এই অর্ডারের সকল পণ্য কার্টে যোগ করে পুনরায় অর্ডার করুন'
                  : 'Pre-fill shopping cart with items from this order'
              }
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'bn' ? 'পুনরায় অর্ডার' : 'Reorder'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onToggleExpand(order.id)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* DEDICATED VERTICAL TIMELINE COMPONENT VISUALIZING orderStatus */}
      <div className="p-6 sm:p-8 bg-neutral-900/90 border-b border-neutral-800/60">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {language === 'bn' ? 'অর্ডার ডেলিভারি ও প্রসেসিং টাইমলাইন' : 'Live Delivery Status Timeline'}
            </h4>
          </div>

          {onOpenTracker && (
            <button
              onClick={() => onOpenTracker(order.orderNumber)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold hover:underline"
            >
              <span>{language === 'bn' ? 'পাবলিক ট্র্যাকারে দেখুন' : 'Open in Live Tracker'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Cancelled State Warning */}
        {order.orderStatus === 'cancelled' ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">অর্ডারটি বাতিল করা হয়েছে (Order Cancelled)</p>
              <p className="text-[11px] text-rose-400/80">
                পণ্য স্টক শেষ অথবা গ্রাহকের অনুরোধে এই অর্ডারটি বাতিল করা হয়েছে। প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন।
              </p>
            </div>
          </div>
        ) : (
          /* Vertical Timeline Steps Layout */
          <div className="relative pl-6 sm:pl-8 space-y-6 max-w-3xl">
            {/* Vertical Connector Bar */}
            <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-0.5 bg-neutral-800 -translate-x-1/2 z-0" />

            {/* Dynamic Active Step Connector Highlight */}
            <div
              className="absolute left-[13px] sm:left-[17px] top-3 w-0.5 bg-emerald-500 -translate-x-1/2 z-0 transition-all duration-700"
              style={{
                height: `${(Math.max(0, currentStepIdx) / (ORDER_TIMELINE_STEPS.length - 1)) * 100}%`
              }}
            />

            {ORDER_TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex items-start gap-4 sm:gap-5 group">
                  {/* Node Icon Indicator */}
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-500 text-neutral-950 ring-4 ring-emerald-500/20 scale-110 shadow-lg shadow-emerald-500/40 font-bold'
                        : isCompleted
                        ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400'
                        : 'bg-neutral-900 border-2 border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </div>

                  {/* Step Description & Metadata */}
                  <div className="space-y-0.5 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-emerald-400'
                            : isCompleted
                            ? 'text-white'
                            : 'text-neutral-500'
                        }`}
                      >
                        {language === 'bn' ? step.titleBn : step.titleEn}
                      </p>

                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold animate-pulse">
                          {language === 'bn' ? 'বর্তমান ধাপ (Active)' : 'Active Stage'}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-[11px] sm:text-xs leading-relaxed ${
                        isCurrent
                          ? 'text-neutral-300'
                          : isCompleted
                          ? 'text-neutral-400'
                          : 'text-neutral-600'
                      }`}
                    >
                      {language === 'bn' ? step.descBn : step.descEn}
                    </p>

                    {isCompleted && (
                      <span className="inline-block text-[10px] font-mono text-emerald-500/80 pt-0.5">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Review Section for Delivered Orders (Always visible or in expanded) */}
      {order.orderStatus === 'delivered' && (
        <div className="px-6 sm:px-8 py-5 bg-neutral-950/70 border-b border-neutral-800">
          <OrderFeedbackForm
            order={order}
            onSubmitReview={onSubmitReview}
            compact={true}
          />
        </div>
      )}

      {/* Collapsible Order Itemization & Financial Details */}
      {isExpanded && (
        <div className="p-6 sm:p-8 bg-neutral-950/80 border-t border-neutral-800 space-y-6 animate-in fade-in">
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'অর্ডারকৃত পণ্যের বিস্তারিত তালিকা' : 'Itemized Ordered Products'}</span>
              </span>

              <button
                type="button"
                onClick={() => onQuickView(order)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সম্পূর্ণ কুইক ভিউ মডাল' : 'Full Quick View Modal'}</span>
              </button>
            </h4>

            <div className="divide-y divide-neutral-800/60 border border-neutral-800/80 rounded-2xl overflow-hidden bg-neutral-900/60">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/90 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        aspectRatio="1/1"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                        <Box className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-white">
                        {language === 'bn' && item.productNameBn ? item.productNameBn : item.productName}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                        {item.gsm && (
                          <span className="px-2 py-0.2 rounded bg-neutral-800 text-[10px] text-teal-300 font-mono font-bold">
                            {item.gsm} GSM
                          </span>
                        )}
                        <span>পরিমাণ: {item.quantity}</span>
                        <span>•</span>
                        <span>দর: ৳{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono font-extrabold text-white text-sm">
                      ৳{item.total}
                    </div>
                    <button
                      type="button"
                      onClick={() => onReorder(order, item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105"
                      title={language === 'bn' ? 'শুধুমাত্র এই পণ্যটি কার্টে যোগ করুন' : 'Add this item to cart'}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">{language === 'bn' ? 'কার্টে যোগ' : 'Reorder Item'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-neutral-400 block uppercase tracking-wider">
                {language === 'bn' ? 'ডেলিভারি তথ্য ও নোট' : 'Delivery & Note Details'}
              </span>
              <p className="text-neutral-300">
                <strong>{language === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {order.deliveryAddress}
              </p>
              <p className="text-neutral-300">
                <strong>{language === 'bn' ? 'মোবাইল:' : 'Phone:'}</strong> {order.customerPhone}
              </p>
              {order.notes && (
                <p className="text-amber-400/90 italic">
                  <strong>{language === 'bn' ? 'বিশেষ নির্দেশনা:' : 'Notes:'}</strong> "{order.notes}"
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs">
              <span className="font-bold text-neutral-400 block uppercase tracking-wider">
                {language === 'bn' ? 'মূল্য হিসাব (Invoice Summary)' : 'Financial Summary'}
              </span>
              <div className="flex justify-between text-neutral-400">
                <span>{language === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
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
                <span>{language === 'bn' ? 'মোট প্রদেয় বিল:' : 'Grand Total:'}</span>
                <span className="font-mono">৳{order.total}</span>
              </div>
            </div>
          </div>

          {/* Order Actions & Interactive Simulator */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Live Simulation Controls for testing Shipped & Delivered status transitions */}
            {onSimulateStatus && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-400">
                  {language === 'bn' ? 'স্ট্যাটাস টেস্ট:' : 'Simulate Status:'}
                </span>
                {order.orderStatus !== 'ready' && (
                  <button
                    type="button"
                    onClick={() => onSimulateStatus(order.id, 'ready')}
                    className="px-2.5 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 text-teal-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                    title="Simulate Shipped status update"
                  >
                    <Truck className="w-3 h-3 text-teal-400" />
                    <span>{language === 'bn' ? 'Shipped করুন' : 'Mark Shipped'}</span>
                  </button>
                )}

                {order.orderStatus !== 'delivered' && (
                  <button
                    type="button"
                    onClick={() => onSimulateStatus(order.id, 'delivered')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                    title="Simulate Delivered status update"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'bn' ? 'Delivered করুন' : 'Mark Delivered'}</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => onQuickView(order)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 border border-neutral-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'কুইক ভিউ' : 'Quick View'}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenInvoice(order)}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-1.5 border border-neutral-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'মেমো / ইনভয়েস' : 'Cash Memo'}</span>
              </button>

              <button
                type="button"
                onClick={() => onReorder(order)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950/80 transition-all hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {language === 'bn'
                    ? `সবগুলো পণ্য পুনরায় অর্ডার করুন (${order.items.length}টি)`
                    : `Reorder All ${order.items.length} Items`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

OrderItemCard.displayName = 'OrderItemCard';
