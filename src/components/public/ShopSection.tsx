import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Product } from '../../types';
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
}

export const ShopSection: React.FC<ShopSectionProps> = ({ openCart }) => {
  const { language, t } = useLanguage();
  const { products, gsmOptions, addToCart } = useData();

  const [selectedGsm, setSelectedGsm] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

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
    <section id="paper-market-shop" className="py-16 bg-neutral-950/90">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Package className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অফিসিয়াল পেপার ও ফটো পেপার শপ' : 'Paper & Photo Paper Store'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('paper_market_title')}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base">
            {t('paper_market_desc')}
          </p>
        </div>

        {/* Filters & GSM Selector Bar */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          {/* GSM Filter Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Layers className="w-4 h-4" />
                {t('filter_by_gsm')}:
              </span>
              <span className="text-neutral-400">
                {selectedGsm === 'all' ? (language === 'bn' ? 'সকল পেপার' : 'All GSM') : `${selectedGsm} GSM`}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                id="gsm-pill-all"
                onClick={() => setSelectedGsm('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedGsm === 'all'
                    ? 'bg-emerald-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {t('all_gsm')}
              </button>

              {gsmOptions.map(option => (
                <button
                  key={option.id}
                  id={`gsm-pill-${option.gsm}`}
                  onClick={() => setSelectedGsm(option.gsm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedGsm === option.gsm
                      ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category sub bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
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
                        ? 'bg-neutral-700 text-white font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="shop-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'পেপার বা ব্র্যান্ড খুঁজুন...' : 'Search brand or paper...'}
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                onClick={() => setSelectedProductModal(product)}
                className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* Product Image & Badges */}
                <div className="relative h-48 bg-neutral-950 overflow-hidden flex items-center justify-center p-4">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-neutral-700" />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.gsm && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                        {product.gsm} GSM
                      </span>
                    )}
                    {product.brand && (
                      <span className="px-2 py-0.5 rounded bg-neutral-900/90 text-neutral-300 text-[10px] font-semibold border border-neutral-750">
                        {product.brand}
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                      SAVE ৳{product.price - (product.discountPrice || product.price)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block mb-1">
                      SKU: {product.sku}
                    </span>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2 mb-2">
                      {language === 'bn' ? product.nameBn : product.name}
                    </h3>

                    <div className="text-xs text-neutral-400 mb-3 flex items-center justify-between">
                      <span>{language === 'bn' ? product.packSizeBn : product.packSize}</span>
                      {isOutOfStock ? (
                        <span className="text-rose-400 font-semibold">{t('out_of_stock')}</span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('stock_in')} ({product.stock})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Cart button */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-white font-mono">
                          ৳{product.discountPrice || product.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-neutral-400 line-through font-mono">
                            ৳{product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      id={`add-to-cart-btn-${product.id}`}
                      disabled={isOutOfStock}
                      onClick={e => handleAddToCart(product, e)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('add_to_cart')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                {selectedProductModal.brand} • {selectedProductModal.gsm ? `${selectedProductModal.gsm} GSM` : 'Supplies'}
              </span>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="h-52 bg-neutral-950 rounded-xl p-4 flex items-center justify-center">
                <img
                  src={selectedProductModal.images[0]}
                  alt={selectedProductModal.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'bn' ? selectedProductModal.nameBn : selectedProductModal.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {language === 'bn' ? selectedProductModal.descriptionBn : selectedProductModal.description}
                </p>
              </div>

              {selectedProductModal.specifications && (
                <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-1.5">
                  <span className="text-xs font-semibold text-neutral-300 block mb-1">
                    {language === 'bn' ? 'স্পেসিফিকেশন:' : 'Specifications:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedProductModal.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-neutral-850 pb-1">
                        <span className="text-neutral-400">{key}:</span>
                        <span className="text-neutral-200 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-neutral-400 block">{t('price')}</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    ৳{selectedProductModal.discountPrice || selectedProductModal.price}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProductModal, 1, selectedProductModal.gsm);
                      setSelectedProductModal(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold"
                  >
                    {t('add_to_cart')}
                  </button>

                  <button
                    onClick={() => handleQuickBuy(selectedProductModal)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-lg"
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
