import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Image } from '../common/Image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  CreditCard,
  CheckCircle2,
  Truck,
  Store,
  ArrowRight,
  User,
  Sparkles,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onOpenAuthModal }) => {
  const { language, t } = useLanguage();
  const { cart, removeFromCart, updateCartQuantity, clearCart, createOrder, settings } = useData();
  const { currentUser, isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);

  // Auto-fill logged-in customer info
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
      if (currentUser.address && !customerAddress) setCustomerAddress(currentUser.address);
    }
  }, [isAuthenticated, currentUser]);

  if (!isOpen) return null;

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryFee = deliveryType === 'delivery' ? 60 : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      alert(language === 'bn' ? 'অনুগ্রহ করে নাম ও মোবাইল নম্বর লিখুন।' : 'Please enter your name and phone number.');
      return;
    }

    if (deliveryType === 'delivery' && !customerAddress) {
      alert(language === 'bn' ? 'অনুগ্রহ করে ডেলিভারি ঠিকানা লিখুন।' : 'Please provide delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName,
        customerPhone,
        customerAddress: deliveryType === 'delivery' ? customerAddress : 'Shop Pickup (Indira Road)',
        items: cart.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          nameBn: i.product.nameBn,
          quantity: i.quantity,
          price: i.product.discountPrice || i.product.price,
          selectedGsm: i.selectedGsm
        })),
        totalAmount: grandTotal,
        deliveryFee,
        deliveryMethod: deliveryType,
        paymentMethod,
        paymentStatus: trxId ? 'paid' : (paymentMethod === 'cod' ? 'pending' : 'pending'),
        trxId: trxId || undefined,
        status: 'pending'
      });

      setPlacedOrderNumber(newOrder.orderNumber);
      clearCart();
      setIsSubmitting(false);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // silent
      }
    }, 400);
  };

  const handleResetAndClose = () => {
    setPlacedOrderNumber(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`border-l w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden transition-colors ${
        isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between transition-colors ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            <span className={isDark ? 'text-white' : 'text-slate-900'}>{t('cart')}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={handleResetAndClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {placedOrderNumber ? (
            /* Order Success View */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
              </h3>

              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                {language === 'bn'
                  ? 'আপনার অর্ডারটি প্রসেসিং শুরু হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।'
                  : 'We have received your order. Our team will contact you shortly.'}
              </p>

              <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                isDark ? 'bg-neutral-950 border-emerald-500/30' : 'bg-emerald-50/80 border-emerald-200'
              }`}>
                <span className={`text-xs uppercase font-bold ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং নম্বর' : 'Order Tracking Number'}
                </span>
                <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {placedOrderNumber}
                </div>
              </div>

              <div className={`p-4 rounded-2xl text-xs text-left space-y-1.5 border ${
                isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <p><strong>{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer:'}</strong> {customerName}</p>
                <p><strong>{language === 'bn' ? 'ফোন নম্বর:' : 'Phone:'}</strong> {customerPhone}</p>
                <p><strong>{language === 'bn' ? 'মোট মূল্য:' : 'Total Amount:'}</strong> ৳{grandTotal}</p>
                <p><strong>{language === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</strong> {paymentMethod.toUpperCase()} {trxId && `(TrxID: ${trxId})`}</p>
              </div>

              <button
                id="done-cart-btn"
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className={`w-12 h-12 mx-auto ${isDark ? 'text-neutral-600' : 'text-slate-300'}`} />
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                {language === 'bn' ? 'আপনার শপিং কার্ট খালি।' : 'Your cart is empty.'}
              </p>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                {language === 'bn' ? 'শপ থেকে কেনাকাটা করুন' : 'Shop Products'}
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Form */
            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Daraz / Amazon BD 1-Click Fast Checkout Member Banner */}
              {!isAuthenticated ? (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
                }`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{language === 'bn' ? 'দারাজ / অ্যামাজন স্টাইলে দ্রুত চেকআউট' : 'Fast 1-Click Checkout'}</span>
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                      {language === 'bn' ? 'লগইন করলে নাম ও ঠিকানা স্বয়ংক্রিয়ভাবে বসে যাবে।' : 'Sign in to auto-fill address and track orders.'}
                    </p>
                  </div>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuthModal('login');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <span>{language === 'bn' ? 'লগইন আছেন:' : 'Logged in as:'} <strong>{currentUser?.name}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Auto-filled</span>
                </div>
              )}

              {/* Item List */}
              <div className="space-y-2.5">
                <span className={`text-xs font-bold uppercase tracking-wide block ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  {language === 'bn' ? 'অর্ডার আইটেম' : 'Order Items'}
                </span>

                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-colors ${
                      isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center p-1 border shrink-0 overflow-hidden ${
                        isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
                      }`}>
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          objectFit="contain"
                          className="max-h-10 max-w-full"
                          aspectRatio="1/1"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold line-clamp-1 max-w-[180px] ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </h4>
                        <div className={`flex items-center gap-2 text-[11px] mt-0.5 ${
                          isDark ? 'text-neutral-400' : 'text-slate-500'
                        }`}>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                            ৳{item.product.discountPrice || item.product.price}
                          </span>
                          {item.selectedGsm && (
                            <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border ${
                              isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-white text-slate-700 border-slate-200'
                            }`}>
                              {item.selectedGsm} GSM
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`flex items-center border rounded-lg ${
                        isDark ? 'border-neutral-700 bg-neutral-900' : 'border-slate-200 bg-white shadow-2xs'
                      }`}>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className={`p-1 transition-colors ${
                            isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`px-2 text-xs font-bold font-mono ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className={`p-1 transition-colors ${
                            isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className={`p-1.5 rounded-lg text-rose-500 transition-colors ${
                          isDark ? 'hover:bg-rose-950/30' : 'hover:bg-rose-50'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery selector */}
              <div className="space-y-2">
                <span className={`text-xs font-bold uppercase tracking-wide block ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  {language === 'bn' ? 'ডেলিভারি মাধ্যম' : 'Delivery Method'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === 'pickup'
                        ? isDark
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : isDark
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Store className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'bn' ? 'দোকান থেকে নেওয়া (৳০)' : 'Shop Pickup (৳0)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === 'delivery'
                        ? isDark
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : isDark
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'bn' ? 'হোম ডেলিভারি (৳৬০)' : 'Home Delivery (৳60)'}</span>
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className={`space-y-3 p-4 rounded-2xl border transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'গ্রাহকের তথ্য ও যোগাযোগের নম্বর' : 'Customer Contact Details'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    id="cart-customer-name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Your Name *'}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-2xs'
                    }`}
                  />
                  <input
                    type="tel"
                    required
                    id="cart-customer-phone"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder={language === 'bn' ? 'মোবাইল নম্বর (যেমন 017XXXXXXXX) *' : 'Phone (e.g. 017XXXXXXXX) *'}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-2xs'
                    }`}
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <input
                      type="text"
                      required
                      id="cart-customer-address"
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      placeholder={language === 'bn' ? 'পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *' : 'Full Delivery Address *'}
                      className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                        isDark
                          ? 'bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-2xs'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className={`space-y-2 p-4 rounded-2xl border transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-950/60 border-pink-500 text-pink-300'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold text-center transition-all ${
                      paymentMethod === 'cod'
                        ? isDark
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : isDark
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash
                  </button>
                </div>

                {paymentMethod !== 'cod' && (
                  <div className={`p-2.5 rounded-xl border space-y-2 mt-2 transition-colors ${
                    isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
                  }`}>
                    <p className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                      {paymentMethod === 'bkash' ? 'bKash Merchant/Personal:' : 'Nagad Personal:'}{' '}
                      <strong className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{settings.bkashNumber}</strong>
                    </p>
                    <input
                      type="text"
                      value={trxId}
                      onChange={e => setTrxId(e.target.value)}
                      placeholder="Transaction TrxID (Optional/যদি থাকে)"
                      className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 text-neutral-100'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className={`p-4 rounded-2xl border space-y-1.5 text-xs transition-colors ${
                isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex justify-between ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>৳{cartTotal}</span>
                </div>
                <div className={`flex justify-between ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>৳{deliveryFee}</span>
                </div>
                <div className={`border-t pt-1.5 flex justify-between text-sm font-bold ${
                  isDark ? 'border-neutral-800 text-white' : 'border-slate-200 text-slate-900'
                }`}>
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base font-extrabold">৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন' : 'Confirm Order Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
