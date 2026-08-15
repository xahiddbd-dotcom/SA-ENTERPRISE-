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
  Invoice
} from '../types';
import {
  initialCategories,
  initialServices,
  initialGsmOptions,
  initialProducts,
  initialStaff,
  initialOrders,
  initialApplications,
  initialExpenses,
  initialPOSSales,
  initialSettings
} from '../data/initialData';

interface DataContextType {
  // Website Settings
  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;

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
  deleteOrder: (orderId: string) => void;

  // Applications
  applications: Application[];
  createApplication: (appData: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'documents'> & { documents?: any[] }) => Application;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
  assignStaffToApplication: (appId: string, staffId: string, staffName: string) => void;
  addApplicationDocument: (appId: string, doc: { name: string; url: string; type: string; uploadedBy: string }) => void;

  // Staff & Employees
  staff: User[];
  addStaffMember: (member: Omit<User, 'id'>) => User;
  updateStaffMember: (id: string, updates: Partial<User>) => void;
  deleteStaffMember: (id: string) => void;

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
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    const saved = localStorage.getItem('se_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('se_services');
    return saved ? JSON.parse(saved) : initialServices;
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
    return saved ? JSON.parse(saved) : initialStaff;
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

  // Sync to local storage
  useEffect(() => { localStorage.setItem('se_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('se_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('se_services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('se_gsm_options', JSON.stringify(gsmOptions)); }, [gsmOptions]);
  useEffect(() => { localStorage.setItem('se_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('se_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('se_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('se_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('se_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('se_pos_sales', JSON.stringify(posSales)); }, [posSales]);
  useEffect(() => { localStorage.setItem('se_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('se_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('se_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Applications
  const createApplication = (appData: Omit<Application, 'id' | 'applicationNumber' | 'createdAt' | 'updatedAt' | 'documents'> & { documents?: any[] }) => {
    const applicationNumber = `APP-${new Date().getFullYear()}-${String(applications.length + 1).padStart(4, '0')}`;
    const newApp: Application = {
      ...appData,
      id: `app_${Date.now()}`,
      applicationNumber,
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

  const updateApplicationStatus = (appId: string, status: ApplicationStatus, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status,
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
  };

  const exportDatabaseJSON = () => {
    const payload = {
      system: 'Saiful Enterprise - Computer, Online & Paper Store',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      exportedBy: 'Admin',
      statistics: {
        servicesCount: services.length,
        productsCount: products.length,
        applicationsCount: applications.length,
        ordersCount: orders.length,
        staffCount: staff.length,
        posSalesCount: posSales.length,
        expensesCount: expenses.length
      },
      settings,
      categories,
      services,
      gsmOptions,
      products,
      staff,
      orders,
      applications,
      expenses,
      posSales,
      activityLogs
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
        deleteOrder,
        applications,
        createApplication,
        updateApplicationStatus,
        assignStaffToApplication,
        addApplicationDocument,
        staff,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,
        posSales,
        recordPOSSale,
        invoices,
        createInvoice,
        expenses,
        addExpense,
        deleteExpense,
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
