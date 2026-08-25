import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Service, Product, StaffMember, Application, Order, ApplicationStatus, User } from '../../types';
import { POSCounter } from '../pos/POSCounter';
import { DatabaseBackup } from './DatabaseBackup';
import { CustomerManagement } from './CustomerManagement';
import { HeroSlidesManager } from './HeroSlidesManager';
import { SEOMetaManager } from './SEOMetaManager';
import { CashMemo } from './CashMemo';
import { AdminAnalyticsDashboard } from './AdminAnalyticsDashboard';
import { BackgroundSettingsManager } from './BackgroundSettingsManager';
import { ADMIN_THEMES, AdminThemeKey } from './AdminTheme';
import { AdminThemeSwitcher } from './AdminThemeSwitcher';
import {
  LayoutDashboard,
  Layers,
  Package,
  FileCheck,
  ShoppingBag,
  Calculator,
  Users,
  UserCheck,
  Ban,
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
  Truck,
  ExternalLink,
  LogOut,
  Bell,
  Globe,
  RefreshCw,
  Phone,
  MessageSquare,
  FileText,
  Clock,
  ShieldCheck,
  Award,
  Filter,
  Download,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Palette,
  Sparkles,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

interface AdminDashboardProps {
  onExitToStore?: () => void;
}

interface ExpenseItem {
  id: string;
  category: 'rent' | 'electricity' | 'paper_purchase' | 'toner_ink' | 'salary' | 'internet' | 'other';
  title: string;
  amount: number;
  date: string;
  note?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore }) => {
  const { language, toggleLanguage } = useLanguage();
  const {
    services, addService, updateService, deleteService,
    products, addProduct, updateProduct, deleteProduct,
    applications, updateApplicationStatus, addApplicationTimelineEvent,
    orders, updateOrderStatus,
    invoices,
    staff, addStaffMember, updateStaffMember, deleteStaffMember, toggleBlockStaff,
    customers, addCustomer, updateCustomer, deleteCustomer, toggleBlockCustomer,
    heroSlides,
    settings, updateSettings
  } = useData();
  const { currentUser, logout } = useAuth();

  // Admin Theme state
  const [adminTheme, setAdminTheme] = useState<AdminThemeKey>(() => {
    const saved = localStorage.getItem('se_admin_theme_choice');
    return (saved && (saved in ADMIN_THEMES)) ? (saved as AdminThemeKey) : 'emerald';
  });

  const handleThemeChange = (newTheme: AdminThemeKey) => {
    setAdminTheme(newTheme);
    localStorage.setItem('se_admin_theme_choice', newTheme);
  };

  const currentThemeConfig = ADMIN_THEMES[adminTheme] || ADMIN_THEMES.emerald;

  // Timeline Inspection Modal for Applications
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<Application | null>(null);
  const [timelineNewStatus, setTimelineNewStatus] = useState<ApplicationStatus>('processing');
  const [timelineNewTitle, setTimelineNewTitle] = useState('');
  const [timelineNewTitleBn, setTimelineNewTitleBn] = useState('');
  const [timelineNewDesc, setTimelineNewDesc] = useState('');
  const [timelineNewDescBn, setTimelineNewDescBn] = useState('');

  const [activeMenu, setActiveMenu] = useState<
    'overview' | 'analytics' | 'cashmemo' | 'services' | 'products' | 'applications' | 'orders' | 'pos' | 'finance' | 'customers' | 'staff' | 'hero_slides' | 'seo_meta' | 'background_settings' | 'settings' | 'backup'
  >('overview');

  // Modals & form states
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<User> | null>(null);
  const [staffSkillsInput, setStaffSkillsInput] = useState('');

  // Search and filter states
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productLowStockOnly, setProductLowStockOnly] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Local expense ledger storage for comprehensive accounting
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('se_admin_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'exp-1', category: 'paper_purchase', title: 'Double A 80 GSM Stock (30 Reams)', amount: 12600, date: new Date().toISOString().split('T')[0], note: 'Wholesale delivery from Chawkbazar depot' },
      { id: 'exp-2', category: 'toner_ink', title: 'Canon & HP Laser Toner Refill', amount: 3500, date: new Date().toISOString().split('T')[0], note: 'Black & Cyan toner refill' },
      { id: 'exp-3', category: 'electricity', title: 'Shop Electricity & AC Bill', amount: 4800, date: new Date().toISOString().split('T')[0], note: 'DESCO Pre-paid meter recharge' },
      { id: 'exp-4', category: 'internet', title: 'Optical Fiber High-Speed Internet', amount: 1500, date: new Date().toISOString().split('T')[0], note: '50 Mbps dedicated connection' }
    ];
  });

  const [newExpense, setNewExpense] = useState<Partial<ExpenseItem>>({
    category: 'paper_purchase',
    title: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    const item: ExpenseItem = {
      id: `exp_${Date.now()}`,
      category: newExpense.category || 'other',
      title: newExpense.title,
      amount: Number(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split('T')[0],
      note: newExpense.note
    };
    const updated = [item, ...expenses];
    setExpenses(updated);
    localStorage.setItem('se_admin_expenses', JSON.stringify(updated));
    setNewExpense({
      category: 'paper_purchase',
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setShowExpenseModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('se_admin_expenses', JSON.stringify(updated));
  };

  // Quick statistics
  const totalInvoiceIncome = invoices.reduce((s, i) => s + i.total, 0);
  const totalOrderIncome = orders.reduce((s, o) => s + (o.paymentStatus === 'paid' || o.paymentStatus === 'verified' ? o.total : 0), 0);
  const totalAppIncome = applications.reduce((s, a) => s + (a.paymentStatus === 'paid' ? a.amount : 0), 0);
  const totalRevenue = totalInvoiceIncome + totalOrderIncome + totalAppIncome;
  const totalExpensesAmount = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpensesAmount;

  const totalAppsCount = applications.length;
  const pendingAppsCount = applications.filter(a => a.status === 'new' || a.status === 'processing').length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockAlert).length;
  const totalPaperStockReams = products.filter(p => p.categoryId === 'paper').reduce((s, p) => s + p.stock, 0);

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
        image: editingService.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
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

    const parsedSkills = staffSkillsInput
      ? staffSkillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : (editingStaff.skills || []);

    if (editingStaff.id) {
      updateStaffMember(editingStaff.id, {
        ...editingStaff,
        skills: parsedSkills
      });
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
        bio: editingStaff.bio || 'Digital service specialist at Saiful Enterprise.',
        bioBn: editingStaff.bioBn || 'সাইফুল এন্টারপ্রাইজ ডিজিটাল সেবা বিশেষজ্ঞ।',
        skills: parsedSkills.length ? parsedSkills : ['Photoshop', 'Online Admission', 'BMET', 'POS Billing'],
        socialLinks: editingStaff.socialLinks || { phone: editingStaff.phone, whatsapp: editingStaff.phone },
        avatar: editingStaff.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'active',
        performanceScore: 95,
        isBlocked: false
      });
    }
    setEditingStaff(null);
    setStaffSkillsInput('');
  };

  // Quick stock adjustment helper
  const handleQuickStockAdjust = (id: string, delta: number) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      const newStock = Math.max(0, p.stock + delta);
      updateProduct(id, { stock: newStock });
    }
  };

  // Filtered collections
  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      (s.nameBn && s.nameBn.includes(serviceSearch)) ||
      (s.description && s.description.toLowerCase().includes(serviceSearch.toLowerCase()));
    const matchesCat = serviceCategoryFilter === 'all' || s.categoryId === serviceCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesLowStock = productLowStockOnly ? p.stock <= p.lowStockAlert : true;
    return matchesSearch && matchesLowStock;
  });

  const filteredApplications = applications.filter(a => {
    const matchesSearch = a.applicationNumber.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicantPhone.includes(appSearch) ||
      a.serviceName.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(o => {
    return o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
  });

  return (
    <div className={`min-h-screen ${currentThemeConfig.mainBg} ${currentThemeConfig.textPrimary} flex flex-col font-sans selection:bg-emerald-500 selection:text-neutral-950 transition-colors duration-200`}>
      {/* Top Standalone Admin Master Bar */}
      <header className={`${currentThemeConfig.headerBg} border-b ${currentThemeConfig.borderColor} sticky top-0 z-40 px-4 py-2.5 shadow-xl transition-colors duration-200`}>
        <div className="container mx-auto flex items-center justify-between gap-3">
          {/* Brand & Mode Tag */}
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentThemeConfig.primaryGradient} flex items-center justify-center text-white font-black shadow-lg shadow-black/40`}>
              SE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white leading-none">
                  Saiful Enterprise
                </span>
                <span className={`px-2 py-0.5 rounded-full ${currentThemeConfig.badgeBg} border ${currentThemeConfig.borderColor} text-[10px] font-mono font-bold uppercase tracking-wider`}>
                  {currentThemeConfig.name} CMS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Full System Access • Farmgate Central</span>
              </p>
            </div>
          </div>

          {/* Center Quick Shortcuts */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveMenu('pos')}
              className={`px-3 py-1.5 rounded-xl ${currentThemeConfig.badgeBg} border ${currentThemeConfig.borderColor} text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ক্যাশ কাউন্টার (POS)' : 'POS Terminal'}</span>
            </button>

            <button
              onClick={() => setActiveMenu('applications')}
              className="relative px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'আবেদন তালিকা' : 'Applications'}</span>
              {pendingAppsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMenu('products')}
              className="relative px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'bn' ? 'পেপার স্টক' : 'Inventory'}</span>
              {lowStockCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMenu('finance')}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'হিসাব ও ব্যয়' : 'Accounts'}</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Admin Theme Switcher Dropdown */}
            <AdminThemeSwitcher
              currentTheme={adminTheme}
              onSelectTheme={handleThemeChange}
              variant="header-dropdown"
            />

            {/* View Live Storefront Button */}
            {onExitToStore && (
              <button
                id="exit-to-store-btn"
                onClick={onExitToStore}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                title="View customer storefront"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">
                  {language === 'bn' ? 'লাইভ সাইট দেখুন' : 'Live Storefront'}
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-bold text-white leading-tight">
                  {currentUser?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Master Administrator
                </span>
              </div>

              <button
                id="admin-logout-btn"
                onClick={logout}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 hover:text-rose-100 transition-colors"
                title="Log Out of Admin CMS"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Responsive WordPress/Shopify-style Sidebar */}
        <aside className={`w-full lg:w-64 ${currentThemeConfig.sidebarBg} border-r ${currentThemeConfig.borderColor} p-4 shrink-0 flex flex-col justify-between transition-colors duration-200`}>
          <div className="space-y-6">
            {/* Quick Admin Profile Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentThemeConfig.primaryGradient} text-white font-black flex items-center justify-center shadow-md`}>
                SA
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs font-bold text-white truncate">Saiful Enterprise</h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Master Privileges</span>
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1 text-xs font-semibold">
              {[
                { id: 'overview', label: language === 'bn' ? 'ড্যাশবোর্ড ওভারভিউ' : 'Dashboard Overview', icon: LayoutDashboard },
                { id: 'analytics', label: language === 'bn' ? 'আয়-ব্যয় ও পারফরম্যান্স' : 'Revenue & Analytics', icon: PieChart, badge: 'Live', badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' },
                { id: 'cashmemo', label: language === 'bn' ? 'ডিজিটাল ক্যাশ মেমো' : 'Digital Cash Memo', icon: Receipt, badge: '3.5x5', badgeColor: 'bg-teal-950 text-teal-300 border border-teal-500/40' },
                { id: 'services', label: language === 'bn' ? 'অনলাইন সেবা CMS' : 'Services Manager', icon: Layers, badge: services.length },
                { id: 'products', label: language === 'bn' ? 'কাগজ ও স্টক' : 'Paper & Stock', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : `${products.length}`, badgeColor: lowStockCount > 0 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : undefined },
                { id: 'applications', label: language === 'bn' ? 'গ্রাহক আবেদনসমূহ' : 'Online Applications', icon: FileCheck, badge: pendingAppsCount > 0 ? `${pendingAppsCount} New` : `${applications.length}`, badgeColor: pendingAppsCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : undefined },
                { id: 'orders', label: language === 'bn' ? 'দোকান অর্ডার' : 'E-Commerce Orders', icon: ShoppingBag, badge: orders.length },
                { id: 'pos', label: language === 'bn' ? 'পস ক্যাশিয়ার কাউন্টার' : 'POS Cashier Terminal', icon: Calculator },
                { id: 'finance', label: language === 'bn' ? 'হিসাব ও ব্যয় খাতা' : 'Finance & Accounts', icon: DollarSign },
                { id: 'customers', label: language === 'bn' ? 'কাস্টমার একাউন্টস' : 'Customer Database', icon: UserCheck, badge: customers.length },
                { id: 'staff', label: language === 'bn' ? 'স্টাফ ও অপারেটর' : 'Staff & Roles', icon: Users, badge: staff.length },
                { id: 'hero_slides', label: language === 'bn' ? 'হিরো ব্যাকগ্রাউন্ড ছবি' : 'Hero Photo Carousel', icon: ImageIcon, badge: heroSlides.length },
                { id: 'background_settings', label: language === 'bn' ? 'ব্যাকগ্রাউন্ড ও ওয়ালপেপার' : 'Background & Wallpaper', icon: Palette },
                { id: 'seo_meta', label: language === 'bn' ? 'এসইও ও মেটা ট্যাগ' : 'Dynamic SEO & Meta', icon: Globe },
                { id: 'settings', label: language === 'bn' ? 'ব্যবসায়িক সেটিংস' : 'Business Settings', icon: Settings },
                { id: 'backup', label: language === 'bn' ? 'ডাটাবেজ ব্যাকআপ' : 'Database Backup', icon: Database }
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
                        ? currentThemeConfig.activeSidebarItem
                        : currentThemeConfig.inactiveSidebarItem
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

          {/* Bottom Store Status Badge */}
          <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Tejgaon Branch</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold">
                Online
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">Beside Tejgaon College, Indira Road</p>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* VIEW 1: OVERVIEW */}
          {activeMenu === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'বিজনেস কন্ট্রোল ড্যাশবোর্ড' : 'Master Control Dashboard'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'সার্ভিস, পেপার স্টক, গ্রাহক আবেদন ও ক্যাশ কাউন্টারের লাইভ পরিসংখ্যান।'
                      : 'Live analytics of sales, applications, inventory, and counter activities.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveMenu('cashmemo')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-950"
                  >
                    <Receipt className="w-4 h-4 text-teal-400" />
                    <span>{language === 'bn' ? 'ক্যাশ মেমো' : 'Cash Memo'}</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('analytics')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950"
                  >
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'আয়-ব্যয় অ্যানালিটিক্স' : 'Analytics & Trends'}</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('backup')}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'ডাটাবেজ ব্যাকআপ' : 'Backup DB'}</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('pos')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{language === 'bn' ? 'পস কাউন্টার খুলুন' : 'Open POS Terminal'}</span>
                  </button>
                </div>
              </div>

              {/* Low Stock Alert Notification Banner if any */}
              {lowStockCount > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-rose-200 text-xs">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <strong className="text-white block text-sm font-bold">
                        {language === 'bn' ? `${lowStockCount}টি পণ্যের স্টক কম রয়েছে!` : `Low Stock Alert on ${lowStockCount} Products!`}
                      </strong>
                      <span>
                        {language === 'bn'
                          ? 'রিম অথবা স্টেশনারি স্টক শেষ হওয়ার আগেই পাইকারি রি-অর্ডার করুন।'
                          : 'Reams or printing supplies are below safe threshold. Please restock.'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveMenu('products'); setProductLowStockOnly(true); }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0"
                  >
                    {language === 'bn' ? 'স্টক দেখুন' : 'View Stock'}
                  </button>
                </div>
              )}

              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                    <span>{language === 'bn' ? 'মোট বিক্রয় ও আয়' : 'Total Gross Revenue'}</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ৳{totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    <span>POS + Orders + Services</span>
                  </p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                    <span>{language === 'bn' ? 'অনলাইন আবেদন' : 'Online Applications'}</span>
                    <FileCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {totalAppsCount}
                  </div>
                  <p className="text-[11px] text-amber-400 font-semibold">
                    {pendingAppsCount} {language === 'bn' ? 'টি আবেদন অপেক্ষমান' : 'pending review'}
                  </p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                    <span>{language === 'bn' ? 'পেপার স্টক (রিম)' : 'Paper Stock (Reams)'}</span>
                    <Package className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {totalPaperStockReams} Reams
                  </div>
                  <p className="text-[11px] text-teal-400 font-semibold">
                    {products.length} {language === 'bn' ? 'টি প্রডাক্ট SKU সক্রিয়' : 'active inventory SKUs'}
                  </p>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs text-neutral-400 uppercase">
                    <span>{language === 'bn' ? 'নেট ব্যালেন্স ও মুনাফা' : 'Net Business Balance'}</span>
                    <PieChart className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className={`text-2xl font-extrabold font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ৳{netProfit.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-semibold">
                    {language === 'bn' ? `ব্যয়: ৳${totalExpensesAmount.toLocaleString()}` : `Total Exp: ৳${totalExpensesAmount.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {/* Recent Applications & Invoices Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Feed */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'bn' ? 'সাম্প্রতিক আবেদনসমূহ' : 'Recent Customer Applications'}</span>
                    </h3>
                    <button onClick={() => setActiveMenu('applications')} className="text-xs text-emerald-400 hover:underline">
                      {language === 'bn' ? 'সব দেখুন →' : 'View All →'}
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
                      <span>{language === 'bn' ? 'সাম্প্রতিক POS ক্যাশ রসিদ' : 'Recent POS Counter Invoices'}</span>
                    </h3>
                    <button onClick={() => setActiveMenu('pos')} className="text-xs text-teal-400 hover:underline">
                      {language === 'bn' ? 'নতুন বিক্রয় →' : 'New Sale →'}
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
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'অনলাইন ও কম্পিউটার সেবা ব্যবস্থাপনা (CMS)' : 'Digital Services Management'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'তেজগাঁও কলেজ ভর্তি, বিএমইটি, চাকরির আবেদন, পাসপোর্ট ছবি ও ফটোকপি রেট এডিট করুন।'
                      : 'Configure online applications, pricing, required documents, and category badges.'}
                  </p>
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
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন সেবা যুক্ত করুন' : 'Add New Service'}</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'সেবা খুঁজুন...' : 'Search services...'}
                    value={serviceSearch}
                    onChange={e => setServiceSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={serviceCategoryFilter}
                    onChange={e => setServiceCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-200"
                  >
                    <option value="all">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                    <option value="edu_admission">Education & Tejgaon College</option>
                    <option value="gov_job">Govt & Defense Jobs</option>
                    <option value="bmet_visa">BMET & Visa Processing</option>
                    <option value="photo_studio">Studio Photo & Visa Lab</option>
                    <option value="print_copy">Laser Print & Photocopy</option>
                    <option value="doc_typing">Computer Typing & CV</option>
                  </select>
                </div>
              </div>

              {/* Services Table */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Service & Photo</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Service Fee</th>
                        <th className="p-4">Delivery Time</th>
                        <th className="p-4">Required Documents</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {filteredServices.map(s => (
                        <tr key={s.id} className="hover:bg-neutral-850/60">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-11 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-700/60 shrink-0">
                                {s.image ? (
                                  <img
                                    src={s.image}
                                    alt={s.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <strong className="text-white block text-sm">{s.name}</strong>
                                <span className="text-neutral-400 text-xs">{s.nameBn}</span>
                                {s.isPopular && (
                                  <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold uppercase">
                                    Popular
                                  </span>
                                )}
                              </div>
                            </div>
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
                              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors"
                              title="Edit Service"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete service: ${s.name}?`)) deleteService(s.id);
                              }}
                              className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-rose-400 transition-colors"
                              title="Delete Service"
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
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'পেপার ও প্রডাক্ট ইনভেন্টরি' : 'Paper & Product Inventory'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'A4 পেপার, ফটো পেপার (১২০-২৩০ জিএসএম), ল্যামিনেশন রোল ও স্টক নিয়ন্ত্রণ।'
                      : 'Manage A4 Paper, Photo Paper (120-230 GSM), Stock levels and Wholesale pricing.'}
                  </p>
                </div>
                <button
                  onClick={() => setEditingProduct({
                    name: '',
                    nameBn: '',
                    sku: `SE-PAP-${Date.now().toString().slice(-4)}`,
                    brand: 'Double A',
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
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন পণ্য / পেপার যোগ করুন' : 'Add Paper / Product'}</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'পণ্য বা ব্র্যান্ড খুঁজুন...' : 'Search products or brand...'}
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductLowStockOnly(!productLowStockOnly)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      productLowStockOnly
                        ? 'bg-rose-600 text-white'
                        : 'bg-neutral-950 border border-neutral-700 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {language === 'bn' ? 'শুধু কম স্টক দেখান' : 'Low Stock Only'}
                  </button>
                </div>
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
                        <th className="p-4">Stock Adjust</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {filteredProducts.map(p => {
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
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuickStockAdjust(p.id, -1)}
                                  className="w-6 h-6 rounded bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                                  title="Decrease Stock by 1"
                                >
                                  -
                                </button>
                                <span className={`font-mono font-bold text-sm min-w-[50px] text-center ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {p.stock} u
                                </span>
                                <button
                                  onClick={() => handleQuickStockAdjust(p.id, 1)}
                                  className="w-6 h-6 rounded bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                                  title="Increase Stock by 1"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => handleQuickStockAdjust(p.id, 10)}
                                  className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 hover:bg-emerald-900"
                                  title="Add 10 Reams"
                                >
                                  +10
                                </button>
                              </div>
                              {isLow && <span className="block text-[10px] text-rose-400 font-semibold mt-1">Low Stock Alert!</span>}
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete product: ${p.name}?`)) deleteProduct(p.id);
                                }}
                                className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-rose-400"
                                title="Delete Product"
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
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'গ্রাহক অনলাইন আবেদন ট্র্যাকার ও ডেলিভারি' : 'Application Pipeline & Customer Queue'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'ভর্তি ফরম, বিএমইটি, চাকরির আবেদন প্রসেস ও হোয়াটসঅ্যাপ মেসেজ পাঠান।'
                      : 'Process student admission forms, defense jobs, BMET, and send direct status updates.'}
                  </p>
                </div>
              </div>

              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'bn' ? 'ট্র্যাকিং নম্বর বা মোবাইল দিয়ে খুঁজুন...' : 'Search by tracking ID, phone...'}
                    value={appSearch}
                    onChange={e => setAppSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['all', 'new', 'processing', 'submitted', 'completed', 'delivered'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setAppStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        appStatusFilter === st
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-neutral-950 border border-neutral-700 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applications Cards */}
              <div className="space-y-4">
                {filteredApplications.map(app => (
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
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-neutral-400 mr-1">Change Status:</span>
                        {(['new', 'processing', 'submitted', 'completed', 'delivered'] as ApplicationStatus[]).map(st => (
                          <button
                            key={st}
                            onClick={() => updateApplicationStatus(app.id, st, undefined, currentUser?.name || 'Admin')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition-all ${
                              app.status === st ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View & Edit Timeline Button */}
                        <button
                          onClick={() => {
                            setSelectedAppForTimeline(app);
                            setTimelineNewStatus(app.status);
                            setTimelineNewTitle('');
                            setTimelineNewTitleBn('');
                            setTimelineNewDesc('');
                            setTimelineNewDescBn('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'হিস্টোরি ও টাইমলাইন' : 'Timeline & Logs'} ({app.timeline?.length || 1})</span>
                        </button>

                        <a
                          href={`https://wa.me/88${app.applicantPhone}?text=${encodeURIComponent(
                            `হ্যালো ${app.applicantName}, সাইফুল এন্টারপ্রাইজ থেকে জানাচ্ছি: আপনার আবেদন #${app.applicationNumber} (${app.serviceName}) এর বর্তমান স্ট্যাটাস: ${app.status.toUpperCase()}। ধন্যবাদ!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900 flex items-center gap-1.5 transition-colors shadow-md"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: ORDERS */}
          {activeMenu === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'দোকান ও হোম ডেলিভারি অর্ডার' : 'E-Commerce & Paper Orders'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'বিকাশ/নগদ ট্রানজেকশন আইডি যাচাই করুন ও ডেলিভারি স্ট্যাটাস পরিবর্তন করুন।'
                      : 'Verify bKash / Nagad TrxIDs, change shipping status, and manage paper ream deliveries.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.map(order => (
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
            <div className="space-y-4 animate-in fade-in duration-200">
              <POSCounter />
            </div>
          )}

          {/* VIEW 7: FINANCE & ACCOUNTS */}
          {activeMenu === 'finance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    {language === 'bn' ? 'আয়-ব্যয় ও আর্থিক হিসাব খাতা' : 'Business Finance & Accounts Ledger'}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    {language === 'bn'
                      ? 'দোকানের বিদ্যুৎ বিল, পেপার ক্রয়, টোনার রিফিল, স্টাফ বেতন ও নেট লাভের হিসাব।'
                      : 'Track gross sales income, daily operational expenses, and calculate net profit margin.'}
                  </p>
                </div>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন খরচ / ব্যয় যোগ করুন' : 'Log New Expense'}</span>
                </button>
              </div>

              {/* Financial Balance Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400 uppercase">
                    <span>Total Sales Income</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-emerald-400">
                    ৳{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">Counter + Online Invoices</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400 uppercase">
                    <span>Total Logged Expenses</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-rose-400">
                    ৳{totalExpensesAmount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">Rent, Toner, Paper & Bills</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400 uppercase">
                    <span>Net Operating Profit</span>
                    <DollarSign className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className={`text-2xl font-extrabold font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ৳{netProfit.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-teal-400 font-mono font-bold">
                    {totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% Profit Margin` : '0%'}
                  </span>
                </div>
              </div>

              {/* Expense Ledger Table */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl space-y-3">
                <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'ব্যয়ের বিস্তারিত তালিকা' : 'Operational Expense Records'}</span>
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">
                    {expenses.length} Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] border-b border-neutral-800">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Expense Details / Title</th>
                        <th className="p-4">Note / Source</th>
                        <th className="p-4">Amount (৳)</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-neutral-850/60">
                          <td className="p-4 font-mono text-neutral-400">{exp.date}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[10px] uppercase font-bold">
                              {exp.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">{exp.title}</td>
                          <td className="p-4 text-neutral-400">{exp.note || '-'}</td>
                          <td className="p-4 font-mono font-bold text-rose-400 text-sm">
                            -৳{exp.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-rose-400 transition-colors"
                              title="Delete Record"
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

          {/* VIEW 8: CUSTOMER MANAGEMENT */}
          {activeMenu === 'customers' && (
            <CustomerManagement />
          )}

          {/* VIEW 9: STAFF & OPERATOR MANAGEMENT */}
          {activeMenu === 'staff' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-emerald-400" />
                    <span>{language === 'bn' ? 'স্টাফ ও অপারেটর টিম ম্যানেজমেন্ট' : 'Staff & Operator Management'}</span>
                  </h1>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {language === 'bn'
                      ? 'অপারেটর ও স্টাফ একাউন্ট তৈরি, ব্লক/আনব্লক, সোশ্যাল মিডিয়া, ফোন ও হোয়াটসঅ্যাপ নম্বর ও পারমিশন নিয়ন্ত্রণ।'
                      : 'Manage staff & operator accounts, block/unblock credentials, bio, phone, WhatsApp & social media profiles.'}
                  </p>
                </div>
                <button
                  id="admin-add-staff-btn"
                  onClick={() => {
                    setEditingStaff({
                      employeeId: `SE-EMP-00${staff.length + 1}`,
                      name: '',
                      nameBn: '',
                      role: 'service_operator',
                      phone: '',
                      email: '',
                      shift: 'Morning (8:00 AM - 4:00 PM)',
                      salary: 18000,
                      bio: '',
                      bioBn: '',
                      skills: ['Photoshop', 'Online Admission', 'BMET', 'POS Billing'],
                      socialLinks: {},
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
                    });
                    setStaffSkillsInput('Photoshop, Online Admission, BMET, POS Billing');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bn' ? 'নতুন কর্মী যুক্ত করুন' : 'Add Staff Member'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map(member => (
                  <div
                    key={member.id}
                    className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                      member.isBlocked
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-xl'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-2xl object-cover border border-neutral-700 shrink-0"
                          />
                          <div className="overflow-hidden">
                            <h3 className="text-sm font-bold text-white truncate">
                              {member.name}
                            </h3>
                            {member.nameBn && (
                              <span className="text-[11px] text-neutral-400 block truncate">
                                {member.nameBn}
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-emerald-400 block">
                              {member.employeeId}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 uppercase font-bold border border-emerald-500/30">
                            {member.role.replace('_', ' ')}
                          </span>
                          {member.isBlocked && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/30 uppercase font-bold">
                              Suspended
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-xs text-neutral-300 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      {/* Info Block */}
                      <div className="space-y-1.5 text-xs bg-neutral-950 p-3 rounded-2xl border border-neutral-850">
                        <div className="flex items-center justify-between text-neutral-300">
                          <span>Phone:</span>
                          <span className="font-mono text-white font-bold">{member.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span>Shift:</span>
                          <span className="text-neutral-300 truncate max-w-[150px]">{member.shift}</span>
                        </div>
                        <div className="flex items-center justify-between text-neutral-300">
                          <span>Salary:</span>
                          <span className="font-mono text-emerald-400 font-bold">৳{member.salary?.toLocaleString()}/mo</span>
                        </div>
                      </div>

                      {/* Skills */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-950 text-[10px] text-emerald-400 border border-neutral-800">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800">
                      {/* Direct Phone & WhatsApp */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${member.phone}`}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors"
                          title="Call Staff"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/88${member.socialLinks?.whatsapp || member.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStaff(member);
                            setStaffSkillsInput((member.skills || []).join(', '));
                          }}
                          className="p-2 rounded-xl bg-neutral-800 text-emerald-400 hover:bg-neutral-700"
                          title="Edit Staff Member"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleBlockStaff(member.id, member.isBlocked ? '' : 'Account suspended by administrator')}
                          className={`p-2 rounded-xl border transition-colors ${
                            member.isBlocked
                              ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                          }`}
                          title={member.isBlocked ? 'Unblock Staff' : 'Block / Suspend Staff'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Remove staff member ${member.name}?`)) deleteStaffMember(member.id);
                          }}
                          className="p-2 rounded-xl bg-neutral-800 text-rose-400 hover:bg-rose-900/40"
                          title="Delete Staff"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 9: BUSINESS & CMS SETTINGS */}
          {activeMenu === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-neutral-800">
                <h1 className="text-2xl font-extrabold text-white">
                  {language === 'bn' ? 'ওয়েবসাইট ও ব্যবসায়িক সেটিংস' : 'Business Information & Site Settings'}
                </h1>
                <p className="text-xs text-neutral-400">
                  {language === 'bn'
                    ? 'দোকানের নাম, ঠিকানা, বিকাশ/হোয়াটসঅ্যাপ নাম্বার, থিম ও টপ নোটিশ আপডেট করুন।'
                    : 'Update shop address, hotline, bKash numbers, admin theme, and top announcement text.'}
                </p>
              </div>

              {/* ADMIN THEME PICKER (SETTINGS GRID) */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
                <AdminThemeSwitcher
                  currentTheme={adminTheme}
                  onSelectTheme={handleThemeChange}
                  variant="settings-grid"
                />
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

          {/* VIEW: HERO PHOTO CAROUSEL CMS */}
          {activeMenu === 'hero_slides' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <HeroSlidesManager />
            </div>
          )}

          {/* VIEW: DYNAMIC SEO & META CMS */}
          {activeMenu === 'seo_meta' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <SEOMetaManager />
            </div>
          )}

          {/* VIEW: BACKGROUND & WALLPAPER SYSTEM CMS */}
          {activeMenu === 'background_settings' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <BackgroundSettingsManager />
            </div>
          )}

          {/* VIEW: RECHARTS DAILY INCOME, EXPENSES & OPERATOR ANALYTICS */}
          {activeMenu === 'analytics' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <AdminAnalyticsDashboard />
            </div>
          )}

          {/* VIEW: DIGITAL INTERACTIVE CASH MEMO (3.5x5) */}
          {activeMenu === 'cashmemo' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <CashMemo />
            </div>
          )}

          {/* VIEW 10: DATABASE BACKUP & RESTORE */}
          {activeMenu === 'backup' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <DatabaseBackup />
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Service Editor */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
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
                <label className="text-xs text-neutral-400 block mb-1">Service Photo / Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingService.image || ''}
                  onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                />
                {editingService.image && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950">
                    <img
                      src={editingService.image}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is-popular-checkbox"
                  checked={!!editingService.isPopular}
                  onChange={e => setEditingService({ ...editingService, isPopular: e.target.checked })}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="is-popular-checkbox" className="text-xs text-neutral-300">
                  Mark as Popular / Featured (জনপ্রিয় সেবা)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Product Editor */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
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

      {/* MODAL: Log Expense */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Log Operational Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Expense Category</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                >
                  <option value="paper_purchase">Paper Reams & Stock Purchase</option>
                  <option value="toner_ink">Printer Toner & Ink Refill</option>
                  <option value="electricity">Electricity / AC / DESCO Bill</option>
                  <option value="rent">Shop Rent</option>
                  <option value="salary">Staff Salary / Wage</option>
                  <option value="internet">Internet / Fiber Connection</option>
                  <option value="other">Other Operational Cost</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Title / Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Double A 80 GSM 20 Reams Purchase"
                  value={newExpense.title || ''}
                  onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Amount (৳)</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 8400"
                    value={newExpense.amount || ''}
                    onChange={e => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Supplier / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Chawkbazar Paper Market"
                  value={newExpense.note || ''}
                  onChange={e => setNewExpense({ ...newExpense, note: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Staff Editor */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{editingStaff.id ? 'Edit Staff Profile' : 'Add Staff Member'}</span>
              </h3>
              <button onClick={() => setEditingStaff(null)} className="text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Staff Name (English) *</label>
                  <input
                    required
                    type="text"
                    value={editingStaff.name || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Staff Name (Bangla)</label>
                  <input
                    type="text"
                    value={editingStaff.nameBn || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, nameBn: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Employee ID *</label>
                  <input
                    required
                    type="text"
                    value={editingStaff.employeeId || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Role / Designation</label>
                  <select
                    value={editingStaff.role || 'service_operator'}
                    onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="super_admin">Founder / Master Admin</option>
                    <option value="admin">Store Admin</option>
                    <option value="manager">Operations Manager</option>
                    <option value="service_operator">Service Operator</option>
                    <option value="cashier">POS Cashier / Accountant</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Base Salary (৳)</label>
                  <input
                    type="number"
                    value={editingStaff.salary || 18000}
                    onChange={e => setEditingStaff({ ...editingStaff, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Phone Number *</label>
                  <input
                    required
                    type="text"
                    value={editingStaff.phone || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editingStaff.socialLinks?.whatsapp || editingStaff.phone || ''}
                    onChange={e => setEditingStaff({
                      ...editingStaff,
                      socialLinks: { ...editingStaff.socialLinks, whatsapp: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={editingStaff.email || ''}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 font-semibold">Shift Timing</label>
                  <input
                    type="text"
                    value={editingStaff.shift || 'Morning (8:00 AM - 4:00 PM)'}
                    onChange={e => setEditingStaff({ ...editingStaff, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Avatar Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editingStaff.avatar || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, avatar: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Bio / Description</label>
                <textarea
                  rows={2}
                  value={editingStaff.bio || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1 font-semibold">Skills & Expertise (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Photoshop, Online Admission, BMET, POS Billing, Laser Print"
                  value={staffSkillsInput}
                  onChange={e => setStaffSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button type="button" onClick={() => setEditingStaff(null)} className="px-4 py-2 rounded-xl bg-neutral-800 text-xs text-neutral-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950">Save Staff Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPLICATION TIMELINE & PROGRESS MILESTONE LOGGER */}
      {selectedAppForTimeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-neutral-900 border border-neutral-800 text-neutral-100 w-full max-w-2xl rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                    {selectedAppForTimeline.applicationNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-bold uppercase">
                    {selectedAppForTimeline.status}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  {selectedAppForTimeline.serviceName}
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn' ? 'আবেদনকারী:' : 'Applicant:'} {selectedAppForTimeline.applicantName} ({selectedAppForTimeline.applicantPhone})
                </p>
              </div>
              <button
                onClick={() => setSelectedAppForTimeline(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Timeline Logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'রেকর্ডকৃত টাইমলাইন হিস্টোরি' : 'Logged Timeline Progression'}</span>
              </h4>

              <div className="space-y-3 pl-3">
                {selectedAppForTimeline.timeline && selectedAppForTimeline.timeline.length > 0 ? (
                  selectedAppForTimeline.timeline.map((ev, i) => (
                    <div key={ev.id || i} className="relative pl-6 pb-3 border-l-2 border-emerald-500/30 last:border-l-transparent last:pb-0">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-900" />
                      <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-white">{ev.titleBn || ev.title}</strong>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(ev.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-neutral-300 text-[11px]">{ev.descriptionBn || ev.description}</p>
                        {ev.updatedBy && (
                          <span className="text-[10px] text-emerald-400 block pt-0.5">
                            • {ev.updatedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">No timeline entries logged yet.</p>
                )}
              </div>
            </div>

            {/* Add New Milestone Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!timelineNewTitle && !timelineNewTitleBn) return;

                const eventPayload = {
                  status: timelineNewStatus,
                  title: timelineNewTitle || timelineNewTitleBn,
                  titleBn: timelineNewTitleBn || timelineNewTitle,
                  description: timelineNewDesc || timelineNewDescBn || 'Status updated by desk operator',
                  descriptionBn: timelineNewDescBn || timelineNewDesc || 'অপারেটর কর্তৃক অগ্রগতি আপডেট করা হয়েছে',
                  updatedBy: currentUser?.name ? `${currentUser.name} (Operator)` : 'Store Operator'
                };

                addApplicationTimelineEvent(selectedAppForTimeline.id, eventPayload);
                
                // Update local modal state
                const updatedList = applications.find(a => a.id === selectedAppForTimeline.id);
                if (updatedList) {
                  setSelectedAppForTimeline({
                    ...updatedList,
                    status: timelineNewStatus,
                    timeline: [...(updatedList.timeline || []), {
                      id: `tl_${Date.now()}`,
                      ...eventPayload,
                      timestamp: new Date().toISOString()
                    }]
                  });
                }

                setTimelineNewTitle('');
                setTimelineNewTitleBn('');
                setTimelineNewDesc('');
                setTimelineNewDescBn('');
              }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3"
            >
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'নতুন টাইমলাইন ধাপ / নোট যুক্ত করুন' : 'Append New Progress Milestone'}</span>
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Set Application Status</label>
                  <select
                    value={timelineNewStatus}
                    onChange={(e) => setTimelineNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white font-bold"
                  >
                    <option value="new">NEW (Received)</option>
                    <option value="processing">PROCESSING (Verification)</option>
                    <option value="submitted">SUBMITTED (Portal Uploaded)</option>
                    <option value="completed">COMPLETED (Slip Ready)</option>
                    <option value="delivered">DELIVERED (Handed Over)</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Step Title (Bangla) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ই-চালান ভেরিফিকেশন সম্পন্ন"
                    value={timelineNewTitleBn}
                    onChange={e => setTimelineNewTitleBn(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Step Title (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. e-Challan Code Verified"
                    value={timelineNewTitle}
                    onChange={e => setTimelineNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Progress Details (Bangla)</label>
                  <input
                    type="text"
                    placeholder="যেমন: সোনালী ব্যাংক চালান কোড যাচাই করে পোর্টালে আপলোড করা হয়েছে।"
                    value={timelineNewDescBn}
                    onChange={e => setTimelineNewDescBn(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'টাইমলাইনে যোগ করুন' : 'Log Milestone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
