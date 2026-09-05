import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Service,
  ServiceCategory,
  Product,
  GsmOption,
  Order,
  Application,
  Expense,
  POSSale,
  User,
  WebsiteSettings,
  AppNotification,
  ActivityLog,
  CartItem,
  OrderStatus,
  PaymentStatus,
  ApplicationStatus,
  Invoice,
  HeroSlide,
  SectionSEO,
  DailyCounterSale,
  StoreExpenseRecord,
  OperatorDailyLedger,
  StoreLedgerSettings,
  CustomLedgerCategory,
  DailyCashReconciliation,
  StampItemConfig,
  StampSaleRecord,
  StampStockPurchase
} from '../types';
import {
  initialCategories,
  initialServices,
  initialGsmOptions,
  initialProducts,
  initialStaff,
  initialCustomers,
  initialOrders,
  initialApplications,
  initialExpenses,
  initialPOSSales,
  initialSettings,
  initialHeroSlides,
  initialSEOSettings,
  initialStoreLedgerSettings,
  initialCustomLedgerCategories,
  initialDailyCounterSales,
  initialStoreExpenses,
  initialOperatorDailyLedgers,
  initialDailyCashReconciliations,
  initialStampConfigs,
  initialStampSales,
  initialStampPurchases
} from '../data/initialData';

interface DataContextType {
  // Website Settings
  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;

  // Hero Background Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => HeroSlide;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;

  // SEO & Meta Tags Manager
  seoSettings: Record<string, SectionSEO>;
  updateSectionSEO: (sectionKey: string, updates: Partial<SectionSEO>) => void;
  resetSectionSEO: (sectionKey?: string) => void;

