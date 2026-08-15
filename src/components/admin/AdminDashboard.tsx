import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Service, Product, StaffMember, Application, Order, ApplicationStatus } from '../../types';
import { POSCounter } from '../pos/POSCounter';
import { DatabaseBackup } from './DatabaseBackup';
import {
  LayoutDashboard,
  Layers,
  Package,
  FileCheck,
  ShoppingBag,
  Calculator,
  Users,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Printer,
  Search,
  X,
  DollarSign,
  Truck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const {
    services, addService, updateService, deleteService,
    products, addProduct, updateProduct, deleteProduct,
    applications, updateApplicationStatus,
    orders, updateOrderStatus,
    invoices,
    staff, addStaffMember, updateStaffMember, deleteStaffMember,
    settings, updateSettings
  } = useData();
  const { currentUser } = useAuth();

  const [activeMenu, setActiveMenu] = useState<'overview' | 'services' | 'products' | 'applications' | 'orders' | 'pos' | 'staff' | 'settings' | 'backup'>('overview');

  // Modals & form states
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<StaffMember> | null>(null);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Quick statistics
  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0) + orders.reduce((s, o) => s + (o.paymentStatus === 'paid' || o.paymentStatus === 'verified' ? o.total : 0), 0);
  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter(a => a.status === 'new' || a.status === 'processing').length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockAlert).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.name || !editingService?.price) return;

    if (editingService.id) {
      updateService(editingService.id, editingService);
    } else {
      addService({
        name: editingService.name,
        nameBn: editingService.nameBn || editingService.name,
        categoryId: editingService.categoryId || 'edu_admission',
        price: Number(editingService.price),
        estimatedTime: editingService.estimatedTime || '15-30 mins',
        estimatedTimeBn: editingService.estimatedTimeBn || '১৫-৩০ মিনিট',
        description: editingService.description || '',
        descriptionBn: editingService.descriptionBn || '',
        requiredDocuments: editingService.requiredDocuments || ['NID / Birth Certificate', 'Passport Photo'],
        requiredDocumentsBn: editingService.requiredDocumentsBn || ['জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন', 'পাসপোর্ট ছবি'],
        isActive: true,
        isPopular: !!editingService.isPopular
      });
    }
    setEditingService(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    if (editingProduct.id) {
      updateProduct(editingProduct.id, editingProduct);
    } else {
      addProduct({
        name: editingProduct.name,
        nameBn: editingProduct.nameBn || editingProduct.name,
        sku: editingProduct.sku || `SE-PAP-${Date.now().toString().slice(-4)}`,
        categoryId: editingProduct.categoryId || 'paper',
        price: Number(editingProduct.price),
        discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : undefined,
        stock: Number(editingProduct.stock || 50),
        lowStockAlert: Number(editingProduct.lowStockAlert || 10),
        gsm: editingProduct.gsm ? Number(editingProduct.gsm) : undefined,
        packSize: editingProduct.packSize || '1 Ream (500 Sheets)',
        packSizeBn: editingProduct.packSizeBn || '১ রিম (৫০০ পাতা)',
        brand: editingProduct.brand || 'Double A',
        images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=60'],
        description: editingProduct.description || '',
        descriptionBn: editingProduct.descriptionBn || '',
        isActive: true
      });
    }
    setEditingProduct(null);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.name || !editingStaff?.employeeId) return;

    if (editingStaff.id) {
      updateStaffMember(editingStaff.id, editingStaff);
    } else {
      addStaffMember({
        employeeId: editingStaff.employeeId,
        name: editingStaff.name,
        nameBn: editingStaff.nameBn || editingStaff.name,
        role: editingStaff.role || 'service_operator',
        phone: editingStaff.phone || '01700000000',
        email: editingStaff.email || 'staff@saifulenterprise.com',
        shift: editingStaff.shift || 'Morning (8:00 AM - 4:00 PM)',
        salary: Number(editingStaff.salary || 18000),
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'active',
        performanceScore: 95
      });
    }
    setEditingStaff(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)] bg-neutral-950">
      {/* WordPress-Style Dark Sidebar */}
      <aside className="w-full lg:w-64 bg-neutral-900 border-r border-neutral-800 p-4 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Admin Tag */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              SA
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold text-white truncate">Saiful Enterprise CMS</h3>
              <p className="text-[10px] text-emerald-400 font-mono">Super Admin Control</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'services', label: 'Services Manager', icon: Layers, badge: services.length },
              { id: 'products', label: 'Paper & Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-rose-900 text-rose-300' },
              { id: 'applications', label: 'Online Applications', icon: FileCheck, badge: pendingAppsCount > 0 ? `${pendingAppsCount} New` : undefined, badgeColor: 'bg-amber-900 text-amber-300' },
              { id: 'orders', label: 'E-Commerce Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'pos', label: 'POS Cashier Counter', icon: Calculator },
              { id: 'staff', label: 'Staff & Operators', icon: Users, badge: staff.length },
              { id: 'backup', label: 'Database Backup', icon: Database },
              { id: 'settings', label: 'Business Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => setActiveMenu(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status */}
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1 mt-6">
          <p className="text-white font-semibold">Store Status: <span className="text-emerald-400">Open</span></p>
          <p>Farmgate Indira Road Branch</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {/* VIEW 1: OVERVIEW */}
        {activeMenu === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Business Control Dashboard</h1>
                <p className="text-xs text-neutral-400">Live summary of sales, applications, and counter activities.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMenu('backup')}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Database Backup</span>
                </button>
                <button
                  onClick={() => setActiveMenu('pos')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Launch POS Counter</span>
                </button>
              </div>
            </div>

            {/* Analytics Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                  <span>Total Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ৳{totalRevenue.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> +18.4% this month
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                  <span>Online Applications</span>
                  <FileCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {totalAppsCount}
                </div>
                <p className="text-[11px] text-amber-400 font-semibold">
                  {pendingAppsCount} pending review
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                  <span>Paper Stock Units</span>
                  <Package className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {products.reduce((s, p) => s + p.stock, 0)} Reams
                </div>
                <p className="text-[11px] text-teal-400 font-semibold">
                  {products.length} product SKUs active
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                  <span>Staff & Operators</span>
                  <Users className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {staff.length} Active
                </div>
                <p className="text-[11px] text-pink-400 font-semibold">
                  100% Attendance today
                </p>
              </div>
            </div>

            {/* Recent Applications & Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications Feed */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Recent Customer Applications</span>
                  </h3>
                  <button onClick={() => setActiveMenu('applications')} className="text-xs text-emerald-400 hover:underline">
                    View All →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {applications.slice(0, 4).map(app => (
                    <div key={app.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-400">{app.applicationNumber}</span>
                        <p className="text-white font-semibold mt-0.5">{app.serviceName}</p>
                        <p className="text-neutral-400 text-[11px]">{app.applicantName} • {app.applicantPhone}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-bold text-neutral-300 uppercase">
                          {app.status}
                        </span>
                        <span className="block font-mono text-emerald-400 font-bold">৳{app.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Invoices Feed */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-teal-400" />
                    <span>Recent POS Counter Invoices</span>
                  </h3>
                  <button onClick={() => setActiveMenu('pos')} className="text-xs text-teal-400 hover:underline">
                    New Sale →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {invoices.slice(0, 4).map(inv => (
                    <div key={inv.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-teal-400">{inv.invoiceNumber}</span>
                        <p className="text-white font-semibold mt-0.5">{inv.customerName}</p>
                        <p className="text-neutral-400 text-[11px]">{inv.items.length} items • {inv.paymentMethod.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-extrabold text-white">৳{inv.total}</span>
                        <span className="block text-[10px] text-emerald-400 font-bold uppercase">{inv.paymentStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SERVICES MANAGER */}
        {activeMenu === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Digital Services Management</h1>
                <p className="text-xs text-neutral-400">Configure online applications, pricing, required documents and category badges.</p>
              </div>
              <button
                onClick={() => setEditingService({
                  name: '',
                  nameBn: '',
                  price: 100,
                  categoryId: 'edu_admission',
                  estimatedTime: '10-20 mins',
                  estimatedTimeBn: '১০-২০ মিনিট',
                  requiredDocuments: ['NID / Birth Certificate', 'Passport Photo'],
                  requiredDocumentsBn: ['জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন', 'পাসপোর্ট ছবি'],
                  description: '',
                  descriptionBn: '',
                  isPopular: false
                })}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">Service Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Fee / Price</th>
                      <th className="p-4">Processing Time</th>
                      <th className="p-4">Required Documents</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-neutral-850/60">
                        <td className="p-4">
                          <strong className="text-white block text-sm">{s.name}</strong>
                          <span className="text-neutral-400 text-xs">{s.nameBn}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]">
                            {s.categoryId}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                          ৳{s.price}
                        </td>
                        <td className="p-4 text-neutral-300">{s.estimatedTime}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {s.requiredDocuments?.map((doc, idx) => (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingService(s)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete service: ${s.name}?`)) deleteService(s.id);
                            }}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCTS & INVENTORY */}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Paper & Product Inventory</h1>
                <p className="text-xs text-neutral-400">Manage A4 Paper, Photo Paper (120-230 GSM), Stock levels and Wholesale pricing.</p>
              </div>
              <button
                onClick={() => setEditingProduct({
                  name: '',
                  nameBn: '',
                  sku: `SE-PAP-${Date.now().toString().slice(-4)}`,
                  brand: 'Paper One',
                  gsm: 80,
                  price: 450,
                  discountPrice: 420,
                  stock: 50,
                  lowStockAlert: 10,
                  packSize: '1 Ream (500 Sheets)',
                  packSizeBn: '১ রিম (৫০০ পাতা)',
                  categoryId: 'paper',
                  description: '',
                  descriptionBn: '',
                  images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=60']
                })}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product / Paper</span>
              </button>
            </div>

            {/* Product Inventory Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-4">SKU / Item</th>
                      <th className="p-4">GSM / Spec</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Retail Price</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {products.map(p => {
                      const isLow = p.stock <= p.lowStockAlert;
                      return (
                        <tr key={p.id} className="hover:bg-neutral-850/60">
                          <td className="p-4">
                            <span className="font-mono text-[10px] text-neutral-400 block">{p.sku}</span>
                            <strong className="text-white text-sm block">{p.name}</strong>
                            <span className="text-neutral-400 text-[11px]">{p.packSize}</span>
                          </td>
                          <td className="p-4">
                            {p.gsm ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
                                {p.gsm} GSM
                              </span>
                            ) : (
                              <span className="text-neutral-500">Standard</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-neutral-200">{p.brand}</td>
                          <td className="p-4">
                            <span className="text-emerald-400 font-mono font-bold text-sm">৳{p.discountPrice || p.price}</span>
                            {p.discountPrice && (
                              <span className="text-neutral-500 line-through text-[10px] block font-mono">৳{p.price}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`font-mono font-bold text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {p.stock} units
                            </span>
                            {isLow && <span className="block text-[10px] text-rose-400 font-semibold">Low Stock Alert!</span>}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product: ${p.name}?`)) deleteProduct(p.id);
                              }}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: APPLICATIONS */}
        {activeMenu === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Application Pipeline & Tracking</h1>
                <p className="text-xs text-neutral-400">Monitor student admission forms, defense jobs, BMET and government clearance.</p>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold font-mono text-emerald-400">{app.applicationNumber}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold uppercase">{app.status}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{app.serviceName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
                        ৳{app.amount} ({app.paymentStatus})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-neutral-950 p-3.5 rounded-xl border border-neutral-850">
                    <div>
                      <span className="text-neutral-400 block">Applicant:</span>
                      <strong className="text-white">{app.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Contact Phone:</span>
                      <span className="font-mono text-emerald-400 font-bold">{app.applicantPhone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">Submission Date:</span>
                      <span className="text-neutral-300">{new Date(app.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {app.customerNotes && (
                    <p className="text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/20">
                      <strong>Customer Notes:</strong> {app.customerNotes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-neutral-400">Change Status:</span>
                      {(['new', 'processing', 'submitted', 'completed', 'delivered'] as ApplicationStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => updateApplicationStatus(app.id, st)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                            app.status === st ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/88${app.applicantPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900"
                    >
                      WhatsApp Update
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: ORDERS */}
        {activeMenu === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">E-Commerce & Paper Orders</h1>
                <p className="text-xs text-neutral-400">Verify bKash / Nagad TrxIDs, change shipping status and manage delivery.</p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                    <div>
                      <span className="font-mono font-extrabold text-emerald-400 text-sm">{order.orderNumber}</span>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        Customer: <strong className="text-white">{order.customerName}</strong> ({order.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold uppercase">
                        {order.orderStatus}
                      </span>
                      <span className="text-base font-mono font-extrabold text-emerald-400">
                        ৳{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-xs text-neutral-300">
                        <span>{item.quantity}x {item.productName} {item.gsm ? `(${item.gsm} GSM)` : ''}</span>
                        <span className="font-mono font-bold text-white">৳{item.total}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-400">
                      Payment: <strong className="text-white uppercase">{order.paymentMethod}</strong> {order.paymentTrxId && `[TrxID: ${order.paymentTrxId}]`}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(['pending', 'confirmed', 'processing', 'delivered'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(order.id, st)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                            order.orderStatus === st ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: POS COUNTER */}
        {activeMenu === 'pos' && (
          <POSCounter />
        )}

        {/* VIEW 7: STAFF MANAGEMENT */}
        {activeMenu === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Staff & Operator Management</h1>
                <p className="text-xs text-neutral-400">Manage operator accounts, assigned shifts, base salaries, and performance.</p>
              </div>
              <button
                onClick={() => setEditingStaff({
                  employeeId: `SE-EMP-00${staff.length + 1}`,
                  name: '',
                  nameBn: '',
                  role: 'service_operator',
                  phone: '',
                  email: '',
                  shift: 'Morning (8:00 AM - 4:00 PM)',
                  salary: 18000
                })}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map(member => (
                <div key={member.id} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{member.name}</h3>
                        <span className="text-[10px] font-mono text-neutral-400">{member.employeeId}</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 uppercase font-bold border border-emerald-500/30">
                      {member.role}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                    <p className="text-neutral-300"><strong>Phone:</strong> {member.phone}</p>
                    <p className="text-neutral-300"><strong>Shift:</strong> {member.shift}</p>
                    <p className="text-neutral-300"><strong>Salary:</strong> ৳{member.salary.toLocaleString()}/mo</p>
                    <p className="text-neutral-300"><strong>Score:</strong> {member.performanceScore}%</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                    <button
                      onClick={() => setEditingStaff(member)}
                      className="p-1.5 rounded-lg bg-neutral-800 text-emerald-400 hover:bg-neutral-700"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove staff member ${member.name}?`)) deleteStaffMember(member.id);
                      }}
                      className="p-1.5 rounded-lg bg-neutral-800 text-rose-400 hover:bg-rose-900/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: GENERAL SETTINGS */}
        {activeMenu === 'settings' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-neutral-800">
              <h1 className="text-2xl font-extrabold text-white">Business Information & Site Settings</h1>
              <p className="text-xs text-neutral-400">Update shop address, hotline, bKash numbers, and top announcement text.</p>
            </div>

            {settingsSaved && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved and applied successfully across all public and admin views!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Name (English)</label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={e => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Name (Bangla)</label>
                  <input
                    type="text"
                    value={settingsForm.businessNameBn}
                    onChange={e => setSettingsForm({ ...settingsForm, businessNameBn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Hotline</label>
                  <input
                    type="text"
                    value={settingsForm.phonePrimary}
                    onChange={e => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp & bKash Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value, bkashNumber: e.target.value, nagadNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Inside Dhaka Delivery Fee (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryChargeInsideDhaka}
                    onChange={e => setSettingsForm({ ...settingsForm, deliveryChargeInsideDhaka: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Shop Address (English)</label>
                  <textarea
                    rows={2}
                    value={settingsForm.address}
                    onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Shop Address (Bangla)</label>
                  <textarea
                    rows={2}
                    value={settingsForm.addressBn}
                    onChange={e => setSettingsForm({ ...settingsForm, addressBn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Top Notice Bar Text (English)</label>
                  <textarea
                    rows={2}
                    value={settingsForm.noticeEn}
                    onChange={e => setSettingsForm({ ...settingsForm, noticeEn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Top Notice Bar Text (Bangla)</label>
                  <textarea
                    rows={2}
                    value={settingsForm.noticeBn}
                    onChange={e => setSettingsForm({ ...settingsForm, noticeBn: e.target.value })}
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Database Backup Quick Action Card inside Settings */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">System Data Backup & Restore</h4>
                    <p className="text-[11px] text-neutral-400">Download snapshot of all services, paper stocks, orders, and applications as JSON.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenu('backup')}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Open Backup Tool</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 9: DATABASE BACKUP & RESTORE */}
        {activeMenu === 'backup' && (
          <DatabaseBackup />
        )}
      </main>

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">{editingService.id ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setEditingService(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Name (English)</label>
                  <input
                    required
                    type="text"
                    value={editingService.name || ''}
                    onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Name (Bangla)</label>
                  <input
                    required
                    type="text"
                    value={editingService.nameBn || ''}
                    onChange={e => setEditingService({ ...editingService, nameBn: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Price (৳)</label>
                  <input
                    required
                    type="number"
                    value={editingService.price || ''}
                    onChange={e => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Processing Time</label>
                  <input
                    type="text"
                    value={editingService.estimatedTime || ''}
                    onChange={e => setEditingService({ ...editingService, estimatedTime: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">{editingProduct.id ? 'Edit Product' : 'Add Paper / Product'}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Product Name</label>
                  <input
                    required
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">GSM</label>
                  <input
                    type="number"
                    value={editingProduct.gsm || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, gsm: Number(e.target.value) })}
                    placeholder="70, 80, 150..."
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Price (৳)</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Stock (Units)</label>
                  <input
                    required
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Editor Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">{editingStaff.id ? 'Edit Staff' : 'Add Staff Member'}</h3>
              <button onClick={() => setEditingStaff(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Staff Name</label>
                <input
                  required
                  type="text"
                  value={editingStaff.name || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Employee ID</label>
                  <input
                    required
                    type="text"
                    value={editingStaff.employeeId || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, employeeId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Phone</label>
                  <input
                    required
                    type="text"
                    value={editingStaff.phone || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingStaff(null)} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
