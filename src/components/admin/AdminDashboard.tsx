import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
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
import { EmployeeOfTheMonthManager } from './EmployeeOfTheMonthManager';
import { DailyShopLedger } from './DailyShopLedger';
import { JudicialStampRegister } from './JudicialStampRegister';
import { OperatorProfitShareWidget } from './dashboard/OperatorProfitShareWidget';
import { ADMIN_THEMES, AdminThemeKey } from './AdminTheme';
import { AdminThemeSwitcher } from './AdminThemeSwitcher';
import { StaffTTSControlWidget } from '../common/StaffTTSControlWidget';
import {
  LayoutDashboard,
  Layers,
  Package,
  FileCheck,
  ShoppingBag,
  Calculator,
  BookOpen,
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
  Video,
  Camera,
  Image as ImageIcon,
  Link2,
  Copy,
  Check,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  Store,
  Lock,
  Building2,
  QrCode,
  Volume2,
  HelpCircle,
  AlertTriangle,
  Power,
  ServerCrash,
  KeyRound,
  ShieldAlert,
  Wrench
} from 'lucide-react';
import { SystemStatusMode } from '../../types';
import { EmergencyShutdownConfirmModal } from './EmergencyShutdownConfirmModal';
import { EmergencyKillswitchPanel } from './EmergencyKillswitchPanel';
import {
  buildAdminSectionUrl,
  copyToClipboard,
  parseCurrentRoute,
  updateBrowserUrl
} from '../../utils/navigation';

export type AdminMenuKey =
  | 'overview'
  | 'analytics'
  | 'ledger'
  | 'stamps'
  | 'cashmemo'
  | 'services'
  | 'products'
  | 'applications'
  | 'orders'
  | 'pos'
  | 'finance'
  | 'customers'
  | 'staff'
  | 'employee_of_month'
  | 'hero_slides'
  | 'seo_meta'
  | 'background_settings'
  | 'settings'
  | 'backup';

const VALID_ADMIN_MENUS: AdminMenuKey[] = [
  'overview',
  'analytics',
  'ledger',
  'stamps',
  'cashmemo',
  'services',
  'products',
  'applications',
  'orders',
  'pos',
  'finance',
  'customers',
  'staff',
  'employee_of_month',
  'hero_slides',
  'seo_meta',
  'background_settings',
  'settings',
  'backup'
];

interface AdminDashboardProps {
  onExitToStore?: () => void;
  initialSection?: string | null;
}

