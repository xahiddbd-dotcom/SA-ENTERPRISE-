import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onOpenAuthModal }) => {
  const { language, t } = useLanguage();
  const { cart, updateCartQuantity, removeFromCart, cartTotal, createOrder, settings } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'cod'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill user information if logged in (Amazon / Daraz style)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
      if (currentUser.address && !customerAddress) setCustomerAddress(currentUser.address);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const deliveryFee = deliveryType === 'delivery' ? settings.deliveryChargeInsideDhaka : 0;
  const grandTotal = cartTotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর দিন।' : 'Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName,
        customerPhone,
        deliveryAddress: deliveryType === 'pickup' ? 'Shop Pickup (Indira Road)' : customerAddress,
        deliveryType,
        items: cart.map(item => ({
          id: `item_${Date.now()}_${item.product.id}`,
          productId: item.product.id,
          productName: item.product.name,
          productNameBn: item.product.nameBn,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          gsm: item.selectedGsm,
          total: (item.product.discountPrice || item.product.price) * item.quantity,
          image: item.product.images[0]
        })),
        subtotal: cartTotal,
        deliveryFee,
        discount: 0,
        total: grandTotal,
        paymentMethod,
        paymentStatus: trxId ? 'verified' : 'pending',
        paymentTrxId: trxId,
        orderStatus: 'pending',
        notes: orderNotes
      });

      setPlacedOrderNumber(newOrder.orderNumber);
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
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-l border-neutral-800 w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>{t('cart')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>
          <button
            id="close-cart-btn"
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {placedOrderNumber ? (
            /* Order Success View */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white">
                {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
              </h3>

              <p className="text-xs text-neutral-400">
                {language === 'bn'
                  ? 'আপনার অর্ডারটি প্রসেসিং শুরু হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।'
                  : 'We have received your order. Our team will contact you shortly.'}
              </p>

              <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 text-center space-y-1">
                <span className="text-xs text-neutral-400 uppercase">
                  {language === 'bn' ? 'অর্ডার ট্র্যাকিং নম্বর' : 'Order Tracking Number'}
                </span>
                <div className="text-2xl font-mono font-extrabold text-emerald-400">
                  {placedOrderNumber}
                </div>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl text-xs text-neutral-300 text-left space-y-1 border border-neutral-800">
                <p><strong>{language === 'bn' ? 'গ্রাহকের নাম:' : 'Customer:'}</strong> {customerName}</p>
                <p><strong>{language === 'bn' ? 'ফোন নম্বর:' : 'Phone:'}</strong> {customerPhone}</p>
                <p><strong>{language === 'bn' ? 'মোট মূল্য:' : 'Total Amount:'}</strong> ৳{grandTotal}</p>
                <p><strong>{language === 'bn' ? 'পেমেন্ট:' : 'Payment:'}</strong> {paymentMethod.toUpperCase()} {trxId && `(TrxID: ${trxId})`}</p>
              </div>

              <button
                id="done-cart-btn"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-sm hover:bg-emerald-400"
              >
                {language === 'bn' ? 'সম্পন্ন করুন' : 'Done'}
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-neutral-400 text-sm">
                {language === 'bn' ? 'আপনার শপিং কার্ট খালি।' : 'Your cart is empty.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
              >
                {language === 'bn' ? 'শপ থেকে কেনাকাটা করুন' : 'Shop Products'}
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Form */
            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Daraz / Amazon BD 1-Click Fast Checkout Member Banner */}
              {!isAuthenticated ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{language === 'bn' ? 'দারাজ / অ্যামাজন স্টাইলে দ্রুত চেকআউট' : 'Daraz/Amazon Fast Checkout'}</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
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
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <span>{language === 'bn' ? 'লগইন আছেন:' : 'Logged in as:'} <strong>{currentUser?.name}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">✓ Auto-filled</span>
                </div>
              )}

              {/* Item List */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  {language === 'bn' ? 'অর্ডার আইটেম' : 'Order Items'}
                </span>

                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center p-1 border border-neutral-800 shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1 max-w-[180px]">
                          {language === 'bn' ? item.product.nameBn : item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                          <span className="text-emerald-400 font-mono font-semibold">
                            ৳{item.product.discountPrice || item.product.price}
                          </span>
                          {item.selectedGsm && (
                            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px]">
                              {item.selectedGsm} GSM
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-900">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  {language === 'bn' ? 'ডেলিভারি মাধ্যম' : 'Delivery Method'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === 'pickup'
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>{language === 'bn' ? 'দোকান থেকে নেওয়া (৳০)' : 'Shop Pickup (৳0)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>{language === 'bn' ? 'হোম ডেলিভারি (৳৬০)' : 'Home Delivery (৳60)'}</span>
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="text-xs font-semibold text-white block">
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
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    required
                    id="cart-customer-phone"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder={language === 'bn' ? 'মোবাইল নম্বর (যেমন 017XXXXXXXX) *' : 'Phone (e.g. 017XXXXXXXX) *'}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
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
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="text-xs font-semibold text-white block">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-2 px-1 rounded-lg border text-xs font-semibold text-center transition-all ${
                      paymentMethod === 'bkash'
                        ? 'bg-pink-950/60 border-pink-500 text-pink-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    bKash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`py-2 px-1 rounded-lg border text-xs font-semibold text-center transition-all ${
                      paymentMethod === 'nagad'
                        ? 'bg-orange-950/60 border-orange-500 text-orange-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Nagad
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-1 rounded-lg border text-xs font-semibold text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Cash
                  </button>
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2 mt-2">
                    <p className="text-[11px] text-neutral-300">
                      {paymentMethod === 'bkash' ? 'bKash Merchant/Personal:' : 'Nagad Personal:'}{' '}
                      <strong className="text-white font-mono">{settings.bkashNumber}</strong>
                    </p>
                    <input
                      type="text"
                      value={trxId}
                      onChange={e => setTrxId(e.target.value)}
                      placeholder="Transaction TrxID (Optional/যদি থাকে)"
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-mono text-white">৳{cartTotal}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
                  <span className="font-mono text-white">৳{deliveryFee}</span>
                </div>
                <div className="border-t border-neutral-800 pt-1.5 flex justify-between text-sm font-bold text-white">
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</span>
                  <span className="font-mono text-emerald-400 text-base">৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