  // Services
  services: Service[];
  categories: ServiceCategory[];
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addCategory: (cat: Omit<ServiceCategory, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;


  // Products & GSM
  products: Product[];
  gsmOptions: GsmOption[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addGsmOption: (gsm: number, label: string, description?: string) => void;
  deleteGsmOption: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedGsm?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  addOrderReview: (orderId: string, rating: number, feedback: string, userName?: string) => void;
  deleteOrder: (orderId: string) => void;

  // Applications
  applications: Application[];
  createApplication: (appData: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'documents'> & { documents?: any[]; timeline?: any[] }) => Application;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string, updatedBy?: string) => void;
  addApplicationTimelineEvent: (appId: string, event: { status: ApplicationStatus; title: string; titleBn: string; description: string; descriptionBn: string; updatedBy?: string; notes?: string }) => void;
  assignStaffToApplication: (appId: string, staffId: string, staffName: string) => void;
  addApplicationDocument: (appId: string, doc: { name: string; url: string; type: string; uploadedBy: string }) => void;

  // Staff & Employees
  staff: User[];
  addStaffMember: (member: Omit<User, 'id'>) => User;
  updateStaffMember: (id: string, updates: Partial<User>) => void;
  deleteStaffMember: (id: string) => void;
  toggleBlockStaff: (id: string, reason?: string) => void;

  // Customers Management
  customers: User[];
  addCustomer: (customer: Omit<User, 'id'> | User) => User;
  updateCustomer: (id: string, updates: Partial<User>) => void;
  deleteCustomer: (id: string) => void;
  toggleBlockCustomer: (id: string, reason?: string) => void;

  // POS Sales & Invoices
  posSales: POSSale[];
  recordPOSSale: (sale: Omit<POSSale, 'id' | 'invoiceNumber' | 'createdAt'>) => POSSale;
  invoices: Invoice[];
  createInvoice: (invoice: any) => Invoice;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => Expense;
  deleteExpense: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  logActivity: (action: string, details: string, user?: { id: string; name: string; role: string }) => void;

  // Daily Shop Accounts Ledger & Khata (দৈনিক দোকানের হিসাব খাতা)
  dailyCounterSales: DailyCounterSale[];
  addDailyCounterSale: (sale: Omit<DailyCounterSale, 'id'>) => DailyCounterSale;
  updateDailyCounterSale: (id: string, updates: Partial<DailyCounterSale>) => void;
  deleteDailyCounterSale: (id: string) => void;

  storeExpenses: StoreExpenseRecord[];
  addStoreExpense: (expense: Omit<StoreExpenseRecord, 'id'>) => StoreExpenseRecord;
  updateStoreExpense: (id: string, updates: Partial<StoreExpenseRecord>) => void;
  deleteStoreExpense: (id: string) => void;

  operatorLedgers: OperatorDailyLedger[];
  saveOperatorLedger: (ledger: Omit<OperatorDailyLedger, 'id'>, syncToLedger?: boolean) => OperatorDailyLedger;
  updateOperatorLedger: (id: string, updates: Partial<OperatorDailyLedger>, syncToLedger?: boolean) => void;
  deleteOperatorLedger: (id: string) => void;
  syncOperatorProfitToShopLedger: (operatorLedgerId: string) => void;

  cashReconciliations: DailyCashReconciliation[];
  saveCashReconciliation: (rec: Omit<DailyCashReconciliation, 'id'>) => DailyCashReconciliation;
  deleteCashReconciliation: (id: string) => void;

  ledgerSettings: StoreLedgerSettings;
  updateLedgerSettings: (settings: Partial<StoreLedgerSettings>) => void;
  addCustomCategory: (category: Omit<CustomLedgerCategory, 'id'>) => CustomLedgerCategory;
  deleteCustomCategory: (id: string) => void;

  // Judicial Stamp & Cartridge Paper Register (জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার হিসাব)
  stampConfigs: StampItemConfig[];
  stampSales: StampSaleRecord[];
  stampPurchases: StampStockPurchase[];
  recordStampSale: (saleData: Omit<StampSaleRecord, 'id' | 'createdAt'>, syncToLedger?: boolean) => StampSaleRecord;
  updateStampSale: (id: string, updates: Partial<StampSaleRecord>) => void;
  deleteStampSale: (id: string) => void;
  recordStampPurchase: (purchaseData: Omit<StampStockPurchase, 'id' | 'createdAt'>) => StampStockPurchase;
  deleteStampPurchase: (id: string) => void;
  updateStampConfig: (id: string, updates: Partial<StampItemConfig>) => void;
  addStampConfig: (config: Omit<StampItemConfig, 'id'>) => StampItemConfig;
  deleteStampConfig: (id: string) => void;

  // Reset / Export Data
  resetAllData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states or localStorage
  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('se_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialSettings, ...parsed };
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }
    return initialSettings;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('se_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('se_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((s: Service) => {
            if (!s.image) {
              const initMatch = initialServices.find(initS => initS.id === s.id);
              if (initMatch?.image) {
                return { ...s, image: initMatch.image };
              }
            }
            return s;
          });
        }
      } catch (e) {
        console.error('Failed to parse saved services', e);
      }
    }
    return initialServices;
  });

  const [gsmOptions, setGsmOptions] = useState<GsmOption[]>(() => {
    const saved = localStorage.getItem('se_gsm_options');
    return saved ? JSON.parse(saved) : initialGsmOptions;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('se_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [staff, setStaff] = useState<User[]>(() => {
    const saved = localStorage.getItem('se_staff');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialStaff.length) {
          return parsed;
        }
        // Merge missing staff from initialStaff so operators with photos are always available
        const existingIds = new Set(parsed.map((u: User) => u.id));
        const missing = initialStaff.filter(u => !existingIds.has(u.id));
        return [...parsed, ...missing];
      } catch (e) {
        console.error('Failed to parse staff', e);
      }
    }
    return initialStaff;
  });

  const [customers, setCustomers] = useState<User[]>(() => {
    const saved = localStorage.getItem('se_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('se_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('se_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('se_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [posSales, setPOSSales] = useState<POSSale[]>(() => {
    const saved = localStorage.getItem('se_pos_sales');
    return saved ? JSON.parse(saved) : initialPOSSales;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('se_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('se_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: "notif_1",
        title: "New Admission Application Received",
        titleBn: "নতুন তেজগাঁও কলেজ ভর্তি আবেদন জমা পড়েছে",
        message: "Application APP-2026-0001 submitted by Md. Sakib Al Amin",
        messageBn: "মো: সাকিব আল আমিন তেজগাঁও কলেজ ভর্তির আবেদন করেছেন (APP-2026-0001)",
        type: "application",
        link: "/admin/applications",
        isRead: false,
        createdAt: "2026-08-14T09:00:00Z"
      },
      {
        id: "notif_2",
        title: "New Online Paper Order",
        titleBn: "নতুন পেপার অর্ডার গৃহীত হয়েছে",
        message: "Order SE-2026-00001 placed for A4 Paper 70 GSM",
        messageBn: "ডাবল এ পেপারের জন্য নতুন অর্ডার SE-2026-00001 গৃহীত হয়েছে",
        type: "order",
        link: "/admin/orders",
        isRead: false,
        createdAt: "2026-08-14T10:35:00Z"
      }
    ];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('se_activity_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: "act_1",
        userId: "usr_admin",
        userName: "Saiful Islam",
        userRole: "super_admin",
        action: "System Initialized",
        details: "Saiful Enterprise digital platform configured with full services & shop catalog",
        timestamp: "2026-08-14T08:00:00Z"
      }
    ];
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('se_hero_slides');
    return saved ? JSON.parse(saved) : initialHeroSlides;
  });

  const [seoSettings, setSeoSettings] = useState<Record<string, SectionSEO>>(() => {
    const saved = localStorage.getItem('se_seo_settings');
    return saved ? JSON.parse(saved) : initialSEOSettings;
  });

  // Daily Shop Accounts Ledger States (দৈনিক দোকানের হিসাব খাতা)
  const [dailyCounterSales, setDailyCounterSales] = useState<DailyCounterSale[]>(() => {
    const saved = localStorage.getItem('se_daily_counter_sales');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialDailyCounterSales;
  });

  const [storeExpenses, setStoreExpenses] = useState<StoreExpenseRecord[]>(() => {
    const saved = localStorage.getItem('se_store_expenses');
    return saved ? JSON.parse(saved) : initialStoreExpenses;
  });

  const [operatorLedgers, setOperatorLedgers] = useState<OperatorDailyLedger[]>(() => {
    const saved = localStorage.getItem('se_operator_ledgers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return initialOperatorDailyLedgers;
  });

  const [cashReconciliations, setCashReconciliations] = useState<DailyCashReconciliation[]>(() => {
    const saved = localStorage.getItem('se_cash_reconciliations');
    return saved ? JSON.parse(saved) : initialDailyCashReconciliations;
  });

  const [ledgerSettings, setLedgerSettings] = useState<StoreLedgerSettings>(() => {
    const saved = localStorage.getItem('se_ledger_settings');
    if (saved) {
      try {
        const parsed: StoreLedgerSettings = JSON.parse(saved);
        if (parsed.customCategories) {
          const hasOpCat = parsed.customCategories.some(c => c.id === 'cat_inc_operator_share');
          if (!hasOpCat) {
            parsed.customCategories = [
              { id: 'cat_inc_operator_share', name: 'Operator 60% Owner Share', nameBn: 'কর্মী হিসাব থেকে ৬০% মালিক মুনাফা', type: 'income', color: 'emerald', isCustom: false },
              ...parsed.customCategories
            ];
          }
          return parsed;
        }
      } catch (e) {}
    }
    return initialStoreLedgerSettings;
  });

  // Judicial Stamp & Cartridge States
  const [stampConfigs, setStampConfigs] = useState<StampItemConfig[]>(() => {
    const saved = localStorage.getItem('se_stamp_configs');
    if (saved) {
      try {
        const parsed: StampItemConfig[] = JSON.parse(saved);
        // Retain only valid configs, purging obsolete ones requested to be deleted
        const cleaned = parsed.filter(
          item => !['stamp_200', 'stamp_300', 'stamp_500', 'stamp_writing'].includes(item.id)
        );
        return cleaned.length > 0 ? cleaned : initialStampConfigs;
      } catch (e) {
        return initialStampConfigs;
      }
    }
    return initialStampConfigs;
  });

  const [stampSales, setStampSales] = useState<StampSaleRecord[]>(() => {
    const saved = localStorage.getItem('se_stamp_sales');
    return saved ? JSON.parse(saved) : initialStampSales;
  });

  const [stampPurchases, setStampPurchases] = useState<StampStockPurchase[]>(() => {
    const saved = localStorage.getItem('se_stamp_purchases');
    return saved ? JSON.parse(saved) : initialStampPurchases;
  });

  // Sync to local storage
  useEffect(() => { localStorage.setItem('se_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('se_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('se_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('se_gsm_options', JSON.stringify(gsmOptions)); }, [gsmOptions]);
  useEffect(() => { localStorage.setItem('se_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('se_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('se_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('se_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('se_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('se_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('se_pos_sales', JSON.stringify(posSales)); }, [posSales]);
  useEffect(() => { localStorage.setItem('se_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('se_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('se_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('se_hero_slides', JSON.stringify(heroSlides)); }, [heroSlides]);
  useEffect(() => { localStorage.setItem('se_seo_settings', JSON.stringify(seoSettings)); }, [seoSettings]);
  useEffect(() => { localStorage.setItem('se_daily_counter_sales', JSON.stringify(dailyCounterSales)); }, [dailyCounterSales]);
  useEffect(() => { localStorage.setItem('se_store_expenses', JSON.stringify(storeExpenses)); }, [storeExpenses]);
  useEffect(() => { localStorage.setItem('se_operator_ledgers', JSON.stringify(operatorLedgers)); }, [operatorLedgers]);
  useEffect(() => { localStorage.setItem('se_cash_reconciliations', JSON.stringify(cashReconciliations)); }, [cashReconciliations]);
  useEffect(() => { localStorage.setItem('se_ledger_settings', JSON.stringify(ledgerSettings)); }, [ledgerSettings]);
  useEffect(() => { localStorage.setItem('se_stamp_configs', JSON.stringify(stampConfigs)); }, [stampConfigs]);
  useEffect(() => { localStorage.setItem('se_stamp_sales', JSON.stringify(stampSales)); }, [stampSales]);
  useEffect(() => { localStorage.setItem('se_stamp_purchases', JSON.stringify(stampPurchases)); }, [stampPurchases]);

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Hero Slides Management
  const addHeroSlide = (slideData: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slideData,
      id: `slide_${Date.now()}`
    };
    setHeroSlides(prev => [...prev, newSlide]);
    logActivity('Hero Slide Added', `Added background slide "${newSlide.titleBn || newSlide.titleEn}"`);
    return newSlide;
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('Hero Slide Updated', `Updated slide ID ${id}`);
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
    logActivity('Hero Slide Deleted', `Deleted slide ID ${id}`);
  };

  // SEO Management
  const updateSectionSEO = (sectionKey: string, updates: Partial<SectionSEO>) => {
    setSeoSettings(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || { sectionId: sectionKey, title: '', description: '', keywords: '', ogTitle: '', ogDescription: '', ogImage: '' }),
        ...updates
      }
    }));
    logActivity('SEO Updated', `Updated meta tags & OG preview for section "${sectionKey}"`);
  };

  const resetSectionSEO = (sectionKey?: string) => {
    if (sectionKey && initialSEOSettings[sectionKey]) {
      setSeoSettings(prev => ({
        ...prev,
        [sectionKey]: initialSEOSettings[sectionKey]
      }));
    } else {
      setSeoSettings(initialSEOSettings);
    }
  };


  // Service CRUD
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: `srv_${Date.now()}`
    };
    setServices(prev => [newService, ...prev]);
    logActivity('Service Created', `Created service "${newService.name}"`);
    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('Service Updated', `Updated service ID ${id}`);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    logActivity('Service Deleted', `Deleted service ID ${id}`);
  };

  const addCategory = (catData: Omit<ServiceCategory, 'id'>) => {
    const newCat: ServiceCategory = {
      ...catData,
      id: `cat_${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    logActivity('Category Created', `Created category "${newCat.name}"`);
  };

  const updateCategory = (id: string, updates: Partial<ServiceCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    logActivity('Product Added', `Added product "${newProd.name}" (${newProd.sku})`);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('Product Updated', `Updated product ID ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    logActivity('Product Deleted', `Deleted product ID ${id}`);
  };

  const addGsmOption = (gsm: number, label: string, description?: string) => {
    const newGsm: GsmOption = {
      id: `gsm_${gsm}_${Date.now()}`,
      gsm,
      label,
      description
    };
    setGsmOptions(prev => [...prev.filter(g => g.gsm !== gsm), newGsm].sort((a, b) => a.gsm - b.gsm));
  };

  const deleteGsmOption = (id: string) => {
    setGsmOptions(prev => prev.filter(g => g.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedGsm?: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedGsm === selectedGsm);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedGsm: selectedGsm || product.gsm }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.discountPrice || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const orderNumber = `SE-${new Date().getFullYear()}-${String(orders.length + 1).padStart(5, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Add notification
    addNotification({
      title: "New Online Customer Order",
      titleBn: "নতুন অনলাইন অর্ডার এসেছে",
      message: `Order #${orderNumber} by ${newOrder.customerName} (৳${newOrder.total})`,
      messageBn: `অর্ডার #${orderNumber} - গ্রাহক ${newOrder.customerName} (৳${newOrder.total})`,
      type: "order",
      link: "/admin/orders"
    });

    logActivity('Order Placed', `Order #${orderNumber} created for ৳${newOrder.total}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          ...(paymentStatus ? { paymentStatus } : {}),
          updatedAt: new Date().toISOString()
        };
      }
      return ord;
    }));
    logActivity('Order Status Updated', `Order ${orderId} marked as ${status}`);
  };

  const addOrderReview = (orderId: string, rating: number, feedback: string, userName?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          review: {
            rating: Math.max(1, Math.min(5, rating)),
            feedback: feedback.trim(),
            createdAt: new Date().toISOString(),
            userName: userName || ord.customerName || 'Verified Customer'
          },
          updatedAt: new Date().toISOString()
        };
      }
      return ord;
    }));
    logActivity('Order Reviewed', `Order ${orderId} received a ${rating}-star review with feedback`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Applications
  const createApplication = (appData: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'documents'> & { documents?: any[]; timeline?: any[] }) => {
    const applicationNumber = `APP-${new Date().getFullYear()}-${String(applications.length + 1).padStart(4, '0')}`;
    const initialTimeline = appData.timeline || [
      {
        id: `tl_${Date.now()}`,
        status: 'new',
        title: 'Application Received',
        titleBn: 'আবেদন নথিভুক্ত হয়েছে',
        description: `Application for ${appData.serviceName} received at digital desk.`,
        descriptionBn: `${appData.serviceNameBn || appData.serviceName} সেবার জন্য আবেদন জমা হয়েছে।`,
        updatedBy: 'System Online Desk',
        timestamp: new Date().toISOString()
      }
    ];

    const newApp: Application = {
      ...appData,
      id: `app_${Date.now()}`,
      applicationNumber,
      timeline: initialTimeline,
      documents: appData.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);

    addNotification({
      title: "New Application Submitted",
      titleBn: "নতুন অনলাইন আবেদন জমা হয়েছে",
      message: `${newApp.serviceName} submitted by ${newApp.applicantName} (#${applicationNumber})`,
      messageBn: `${newApp.serviceNameBn} - আবেদনকারী: ${newApp.applicantName} (#${applicationNumber})`,
      type: "application",
      link: "/admin/applications"
    });

    logActivity('Application Created', `Application #${applicationNumber} submitted for ${newApp.serviceName}`);
    return newApp;
  };

  const addApplicationTimelineEvent = (
    appId: string,
    event: { status: ApplicationStatus; title: string; titleBn: string; description: string; descriptionBn: string; updatedBy?: string; notes?: string }
  ) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newEvent = {
          id: `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          status: event.status,
          title: event.title,
          titleBn: event.titleBn,
          description: event.description,
          descriptionBn: event.descriptionBn,
          updatedBy: event.updatedBy || 'Staff Operator',
          timestamp: new Date().toISOString(),
          notes: event.notes
        };
        const currentTimeline = app.timeline || [];
        return {
          ...app,
          status: event.status,
          timeline: [...currentTimeline, newEvent],
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, notes?: string, updatedBy?: string) => {
    const titlesMap: Record<ApplicationStatus, { en: string; bn: string; descEn: string; descBn: string }> = {
      new: {
        en: 'Application Received & Queued',
        bn: 'আবেদন নথিভুক্ত ও কিউতে সংরক্ষিত',
        descEn: 'Application details recorded.',
        descBn: 'আবেদনের প্রাথমিক তথ্য নথিভুক্ত করা হয়েছে।'
      },
      processing: {
        en: 'In Processing & Document Verification',
        bn: 'যাচাই ও প্রক্রিয়াকরণ চলছে',
        descEn: 'Operator is verifying details and preparing portal submission.',
        descBn: 'অপারেটর কর্তৃক তথ্য ও ডকুমেন্ট যাচাই করে সাবমিশনের জন্য প্রস্তুত করা হচ্ছে।'
      },
      submitted: {
        en: 'Form Submitted to Official Portal',
        bn: 'অফিসিয়াল পোর্টালে অনলাইন দাখিল সম্পন্ন',
        descEn: 'Successfully submitted to the government/academic authority server.',
        descBn: 'কর্তৃপক্ষের নির্দিষ্ট সার্ভারে অনলাইন দাখিল সম্পন্ন হয়েছে।'
      },
      completed: {
        en: 'Work Completed & Ready for Delivery',
        bn: 'কাজ সম্পন্ন ও ডেলিভারির জন্য প্রস্তুত',
        descEn: 'Official slip or certificate processed and ready for customer.',
        descBn: 'কাঙ্ক্ষিত সনদ বা কনফার্মেশন স্লিপ তৈরি সম্পন্ন হয়েছে এবং ডাউনলোডের জন্য উন্মুক্ত।'
      },
      delivered: {
        en: 'Handed Over / Delivered to Applicant',
        bn: 'গ্রাহককে ডেলিভারি ও হস্তান্তর সম্পন্ন',
        descEn: 'Printed document/slip collected by or sent to customer.',
        descBn: 'গ্রাহকের নিকট প্রিন্টেড কপি বা অনলাইন ফাইল হস্তান্তর করা হয়েছে।'
      },
      cancelled: {
        en: 'Application Cancelled / Rejected',
        bn: 'আবেদন বাতিল বা তথ্য অমিল',
        descEn: 'Application could not be processed due to incomplete data or client request.',
        descBn: 'অসম্পূর্ণ তথ্য বা ফি সংক্রান্ত কারণে আবেদনটি স্থগিত বা বাতিল করা হয়েছে।'
      }
    };

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const info = titlesMap[status] || titlesMap.processing;
        const newEvent = {
          id: `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          status,
          title: info.en,
          titleBn: info.bn,
          description: notes || info.descEn,
          descriptionBn: notes || info.descBn,
          updatedBy: updatedBy || app.assignedStaffName || 'Staff Operator',
          timestamp: new Date().toISOString(),
          notes
        };
        const currentTimeline = app.timeline || [];

        return {
          ...app,
          status,
          timeline: [...currentTimeline, newEvent],
          ...(notes ? { notes } : {}),
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
    logActivity('Application Status Changed', `Application ${appId} changed to ${status}`);
  };

  const assignStaffToApplication = (appId: string, staffId: string, staffName: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          status: app.status === 'new' ? 'processing' : app.status,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
    logActivity('Application Assigned', `Application ${appId} assigned to ${staffName}`);
  };

  const addApplicationDocument = (appId: string, doc: { name: string; url: string; type: string; uploadedBy: string }) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newDoc = {
          id: `doc_${Date.now()}`,
          ...doc,
          uploadedAt: new Date().toISOString()
        };
        return {
          ...app,
          documents: [...app.documents, newDoc],
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  // Staff CRUD
  const addStaffMember = (memberData: Omit<User, 'id'>) => {
    const employeeId = memberData.employeeId || `SE-EMP-${String(staff.length + 1).padStart(3, '0')}`;
    const newMember: User = {
      ...memberData,
      id: `usr_${Date.now()}`,
      employeeId
    };
    setStaff(prev => [...prev, newMember]);
    logActivity('Staff Added', `New employee registered: ${newMember.name} (${newMember.employeeId})`);
    return newMember;
  };

  const updateStaffMember = (id: string, updates: Partial<User>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('Staff Profile Updated', `Updated staff member ID ${id}`);
  };

  const deleteStaffMember = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    logActivity('Staff Removed', `Removed staff member ID ${id}`);
  };

  const toggleBlockStaff = (id: string, reason?: string) => {
    setStaff(prev => prev.map(s => {
      if (s.id === id) {
        const nextBlocked = !s.isBlocked;
        logActivity(
          nextBlocked ? 'Staff Blocked' : 'Staff Unblocked',
          `Staff member ${s.name} (${s.employeeId}) ${nextBlocked ? 'blocked' : 'unblocked'}. ${reason ? `Reason: ${reason}` : ''}`
        );
        return {
          ...s,
          isBlocked: nextBlocked,
          blockReason: nextBlocked ? (reason || 'Blocked by Super Admin') : undefined
        };
      }
      return s;
    }));
  };

  // Customers Management CRUD
  const addCustomer = (customerData: Omit<User, 'id'> | User): User => {
    const newCustomer: User = {
      ...customerData,
      id: (customerData as User).id || `usr_cust_${Date.now()}`,
      role: 'customer',
      isActive: true,
      isBlocked: (customerData as User).isBlocked ?? false,
      registeredAt: (customerData as User).registeredAt || new Date().toISOString()
    };
    setCustomers(prev => {
      // Avoid duplicate by phone or email
      const existingIdx = prev.findIndex(c => (c.phone && c.phone === newCustomer.phone) || (c.email && c.email === newCustomer.email));
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newCustomer };
        return updated;
      }
      return [newCustomer, ...prev];
    });
    logActivity('Customer Registered', `New customer profile created: ${newCustomer.name} (${newCustomer.phone})`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<User>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logActivity('Customer Profile Updated', `Updated customer ID ${id}`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    logActivity('Customer Deleted', `Deleted customer ID ${id}`);
  };

  const toggleBlockCustomer = (id: string, reason?: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextBlocked = !c.isBlocked;
        logActivity(
          nextBlocked ? 'Customer Suspended' : 'Customer Reactivated',
          `Customer ${c.name} (${c.phone}) ${nextBlocked ? 'suspended' : 'reactivated'}. ${reason ? `Reason: ${reason}` : ''}`
        );
        return {
          ...c,
          isBlocked: nextBlocked,
          blockReason: nextBlocked ? (reason || 'Account suspended by Administrator') : undefined
        };
      }
      return c;
    }));
  };

  // POS Sales
  const recordPOSSale = (saleData: Omit<POSSale, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(posSales.length + 1).padStart(4, '0')}`;
    const newSale: POSSale = {
      ...saleData,
      id: `pos_${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString()
    };
    setPOSSales(prev => [newSale, ...prev]);

    // Deduct stock for physical products
    saleData.items.forEach(item => {
      if (item.type === 'product' && item.itemId) {
        setProducts(currProds => currProds.map(p => {
          if (p.id === item.itemId) {
            const updatedStock = Math.max(0, p.stock - item.quantity);
            if (updatedStock <= p.lowStockThreshold) {
              addNotification({
                title: `Low Stock Alert: ${p.name}`,
                titleBn: `কম স্টক সতর্কতা: ${p.nameBn}`,
                message: `Only ${updatedStock} units left in stock.`,
                messageBn: `স্টকে মাত্র ${updatedStock} টি পণ্য বাকি আছে।`,
                type: "inventory",
                link: "/admin/products"
              });
            }
            return { ...p, stock: updatedStock };
          }
          return p;
        }));
      }
    });

    logActivity('POS Sale Completed', `Invoice #${invoiceNumber} for ৳${newSale.total} billed by ${newSale.cashierName}`);
    return newSale;
  };

  const createInvoice = (invData: any): Invoice => {
    const sale = recordPOSSale({
      cashierId: invData.cashierId || 'admin',
      cashierName: invData.cashierName || 'Saiful Enterprise Staff',
      customerName: invData.customerName,
      customerPhone: invData.customerPhone,
      items: (invData.items || []).map((it: any) => ({
        id: it.id || `pos_item_${Date.now()}`,
        name: it.name,
        nameBn: it.nameBn,
        type: it.type || 'custom',
        price: it.unitPrice || it.price || 0,
        quantity: it.quantity || 1
      })),
      subtotal: invData.subtotal || 0,
      discount: invData.discount || 0,
      total: invData.total || 0,
      paidAmount: invData.paidAmount || invData.total || 0,
      changeAmount: Math.max(0, (invData.paidAmount || invData.total || 0) - (invData.total || 0)),
      paymentMethod: invData.paymentMethod || 'cash_counter'
    });

    const invoice: Invoice = {
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      customerName: sale.customerName || 'Walk-in Customer',
      customerPhone: sale.customerPhone,
      items: invData.items || [],
      subtotal: sale.subtotal,
      discount: sale.discount,
      tax: invData.tax || 0,
      total: sale.total,
      paidAmount: sale.paidAmount,
      dueAmount: invData.dueAmount || 0,
      paymentMethod: sale.paymentMethod,
      paymentStatus: invData.paymentStatus || 'paid',
      cashierId: sale.cashierId,
      cashierName: sale.cashierName,
      notes: invData.notes,
      createdAt: sale.createdAt
    };
    return invoice;
  };

  const invoices: Invoice[] = posSales.map(s => ({
    id: s.id,
    invoiceNumber: s.invoiceNumber,
    customerName: s.customerName || 'Walk-in Customer',
    customerPhone: s.customerPhone,
    items: s.items.map(i => ({
      id: i.id,
      name: i.name,
      nameBn: i.nameBn,
      quantity: i.quantity,
      unitPrice: i.price,
      total: i.price * i.quantity
    })),
    subtotal: s.subtotal,
    discount: s.discount,
    tax: 0,
    total: s.total,
    paidAmount: s.paidAmount,
    dueAmount: Math.max(0, s.total - s.paidAmount),
    paymentMethod: s.paymentMethod,
    paymentStatus: s.paidAmount >= s.total ? 'paid' : 'partial',
    cashierId: s.cashierId,
    cashierName: s.cashierName,
    createdAt: s.createdAt
  }));

  // Expenses
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
    logActivity('Expense Logged', `Logged expense ৳${newExpense.amount} for "${newExpense.title}"`);
    return newExpense;
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Notifications
  const addNotification = (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Activity Log
  const logActivity = (action: string, details: string, user?: { id: string; name: string; role: string }) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      userId: user?.id || "usr_current",
      userName: user?.name || "Saiful Islam",
      userRole: user?.role || "super_admin",
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  // Daily Counter Sales / Income (দৈনিক নগদ জমার হিসাব)
  const addDailyCounterSale = (saleData: Omit<DailyCounterSale, 'id'>) => {
    const newSale: DailyCounterSale = {
      ...saleData,
      id: `dcs_${Date.now()}`
    };
    setDailyCounterSales(prev => [newSale, ...prev]);
    logActivity('Daily Income Logged', `Logged ৳${newSale.amount} for "${newSale.title}" via ${newSale.paymentMethod}`);
    return newSale;
  };

  const updateDailyCounterSale = (id: string, updates: Partial<DailyCounterSale>) => {
    setDailyCounterSales(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('Daily Income Updated', `Updated daily sale record ${id}`);
  };

  const deleteDailyCounterSale = (id: string) => {
    setDailyCounterSales(prev => prev.filter(s => s.id !== id));
    logActivity('Daily Income Deleted', `Deleted daily sale record ${id}`);
  };

  // Store Operational Expenses (দোকানের খরচ ও ভাউচার)
  const addStoreExpense = (expenseData: Omit<StoreExpenseRecord, 'id'>) => {
    const newExpense: StoreExpenseRecord = {
      ...expenseData,
      id: `ser_${Date.now()}`
    };
    setStoreExpenses(prev => [newExpense, ...prev]);
    logActivity('Store Expense Logged', `Logged expense ৳${newExpense.amount} for "${newExpense.title}"`);
    return newExpense;
  };

  const updateStoreExpense = (id: string, updates: Partial<StoreExpenseRecord>) => {
    setStoreExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    logActivity('Store Expense Updated', `Updated store expense record ${id}`);
  };

  const deleteStoreExpense = (id: string) => {
    setStoreExpenses(prev => prev.filter(e => e.id !== id));
    logActivity('Store Expense Deleted', `Deleted store expense record ${id}`);
  };

  // Helper to sync or update owner's 60% profit to daily counter sales (দোকানের দৈনিক হিসাব খাতায় ৬০% মুনাফা যুক্তকরণ)
  const syncOwnerShareToDailySales = (
    ledger: OperatorDailyLedger,
    ownerAmount: number,
    existingSaleId?: string
  ): string => {
    const shiftLabel = ledger.shift === 'morning' ? 'সকাল' : ledger.shift === 'evening' ? 'বিকাল' : ledger.shift === 'night' ? 'রাত' : 'পূর্ণ দিবস';
    const title = `মালিকের ৬০% অংশ (${ledger.operatorName} - ${shiftLabel})`;
    const notes = `মোট কাজ: ৳${ledger.grossServiceSales}, খরচ: ৳${ledger.operatorExpenses || 0}, নিট: ৳${ledger.netServiceIncome || (ledger.grossServiceSales - (ledger.operatorExpenses || 0))} (মালিক ৬০%: ৳${ownerAmount}, কর্মী ৪০%: ৳${ledger.workerShareAmount || 0}) • ক্যাশে জমা: ৳${ledger.cashDepositedToOwner ?? 0}`;

    let resolvedSaleId = existingSaleId;

    setDailyCounterSales(prev => {
      const idx = prev.findIndex(s => 
        (resolvedSaleId && s.id === resolvedSaleId) ||
        (s.category === 'cat_inc_operator_share' && s.date === ledger.date && s.operatorId === ledger.operatorId)
      );

      if (idx >= 0) {
        resolvedSaleId = prev[idx].id;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          amount: ownerAmount,
          title,
          notes,
          paymentMethod: 'cash'
        };
        return updated;
      } else {
        const newSaleId = `dcs_op_${Date.now()}`;
        resolvedSaleId = newSaleId;
        const newSale: DailyCounterSale = {
          id: newSaleId,
          voucherNo: `VCH-${new Date(ledger.date).getFullYear() || 2026}-${String(Math.floor(Math.random() * 9000 + 1000))}`,
          date: ledger.date,
          title,
          category: 'cat_inc_operator_share',
          amount: ownerAmount,
          paymentMethod: 'cash',
          operatorId: ledger.operatorId,
          operatorName: ledger.operatorName,
          notes,
          createdAt: new Date().toISOString()
        };
        return [newSale, ...prev];
      }
    });

    return resolvedSaleId || `dcs_op_${Date.now()}`;
  };

  // Operator Shift Daily Ledgers (অপারেটর শিফট ও ৬০/৪০ কমিশন লেজার)
  const saveOperatorLedger = (ledgerData: Omit<OperatorDailyLedger, 'id'>, syncToLedger = true) => {
    const gross = Number(ledgerData.grossServiceSales || 0);
    const exp = Number(ledgerData.operatorExpenses || 0);
    const net = Math.max(0, gross - exp);
    const ownerPct = ledgerData.ownerSharePercentage ?? (ledgerSettings.defaultDeductionPercentage || 60);
    const workerPct = ledgerData.workerSharePercentage ?? (100 - ownerPct);
    const ownerAmount = Math.round((net * ownerPct) / 100);
    const workerAmount = Math.max(0, net - ownerAmount);
    const cashDeposited = Number(ledgerData.cashDepositedToOwner ?? gross);

    let linkedSaleId = ledgerData.shopLedgerSaleId;
    const shouldSync = syncToLedger && (ledgerData.syncedToShopLedger !== false);

    const newLedger: OperatorDailyLedger = {
      ...ledgerData,
      id: `odl_${Date.now()}`,
      grossServiceSales: gross,
      operatorExpenses: exp,
      netServiceIncome: net,
      ownerSharePercentage: ownerPct,
      ownerShareAmount: ownerAmount,
      workerSharePercentage: workerPct,
      workerShareAmount: workerAmount,
      cashDepositedToOwner: cashDeposited,
      deductionPercentage: ownerPct,
      deductionAmount: ownerAmount,
      netAfterDeduction: workerAmount,
      syncedToShopLedger: shouldSync,
      createdAt: ledgerData.createdAt || new Date().toISOString()
    };

    if (shouldSync) {
      linkedSaleId = syncOwnerShareToDailySales(newLedger, ownerAmount, linkedSaleId);
      newLedger.shopLedgerSaleId = linkedSaleId;
    }

    setOperatorLedgers(prev => {
      const existingIdx = prev.findIndex(l => l.date === newLedger.date && l.operatorId === newLedger.operatorId && l.shift === newLedger.shift);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newLedger;
        return updated;
      }
      return [newLedger, ...prev];
    });

    logActivity('Operator Ledger Saved', `Recorded 60/40 ledger for ${newLedger.operatorName} (Gross ৳${gross}, Owner 60%: ৳${ownerAmount}, Cash: ৳${cashDeposited})`);
    return newLedger;
  };

  const updateOperatorLedger = (id: string, updates: Partial<OperatorDailyLedger>, syncToLedger = true) => {
    setOperatorLedgers(prev => {
      return prev.map(l => {
        if (l.id !== id) return l;
        const gross = updates.grossServiceSales !== undefined ? Number(updates.grossServiceSales) : l.grossServiceSales;
        const exp = updates.operatorExpenses !== undefined ? Number(updates.operatorExpenses) : (l.operatorExpenses || 0);
        const net = Math.max(0, gross - exp);
        const ownerPct = updates.ownerSharePercentage ?? l.ownerSharePercentage ?? 60;
        const workerPct = updates.workerSharePercentage ?? l.workerSharePercentage ?? (100 - ownerPct);
        const ownerAmount = Math.round((net * ownerPct) / 100);
        const workerAmount = Math.max(0, net - ownerAmount);
        const cashDeposited = updates.cashDepositedToOwner !== undefined ? Number(updates.cashDepositedToOwner) : (l.cashDepositedToOwner ?? gross);

        const merged: OperatorDailyLedger = {
          ...l,
          ...updates,
          grossServiceSales: gross,
          operatorExpenses: exp,
          netServiceIncome: net,
          ownerSharePercentage: ownerPct,
          ownerShareAmount: ownerAmount,
          workerSharePercentage: workerPct,
          workerShareAmount: workerAmount,
          cashDepositedToOwner: cashDeposited,
          deductionPercentage: ownerPct,
          deductionAmount: ownerAmount,
          netAfterDeduction: workerAmount
        };

        if (syncToLedger && merged.syncedToShopLedger !== false) {
          const linkedSaleId = syncOwnerShareToDailySales(merged, ownerAmount, merged.shopLedgerSaleId);
          merged.shopLedgerSaleId = linkedSaleId;
          merged.syncedToShopLedger = true;
        }

        return merged;
      });
    });
    logActivity('Operator Ledger Updated', `Updated shift ledger ${id}`);
  };

  const deleteOperatorLedger = (id: string) => {
    setOperatorLedgers(prev => {
      const target = prev.find(l => l.id === id);
      if (target?.shopLedgerSaleId) {
        // Remove linked sale from daily counter sales as well
        setDailyCounterSales(sPrev => sPrev.filter(s => s.id !== target.shopLedgerSaleId));
      }
      return prev.filter(l => l.id !== id);
    });
    logActivity('Operator Ledger Deleted', `Deleted operator shift ledger record ${id}`);
  };

  const syncOperatorProfitToShopLedger = (operatorLedgerId: string) => {
    setOperatorLedgers(prev => {
      return prev.map(l => {
        if (l.id !== operatorLedgerId) return l;
        const ownerAmount = l.ownerShareAmount || Math.round(((l.grossServiceSales - (l.operatorExpenses || 0)) * (l.ownerSharePercentage || 60)) / 100);
        const saleId = syncOwnerShareToDailySales(l, ownerAmount, l.shopLedgerSaleId);
        return {
          ...l,
          syncedToShopLedger: true,
          shopLedgerSaleId: saleId
        };
      });
    });
    logActivity('Operator Share Synced to Ledger', `Manually synced 60% profit of operator ledger ${operatorLedgerId} to daily shop accounts`);
  };

  // Daily Cash Reconciliations (ক্যাশ ড্রয়ার হিসাব মিলকরণ)
  const saveCashReconciliation = (recData: Omit<DailyCashReconciliation, 'id'>) => {
    const newRec: DailyCashReconciliation = {
      ...recData,
      id: `dcr_${Date.now()}`
    };
    setCashReconciliations(prev => {
      const filtered = prev.filter(r => r.date !== newRec.date);
      return [newRec, ...filtered];
    });
    logActivity('Cash Drawer Reconciled', `Reconciled cash for ${newRec.date} with status ${newRec.status}`);
    return newRec;
  };

  const deleteCashReconciliation = (id: string) => {
    setCashReconciliations(prev => prev.filter(r => r.id !== id));
  };

  // Ledger Customization Settings (হিসাব খাতা কাস্টমাইজেশন)
  const updateLedgerSettings = (newSettings: Partial<StoreLedgerSettings>) => {
    setLedgerSettings(prev => ({ ...prev, ...newSettings }));
    logActivity('Ledger Settings Updated', 'Updated Daily Shop Accounts Ledger settings and parameters');
  };

  const addCustomCategory = (categoryData: Omit<CustomLedgerCategory, 'id'>) => {
    const newCat: CustomLedgerCategory = {
      ...categoryData,
      id: `cat_custom_${Date.now()}`,
      isCustom: true
    };
    setLedgerSettings(prev => ({
      ...prev,
      customCategories: [...prev.customCategories, newCat]
    }));
    logActivity('Custom Ledger Category Added', `Added ${newCat.type} category "${newCat.nameBn || newCat.name}"`);
    return newCat;
  };

  const deleteCustomCategory = (id: string) => {
    setLedgerSettings(prev => ({
      ...prev,
      customCategories: prev.customCategories.filter(c => c.id !== id)
    }));
    logActivity('Custom Ledger Category Deleted', `Deleted category ${id}`);
  };

  // Judicial Stamp & Cartridge Paper Actions (জুডিশিয়াল স্ট্যাম্প ও কার্টিজ পেপার অ্যাকশন)
  const recordStampSale = (
    saleData: Omit<StampSaleRecord, 'id' | 'createdAt'>,
    syncToLedger = true
  ) => {
    const qty = Math.max(1, Number(saleData.quantity) || 1);
    const buyPrice = Number(saleData.buyPricePerUnit) || 0;
    const salePrice = Number(saleData.salePricePerUnit) || 0;
    const totalBuyCost = saleData.totalBuyCost !== undefined ? Number(saleData.totalBuyCost) : qty * buyPrice;
    const totalSaleAmount = saleData.totalSaleAmount !== undefined ? Number(saleData.totalSaleAmount) : qty * salePrice;
    const totalProfit = totalSaleAmount - totalBuyCost;

    const newSale: StampSaleRecord = {
      ...saleData,
      quantity: qty,
      buyPricePerUnit: buyPrice,
      salePricePerUnit: salePrice,
      totalBuyCost,
      totalSaleAmount,
      totalProfit,
      id: `st_sale_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };

    setStampSales(prev => [newSale, ...prev]);

    // Update remaining stock (strictly decrement numeric quantity)
    setStampConfigs(prev =>
      prev.map(item => {
        if (item.id === newSale.itemType) {
          const current = Number(item.currentStock) || 0;
          const updatedStock = Math.max(0, current - qty);
          return { ...item, currentStock: updatedStock };
        }
        return item;
      })
    );

    // If synced to main daily shop ledger
    if (syncToLedger && newSale.paymentMethod !== 'due') {
      const ledgerEntry: Omit<DailyCounterSale, 'id'> = {
        date: newSale.date,
        time: newSale.time,
        category: 'stamp',
        title: `${newSale.itemNameBn} (পিস: ${newSale.quantity})`,
        customerName: newSale.customerName,
        customerPhone: newSale.customerPhone,
        paymentMethod: newSale.paymentMethod,
        amount: newSale.totalSaleAmount,
        operatorName: newSale.operatorName || 'Shop Operator',
        notes: `স্ট্যাম্প বিক্রয় | লাভ: ৳${newSale.totalProfit}${newSale.serialNumbers ? ` | ক্রমিক: ${newSale.serialNumbers}` : ''}`
      };
      addDailyCounterSale(ledgerEntry);
    }

    logActivity(
      'Stamp Sold',
      `Sold ${newSale.quantity} pcs ${newSale.itemNameBn} for ৳${newSale.totalSaleAmount} (Profit: ৳${newSale.totalProfit})`
    );

    return newSale;
  };

  const updateStampSale = (id: string, updates: Partial<StampSaleRecord>) => {
    const existing = stampSales.find(s => s.id === id);

    // Adjust stock in stampConfigs if quantity or itemType changes
    if (existing) {
      const oldItemType = existing.itemType;
      const oldQty = Number(existing.quantity) || 0;
      const newItemType = updates.itemType ?? oldItemType;
      const newQty = updates.quantity !== undefined ? (Number(updates.quantity) || 0) : oldQty;

      setStampConfigs(prev =>
        prev.map(item => {
          let stock = Number(item.currentStock) || 0;
          if (item.id === oldItemType) {
            stock += oldQty;
          }
          if (item.id === newItemType) {
            stock = Math.max(0, stock - newQty);
          }
          return { ...item, currentStock: stock };
        })
      );
    }

    setStampSales(prev =>
      prev.map(sale => {
        if (sale.id === id) {
          const updated = { ...sale, ...updates };
          const qty = Math.max(1, Number(updated.quantity) || 1);
          const buyPrice = Number(updated.buyPricePerUnit) || 0;
          const salePrice = Number(updated.salePricePerUnit) || 0;
          updated.quantity = qty;
          updated.buyPricePerUnit = buyPrice;
          updated.salePricePerUnit = salePrice;
          updated.totalBuyCost = qty * buyPrice;
          updated.totalSaleAmount = qty * salePrice;
          updated.totalProfit = updated.totalSaleAmount - updated.totalBuyCost;
          return updated;
        }
        return sale;
      })
    );
    logActivity('Stamp Sale Updated', `Updated stamp sale record ${id}`);
  };

  const deleteStampSale = (id: string) => {
    const saleToDelete = stampSales.find(s => s.id === id);
    if (saleToDelete) {
      // Restore stock
      setStampConfigs(prev =>
        prev.map(item => {
          if (item.id === saleToDelete.itemType) {
            const current = Number(item.currentStock) || 0;
            const qty = Number(saleToDelete.quantity) || 0;
            return { ...item, currentStock: current + qty };
          }
          return item;
        })
      );
    }
    setStampSales(prev => prev.filter(s => s.id !== id));
    logActivity('Stamp Sale Deleted', `Deleted stamp sale record ${id}`);
  };

  const recordStampPurchase = (purchaseData: Omit<StampStockPurchase, 'id' | 'createdAt'>) => {
    const qty = Math.max(1, Number(purchaseData.quantity) || 1);
    const unitPrice = Number(purchaseData.buyPricePerUnit) || 0;
    const totalCost = purchaseData.totalCost !== undefined ? Number(purchaseData.totalCost) : qty * unitPrice;

    const newPurchase: StampStockPurchase = {
      ...purchaseData,
      quantity: qty,
      buyPricePerUnit: unitPrice,
      totalCost,
      id: `st_pur_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };

    setStampPurchases(prev => [newPurchase, ...prev]);

    // Increase stock
    setStampConfigs(prev =>
      prev.map(item => {
        if (item.id === newPurchase.itemType) {
          const current = Number(item.currentStock) || 0;
          return { ...item, currentStock: current + qty };
        }
        return item;
      })
    );

    logActivity(
      'Stamp Stock Purchased',
      `Purchased ${newPurchase.quantity} pcs ${newPurchase.itemNameBn} (Cost: ৳${newPurchase.totalCost})`
    );

    return newPurchase;
  };

  const deleteStampPurchase = (id: string) => {
    const purToDelete = stampPurchases.find(p => p.id === id);
    if (purToDelete) {
      setStampConfigs(prev =>
        prev.map(item => {
          if (item.id === purToDelete.itemType) {
            const current = Number(item.currentStock) || 0;
            const qty = Number(purToDelete.quantity) || 0;
            return {
              ...item,
              currentStock: Math.max(0, current - qty)
            };
          }
          return item;
        })
      );
    }
    setStampPurchases(prev => prev.filter(p => p.id !== id));
    logActivity('Stamp Purchase Deleted', `Deleted stamp stock purchase record ${id}`);
  };

  const updateStampConfig = (id: string, updates: Partial<StampItemConfig>) => {
    setStampConfigs(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (updates.defaultBuyPrice !== undefined) updated.defaultBuyPrice = Number(updates.defaultBuyPrice) || 0;
          if (updates.defaultSalePrice !== undefined) updated.defaultSalePrice = Number(updates.defaultSalePrice) || 0;
          if (updates.currentStock !== undefined) updated.currentStock = Math.max(0, Number(updates.currentStock) || 0);
          return updated;
        }
        return item;
      })
    );
    logActivity('Stamp Config Updated', `Updated settings/pricing for stamp item ${id}`);
  };

  const addStampConfig = (configData: Omit<StampItemConfig, 'id'>) => {
    const newConfig: StampItemConfig = {
      ...configData,
      id: `stamp_custom_${Date.now()}`
    };
    setStampConfigs(prev => [...prev, newConfig]);
    logActivity('Stamp Item Added', `Added stamp/item config "${newConfig.nameBn}"`);
    return newConfig;
  };

  const deleteStampConfig = (id: string) => {
    setStampConfigs(prev => prev.filter(item => item.id !== id));
    logActivity('Stamp Item Deleted', `Deleted stamp config ${id}`);
  };

  // Reset & Backup
  const resetAllData = () => {
    localStorage.removeItem('se_settings');
    localStorage.removeItem('se_categories');
    localStorage.removeItem('se_services');
    localStorage.removeItem('se_gsm_options');
    localStorage.removeItem('se_products');
    localStorage.removeItem('se_staff');
    localStorage.removeItem('se_orders');
    localStorage.removeItem('se_applications');
    localStorage.removeItem('se_expenses');
    localStorage.removeItem('se_pos_sales');
    localStorage.removeItem('se_cart');
    localStorage.removeItem('se_notifications');
    localStorage.removeItem('se_activity_logs');
    localStorage.removeItem('se_daily_counter_sales');
    localStorage.removeItem('se_store_expenses');
    localStorage.removeItem('se_operator_ledgers');
    localStorage.removeItem('se_cash_reconciliations');
    localStorage.removeItem('se_ledger_settings');
    localStorage.removeItem('se_stamp_configs');
    localStorage.removeItem('se_stamp_sales');
    localStorage.removeItem('se_stamp_purchases');

    setSettings(initialSettings);
    setCategories(initialCategories);
    setServices(initialServices);
    setGsmOptions(initialGsmOptions);
    setProducts(initialProducts);
    setStaff(initialStaff);
    setOrders(initialOrders);
    setApplications(initialApplications);
    setExpenses(initialExpenses);
    setPOSSales(initialPOSSales);
    setCart([]);
    setDailyCounterSales(initialDailyCounterSales);
    setStoreExpenses(initialStoreExpenses);
    setOperatorLedgers(initialOperatorDailyLedgers);
    setCashReconciliations(initialDailyCashReconciliations);
    setLedgerSettings(initialStoreLedgerSettings);
    setStampConfigs(initialStampConfigs);
    setStampSales(initialStampSales);
    setStampPurchases(initialStampPurchases);
  };

  const exportDatabaseJSON = () => {
    const payload = {
      system: 'Saiful Enterprise - Computer, Online & Paper Store',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      exportedBy: 'Admin',
      statistics: {
        servicesCount: services.length,
        productsCount: products.length,
        applicationsCount: applications.length,
        ordersCount: orders.length,
        customersCount: customers.length,
        staffCount: staff.length,
        posSalesCount: posSales.length,
        expensesCount: expenses.length,
        dailySalesCount: dailyCounterSales.length,
        storeExpensesCount: storeExpenses.length,
        stampSalesCount: stampSales.length
      },
      settings,
      categories,
      services,
      gsmOptions,
      products,
      staff,
      customers,
      orders,
      applications,
      expenses,
      posSales,
      activityLogs,
      dailyCounterSales,
      storeExpenses,
      operatorLedgers,
      cashReconciliations,
      ledgerSettings,
      stampConfigs,
      stampSales,
      stampPurchases
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string) => {
    try {
      const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      if (data.settings) {
        setSettings(data.settings);
        localStorage.setItem('se_settings', JSON.stringify(data.settings));
      }
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
        localStorage.setItem('se_categories', JSON.stringify(data.categories));
      }
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
        localStorage.setItem('se_services', JSON.stringify(data.services));
      }
      if (data.gsmOptions && Array.isArray(data.gsmOptions)) {
        setGsmOptions(data.gsmOptions);
        localStorage.setItem('se_gsm_options', JSON.stringify(data.gsmOptions));
      }
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        localStorage.setItem('se_products', JSON.stringify(data.products));
      }
      if (data.staff && Array.isArray(data.staff)) {
        setStaff(data.staff);
        localStorage.setItem('se_staff', JSON.stringify(data.staff));
      }
      if (data.customers && Array.isArray(data.customers)) {
        setCustomers(data.customers);
        localStorage.setItem('se_customers', JSON.stringify(data.customers));
      }
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
        localStorage.setItem('se_orders', JSON.stringify(data.orders));
      }
      if (data.applications && Array.isArray(data.applications)) {
        setApplications(data.applications);
        localStorage.setItem('se_applications', JSON.stringify(data.applications));
      }
      if (data.expenses && Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
        localStorage.setItem('se_expenses', JSON.stringify(data.expenses));
      }
      if (data.posSales && Array.isArray(data.posSales)) {
        setPOSSales(data.posSales);
        localStorage.setItem('se_pos_sales', JSON.stringify(data.posSales));
      }
      if (data.activityLogs && Array.isArray(data.activityLogs)) {
        setActivityLogs(data.activityLogs);
        localStorage.setItem('se_activity_logs', JSON.stringify(data.activityLogs));
      }
      if (data.heroSlides && Array.isArray(data.heroSlides)) {
        setHeroSlides(data.heroSlides);
        localStorage.setItem('se_hero_slides', JSON.stringify(data.heroSlides));
      }
      if (data.seoSettings) {
        setSeoSettings(data.seoSettings);
        localStorage.setItem('se_seo_settings', JSON.stringify(data.seoSettings));
      }
      if (data.dailyCounterSales && Array.isArray(data.dailyCounterSales)) {
        setDailyCounterSales(data.dailyCounterSales);
        localStorage.setItem('se_daily_counter_sales', JSON.stringify(data.dailyCounterSales));
      }
      if (data.storeExpenses && Array.isArray(data.storeExpenses)) {
        setStoreExpenses(data.storeExpenses);
        localStorage.setItem('se_store_expenses', JSON.stringify(data.storeExpenses));
      }
      if (data.operatorLedgers && Array.isArray(data.operatorLedgers)) {
        setOperatorLedgers(data.operatorLedgers);
        localStorage.setItem('se_operator_ledgers', JSON.stringify(data.operatorLedgers));
      }
      if (data.cashReconciliations && Array.isArray(data.cashReconciliations)) {
        setCashReconciliations(data.cashReconciliations);
        localStorage.setItem('se_cash_reconciliations', JSON.stringify(data.cashReconciliations));
      }
      if (data.ledgerSettings) {
        setLedgerSettings(data.ledgerSettings);
        localStorage.setItem('se_ledger_settings', JSON.stringify(data.ledgerSettings));
      }
      if (data.stampConfigs && Array.isArray(data.stampConfigs)) {
        setStampConfigs(data.stampConfigs);
        localStorage.setItem('se_stamp_configs', JSON.stringify(data.stampConfigs));
      }
      if (data.stampSales && Array.isArray(data.stampSales)) {
        setStampSales(data.stampSales);
        localStorage.setItem('se_stamp_sales', JSON.stringify(data.stampSales));
      }
      if (data.stampPurchases && Array.isArray(data.stampPurchases)) {
        setStampPurchases(data.stampPurchases);
        localStorage.setItem('se_stamp_purchases', JSON.stringify(data.stampPurchases));
      }
      return true;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        settings,
        updateSettings,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        seoSettings,
        updateSectionSEO,
        resetSectionSEO,
        services,
        categories,
        addService,
        updateService,
        deleteService,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        gsmOptions,
        addProduct,
        updateProduct,
        deleteProduct,
        addGsmOption,
        deleteGsmOption,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        createOrder,
        updateOrderStatus,
        addOrderReview,
        deleteOrder,
        applications,
        createApplication,
        updateApplicationStatus,
        addApplicationTimelineEvent,
        assignStaffToApplication,
        addApplicationDocument,
        staff,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        toggleBlockStaff,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleBlockCustomer,
        posSales,
        recordPOSSale,
        invoices,
        createInvoice,
        expenses,
        addExpense,
        deleteExpense,
        dailyCounterSales,
        addDailyCounterSale,
        updateDailyCounterSale,
        deleteDailyCounterSale,
        storeExpenses,
        addStoreExpense,
        updateStoreExpense,
        deleteStoreExpense,
        operatorLedgers,
        saveOperatorLedger,
        updateOperatorLedger,
        deleteOperatorLedger,
        syncOperatorProfitToShopLedger,
        cashReconciliations,
        saveCashReconciliation,
        deleteCashReconciliation,
        ledgerSettings,
        updateLedgerSettings,
        addCustomCategory,
        deleteCustomCategory,
        stampConfigs,
        stampSales,
        stampPurchases,
        recordStampSale,
        updateStampSale,
        deleteStampSale,
        recordStampPurchase,
        deleteStampPurchase,
        updateStampConfig,
        addStampConfig,
        deleteStampConfig,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        activityLogs,
        logActivity,
        resetAllData,
        exportDatabaseJSON,
        importDatabaseJSON
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
