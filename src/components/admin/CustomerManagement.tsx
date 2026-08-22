import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { User } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Ban,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  X,
  Save,
  Filter,
  ShoppingBag,
  FileCheck,
  Sparkles
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { language } = useLanguage();
  const { customers, addCustomer, updateCustomer, deleteCustomer, toggleBlockCustomer, orders, applications } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'blocked' | 'google' | 'phone_otp'>('all');
  
  // Modals
  const [editingCustomer, setEditingCustomer] = useState<Partial<User> | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blockModalCustomer, setBlockModalCustomer] = useState<User | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('');
  
  // New Customer Form
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    nameBn: '',
    phone: '',
    email: '',
    address: 'Tejgaon, Dhaka',
    customerNotes: ''
  });

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'active') return !c.isBlocked;
    if (filterType === 'blocked') return !!c.isBlocked;
    if (filterType === 'google') return c.authProvider === 'google';
    if (filterType === 'phone_otp') return c.authProvider === 'phone_otp';
    return true;
  });

  // Metrics
  const totalCount = customers.length;
  const activeCount = customers.filter(c => !c.isBlocked).length;
  const blockedCount = customers.filter(c => !!c.isBlocked).length;
  const googleCount = customers.filter(c => c.authProvider === 'google').length;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) return;

    addCustomer({
      name: newCustomerForm.name,
      nameBn: newCustomerForm.nameBn || newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email || `${newCustomerForm.phone}@customer.bd`,
      address: newCustomerForm.address,
      customerNotes: newCustomerForm.customerNotes,
      role: 'customer',
      isActive: true,
      isBlocked: false,
      isPhoneVerified: true,
      authProvider: 'phone_otp',
      registeredAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    });

    setNewCustomerForm({
      name: '',
      nameBn: '',
      phone: '',
      email: '',
      address: 'Tejgaon, Dhaka',
      customerNotes: ''
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.id || !editingCustomer.name) return;

    updateCustomer(editingCustomer.id, {
      name: editingCustomer.name,
      nameBn: editingCustomer.nameBn,
      phone: editingCustomer.phone,
      email: editingCustomer.email,
      address: editingCustomer.address,
      customerNotes: editingCustomer.customerNotes
    });
    setEditingCustomer(null);
  };

  const handleConfirmToggleBlock = () => {
    if (!blockModalCustomer) return;
    toggleBlockCustomer(blockModalCustomer.id, blockReasonInput || 'Account suspended by Administrator');
    setBlockModalCustomer(null);
    setBlockReasonInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>{language === 'bn' ? 'কাস্টমার অ্যাকাউন্ট ও গ্রাহক ডাটাবেজ' : 'Customer Accounts Management'}</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {language === 'bn'
              ? 'গ্রাহকদের নতুন একাউন্ট তৈরি, ব্লক/আনব্লক, প্রোফাইল ডিলিট, ফোন ও গুগল ভেরিফিকেশন স্ট্যাটাস নিয়ন্ত্রণ।'
              : 'Create new customer accounts, block/unblock access, delete profiles, and inspect order histories.'}
          </p>
        </div>

        <button
          id="admin-add-customer-btn"
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন কাস্টমার একাউন্ট যুক্ত করুন' : 'Add New Customer'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <span className="text-[11px] text-neutral-400 uppercase font-semibold">Total Customers</span>
          <div className="text-2xl font-black font-mono text-white mt-1">{totalCount}</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <span className="text-[11px] text-emerald-400 uppercase font-semibold">Active Profiles</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{activeCount}</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <span className="text-[11px] text-rose-400 uppercase font-semibold">Blocked / Suspended</span>
          <div className="text-2xl font-black font-mono text-rose-400 mt-1">{blockedCount}</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
          <span className="text-[11px] text-sky-400 uppercase font-semibold">Google Verified</span>
          <div className="text-2xl font-black font-mono text-sky-400 mt-1">{googleCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'নাম, মোবাইল বা ইমেইল দিয়ে খুঁজুন...' : 'Search by name, phone, email...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল গ্রাহক' : 'All' },
            { id: 'active', label: language === 'bn' ? 'সক্রিয়' : 'Active' },
            { id: 'blocked', label: language === 'bn' ? 'ব্লক করা' : 'Blocked' },
            { id: 'phone_otp', label: language === 'bn' ? 'ফোন OTP' : 'Phone OTP' },
            { id: 'google', label: language === 'bn' ? 'গুগল সাইন-ইন' : 'Google Auth' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === f.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(customer => {
          const customerOrders = orders.filter(o => o.customerPhone === customer.phone || o.customerName === customer.name);
          const customerApps = applications.filter(a => a.applicantPhone === customer.phone || a.applicantName === customer.name);

          return (
            <div
              key={customer.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all duration-200 ${
                customer.isBlocked
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-xl'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                      alt={customer.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border border-neutral-700 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-bold text-white leading-tight truncate">
                        {customer.name}
                      </h3>
                      {customer.nameBn && (
                        <span className="text-[11px] text-neutral-400 block truncate">
                          {customer.nameBn}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block mt-0.5">
                        {customer.phone || 'No Phone'}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {customer.isBlocked ? (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <Ban className="w-3 h-3 text-rose-400" />
                      <span>Blocked</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Details Box */}
                <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-850 space-y-1.5 text-xs">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-neutral-300 truncate">
                      <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}

                  {customer.address && (
                    <div className="flex items-center gap-2 text-neutral-400 truncate">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>Joined: {customer.registeredAt ? new Date(customer.registeredAt).toLocaleDateString() : 'Active'}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-emerald-400 font-bold">
                      {customer.authProvider === 'google' ? 'Google' : 'Phone OTP'}
                    </span>
                  </div>
                </div>

                {/* Block reason notice if blocked */}
                {customer.isBlocked && customer.blockReason && (
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] space-y-0.5">
                    <strong className="block font-bold">Block Reason:</strong>
                    <p>{customer.blockReason}</p>
                  </div>
                )}

                {/* Order & Application Activity Summary */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-850">
                    <span className="text-neutral-400 text-[10px] block">Shop Orders</span>
                    <strong className="text-emerald-400 font-mono font-bold text-sm">{customerOrders.length}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-850">
                    <span className="text-neutral-400 text-[10px] block">Online Apps</span>
                    <strong className="text-teal-400 font-mono font-bold text-sm">{customerApps.length}</strong>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                {/* Contact Shortcuts */}
                <div className="flex items-center gap-1.5">
                  {customer.phone && (
                    <>
                      <a
                        href={`tel:${customer.phone}`}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/88${customer.phone}?text=${encodeURIComponent(
                          `হ্যালো ${customer.name}, সাইফুল এন্টারপ্রাইজ থেকে শুভেচ্ছা!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 transition-colors"
                        title="WhatsApp Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>

                {/* Admin Management Tools */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(customer)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-emerald-600 text-neutral-300 hover:text-white transition-colors"
                    title="Edit Customer Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBlockModalCustomer(customer);
                      setBlockReasonInput(customer.blockReason || '');
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      customer.isBlocked
                        ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                        : 'bg-rose-950/50 border-rose-500/40 text-rose-300 hover:bg-rose-900'
                    }`}
                    title={customer.isBlocked ? 'Unblock Customer' : 'Block Customer Profile'}
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete customer profile: ${customer.name}?`)) {
                        deleteCustomer(customer.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-900/60 text-rose-400 transition-colors"
                    title="Delete Customer Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="p-12 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl space-y-2">
          <Users className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No customers found</h3>
          <p className="text-xs text-neutral-400">Try changing your search query or filter selection.</p>
        </div>
      )}

      {/* MODAL: Add New Customer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'নতুন কাস্টমার একাউন্ট তৈরি' : 'Create Customer Account'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Customer Full Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamrul Hasan"
                  value={newCustomerForm.name}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Customer Name (Bangla)</label>
                <input
                  type="text"
                  placeholder="e.g. কামরুল হাসান"
                  value={newCustomerForm.nameBn}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, nameBn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={newCustomerForm.phone}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="customer@gmail.com"
                  value={newCustomerForm.email}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  placeholder="e.g. Indira Road, Farmgate, Tejgaon, Dhaka"
                  value={newCustomerForm.address}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Admin Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tejgaon College Student, regular Double A paper buyer"
                  value={newCustomerForm.customerNotes}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, customerNotes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <Save className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Customer */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-400" />
                <span>Edit Customer Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={editingCustomer.phone || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingCustomer.email || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={editingCustomer.address || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Admin Notes</label>
                <textarea
                  rows={2}
                  value={editingCustomer.customerNotes || ''}
                  onChange={e => setEditingCustomer({ ...editingCustomer, customerNotes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Toggle Block Confirmation */}
      {blockModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">
                {blockModalCustomer.isBlocked
                  ? (language === 'bn' ? 'কাস্টমার আনব্লক / সক্রিয় করুন' : 'Unblock Customer Access')
                  : (language === 'bn' ? 'কাস্টমার অ্যাকাউন্ট স্থগিত (Block) করুন' : 'Block / Suspend Customer')}
              </h3>
            </div>

            <p className="text-xs text-neutral-300">
              {blockModalCustomer.isBlocked
                ? `Are you sure you want to restore access for ${blockModalCustomer.name} (${blockModalCustomer.phone})? They will be able to log in and order again.`
                : `Are you sure you want to block ${blockModalCustomer.name} (${blockModalCustomer.phone})? Blocked customers cannot log in or place orders.`}
            </p>

            {!blockModalCustomer.isBlocked && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Reason for suspension (Visible to customer upon login)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Account suspended due to invalid contact info"
                  value={blockReasonInput}
                  onChange={e => setBlockReasonInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            <div className="pt-3 flex justify-end gap-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setBlockModalCustomer(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleBlock}
                className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg ${
                  blockModalCustomer.isBlocked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                }`}
              >
                <Ban className="w-4 h-4" />
                <span>{blockModalCustomer.isBlocked ? 'Confirm Unblock' : 'Confirm Block Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
