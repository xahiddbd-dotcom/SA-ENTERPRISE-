import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
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

  const matchedOrders = clean
    ? orders.filter(o => o.orderNumber.toLowerCase().includes(clean) || o.customerPhone.includes(clean) || o.customerName.toLowerCase().includes(clean))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            id="global-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'সার্ভিস, প্রোডাক্ট, আবেদন নম্বর বা ফোন দিয়ে সার্চ করুন...' : 'Search services, paper, app ID, order or phone...'}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {!clean && (
            <div className="text-center py-8 text-xs text-neutral-500 space-y-2">
              <p>Type to search across everything in Saiful Enterprise.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['Tejgaon College', 'BMET', 'Passport Photo', 'A4 70 GSM', 'Army Apply', 'APP-2026-0001'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-emerald-400"
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
              <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider block mb-2">
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
                    className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">{language === 'bn' ? s.nameBn : s.name}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">৳{s.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase text-teal-400 tracking-wider block mb-2">
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
                    className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-teal-400" />
                      <span className="font-semibold text-white">{language === 'bn' ? p.nameBn : p.name}</span>
                      {p.gsm && <span className="text-[10px] text-neutral-400">({p.gsm} GSM)</span>}
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">৳{p.discountPrice || p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Applications */}
          {matchedApps.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider block mb-2">
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
                    className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-bold text-amber-300">{a.applicationNumber}</span>
                      <span className="text-neutral-300">({a.applicantName})</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase">
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
