import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Product } from '../../types';
import { Image } from '../common/Image';
import { buildUrl } from '../../utils/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Check,
  Sparkles,
  Search,
  SlidersHorizontal,
  Package,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

interface ShopSectionProps {
  openCart: () => void;
  initialProductId?: string | null;
  onProductSelect?: (productId: string | null) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  openCart,
  initialProductId,
  onProductSelect
}) => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const { products, gsmOptions, addToCart } = useData();

  const [selectedGsm, setSelectedGsm] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  // Sync initialProductId when deep-linked
  useEffect(() => {
    if (initialProductId && products.length > 0) {
      const found = products.find(p => p.id === initialProductId || p.sku.toLowerCase() === initialProductId.toLowerCase());
      if (found) {
        setSelectedProductModal(found);
      }
    }
  }, [initialProductId, products]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProductModal(product);
    if (onProductSelect) {
      onProductSelect(product.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedProductModal(null);
    if (onProductSelect) {
      onProductSelect(null);
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product.isActive) return false;
    const matchesGsm = selectedGsm === 'all' || product.gsm === selectedGsm;
    const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameBn.includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGsm && matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1, product.gsm);
    setAddedNotification(product.name);
    setTimeout(() => setAddedNotification(null), 2500);
  };

  const handleQuickBuy = (product: Product) => {
    addToCart(product, 1, product.gsm);
    setSelectedProductModal(null);
    openCart();
  };

  return (
    <section id="paper-market-shop" className={`py-16 transition-colors duration-200 ${isDark ? 'bg-neutral-950/90' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <Package className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অফিসিয়াল পেপার ও ফটো পেপার শপ' : 'Paper & Photo Paper Store'}</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('paper_market_title')}
          </h2>

          <p className={`text-sm sm:text-base ${isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'}`}>
            {t('paper_market_desc')}
          </p>
        </div>

        {/* Filters & GSM Selector Bar */}
        <div className={`border rounded-2xl p-4 sm:p-5 mb-8 space-y-4 transition-colors ${
          isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* GSM Filter Pills */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Layers className="w-4 h-4" />
                {t('filter_by_gsm')}:
              </span>
              <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>
                {selectedGsm === 'all' ? (language === 'bn' ? 'সকল পেপার' : 'All GSM') : `${selectedGsm} GSM`}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                id="gsm-pill-all"
                onClick={() => setSelectedGsm('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGsm === 'all'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('all_gsm')}
              </button>

              {gsmOptions.map(option => (
                <button
                  key={option.id}
                  id={`gsm-pill-${option.gsm}`}
                  onClick={() => setSelectedGsm(option.gsm)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedGsm === option.gsm
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20'
                      : isDark
                      ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category sub bar */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t ${
            isDark ? 'border-neutral-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['all', 'paper', 'photo_paper', 'supplies'].map(catKey => {
                const label =
                  catKey === 'all' ? (language === 'bn' ? 'সব প্রোডাক্ট' : 'All') :
                  catKey === 'paper' ? (language === 'bn' ? 'A4 পেপার' : 'A4 Paper') :
                  catKey === 'photo_paper' ? (language === 'bn' ? 'ফটো পেপার' : 'Photo Paper') :
                  (language === 'bn' ? 'বাইন্ডিং ও এক্সেসরিজ' : 'Supplies');

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === catKey
                        ? (isDark ? 'bg-neutral-700 text-white font-semibold' : 'bg-slate-900 text-white font-semibold shadow-xs')
                        : (isDark ? 'text-neutral-400 hover:text-neutral-200' : 'text-slate-600 hover:text-slate-950')
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-400' : 'text-slate-400'}`} />
              <input
                type="text"
                id="shop-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'পেপার বা ব্র্যান্ড খুঁজুন...' : 'Search brand or paper...'}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark
                    ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => {
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;
              const isOutOfStock = product.stock <= 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  id={`product-card-${product.id}`}
                  onClick={() => handleOpenProduct(product)}
                  className={`border rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30'
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xl shadow-sm'
                  }`}
                >
                  {/* Product Image & Badges */}
                  <div className={`relative h-48 overflow-hidden flex items-center justify-center p-4 transition-colors ${
                    isDark ? 'bg-neutral-950' : 'bg-slate-50'
                  }`}>
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        objectFit="contain"
                        className="max-h-40 max-w-full group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <Package className={`w-12 h-12 ${isDark ? 'text-neutral-700' : 'text-slate-300'}`} />
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {product.gsm && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                          {product.gsm} GSM
                        </span>
                      )}
                      {product.brand && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isDark ? 'bg-neutral-900/90 text-neutral-300 border-neutral-750' : 'bg-white/90 text-slate-700 border-slate-200 shadow-xs'
                        }`}>
                          {product.brand}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Save Badge */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      {hasDiscount && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold shadow-md">
                          SAVE ৳{product.price - (product.discountPrice || product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`text-[10px] uppercase font-mono block mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                        SKU: {product.sku}
                      </span>

                      <h3 className={`text-sm font-bold transition-colors leading-snug line-clamp-2 mb-2 ${
                        isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-700'
                      }`}>
                        {language === 'bn' ? product.nameBn : product.name}
                      </h3>

                      <div className={`text-xs mb-3 flex items-center justify-between ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                        <span>{language === 'bn' ? product.packSizeBn : product.packSize}</span>
                        {isOutOfStock ? (
                          <span className="text-rose-500 font-semibold">{t('out_of_stock')}</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('stock_in')} ({product.stock})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing and Cart button */}
                    <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                      isDark ? 'border-neutral-800' : 'border-slate-100'
                    }`}>
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-base font-extrabold font-mono ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            ৳{product.discountPrice || product.price}
                          </span>
                          {hasDiscount && (
                            <span className={`text-xs line-through font-mono ${isDark ? 'text-neutral-400' : 'text-slate-400'}`}>
                              ৳{product.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        id={`add-to-cart-btn-${product.id}`}
                        disabled={isOutOfStock}
                        onClick={e => handleAddToCart(product, e)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('add_to_cart')}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Add Notification */}
      {addedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>Added to Cart: {addedNotification}</span>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {selectedProductModal.brand} • {selectedProductModal.gsm ? `${selectedProductModal.gsm} GSM` : 'Supplies'}
                </span>
                <span className={`text-xs hidden sm:inline ${isDark ? 'text-neutral-600' : 'text-slate-300'}`}>•</span>
                <span className={`text-[11px] font-mono hidden sm:inline ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  SKU: {selectedProductModal.sku}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseModal}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className={`h-52 rounded-2xl p-4 flex items-center justify-center overflow-hidden border ${
                isDark ? 'bg-neutral-950 border-neutral-800/80' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <Image
                  src={selectedProductModal.images[0]}
                  alt={selectedProductModal.name}
                  objectFit="contain"
                  className="max-h-48 max-w-full"
                  priority={true}
                />
              </div>

              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'bn' ? selectedProductModal.nameBn : selectedProductModal.name}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                  {language === 'bn' ? selectedProductModal.descriptionBn : selectedProductModal.description}
                </p>
              </div>

              {selectedProductModal.specifications && (
                <div className={`p-3.5 rounded-2xl border space-y-1.5 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`text-xs font-semibold block mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                    {language === 'bn' ? 'স্পেসিফিকেশন:' : 'Specifications:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedProductModal.specifications).map(([key, val]) => (
                      <div key={key} className={`flex justify-between border-b pb-1 ${
                        isDark ? 'border-neutral-850' : 'border-slate-200'
                      }`}>
                        <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>{key}:</span>
                        <span className={`font-medium ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className={`text-xs block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{t('price')}</span>
                  <span className={`text-2xl font-extrabold font-mono ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    ৳{selectedProductModal.discountPrice || selectedProductModal.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => {
                      addToCart(selectedProductModal, 1, selectedProductModal.gsm);
                      handleCloseModal();
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                      isDark
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    {t('add_to_cart')}
                  </button>

                  <button
                    onClick={() => {
                      handleQuickBuy(selectedProductModal);
                      handleCloseModal();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all active:scale-95"
                  >
                    <span>{t('buy_now')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
