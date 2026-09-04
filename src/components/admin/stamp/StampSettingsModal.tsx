import React, { useState } from 'react';
import { StampItemConfig } from '../../../types';
import { X, Plus, Trash2, Sliders, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { initialStampConfigs } from '../../../data/initialData';

interface StampSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stampConfigs?: StampItemConfig[];
  updateStampConfig?: (id: string, updates: Partial<StampItemConfig>) => void;
  addStampConfig?: (configData: Omit<StampItemConfig, 'id'>) => StampItemConfig;
  deleteStampConfig?: (id: string) => void;
}

export const StampSettingsModal: React.FC<StampSettingsModalProps> = ({
  isOpen,
  onClose,
  stampConfigs = [],
  updateStampConfig = (_id: string, _updates: Partial<StampItemConfig>) => {},
  addStampConfig = (_configData: Omit<StampItemConfig, 'id'>) => ({} as any),
  deleteStampConfig = (_id: string) => {}
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    nameBn: '',
    name: '',
    faceValue: 0,
    defaultBuyPrice: 0,
    defaultSalePrice: 0,
    currentStock: 0,
    lowStockThreshold: 10,
    category: 'stamp' as 'stamp' | 'cartridge' | 'service',
    descriptionBn: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.nameBn.trim()) {
      alert('অনুগ্রহ করে আইটেমের নাম (বাংলা) প্রদান করুন');
      return;
    }

    addStampConfig({
      nameBn: newItem.nameBn.trim(),
      name: newItem.name.trim() || newItem.nameBn.trim(),
      faceValue: Number(newItem.faceValue) || 0,
      defaultBuyPrice: Number(newItem.defaultBuyPrice) || 0,
      defaultSalePrice: Number(newItem.defaultSalePrice) || 0,
      currentStock: Number(newItem.currentStock) || 0,
      lowStockThreshold: Number(newItem.lowStockThreshold) || 5,
      category: newItem.category,
      descriptionBn: newItem.descriptionBn.trim()
    });

    setNewItem({
      nameBn: '',
      name: '',
      faceValue: 0,
      defaultBuyPrice: 0,
      defaultSalePrice: 0,
      currentStock: 0,
      lowStockThreshold: 10,
      category: 'stamp',
      descriptionBn: ''
    });
    setShowAddForm(false);
    setSuccessMsg('নতুন আইটেম সফলভাবে সংযোজন করা হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteItem = (item: StampItemConfig) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${item.nameBn}" আইটেমটি তালিকা থেকে বিয়োজন (মুছে ফেলতে) চান?`)) {
      deleteStampConfig(item.id);
      setSuccessMsg(`"${item.nameBn}" বিয়োজন করা হয়েছে!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleResetToCoreThree = () => {
    if (confirm('আপনি কি স্ট্যাম্প তালিকা শুধু কার্টিজ পেপার, ৫০ টাকার ও ১০০ টাকার স্ট্যাম্পে রিসেট করতে চান? অন্য সব মুছে যাবে।')) {
      // Delete non-core items
      const coreIds = ['cartridge_paper', 'stamp_50', 'stamp_100'];
      stampConfigs.forEach(item => {
        if (!coreIds.includes(item.id)) {
          deleteStampConfig(item.id);
        }
      });
      setSuccessMsg('তালিকাটি শুধু কার্টিজ, ৫০৳ ও ১০০৳ স্ট্যাম্পে সেট করা হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 w-full max-w-2xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-neutral-800">
          <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">স্ট্যাম্প ও কার্টিজ সেটিংস (অ্যাডমিন কন্ট্রোল)</h3>
            <p className="text-xs text-neutral-400">
              আইটেম সংযোজন, বিয়োজন, ক্রয়-বিক্রয় রেট ও স্টক নিয়ন্ত্রণ করুন
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <button
            onClick={() => setShowAddForm(p => !p)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'সংযোজন ফরম বন্ধ করুন' : '+ নতুন স্ট্যাম্প বা পেপার সংযোজন করুন'}</span>
          </button>

          <button
            onClick={handleResetToCoreThree}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors"
            title="কার্টিজ, ৫০৳ ও ১০০৳ স্ট্যাম্পে রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>শুধু ৩টি ডিফল্ট আইটেমে রিসেট</span>
          </button>
        </div>

        {/* Form: Add New Stamp / Item */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="mb-4 p-4 rounded-xl bg-neutral-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-xs text-emerald-400 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন স্ট্যাম্প / আইটেম সংযোজন ফরম</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-neutral-500 hover:text-neutral-300 text-xs"
              >
                বাতিল
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  আইটেমের নাম (বাংলা) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ২০০ টাকার নন-জুডিশিয়াল স্ট্যাম্প"
                  value={newItem.nameBn}
                  onChange={e => setNewItem(p => ({ ...p, nameBn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  ক্যাটাগরি
                </label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem(p => ({ ...p, category: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="stamp">নন-জুডিশিয়াল স্ট্যাম্প (Stamp)</option>
                  <option value="cartridge">কার্টিজ পেপার (Cartridge Paper)</option>
                  <option value="service">সার্ভিস ফি (Service/Typing)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  ফেস ভ্যালু (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.faceValue}
                  onChange={e => setNewItem(p => ({ ...p, faceValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  ডিফল্ট ক্রয় মূল্য (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.defaultBuyPrice}
                  onChange={e => setNewItem(p => ({ ...p, defaultBuyPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-red-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  ডিফল্ট বিক্রয় মূল্য (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.defaultSalePrice}
                  onChange={e => setNewItem(p => ({ ...p, defaultSalePrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-semibold mb-1">
                  প্রাথমিক স্টক (পিস)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.currentStock}
                  onChange={e => setNewItem(p => ({ ...p, currentStock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-purple-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                সংযোজন নিশ্চিত করুন (+)
              </button>
            </div>
          </form>
        )}

        {/* Existing Items List with Edit and Delete (বিয়োজন) */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {stampConfigs.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.nameBn}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                    {item.id}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item)}
                  className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="এই আইটেমটি বিয়োজন (মুছে ফেলুন)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>বিয়োজন করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    ক্রয় মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={item.defaultBuyPrice}
                    onChange={e => updateStampConfig(item.id, { defaultBuyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-red-400 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-400 font-medium">
                      বিক্রয় মূল্য (৳)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold">বাড়ান / কমান</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateStampConfig(item.id, { defaultSalePrice: Math.max(0, item.defaultSalePrice - 5) })}
                      className="px-1.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-bold text-xs"
                      title="৫ টাকা কমান"
                    >
                      -৫
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStampConfig(item.id, { defaultSalePrice: Math.max(0, item.defaultSalePrice - 1) })}
                      className="px-1.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                      title="১ টাকা কমান"
                    >
                      -১
                    </button>
                    <input
                      type="number"
                      value={item.defaultSalePrice}
                      onChange={e => updateStampConfig(item.id, { defaultSalePrice: parseFloat(e.target.value) || 0 })}
                      className="flex-1 min-w-[50px] px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-emerald-300 font-bold font-mono text-center focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => updateStampConfig(item.id, { defaultSalePrice: item.defaultSalePrice + 1 })}
                      className="px-1.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
                      title="১ টাকা বাড়ান"
                    >
                      +১
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStampConfig(item.id, { defaultSalePrice: item.defaultSalePrice + 5 })}
                      className="px-1.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs"
                      title="৫ টাকা বাড়ান"
                    >
                      +৫
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    বর্তমান স্টক (পিস)
                  </label>
                  <input
                    type="number"
                    value={item.currentStock}
                    onChange={e => updateStampConfig(item.id, { currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-purple-300 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>
                  প্রতি পিসে মুনাফা: <strong className="text-emerald-400">৳{item.defaultSalePrice - item.defaultBuyPrice}</strong>
                </span>
                <span>
                  অ্যালার্ট থ্রেশহোল্ড: <strong>{item.lowStockThreshold} পিস</strong>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-neutral-800 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
          >
            সংরক্ষণ ও বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
