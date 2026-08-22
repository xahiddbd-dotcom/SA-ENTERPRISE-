import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';
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
      className="py-10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-y border-neutral-800 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'হোমপেজ ফিচার্ড পণ্য স্লাইডার' : 'Featured Products Spotlight'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'bn' ? 'প্রিমিয়াম পেপার ও কম্পিউটার এক্সেসরিজ' : 'Premium Paper & Store Best Sellers'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              {language === 'bn'
                ? 'ডাবল এ, পেপার ওয়ান, নেভিগেটর এবং অফিস স্টেশনারি পাইকারি ও খুচরা মূল্যে।'
                : 'Double A, Paper One, Navigator & quality stationery at verified direct shop rates.'}
            </p>
          </div>

          {/* Controls & Rotation Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline-flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-slide: 32s {isPaused ? '(Paused)' : ''}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                id="slider-prev-btn"
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Previous Product"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="slider-next-btn"
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Next Product"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Timer Progress Bar */}
        <div className="w-full bg-neutral-800 h-1 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Featured Card Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Product Big Photo Slider */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[300px] sm:min-h-[380px] bg-neutral-950/70 rounded-2xl border border-neutral-800/80 p-4 sm:p-6 overflow-hidden group">
            <img
              src={currentProduct.imageUrl || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80'}
              alt={currentProduct.name}
              referrerPolicy="no-referrer"
              className="max-h-[320px] w-auto object-contain rounded-xl shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-xs shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentProduct.brand}</span>
              </span>
              {currentProduct.isFeatured && (
                <span className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-black font-bold text-xs shadow-lg">
                  {language === 'bn' ? 'বেস্ট সেলার' : 'Best Seller'}
                </span>
              )}
            </div>

            {currentProduct.availableGsm && currentProduct.availableGsm.length > 0 && (
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                {currentProduct.availableGsm.map(gsm => (
                  <span
                    key={gsm}
                    className="px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-700 text-[11px] font-mono text-emerald-400 font-bold backdrop-blur-md"
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
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>SKU: {currentProduct.id.toUpperCase()}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Genuine Quality</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {language === 'bn' ? currentProduct.nameBn : currentProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                  {language === 'bn' ? currentProduct.descriptionBn : currentProduct.description}
                </p>
              </div>

              {/* Price & Stock Badge */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                    ৳{currentProduct.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    / {language === 'bn' ? (currentProduct.unitBn || 'রিম / প্যাকেট') : (currentProduct.unit || 'Ream')}
                  </span>
                </div>

                {currentProduct.stock > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                    In Stock: {currentProduct.stock} units
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'হাই-স্পিড লেজার ও ফটোকপি পারফেক্ট' : 'High Speed Laser & Copy Ready'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'নো-জ্যাম সুপার স্মুথ ফিনিশিং' : 'No Jam Super Bright Surface'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'হোম ও অফিস দ্রুত হোম ডেলিভারি' : 'Same Day Tejgaon Delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{language === 'bn' ? 'বিকাশ ও ক্যাশ অন ডেলিভারি' : 'bKash & Cash On Delivery'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-neutral-800">
              <button
                type="button"
                id={`slider-add-cart-${currentProduct.id}`}
                onClick={e => handleAddToCart(currentProduct, e)}
                disabled={currentProduct.stock <= 0}
                className={`flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                  addedProductId === currentProduct.id
                    ? 'bg-emerald-500 text-black shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white shadow-emerald-950'
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
                className="py-3.5 px-5 rounded-2xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
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
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 ${
                idx === currentIndex
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                  : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 object-contain rounded"
              />
              <span className="font-mono">{item.brand || item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