interface ExpenseItem {
  id: string;
  category: 'rent' | 'electricity' | 'paper_purchase' | 'toner_ink' | 'salary' | 'internet' | 'other';
  title: string;
  amount: number;
  date: string;
  note?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitToStore, initialSection }) => {
  const { language, toggleLanguage } = useLanguage();
  const { themeMode, toggleTheme } = useTheme();
  const {
    services, addService, updateService, deleteService,
    products, addProduct, updateProduct, deleteProduct,
    applications, updateApplicationStatus, addApplicationTimelineEvent,
    orders, updateOrderStatus,
    invoices,
    staff, addStaffMember, updateStaffMember, deleteStaffMember, toggleBlockStaff,
    customers, addCustomer, updateCustomer, deleteCustomer, toggleBlockCustomer,
    heroSlides,
    settings, updateSettings,
    syncFullDatabaseToServer, isServerSyncing,
    logActivity
  } = useData();
  const { currentUser, logout, isAdmin, isSuperAdmin } = useAuth();

  // Strict Authorization Check: If not authenticated or not admin, restrict immediately
  if (!currentUser || (!isAdmin && !isSuperAdmin)) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">অ্যাডমিন প্রবেশাধিকার সংরক্ষিত</h2>
            <p className="text-xs text-neutral-400 mt-2">
              এই কন্ট্রোল প্যানেল শুধুমাত্র অনুমোদিত অ্যাডমিনিস্ট্রেটরদের জন্য। আপনার অ্যাকাউন্টটির এই প্যানেলে প্রবেশের অনুমতি নেই।
            </p>
          </div>
          <button
            onClick={onExitToStore}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all"
          >
            হোমপেজে ফিরে যান (Return to Store)
          </button>
        </div>
      </div>
    );
  }

  // Admin Theme state
  const [adminTheme, setAdminTheme] = useState<AdminThemeKey>(() => {
    const saved = localStorage.getItem('se_admin_theme_choice');
    return (saved && (saved in ADMIN_THEMES)) ? (saved as AdminThemeKey) : (themeMode === 'light' ? 'nordic_light' : 'emerald');
  });

  const handleThemeChange = (newTheme: AdminThemeKey) => {
    setAdminTheme(newTheme);
    localStorage.setItem('se_admin_theme_choice', newTheme);
  };

  // When global themeMode is toggled to light, prioritize deep high-contrast nordic_light if emerald was default
  const effectiveThemeKey: AdminThemeKey = (themeMode === 'light' && adminTheme === 'emerald')
    ? 'nordic_light'
    : adminTheme;

  const currentThemeConfig = ADMIN_THEMES[effectiveThemeKey] || (themeMode === 'light' ? ADMIN_THEMES.nordic_light : ADMIN_THEMES.emerald);

  // Timeline Inspection Modal for Applications
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<Application | null>(null);
  const [timelineNewStatus, setTimelineNewStatus] = useState<ApplicationStatus>('processing');
  const [timelineNewTitle, setTimelineNewTitle] = useState('');
  const [timelineNewTitleBn, setTimelineNewTitleBn] = useState('');
  const [timelineNewDesc, setTimelineNewDesc] = useState('');
  const [timelineNewDescBn, setTimelineNewDescBn] = useState('');

  const getInitialMenu = (): AdminMenuKey => {
    if (initialSection && VALID_ADMIN_MENUS.includes(initialSection as AdminMenuKey)) {
      return initialSection as AdminMenuKey;
    }
    const currentRoute = parseCurrentRoute();
    if (currentRoute.adminSection && VALID_ADMIN_MENUS.includes(currentRoute.adminSection as AdminMenuKey)) {
      return currentRoute.adminSection as AdminMenuKey;
    }
    return 'overview';
  };

  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>(getInitialMenu);
  const [copiedLinkSection, setCopiedLinkSection] = useState<string | null>(null);

  const navigateToMenu = (menuId: AdminMenuKey) => {
    setActiveMenu(menuId);
    updateBrowserUrl({ tab: 'admin', adminSection: menuId });
  };

  const handleCopySectionLink = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const url = buildAdminSectionUrl(sectionId);
    copyToClipboard(url);
    setCopiedLinkSection(sectionId);
    setTimeout(() => {
      setCopiedLinkSection(null);
    }, 2500);
  };

  // Sync activeMenu with URL popstate / hash changes
  useEffect(() => {
    const handleUrlSync = () => {
      const route = parseCurrentRoute();
      if (route.adminSection && VALID_ADMIN_MENUS.includes(route.adminSection as AdminMenuKey)) {
        setActiveMenu(route.adminSection as AdminMenuKey);
      }
    };
    window.addEventListener('popstate', handleUrlSync);
    window.addEventListener('hashchange', handleUrlSync);
    return () => {
      window.removeEventListener('popstate', handleUrlSync);
      window.removeEventListener('hashchange', handleUrlSync);
    };
  }, []);

  // Sync when initialSection prop updates
  useEffect(() => {
    if (initialSection && VALID_ADMIN_MENUS.includes(initialSection as AdminMenuKey)) {
      setActiveMenu(initialSection as AdminMenuKey);
    }
  }, [initialSection]);

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

  // Sidebar menu search query and category filter
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarCategoryFilter, setSidebarCategoryFilter] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const expandAllCategories = () => {
    setCollapsedCategories({});
  };

  // Settings sub-tab state
  type SettingsTabKey = 'profile' | 'contacts' | 'delivery' | 'notice' | 'themes' | 'hardware' | 'system' | 'killswitch';
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsTabKey>('profile');

  // Emergency System Killswitch Modal State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [targetEmergencyMode, setTargetEmergencyMode] = useState<SystemStatusMode>('maintenance');

  const handleOpenKillswitchModal = (mode: SystemStatusMode) => {
    setTargetEmergencyMode(mode);
    setIsEmergencyModalOpen(true);
  };

  const handleConfirmEmergencyMode = (payload: {
    mode: SystemStatusMode;
    reason?: string;
    reasonBn?: string;
    estimatedResume?: string;
    estimatedResumeBn?: string;
  }) => {
    const isOnline = payload.mode === 'online';
    const updated = {
      ...settings,
      ...settingsForm,
      systemStatusMode: payload.mode,
      maintenanceMode: !isOnline,
      systemStatusReason: payload.reason || settings.systemStatusReason,
      systemStatusReasonBn: payload.reasonBn || settings.systemStatusReasonBn,
      systemStatusEstimatedResume: payload.estimatedResume || settings.systemStatusEstimatedResume,
      systemStatusEstimatedResumeBn: payload.estimatedResumeBn || settings.systemStatusEstimatedResumeBn,
      systemLastModifiedAt: new Date().toISOString(),
      systemLastModifiedBy: currentUser?.name || 'Administrator'
    };
    updateSettings(updated);
    setSettingsForm(updated);
    localStorage.setItem('se_settings', JSON.stringify(updated));
    syncFullDatabaseToServer();
    logActivity(
      'Emergency Killswitch Changed',
      `System mode set to ${payload.mode} by ${currentUser?.name || 'Administrator'}`
    );
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Synchronize settingsForm whenever settings updates in DataContext
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

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
    fetch('/api/database/patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminExpenses: updated })
    }).catch(() => {});
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
    fetch('/api/database/patch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminExpenses: updated })
    }).catch(() => {});
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settingsForm,
      noticeBanner: settingsForm.noticeBanner || (settingsForm as any).noticeEn || '',
      noticeBannerBn: settingsForm.noticeBannerBn || (settingsForm as any).noticeBn || '',
      noticeEn: settingsForm.noticeBanner || (settingsForm as any).noticeEn || '',
      noticeBn: settingsForm.noticeBannerBn || (settingsForm as any).noticeBn || ''
    };
    updateSettings(updated);
    await syncFullDatabaseToServer();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3500);
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

  // Professionally Organized Navigation Categories
  const navigationCategories = useMemo(() => [
    {
      id: 'cat_sales_ledger',
      nameEn: 'Sales & Daily Cash Registers',
      nameBn: 'ক্যাশ কাউন্টার ও হিসাব খাতা',
      icon: Calculator,
      color: 'emerald',
      items: [
        {
          id: 'pos' as AdminMenuKey,
          labelBn: 'পস ক্যাশিয়ার কাউন্টার',
          labelEn: 'POS Cashier Terminal',
          icon: Calculator,
          badge: 'Counter',
          badgeColor: 'bg-emerald-500 text-black font-bold',
          categoryBn: 'কাউন্টার',
          descBn: 'ক্যাশ কাউন্টারে দ্রুত বারকোড ও ক্যাশ মেমো বিলিং'
        },
        {
          id: 'ledger' as AdminMenuKey,
          labelBn: 'দৈনিক হিসাব খাতা',
          labelEn: 'Daily Shop Ledger',
          icon: BookOpen,
          badge: 'Special',
          badgeColor: 'bg-amber-500 text-black font-bold',
          categoryBn: 'ক্যাশ খাতা',
          descBn: 'দোকানের ক্যাশ ড্রয়ার, বিক্রি ও খরচের পূর্ণাঙ্গ খতিয়ান'
        },
        {
          id: 'cashmemo' as AdminMenuKey,
          labelBn: 'ডিজিটাল ক্যাশ মেমো',
          labelEn: 'Digital Cash Memo',
          icon: Receipt,
          badge: '3.5x5',
          badgeColor: 'bg-teal-950 text-teal-300 border border-teal-500/40',
          categoryBn: 'ইনভয়েস',
          descBn: 'সাইফুল এন্টারপ্রাইজ প্রিন্টেবল ভাউচার ও রসিদ তৈরি'
        },
        {
          id: 'stamps' as AdminMenuKey,
          labelBn: 'স্ট্যাম্প ও কার্টিজ রেজিস্টার',
          labelEn: 'Stamp Register',
          icon: FileText,
          badge: '৫০৳/১০০৳',
          badgeColor: 'bg-amber-400 text-black font-bold',
          categoryBn: 'সরকারি রেজিস্টার',
          descBn: '৫০৳/১০০৳ স্ট্যাম্প, কার্টিজ পেপার সরকারি স্টক ও লাভ খাতা'
        },
        {
          id: 'finance' as AdminMenuKey,
          labelBn: 'দোকান ব্যয় ও খরচ খাতা',
          labelEn: 'Store Expenses & Accounts',
          icon: DollarSign,
          categoryBn: 'হিসাব',
          descBn: 'দোকান ভাড়া, বিদ্যুৎ বিল, নাস্তা ও দৈনন্দিন খরচের খাতা'
        }
      ]
    },
    {
      id: 'cat_catalog',
      nameEn: 'Catalog & Inventory Management',
      nameBn: 'ক্যাটালগ ও পেপার স্টক',
      icon: Package,
      color: 'teal',
      items: [
        {
          id: 'products' as AdminMenuKey,
          labelBn: 'কাগজ ও ইনভেন্টরি স্টক',
          labelEn: 'Paper & Stock Inventory',
          icon: Package,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : `${products.length}`,
          badgeColor: lowStockCount > 0 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : undefined,
          categoryBn: 'ইনভেন্টরি',
          descBn: 'কাগজ, কার্টিজ, টোনার ও স্টেশনারি রি-অর্ডার ইনভেন্টরি'
        },
        {
          id: 'services' as AdminMenuKey,
          labelBn: 'অনলাইন সেবা CMS',
          labelEn: 'Services Catalog',
          icon: Layers,
          badge: services.length,
          categoryBn: 'সার্ভিস',
          descBn: 'সরকারি ও প্রতিরক্ষা আবেদন এবং কলেজ ভর্তি সেবার মূল্য তালিকা'
        }
      ]
    },
    {
      id: 'cat_orders_crm',
      nameEn: 'Orders & Customer CRM',
      nameBn: 'অর্ডার ও গ্রাহক ব্যবস্থাপনা',
      icon: FileCheck,
      color: 'indigo',
      items: [
        {
          id: 'applications' as AdminMenuKey,
          labelBn: 'গ্রাহক আবেদনসমূহ',
          labelEn: 'Online Applications',
          icon: FileCheck,
          badge: pendingAppsCount > 0 ? `${pendingAppsCount} New` : `${applications.length}`,
          badgeColor: pendingAppsCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : undefined,
          categoryBn: 'আবেদন',
          descBn: 'গ্রাহকদের জমা দেওয়া পুলিশ ক্লিয়ারেন্স, ভর্তি ও চাকরির ফর্ম'
        },
        {
          id: 'orders' as AdminMenuKey,
          labelBn: 'দোকান ই-কমার্স অর্ডার',
          labelEn: 'E-Commerce Orders',
          icon: ShoppingBag,
          badge: orders.length,
          categoryBn: 'অর্ডার',
          descBn: 'অনলাইন ও অফলাইন প্রিন্টিং কাজের অর্ডার ট্র্যাকিং'
        },
        {
          id: 'customers' as AdminMenuKey,
          labelBn: 'কাস্টমার ডাটাবেজ ও বাকি খাতা',
          labelEn: 'Customer Database & CRM',
          icon: UserCheck,
          badge: customers.length,
          categoryBn: 'গ্রাহক',
          descBn: 'নিয়মিত গ্রাহকদের নাম, ফোন নম্বর ও বাকি খাতা'
        }
      ]
    },
    {
      id: 'cat_dashboard',
      nameEn: 'Dashboard & Intelligence',
      nameBn: 'ওভারভিউ ও ড্যাশবোর্ড',
      icon: LayoutDashboard,
      color: 'amber',
      items: [
        {
          id: 'overview' as AdminMenuKey,
          labelBn: 'ড্যাশবোর্ড ওভারভিউ',
          labelEn: 'Dashboard Overview',
          icon: LayoutDashboard,
          categoryBn: 'প্রধান ড্যাশবোর্ড',
          descBn: 'সার্ভিস, পেপার স্টক, গ্রাহক আবেদন ও ক্যাশ কাউন্টারের লাইভ পরিসংখ্যান'
        },
        {
          id: 'analytics' as AdminMenuKey,
          labelBn: 'আয়-ব্যয় ও অ্যানালিটিক্স',
          labelEn: 'Revenue & Analytics',
          icon: PieChart,
          badge: 'Live',
          badgeColor: 'bg-emerald-950 text-emerald-300 border border-emerald-500/40',
          categoryBn: 'রিপোর্ট',
          descBn: 'দৈনিক, সাপ্তাহিক ও মাসিক লাভ-লোকসান চার্ট ও ট্রেন্ড'
        }
      ]
    },
    {
      id: 'cat_team_hr',
      nameEn: 'Team & HR Operations',
      nameBn: 'টিম ও কর্মী ব্যবস্থাপনা',
      icon: Users,
      color: 'purple',
      items: [
        {
          id: 'staff' as AdminMenuKey,
          labelBn: 'স্টাফ ও অপারেটর রোলস',
          labelEn: 'Staff & Roles',
          icon: Users,
          badge: staff.length,
          categoryBn: 'টিম',
          descBn: 'দোকানের কম্পিউটার অপারেটরদের অ্যাক্সেস ও রোল'
        },
        {
          id: 'employee_of_month' as AdminMenuKey,
          labelBn: 'মাসের সেরা কর্মী ও মিডিয়া',
          labelEn: 'Employee of Month & Media',
          icon: Award,
          categoryBn: 'টিম',
          descBn: 'কর্মীর ছবি, ইউটিউব ও ফেসবুক ভিডিও লিংক বা ফাইল আপলোড নিয়ন্ত্রণ'
        }
      ]
    },
    {
      id: 'cat_website_media',
      nameEn: 'Storefront CMS & Media',
      nameBn: 'ওয়েবসাইট ও ব্র্যান্ডিং CMS',
      icon: Palette,
      color: 'sky',
      items: [
        {
          id: 'hero_slides' as AdminMenuKey,
          labelBn: 'হিরো ফটো স্লাইডার',
          labelEn: 'Hero Photo Carousel',
          icon: ImageIcon,
          badge: heroSlides.length,
          categoryBn: 'ডিজাইন',
          descBn: 'ওয়েবসাইটের প্রধান হিরো সেকশনের ফটো স্লাইডার'
        },
        {
          id: 'background_settings' as AdminMenuKey,
          labelBn: 'ব্যাকগ্রাউন্ড ও ওয়ালপেপার',
          labelEn: 'Background & Wallpaper',
          icon: Palette,
          categoryBn: 'ডিজাইন',
          descBn: 'সাইটের থিম, ব্যাকগ্রাউন্ড প্যাটার্ন ও ওয়ালপেপার'
        },
        {
          id: 'seo_meta' as AdminMenuKey,
          labelBn: 'এসইও ও মেটা ট্যাগ',
          labelEn: 'Dynamic SEO & Meta',
          icon: Globe,
          categoryBn: 'মার্কেটিং',
          descBn: 'গুগল সার্চ ও সোশ্যাল মিডিয়া মেটা ট্যাগ সেটিংস'
        }
      ]
    },
    {
      id: 'cat_system_config',
      nameEn: 'System, Settings & Data',
      nameBn: 'সিস্টেম ও কনফিগারেশন',
      icon: Settings,
      color: 'slate',
      items: [
        {
          id: 'settings' as AdminMenuKey,
          labelBn: 'ব্যবসায়িক মাস্টার সেটিংস',
          labelEn: 'Business Settings',
          icon: Settings,
          categoryBn: 'কনফিগ',
          descBn: 'দোকানের নাম, ঠিকানা, মোবাইল ও সামাজিক যোগাযোগ লিঙ্ক'
        },
        {
          id: 'settings' as AdminMenuKey,
          subTab: 'killswitch' as SettingsTabKey,
          labelBn: 'জরুরি শাটডাউন ও কিলসুইচ',
          labelEn: 'Emergency Killswitch',
          icon: AlertTriangle,
          badge: settings.systemStatusMode && settings.systemStatusMode !== 'online' ? 'LOCKED' : undefined,
          badgeColor: 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse font-bold',
          categoryBn: 'সিকিউরিটি',
          descBn: 'সাইট সাময়িক বন্ধ, 503 এরর বা টার্মিনেট করুন'
        },
        {
          id: 'backup' as AdminMenuKey,
          labelBn: 'ডাটাবেজ ব্যাকআপ ও রিস্টোর',
          labelEn: 'Database Backup',
          icon: Database,
          categoryBn: 'সিস্টেম',
          descBn: 'সম্পূর্ণ দোকানের তথ্য JSON ব্যাকআপ ডাউনলোড ও রিস্টোর'
        }
      ]
    }
  ], [services.length, lowStockCount, products.length, pendingAppsCount, applications.length, orders.length, customers.length, staff.length, heroSlides.length, settings.systemStatusMode]);

  // Flattened items for backward compatibility
  const navigationMenuItems = useMemo(() => {
    return navigationCategories.flatMap(cat => cat.items);
  }, [navigationCategories]);

  // Filtered categories based on sidebar search and category pill filter
  const filteredCategories = useMemo(() => {
    let cats = navigationCategories;
    if (sidebarCategoryFilter !== 'all') {
      cats = cats.filter(cat => cat.id === sidebarCategoryFilter);
    }
    if (!sidebarSearch.trim()) return cats;
    const q = sidebarSearch.toLowerCase();
    return cats
      .map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.labelEn.toLowerCase().includes(q) ||
            item.labelBn.includes(q) ||
            item.id.toLowerCase().includes(q) ||
            (item.descBn && item.descBn.includes(q))
        )
      }))
      .filter(cat => cat.items.length > 0);
  }, [navigationCategories, sidebarSearch, sidebarCategoryFilter]);

  const activeMenuItem = useMemo(() => {
    return navigationMenuItems.find(item => item.id === activeMenu) || navigationMenuItems[0];
  }, [navigationMenuItems, activeMenu]);

  const activeCategory = useMemo(() => {
    return navigationCategories.find(cat => cat.items.some(item => item.id === activeMenu)) || navigationCategories[0];
  }, [navigationCategories, activeMenu]);

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
                <span className={`px-2 py-0.5 rounded-full ${currentThemeConfig.badgeBg || currentThemeConfig.accentBadge} border ${currentThemeConfig.borderColor} text-[10px] font-mono font-bold uppercase tracking-wider`}>
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
              onClick={() => navigateToMenu('pos')}
              className={`px-3 py-1.5 rounded-xl ${currentThemeConfig.badgeBg || currentThemeConfig.accentBadge} border ${currentThemeConfig.borderColor} text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ক্যাশ কাউন্টার (POS)' : 'POS Terminal'}</span>
            </button>

            <button
              onClick={() => navigateToMenu('applications')}
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
              onClick={() => navigateToMenu('products')}
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
              onClick={() => navigateToMenu('finance')}
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
              id="admin-lang-btn"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Dark & Light Mode Toggle */}
            <button
              id="admin-theme-toggle-btn"
              onClick={() => {
                toggleTheme();
                if (themeMode === 'dark') {
                  handleThemeChange('nordic_light');
                } else {
                  handleThemeChange('emerald');
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title={
                themeMode === 'dark'
                  ? 'লাইট মোড চালু করুন (Switch to Light Mode)'
                  : 'ডার্ক মোড চালু করুন (Switch to Dark Mode)'
              }
            >
              {themeMode === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline font-bold">{language === 'bn' ? 'লাইট' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline font-bold">{language === 'bn' ? 'ডার্ক' : 'Dark'}</span>
                </>
              )}
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

            {/* Quick Menu Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                placeholder={language === 'bn' ? 'মেনু সার্চ করুন...' : 'Search menus...'}
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
              {sidebarSearch && (
                <button
                  type="button"
                  onClick={() => setSidebarSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-400 px-1">
                <span>{language === 'bn' ? 'ক্যাটাগরি ফিল্টার' : 'Category Filter'}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (Object.keys(collapsedCategories).length > 0) {
                      expandAllCategories();
                    } else {
                      const next: Record<string, boolean> = {};
                      navigationCategories.forEach(cat => {
                        if (!cat.items.some(it => it.id === activeMenu)) {
                          next[cat.id] = true;
                        }
                      });
                      setCollapsedCategories(next);
                    }
                  }}
                  className="text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  {Object.keys(collapsedCategories).length > 0
                    ? (language === 'bn' ? 'সব প্রসারিত' : 'Expand All')
                    : (language === 'bn' ? 'সব সংকুচিত' : 'Collapse All')}
                </button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-semibold custom-scrollbar">
                <button
                  type="button"
                  onClick={() => setSidebarCategoryFilter('all')}
                  className={`px-2 py-0.5 rounded-lg shrink-0 transition-all font-mono ${
                    sidebarCategoryFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {language === 'bn' ? 'সব' : 'All'} ({navigationMenuItems.length})
                </button>
                {navigationCategories.map(cat => {
                  const isSelected = sidebarCategoryFilter === cat.id;
                  const shortLabel = language === 'bn'
                    ? cat.nameBn.split(' ')[0]
                    : cat.nameEn.split(' ')[0];
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSidebarCategoryFilter(cat.id === sidebarCategoryFilter ? 'all' : cat.id)}
                      className={`px-2 py-0.5 rounded-lg shrink-0 transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <span>{shortLabel}</span>
                      <span className="opacity-70 text-[9px] font-mono">({cat.items.length})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorized Navigation Menu */}
            <nav className="space-y-3 text-xs font-semibold overflow-y-auto max-h-[calc(100vh-330px)] pr-1 custom-scrollbar">
              {filteredCategories.length === 0 ? (
                <div className="p-4 text-center text-xs text-neutral-500 bg-neutral-950/40 rounded-xl border border-neutral-800/60">
                  <p>{language === 'bn' ? 'কোনো মেনু পাওয়া যায়নি' : 'No menu found'}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSidebarSearch('');
                      setSidebarCategoryFilter('all');
                    }}
                    className="mt-2 text-emerald-400 hover:underline text-[11px] font-bold"
                  >
                    {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset filter'}
                  </button>
                </div>
              ) : (
                filteredCategories.map(cat => {
                  const CatIcon = cat.icon || LayoutDashboard;
                  const isCategoryActive = cat.items.some(item => item.id === activeMenu);
                  const isCollapsed = !!collapsedCategories[cat.id] && !isCategoryActive;

                  return (
                    <div key={cat.id} className="space-y-1 bg-neutral-950/40 rounded-xl p-1 border border-neutral-800/40">
                      {/* Category Section Header with Accordion Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCategoryCollapse(cat.id)}
                        className="w-full px-2 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors group select-none cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isCategoryActive ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                          <span className="truncate">{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                            {cat.items.length}
                          </span>
                          {isCollapsed ? (
                            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-transform" />
                          ) : (
                            <ChevronUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-transform" />
                          )}
                        </div>
                      </button>

                      {/* Category Items */}
                      {!isCollapsed && (
                        <div className="space-y-0.5 pt-0.5 animate-in fade-in duration-150">
                          {cat.items.map(item => {
                            const Icon = item.icon;
                            const isActive = activeMenu === item.id;
                            const isCopied = copiedLinkSection === item.id;
                            return (
                              <div key={`${item.id}-${(item as any).subTab || ''}`} className="group relative flex items-center">
                                <button
                                  id={`admin-nav-${item.id}-${(item as any).subTab || ''}`}
                                  onClick={() => {
                                    if ((item as any).subTab) {
                                      setSettingsSubTab((item as any).subTab);
                                    }
                                    navigateToMenu(item.id);
                                  }}
                                  className={`w-full flex items-center justify-between pl-3 pr-2 py-2 rounded-xl transition-all relative ${
                                    isActive
                                      ? `${currentThemeConfig.activeSidebarItem} shadow-sm ring-1 ring-emerald-500/30`
                                      : currentThemeConfig.inactiveSidebarItem
                                  }`}
                                >
                                  {isActive && (
                                    <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-emerald-400" />
                                  )}
                                  <div className="flex items-center gap-2.5 min-w-0 pr-1 pl-1">
                                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-neutral-400'}`} />
                                    <span className="truncate">{language === 'bn' ? item.labelBn : item.labelEn}</span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {item.badge !== undefined && item.badge !== null && item.badge !== '' && (
                                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                                        {item.badge}
                                      </span>
                                    )}
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      onClick={(e) => handleCopySectionLink(e, item.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          handleCopySectionLink(e as any, item.id);
                                        }
                                      }}
                                      className="p-1 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/80 transition-colors"
                                      title={`${language === 'bn' ? 'সরাসরি লিঙ্ক কপি করুন' : 'Copy direct link'}: /admin?section=${item.id}`}
                                    >
                                      {isCopied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
                                      ) : (
                                        <Link2 className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                      )}
                                    </span>
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </nav>
          </div>

          {/* Bottom Store Status Badge */}
          <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{language === 'bn' ? 'স্টোর স্ট্যাটাস' : 'Store Status'}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                settings.systemStatusMode === 'online' || !settings.systemStatusMode
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse'
              }`}>
                {settings.systemStatusMode || 'Online'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500">Beside Tejgaon College, Indira Road</p>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* Emergency Killswitch Top Sticky Warning Banner */}
          {settings.systemStatusMode && settings.systemStatusMode !== 'online' && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-rose-950/80 to-amber-950/90 border-2 border-red-500/60 shadow-2xl shadow-red-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/40 shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider font-mono">
                      {settings.systemStatusMode.toUpperCase()} LOCK ACTIVE
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      {language === 'bn' ? 'জরুরি সতর্কতা: সাধারণ ভিজিটরদের জন্য সাইট বন্ধ আছে!' : 'CRITICAL ALERT: Storefront Access is Temporarily Halted!'}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {language === 'bn'
                      ? `বর্তমান মোড: ${
                          settings.systemStatusMode === 'maintenance'
                            ? 'সাময়িক রক্ষণাবেক্ষণ'
                            : settings.systemStatusMode === 'server_error'
                            ? '৫০৩ সার্ভার ত্রুটি'
                            : 'টার্মিনেশন'
                        }। সাধারণ গ্রাহকরা সাইট দেখতে পাচ্ছেন না।`
                      : `Mode: ${settings.systemStatusMode}. Public visitors cannot view services or submit orders.`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMenu('settings');
                    setSettingsSubTab('killswitch');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-700 cursor-pointer"
                >
                  {language === 'bn' ? 'কিলসুইচ সেটিংস' : 'Killswitch Settings'}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenKillswitchModal('online')}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
                >
                  {language === 'bn' ? '১-ক্লিকে অনলাইন করুন' : 'Restore Online'}
                </button>
              </div>
            </div>
          )}

          {/* Top Workspace Breadcrumb & Context Navigation */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 text-neutral-400 font-medium">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                <span className="text-neutral-400">{language === 'bn' ? activeCategory?.nameBn : activeCategory?.nameEn}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              </div>
              <div className="flex items-center gap-1.5 font-bold text-white bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
                {activeMenuItem && React.createElement(activeMenuItem.icon, { className: 'w-3.5 h-3.5 text-emerald-400' })}
                <span>{language === 'bn' ? activeMenuItem?.labelBn : activeMenuItem?.labelEn}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigateToMenu('pos')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
              >
                <Calculator className="w-3 h-3 text-emerald-400" />
                <span>{language === 'bn' ? 'পস কাউন্টার' : 'POS Counter'}</span>
              </button>
              <button
                onClick={() => navigateToMenu('settings')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  activeMenu === 'settings'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                }`}
              >
                <Settings className="w-3 h-3 text-amber-400" />
                <span>{language === 'bn' ? 'মাস্টার সেটিংস' : 'Settings'}</span>
              </button>
              <button
                onClick={(e) => handleCopySectionLink(e, activeMenu)}
                className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 text-[11px] flex items-center gap-1 transition-all"
                title={language === 'bn' ? 'এই সেকশনের সরাসরি লিঙ্ক কপি করুন' : 'Copy direct link to this section'}
              >
                {copiedLinkSection === activeMenu ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Link2 className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{language === 'bn' ? 'শেয়ার লিঙ্ক' : 'Share Link'}</span>
              </button>
            </div>
          </div>

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
                  {/* Special Ledger Button */}
                  <button
                    onClick={() => navigateToMenu('ledger')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/30 to-emerald-500/30 hover:brightness-110 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{language === 'bn' ? 'দৈনিক হিসাব খাতা' : 'Daily Shop Ledger'}</span>
                  </button>
                  {/* Special Stamp & Cartridge Register Button */}
                  <button
                    onClick={() => navigateToMenu('stamps')}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-950/70 to-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-950"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>{language === 'bn' ? 'স্ট্যাম্প ও কার্টিজ রেজিস্টার' : 'Stamp Register'}</span>
                  </button>
                  <button
                    onClick={() => navigateToMenu('cashmemo')}
                    className="px-3.5 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-950"
                  >
                    <Receipt className="w-4 h-4 text-teal-400" />
                    <span>{language === 'bn' ? 'ক্যাশ মেমো' : 'Cash Memo'}</span>
                  </button>
                  <button
                    onClick={() => navigateToMenu('analytics')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950"
                  >
                    <PieChart className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'আয়-ব্যয় অ্যানালিটিক্স' : 'Analytics & Trends'}</span>
                  </button>
                  <button
                    onClick={() => navigateToMenu('backup')}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'ডাটাবেজ ব্যাকআপ' : 'Backup DB'}</span>
                  </button>
                  <button
                    onClick={() => navigateToMenu('pos')}
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
                    onClick={() => { navigateToMenu('products'); setProductLowStockOnly(true); }}
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

              {/* Staff Text-to-Speech Voice Alerts & Assistance Center */}
              <StaffTTSControlWidget variant="embedded" />

              {/* Operator 60% Owner Profit & 40% Worker Share Widget with Photo Buttons */}
              <OperatorProfitShareWidget onNavigateToLedger={() => navigateToMenu('ledger')} />

              {/* Recent Invoices Feed */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-teal-400" />
                    <span>{language === 'bn' ? 'সাম্প্রতিক POS কাউন্টার ক্যাশ রসিদ' : 'Recent POS Counter Invoices'}</span>
                  </h3>
                  <button onClick={() => navigateToMenu('pos')} className="text-xs text-teal-400 hover:underline">
                    {language === 'bn' ? 'নতুন বিক্রয় →' : 'New Sale →'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          )}

          {/* VIEW: DAILY SHOP LEDGER (স্পেশাল দৈনিক হিসাব খাতা) */}
          {activeMenu === 'ledger' && (
            <DailyShopLedger isEmbedded={true} />
          )}

          {/* VIEW: JUDICIAL STAMPS & CARTRIDGE REGISTER (জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার রেজিস্টার) */}
          {activeMenu === 'stamps' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <JudicialStampRegister lang={language} />
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

          {/* VIEW 9: BUSINESS & CMS SETTINGS - PROFESSIONALLY TABBED & ORGANIZED */}
          {activeMenu === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Settings Header Bar */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                        {language === 'bn' ? 'ব্যবসায়িক মাস্টার সেটিংস' : 'Master Business Settings'}
                      </h1>
                      <p className="text-xs text-neutral-400">
                        {language === 'bn'
                          ? 'দোকানের নাম, ঠিকানা, বিকাশ/হোয়াটসঅ্যাপ নাম্বার, ডেলিভারি চার্জ, টপ নোটিশ ও পস টার্মিনাল কনফিগারেশন'
                          : 'Configure shop identity, hotline, payment accounts, shipping rates, notice banners, and POS hardware'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Shop Open / Closed Live Badge */}
                  <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                    settingsForm.isShopOpen
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${settingsForm.isShopOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{settingsForm.isShopOpen ? (language === 'bn' ? 'দোকান খোলা' : 'Shop Open') : (language === 'bn' ? 'দোকান বন্ধ' : 'Shop Closed')}</span>
                  </div>

                  {/* Top Notice Status Badge */}
                  <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    settingsForm.showNoticeBanner
                      ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-400'
                  }`}>
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>{settingsForm.showNoticeBanner ? (language === 'bn' ? 'নোটিশ সক্রিয়' : 'Notice Active') : (language === 'bn' ? 'নোটিশ লুকানো' : 'Notice Hidden')}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={isServerSyncing}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isServerSyncing ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'সেভ করুন' : 'Save')}</span>
                  </button>
                </div>
              </div>

              {settingsSaved && (
                <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg animate-in slide-in-from-top duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{language === 'bn' ? 'সকল সেটিংস সফলভাবে সংরক্ষিত হয়েছে এবং সাইটে প্রয়োগ করা হয়েছে!' : 'All settings saved and applied successfully across all public and admin views!'}</span>
                </div>
              )}

              {/* Sub-Tab Navigation Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-800 custom-scrollbar">
                {[
                  { id: 'profile' as SettingsTabKey, labelBn: 'দোকানের পরিচিতি ও স্ট্যাটাস', labelEn: 'Profile & Status', icon: Building2 },
                  { id: 'contacts' as SettingsTabKey, labelBn: 'যোগাযোগ ও পেমেন্ট নম্বর', labelEn: 'Contacts & Payments', icon: Phone },
                  { id: 'delivery' as SettingsTabKey, labelBn: 'ডেলিভারি চার্জ ও শর্তাবলী', labelEn: 'Delivery Rates', icon: Truck },
                  { id: 'notice' as SettingsTabKey, labelBn: 'টপ নোটিশ বার ও ঘোষণা', labelEn: 'Notice Banner', icon: Bell },
                  { id: 'themes' as SettingsTabKey, labelBn: 'অ্যাডমিন ভিজ্যুয়াল থিম', labelEn: 'Admin Themes', icon: Palette },
                  { id: 'hardware' as SettingsTabKey, labelBn: 'পস ও ক্লাউড সিঙ্ক', labelEn: 'Hardware & Sync', icon: Database },
                  {
                    id: 'killswitch' as SettingsTabKey,
                    labelBn: 'জরুরি কিলসুইচ ও সার্ভার কন্ট্রোল',
                    labelEn: 'Emergency Killswitch',
                    icon: AlertTriangle,
                    badge: settings.systemStatusMode && settings.systemStatusMode !== 'online' ? 'ACTIVE' : undefined
                  }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = settingsSubTab === tab.id || (tab.id === 'hardware' && settingsSubTab === 'system');
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSettingsSubTab(tab.id)}
                      className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all ${
                        isActive
                          ? tab.id === 'killswitch'
                            ? 'bg-rose-950 text-rose-200 shadow-md border border-rose-500/50 ring-1 ring-rose-500/50'
                            : 'bg-neutral-800 text-white shadow-md border border-neutral-700 ring-1 ring-emerald-500/40'
                          : tab.id === 'killswitch' && settings.systemStatusMode && settings.systemStatusMode !== 'online'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${
                        isActive
                          ? tab.id === 'killswitch' ? 'text-rose-400' : 'text-emerald-400'
                          : tab.id === 'killswitch' ? 'text-rose-400' : 'text-neutral-400'
                      }`} />
                      <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                      {tab.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black uppercase">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Settings Form */}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* TAB 1: PROFILE & STATUS */}
                {settingsSubTab === 'profile' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Live Shop Open / Closed Control Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Store className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'bn' ? 'দোকানের লাইভ স্ট্যাটাস ও কার্যকাল' : 'Live Shop Status & Operations'}</span>
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {language === 'bn'
                              ? 'দোকান খোলা নাকি সাময়িক বন্ধ তা পাবলিক ভিজিটরদের সরাসরি দেখায়'
                              : 'Control store live presence indicator displayed to public visitors'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, isShopOpen: !settingsForm.isShopOpen })}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-md ${
                            settingsForm.isShopOpen
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                              : 'bg-rose-900 hover:bg-rose-800 text-rose-200 shadow-rose-950'
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${settingsForm.isShopOpen ? 'bg-white animate-pulse' : 'bg-rose-400'}`} />
                          <span>{settingsForm.isShopOpen ? (language === 'bn' ? 'দোকান খোলা (Open)' : 'Open (Live)') : (language === 'bn' ? 'দোকান বন্ধ (Closed)' : 'Closed')}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            {language === 'bn' ? 'কার্যঘণ্টা (English)' : 'Opening Hours (English)'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.openingHours || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                            placeholder="Sat - Thu: 8:00 AM - 11:00 PM, Fri: 2:30 PM - 11:00 PM"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            {language === 'bn' ? 'কার্যঘণ্টা (বাংলা)' : 'Opening Hours (Bangla)'}
                          </label>
                          <input
                            type="text"
                            value={settingsForm.openingHoursBn || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, openingHoursBn: e.target.value })}
                            placeholder="শনি - বৃহস্পতি: সকাল ৮:০০ - রাত ১১:০০, শুক্র: দুপুর ২:৩০ - রাত ১১:০০"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Identity Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'দোকানের নাম ও স্লোগান' : 'Business Identity & Names'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'ওয়েবসাইটের হেডার, ফুটার এবং ক্যাশ মেমোতে ব্যবহৃত হবে' : 'Displayed on storefront headers, receipts, and invoices'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Name (English)</label>
                          <input
                            type="text"
                            value={settingsForm.businessName}
                            onChange={e => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Business Name (Bangla)</label>
                          <input
                            type="text"
                            value={settingsForm.businessNameBn}
                            onChange={e => setSettingsForm({ ...settingsForm, businessNameBn: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Tagline (English)</label>
                          <input
                            type="text"
                            value={settingsForm.tagline || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Tagline (Bangla)</label>
                          <input
                            type="text"
                            value={settingsForm.taglineBn || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, taglineBn: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Tejgaon Branch Highlight (English)</label>
                          <input
                            type="text"
                            value={settingsForm.tejgaonCollegeHighlight || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, tejgaonCollegeHighlight: e.target.value })}
                            placeholder="Beside Tejgaon College Gate, Indira Road"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Tejgaon Branch Highlight (Bangla)</label>
                          <input
                            type="text"
                            value={settingsForm.tejgaonCollegeHighlightBn || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, tejgaonCollegeHighlightBn: e.target.value })}
                            placeholder="তেজগাঁও কলেজ গেট সংলগ্ন, ইন্দিরা রোড"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Live Public Header Preview Card */}
                    <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                        {language === 'bn' ? 'লাইভ পাবলিক প্রিভিউ (Public Storefront Simulation)' : 'Public Storefront Simulation'}
                      </span>
                      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                            SE
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white">
                              {language === 'bn' ? settingsForm.businessNameBn : settingsForm.businessName}
                            </h4>
                            <p className="text-xs text-neutral-400">
                              {language === 'bn' ? settingsForm.taglineBn : settingsForm.tagline}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            settingsForm.isShopOpen ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${settingsForm.isShopOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                            {settingsForm.isShopOpen ? 'Open Now' : 'Closed'}
                          </span>
                          <span className="block text-[10px] text-neutral-500 mt-1 font-mono">
                            {settingsForm.openingHours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CONTACTS & PAYMENTS */}
                {settingsSubTab === 'contacts' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Hotlines Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'গ্রাহক হটলাইন ও হেল্পলাইন' : 'Customer Hotlines & Helpline'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'ওয়েবসাইটের হেডার, ফুটার এবং জরুরি কল বাটনে ব্যবহৃত হবে' : 'Main communication lines used across header and footer'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Primary Hotline (প্রধান ফোন)</label>
                          <input
                            type="text"
                            value={settingsForm.phonePrimary}
                            onChange={e => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Secondary Mobile (বিকল্প ফোন)</label>
                          <input
                            type="text"
                            value={settingsForm.phoneSecondary || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })}
                            placeholder="017XXXXXXXX"
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Official Email (অফিসিয়াল ইমেইল)</label>
                          <input
                            type="email"
                            value={settingsForm.email || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp & Mobile Financial Services (MFS) Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ ও মোবাইল ব্যাংকিং পেমেন্ট (bKash / Nagad)' : 'WhatsApp & Mobile Banking Payment Numbers'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'গ্রাহকরা অনলাইনে আবেদন ফি ও প্রিন্টিং বিল পরিশোধের সময় এই নম্বরগুলোতে পেমেন্ট পাঠাবে' : 'Accounts used for advance order payment and direct WhatsApp document submission'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">WhatsApp Hotline (ডকুমেন্ট জমা)</label>
                          <input
                            type="text"
                            value={settingsForm.whatsappNumber}
                            onChange={e => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">bKash Account (মার্চেন্ট / পার্সোনাল)</label>
                          <input
                            type="text"
                            value={settingsForm.bkashNumber || settingsForm.whatsappNumber}
                            onChange={e => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Nagad Account (নগদ নম্বর)</label>
                          <input
                            type="text"
                            value={settingsForm.nagadNumber || settingsForm.whatsappNumber}
                            onChange={e => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                      </div>

                      {/* Quick Verification Actions */}
                      <div className="pt-2 flex items-center gap-3">
                        <a
                          href={`https://wa.me/88${settingsForm.whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট পরীক্ষা করুন' : 'Test WhatsApp Link'}</span>
                        </a>
                        <a
                          href={`tel:${settingsForm.phonePrimary}`}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'bn' ? 'হটলাইন কল পরীক্ষা করুন' : 'Test Hotline Call'}</span>
                        </a>
                      </div>
                    </div>

                    {/* Shop Physical Address Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'দোকানের ঠিকানা ও গুগল ম্যাপ' : 'Physical Shop Address & Google Maps'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'গ্রাহক রসিদ ও ডেলিভারি ইনভয়েসে মুদ্রিত ঠিকানা' : 'Official store location rendered on invoices and contact section'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Shop Address (English)</label>
                          <textarea
                            rows={3}
                            value={settingsForm.address}
                            onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Shop Address (Bangla)</label>
                          <textarea
                            rows={3}
                            value={settingsForm.addressBn}
                            onChange={e => setSettingsForm({ ...settingsForm, addressBn: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Google Maps URL (গুগল ম্যাপ লিঙ্ক)</label>
                        <input
                          type="url"
                          value={settingsForm.googleMapUrl || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, googleMapUrl: e.target.value })}
                          placeholder="https://maps.google.com/..."
                          className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DELIVERY & COMMERCE */}
                {settingsSubTab === 'delivery' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'হোম ডেলিভারি চার্জ ও অর্ডার শর্তাবলী' : 'Delivery Charges & Minimum Order Policy'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'কাগজ, প্রিন্টিং ও স্টেশনারি হোম ডেলিভারি ফি নির্ধারণ করুন' : 'Configure delivery fee for inside and outside Dhaka courier shipments'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            {language === 'bn' ? 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)' : 'Inside Dhaka Delivery (৳)'}
                          </label>
                          <input
                            type="number"
                            value={settingsForm.deliveryChargeInsideDhaka}
                            onChange={e => setSettingsForm({ ...settingsForm, deliveryChargeInsideDhaka: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                          <span className="text-[10px] text-neutral-500 mt-1 block">Standard: ৳60 (Express 24h)</span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            {language === 'bn' ? 'ঢাকার বাইরে ডেলিভারি চার্জ (৳)' : 'Outside Dhaka Delivery (৳)'}
                          </label>
                          <input
                            type="number"
                            value={settingsForm.deliveryChargeOutsideDhaka ?? 120}
                            onChange={e => setSettingsForm({ ...settingsForm, deliveryChargeOutsideDhaka: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                          <span className="text-[10px] text-neutral-500 mt-1 block">Standard: ৳120 (Sundarban/Steadfast)</span>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            {language === 'bn' ? 'সর্বনিম্ন অর্ডার মূল্য (৳)' : 'Minimum Order Amount (৳)'}
                          </label>
                          <input
                            type="number"
                            value={settingsForm.minOrderAmount ?? 100}
                            onChange={e => setSettingsForm({ ...settingsForm, minOrderAmount: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                          <span className="text-[10px] text-neutral-500 mt-1 block">Minimum checkout threshold</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Currency Symbol (মুদ্রা প্রতীক)</label>
                          <input
                            type="text"
                            value={settingsForm.currencySymbol || '৳'}
                            onChange={e => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">VAT / Tax Rate (%) (ভ্যাট শতাংশ)</label>
                          <input
                            type="number"
                            value={settingsForm.taxRate || 0}
                            onChange={e => setSettingsForm({ ...settingsForm, taxRate: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery Policy Note */}
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                      <div className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{language === 'bn' ? 'হোম ডেলিভারি পলিসি নির্দেশিকা' : 'Shipping Policy Summary'}</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed text-[11px]">
                        {language === 'bn'
                          ? '• তেজগাঁও, ফার্মগেট, ইন্দিরা রোড এলাকায় ১ ঘণ্টার মধ্যে স্পেশাল লোকাল ডেলিভারি সম্ভব।\n• ঢাকা সিটির ভেতর সুন্দরবন বা পাঠাও কুরিয়ারে ২৪ ঘণ্টায় ডেলিভারি।\n• ঢাকার বাইরে সুন্দরবন ও রেডেক্স সার্ভিসে ৪৮-৭২ ঘণ্টায় পণ্য পৌঁছে দেওয়া হয়।'
                          : '• Farmgate & Indira Road local express delivery within 1 hour.\n• Inside Dhaka delivery within 24 hours via courier.\n• Nationwide parcel delivery across 64 districts in 48-72 hours.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 4: TOP ANNOUNCEMENT BANNER */}
                {settingsSubTab === 'notice' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-amber-400" />
                            <span>{language === 'bn' ? 'টপ নোটিশ বার ও জরুরি বার্তা' : 'Top Announcement Banner'}</span>
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {language === 'bn' ? 'ওয়েবসাইটের একদম শীর্ষে বিশেষ জরুরি বিজ্ঞপ্তি প্রদর্শন' : 'Live marquee announcement ticker bar displayed across the website header'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, showNoticeBanner: !settingsForm.showNoticeBanner })}
                          className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-md ${
                            settingsForm.showNoticeBanner
                              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${settingsForm.showNoticeBanner ? 'bg-white animate-pulse' : 'bg-neutral-500'}`} />
                          <span>{settingsForm.showNoticeBanner ? (language === 'bn' ? 'নোটিশ সক্রিয় (Active)' : 'Active') : (language === 'bn' ? 'নোটিশ লুকানো (Hidden)' : 'Hidden')}</span>
                        </button>
                      </div>

                      {/* Ready-Made Preset Buttons */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                          {language === 'bn' ? 'এক ক্লিকে বিশেষ নোটিশ লোড করুন (Quick Presets)' : 'Quick Preset Templates'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({
                                ...settingsForm,
                                showNoticeBanner: true,
                                noticeBanner: 'Admission & Govt Job application forms are currently being submitted. Visit with required documents.',
                                noticeBannerBn: 'বিশ্ববিদ্যালয় ভর্তি, ক্যাডেট কলেজ ও সরকারি চাকরির আবেদন ফর্ম পূরণ চলছে। প্রয়োজনীয় কাগজপত্র নিয়ে আসুন।'
                              });
                            }}
                            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-start gap-2"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">বিশ্ববিদ্যালয় ভর্তি ও চাকরির আবেদন</span>
                              <span className="text-[10px] text-neutral-400 block line-clamp-1">ভর্তি ও সরকারি চাকরির আবেদন সংক্রান্ত নোটিশ</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({
                                ...settingsForm,
                                showNoticeBanner: true,
                                noticeBanner: 'Holy Ramadan schedule: Open daily from 9:00 AM to 11:00 PM.',
                                noticeBannerBn: 'পবিত্র মাহে রমজান উপলক্ষে আমাদের দোকান প্রতিদিন সকাল ৯:০০টা থেকে রাত ১১:০০টা পর্যন্ত খোলা থাকবে।'
                              });
                            }}
                            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-start gap-2"
                          >
                            <Moon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">পবিত্র মাহে রমজান সময়সূচি</span>
                              <span className="text-[10px] text-neutral-400 block line-clamp-1">রমজানের বিশেষ সেবা সময়সূচি</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({
                                ...settingsForm,
                                showNoticeBanner: true,
                                noticeBanner: 'Friday special hours: Open from 2:30 PM (after Jummah prayer) until 11:00 PM.',
                                noticeBannerBn: 'প্রতি শুক্রবার জুমার নামাজের পর দুপুর ২:৩০টা থেকে রাত ১১:০০টা পর্যন্ত সেবা চালু থাকে।'
                              });
                            }}
                            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-start gap-2"
                          >
                            <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">শুক্রবার জুমার বিশেষ সময়সূচি</span>
                              <span className="text-[10px] text-neutral-400 block line-clamp-1">শুক্রবার দুপুর ২:৩০টা থেকে খোলা</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSettingsForm({
                                ...settingsForm,
                                showNoticeBanner: true,
                                noticeBanner: 'Judicial Stamps (50 Tk, 100 Tk, 300 Tk) and Court Fees are in full stock.',
                                noticeBannerBn: '৫০৳, ১০০৳ ও ৩০০৳ জুডিশিয়াল নন-জুডিশিয়াল স্ট্যাম্প এবং কোর্ট ফি পর্যাপ্ত পরিমাণে স্টকে আছে।'
                              });
                            }}
                            className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-start gap-2"
                          >
                            <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block">জুডিশিয়াল স্ট্যাম্প ও কোর্ট ফি স্টক</span>
                              <span className="text-[10px] text-neutral-400 block line-clamp-1">স্ট্যাম্প ও কার্টিজ পেপার বিজ্ঞপ্তি</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Top Notice Bar Text (English)</label>
                          <textarea
                            rows={3}
                            value={settingsForm.noticeBanner ?? (settingsForm as any).noticeEn ?? ''}
                            onChange={e => setSettingsForm({ ...settingsForm, noticeBanner: e.target.value, noticeEn: e.target.value } as any)}
                            placeholder="Special notice to display across top of site..."
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">Top Notice Bar Text (Bangla)</label>
                          <textarea
                            rows={3}
                            value={settingsForm.noticeBannerBn ?? (settingsForm as any).noticeBn ?? ''}
                            onChange={e => setSettingsForm({ ...settingsForm, noticeBannerBn: e.target.value, noticeBn: e.target.value } as any)}
                            placeholder="ওয়েবসাইটের শীর্ষে প্রদর্শনের জন্য বিশেষ নোটিশ..."
                            className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Live Notice Bar Simulation */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                          {language === 'bn' ? 'লাইভ ব্যানার প্রিভিউ (Live Banner Preview)' : 'Live Notice Bar Simulation'}
                        </span>
                        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
                          settingsForm.showNoticeBanner
                            ? 'bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border-amber-500/40 text-amber-200'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-500 opacity-60'
                        }`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                            <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="truncate">
                              {language === 'bn'
                                ? (settingsForm.noticeBannerBn || 'কোনো নোটিশ টেক্সট দেওয়া হয়নি')
                                : (settingsForm.noticeBanner || 'No notice text configured')}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0 font-mono">
                            {settingsForm.showNoticeBanner ? 'VISIBLE' : 'HIDDEN'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: ADMIN THEMES */}
                {settingsSubTab === 'themes' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Palette className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'অ্যাডমিন ভিজ্যুয়াল কালার প্যালেট' : 'Admin Visual Themes & Contrast Modes'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ডের রঙ ও ভিজ্যুয়াল স্টাইল নির্বাচন করুন' : 'Select color theme for the management control room'}
                        </p>
                      </div>

                      <AdminThemeSwitcher
                        currentTheme={adminTheme}
                        onSelectTheme={handleThemeChange}
                        variant="settings-grid"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 6: POS HARDWARE, AUDIO & CLOUD SYNC */}
                {(settingsSubTab === 'hardware' || settingsSubTab === 'system') && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* POS Hardware & Thermal Printer Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Printer className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'পস থার্মাল প্রিন্টার ও হার্ডওয়্যার কনফিগারেশন' : 'POS Hardware & Thermal Printer Setup'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'দোকানের ক্যাশ কাউন্টার থার্মাল প্রিন্টার (80mm / 58mm) ও রসিদ ফরম্যাট' : 'Configure thermal printer paper width and receipt header preferences'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                          <span className="block text-xs font-bold text-white">
                            {language === 'bn' ? 'স্ট্যান্ডার্ড থার্মাল পেপার সাইজ' : 'Thermal Paper Width'}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                              80mm Standard POS (3-inch)
                            </span>
                            <span className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-400 border border-neutral-800 text-xs font-mono">
                              58mm Compact Pocket
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500">
                            {language === 'bn' ? 'ডেলি রিপোর্ট ও ক্যাশ মেমো ৮৮ মিমি ও ৮০ মিমি থার্মাল প্রিন্টারের জন্য অপ্টিমাইজড।' : 'Formatted for standard EPSON / Xprinter 80mm roll printers.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                          <span className="block text-xs font-bold text-white">
                            {language === 'bn' ? 'রসিদে হেল্পলাইন ও ঠিকানা প্রদর্শন' : 'Print Slip Contact Header'}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-semibold block truncate">
                            {settingsForm.businessName} • {settingsForm.phonePrimary}
                          </span>
                          <p className="text-[11px] text-neutral-500">
                            {language === 'bn' ? 'প্রিন্ট স্লিপের একদম উপরে দোকানের নাম, মোবাইল ও তেজগাঁও শাখা মুদ্রিত হবে।' : 'Automatically printed at top of thermal POS tickets and daily reports.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Staff Audio & Voice Notifications */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'স্টাফ অডিও অ্যালার্ট ও ভয়েস নোটিফিকেশন (TTS)' : 'Voice & Sound Notifications (Text-To-Speech)'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'নতুন অনলাইন আবেদন বা অর্ডার জমা হলে বাংলা/ইংরেজি ভয়েস অ্যালার্ট' : 'Audio voice alerts for incoming applications and print orders'}
                        </p>
                      </div>

                      <StaffTTSControlWidget />
                    </div>

                    {/* Cloud Database Synchronization & Diagnostics */}
                    <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                      <div className="pb-3 border-b border-neutral-800">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'bn' ? 'ক্লাউড ডাটাবেজ ও সার্ভার সিঙ্ক' : 'Cloud Database Synchronization & Health'}</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                          {language === 'bn' ? 'ব্রাউজারের লোকাল স্টোরেজ ও সার্ভার ডিস্কের পূর্ণাঙ্গ লাইভ সিঙ্ক স্ট্যাটাস' : 'Persistent synchronization between browser cache and server storage'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-white">Server Connection Status</span>
                            <span className="text-[11px] text-neutral-400">Local Express Node Server</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ONLINE
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <span className="block text-xs font-bold text-white">Database Backup Suite</span>
                            <span className="text-[11px] text-neutral-400">Full JSON snapshots & recovery</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigateToMenu('backup')}
                            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <span>{language === 'bn' ? 'ব্যাকআপ পেজ' : 'Go to Backup'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await syncFullDatabaseToServer();
                            setSettingsSaved(true);
                            setTimeout(() => setSettingsSaved(false), 3000);
                          }}
                          disabled={isServerSyncing}
                          className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-emerald-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isServerSyncing ? 'animate-spin' : ''}`} />
                          <span>{isServerSyncing ? (language === 'bn' ? 'সার্ভারে সিঙ্ক হচ্ছে...' : 'Syncing...') : (language === 'bn' ? 'সার্ভারে সম্পূর্ণ ডাটাবেজ ফোর্স সিঙ্ক করুন' : 'Force Full Cloud Sync Now')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: EMERGENCY KILLSWITCH & OUTAGE CONTROLS */}
                {settingsSubTab === 'killswitch' && (
                  <EmergencyKillswitchPanel
                    settings={settings}
                    onOpenConfirmModal={handleOpenKillswitchModal}
                    onUpdateSettings={(updated) => {
                      const merged = { ...settings, ...settingsForm, ...updated };
                      updateSettings(merged);
                      setSettingsForm(merged);
                      localStorage.setItem('se_settings', JSON.stringify(merged));
                      syncFullDatabaseToServer();
                    }}
                    currentUser={currentUser || undefined}
                  />
                )}

                {/* Global Settings Save Footer Bar */}
                <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between flex-wrap gap-3 shadow-xl">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'bn' ? 'সকল পরিবর্তন স্বয়ংক্রিয়ভাবে ব্রাউজার ও সার্ভার ডিস্কে সংরক্ষিত থাকবে' : 'All modifications persist across browser cache and server storage'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {settingsSaved && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        {language === 'bn' ? 'সংরক্ষিত হয়েছে' : 'Saved'}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isServerSyncing}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isServerSyncing ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'সেটিংস সম্পূর্ণ সংরক্ষণ করুন (Save All Settings)' : 'Save All Settings')}</span>
                    </button>
                  </div>
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

          {/* VIEW: EMPLOYEE OF THE MONTH (মাসের সেরা কর্মী ও থ্যানোস স্ন্যাপ) */}
          {activeMenu === 'employee_of_month' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <EmployeeOfTheMonthManager />
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

      {/* Emergency Shutdown & Killswitch Security Confirmation Modal */}
      <EmergencyShutdownConfirmModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        targetMode={targetEmergencyMode}
        settings={settings}
        onConfirm={handleConfirmEmergencyMode}
      />
    </div>
  );
};
