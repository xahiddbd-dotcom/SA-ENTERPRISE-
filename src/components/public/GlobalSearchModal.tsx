import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  X,
  Package,
  FileCheck,
  Printer,
  ShoppingBag,
  User,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (serviceId: string) => void;
  onSelectApplication?: (appId: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onSelectApplication,
  onSelectProduct
}) => {
  const { language } = useLanguage();
  const { services, products, applications, orders } = useData();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const clean = searchTerm.trim().toLowerCase();

  const matchedServices = clean
    ? services.filter(s => s.name.toLowerCase().includes(clean) || s.nameBn.includes(clean))
    : [];

  const matchedProducts = clean
    ? products.filter(p => p.name.toLowerCase().includes(clean) || p.nameBn.includes(clean) || p.sku.toLowerCase().includes(clean))
    : [];

  const matchedApps = clean
    ? applications.filter(a => a.applicationNumber.toLowerCase().includes(clean) || a.applicantPhone.includes(clean) || a.applicantName.toLowerCase().includes(clean))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors ${
        isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Search Bar */}
        <div className={`p-4 border-b flex items-center gap-3 transition-colors ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-100'
        }`}>
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            autoFocus
            id="global-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'সার্ভিস, প্রোডাক্ট, আবেদন নম্বর বা ফোন দিয়ে সার্চ করুন...' : 'Search services, paper, app ID, order or phone...'}
            className={`w-full bg-transparent text-sm sm:text-base focus:outline-none ${
              isDark ? 'text-white placeholder:text-neutral-500' : 'text-slate-900 placeholder:text-slate-400 font-medium'
            }`}
          />
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!clean && (
            <div className={`text-center py-8 text-xs space-y-2 ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>
              <p>Type to search across everything in Saiful Enterprise.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Tejgaon College', 'BMET', 'Passport Photo', 'A4 70 GSM', 'Army Apply', 'APP-2026-0001'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                      isDark
                        ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-emerald-400'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Services */}
          {matchedServices.length > 0 && (
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                Services ({matchedServices.length})
              </span>
              <div className="space-y-1.5">
                {matchedServices.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      if (onSelectService) onSelectService(s.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Printer className="w-4 h-4 text-emerald-500" />
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {language === 'bn' ? s.nameBn : s.name}
                      </span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">৳{s.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
                isDark ? 'text-teal-400' : 'text-teal-700'
              }`}>
                Products & Paper ({matchedProducts.length})
              </span>
              <div className="space-y-1.5">
                {matchedProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(p.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-teal-500" />
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {language === 'bn' ? p.nameBn : p.name}
                      </span>
                      {p.gsm && <span className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>({p.gsm} GSM)</span>}
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      ৳{p.discountPrice || p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Applications */}
          {matchedApps.length > 0 && (
            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${
                isDark ? 'text-amber-400' : 'text-amber-700'
              }`}>
                Applications ({matchedApps.length})
              </span>
              <div className="space-y-1.5">
                {matchedApps.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      if (onSelectApplication) onSelectApplication(a.applicationNumber);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-colors shadow-2xs ${
                      isDark
                        ? 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-amber-500" />
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-300">{a.applicationNumber}</span>
                      <span className={isDark ? 'text-neutral-300' : 'text-slate-600'}>({a.applicantName})</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
                      isDark
                        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
