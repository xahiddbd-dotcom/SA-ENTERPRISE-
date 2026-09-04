import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Product } from '../../types';
import { Image } from '../common/Image';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ProductSliderProps {
  openCart: () => void;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ openCart }) => {
  const { language } = useLanguage();
  const { products, addToCart } = useData();
  const { isDark } = useTheme();

  // Featured products suitable for home page slider
  const featuredProducts = products.filter(p => p.isFeatured || p.stock > 0).slice(0, 8);
  const sliderItems = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Rotation interval: 32 seconds (30-35 seconds as requested by user)
  const ROTATION_INTERVAL_MS = 32000;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sliderItems.length <= 1 || isPaused) return;

    const intervalStep = 100;
    const progressStep = (intervalStep / ROTATION_INTERVAL_MS) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(current => (current + 1) % sliderItems.length);
          return 0;
        }
        return prev + progressStep;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [sliderItems.length, isPaused, currentIndex]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % sliderItems.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + sliderItems.length) % sliderItems.length);
    setProgress(0);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (sliderItems.length === 0) return null;

  const currentProduct = sliderItems[currentIndex];

  return (
    <section
      id="product-showcase-slider"
      className={`py-12 border-y relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-neutral-800'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 border-slate-200'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${
                isDark
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'bn' ? 'হোমপেজ ফিচার্ড পণ্য স্লাইডার' : 'Featured Products Spotlight'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'bn' ? 'প্রিমিয়াম পেপার ও কম্পিউটার এক্সেসরিজ' : 'Premium Paper & Store Best Sellers'}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'}`}>
              {language === 'bn'
                ? 'ডাবল এ, পেপার ওয়ান, নেভিগেটর এবং অফিস স্টেশনারি পাইকারি ও খুচরা মূল্যে।'
                : 'Double A, Paper One, Navigator & quality stationery at verified direct shop rates.'}
            </p>
          </div>

          {/* Controls & Rotation Indicator */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-mono hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                isDark
                  ? 'text-neutral-400 bg-neutral-900 border-neutral-800'
                  : 'text-slate-600 bg-white border-slate-200 shadow-xs'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Auto-slide: 32s {isPaused ? '(Paused)' : ''}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="slider-prev-btn"
                onClick={handlePrev}
                className={`p-2.5 rounded-xl border transition-all shadow-xs active:scale-95 ${
                  isDark
                    ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                title="Previous Product"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="slider-next-btn"
                onClick={handleNext}
                className={`p-2.5 rounded-xl border transition-all shadow-xs active:scale-95 ${
                  isDark
                    ? 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                title="Next Product"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Timer Progress Bar */}
        <div className={`w-full h-1 rounded-full mb-6 overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-slate-200'}`}>
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Featured Card Stage */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl p-6 lg:p-8 backdrop-blur-xl border transition-all duration-300 shadow-xl relative overflow-hidden ${
            isDark
              ? 'bg-neutral-900/90 border-neutral-800 shadow-2xl'
              : 'bg-white/95 border-slate-200 shadow-slate-200/50'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Product Big Photo Slider */}
          <div
            className={`lg:col-span-6 flex items-center justify-center relative min-h-[300px] sm:min-h-[380px] rounded-2xl border p-4 sm:p-6 overflow-hidden group ${
              isDark
                ? 'bg-neutral-950/70 border-neutral-800/80'
                : 'bg-slate-50/80 border-slate-200/90'
            }`}
          >
            <Image
              src={currentProduct.imageUrl || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80'}
              alt={currentProduct.name}
              objectFit="contain"
              className="max-h-[320px] w-auto rounded-xl shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
              priority={true}
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentProduct.brand}</span>
              </span>
              {currentProduct.isFeatured && (
                <span className="px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-slate-900 font-bold text-xs shadow-lg">
                  {language === 'bn' ? 'বেস্ট সেলার' : 'Best Seller'}
                </span>
              )}
            </div>

            {currentProduct.availableGsm && currentProduct.availableGsm.length > 0 && (
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                {currentProduct.availableGsm.map(gsm => (
                  <span
                    key={gsm}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold backdrop-blur-md border ${
                      isDark
                        ? 'bg-neutral-900/90 border-neutral-700 text-emerald-400'
                        : 'bg-white/95 border-emerald-200 text-emerald-800 shadow-xs'
                    }`}
                  >
                    {gsm} GSM
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Purchase Trigger */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>
                  SKU: {currentProduct.id.toUpperCase()}
                </span>
                <span
                  className={`flex items-center gap-1 font-bold px-2.5 py-1 rounded-md border ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/20'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Genuine Quality</span>
                </span>
              </div>

              <div>
                <h3 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? currentProduct.nameBn : currentProduct.name}
                </h3>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                  {language === 'bn' ? currentProduct.descriptionBn : currentProduct.description}
                </p>
              </div>

              {/* Price & Stock Badge */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ৳{currentProduct.price.toLocaleString()}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                    / {language === 'bn' ? (currentProduct.unitBn || 'রিম / প্যাকেট') : (currentProduct.unit || 'Ream')}
                  </span>
                </div>

                {currentProduct.stock > 0 ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      isDark
                        ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    In Stock: {currentProduct.stock} units
                  </span>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      isDark
                        ? 'bg-rose-950/80 border-rose-500/30 text-rose-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Bullet Features */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                {[
                  { textBn: 'হাই-স্পিড লেজার ও ফটোকপি পারফেক্ট', textEn: 'High Speed Laser & Copy Ready' },
                  { textBn: 'নো-জ্যাম সুপার স্মুথ ফিনিশিং', textEn: 'No Jam Super Bright Surface' },
                  { textBn: 'হোম ও অফিস দ্রুত হোম ডেলিভারি', textEn: 'Same Day Tejgaon Delivery' },
                  { textBn: 'বিকাশ ও ক্যাশ অন ডেলিভারি', textEn: 'bKash & Cash On Delivery' }
                ].map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{language === 'bn' ? feature.textBn : feature.textEn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`pt-4 flex flex-wrap items-center gap-3 border-t ${isDark ? 'border-neutral-800' : 'border-slate-200'}`}>
              <button
                type="button"
                id={`slider-add-cart-${currentProduct.id}`}
                onClick={e => handleAddToCart(currentProduct, e)}
                disabled={currentProduct.stock <= 0}
                className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                  addedProductId === currentProduct.id
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white shadow-emerald-900/30'
                }`}
              >
                {addedProductId === currentProduct.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ব্যাগে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="slider-view-cart-btn"
                onClick={openCart}
                className={`py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border ${
                  isDark
                    ? 'bg-neutral-800 hover:bg-neutral-750 border-neutral-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
              >
                <span>{language === 'bn' ? 'ব্যাগ দেখুন' : 'View Bag'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 overflow-x-auto py-2">
          {sliderItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                idx === currentIndex
                  ? isDark
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                    : 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                  : isDark
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                objectFit="contain"
                className="w-5 h-5 rounded"
                aspectRatio="1/1"
                loading="lazy"
              />
              <span className="font-mono">{item.brand || item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
