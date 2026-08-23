export type Language = 'bn' | 'en';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'accountant' | 'service_operator' | 'customer';

export interface Permission {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  category: 'dashboard' | 'services' | 'products' | 'orders' | 'applications' | 'staff' | 'pos' | 'inventory' | 'expenses' | 'reports' | 'cms' | 'settings';
}

export interface SocialLinks {
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
}

export interface User {
  id: string;
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  employeeId?: string;
  designation?: string;
  designationBn?: string;
  bio?: string;
  bioBn?: string;
  skills?: string[];
  skillsBn?: string[];
  socialLinks?: SocialLinks;
  joiningDate?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  isActive: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  authProvider?: 'phone_otp' | 'google' | 'facebook' | 'email_password' | 'admin_created';
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  registeredAt?: string;
  customerNotes?: string;
  permissions?: string[];
  shift?: string;
  salary?: number;
  performanceScore?: number;
  password?: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
  featured?: boolean;
  order: number;
}

export interface Service {
  id: string;
  categoryId: string;
  subCategory?: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  price: number;
  startingPrice?: boolean;
  estimatedTime: string;
  estimatedTimeBn: string;
  requiredDocuments: string[];
  requiredDocumentsBn: string[];
  instructions?: string;
  instructionsBn?: string;
  iconName?: string;
  image?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isActive: boolean;
  order: number;
}

export interface GsmOption {
  id: string;
  gsm: number;
  label: string;
  description?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  categoryId: string;
  brand: string;
  gsm?: number;
  packSize: string;
  packSizeBn?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockThreshold: number;
  lowStockAlert?: number;
  minOrderQty: number;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isActive: boolean;
  specifications?: Record<string, string>;
}

export type StaffMember = User & {
  shift?: string;
  salary?: number;
  status?: string;
  performanceScore?: number;
};

export interface InvoiceItem {
  id: string;
  name: string;
  nameBn?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax?: number;
  total: number;
  paidAmount: number;
  dueAmount?: number;
  paymentMethod: string;
  paymentStatus: string;
  cashierId: string;
  cashierName: string;
  notes?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedGsm?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'verified' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'bkash' | 'nagad' | 'cod' | 'cash_counter' | 'card';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameBn: string;
  price: number;
  quantity: number;
  gsm?: number;
  total: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryType: 'pickup' | 'delivery';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTrxId?: string;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedStaffId?: string;
}

export type ApplicationStatus = 'new' | 'processing' | 'submitted' | 'completed' | 'delivered' | 'cancelled';

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  updatedBy: string;
  timestamp: string;
  notes?: string;
}

export interface Application {
  id: string;
  applicationNumber: string;
  serviceId: string;
  serviceName: string;
  serviceNameBn: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  applicantNidOrBirthCert?: string;
  category: string;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  paidAmount: number;
  documents: ApplicationDocument[];
  timeline?: ApplicationTimelineEvent[];
  assignedStaffId?: string;
  assignedStaffName?: string;
  deadline?: string;
  estimatedCompletionDate?: string;
  notes?: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface POSCartItem {
  id: string;
  type: 'product' | 'service' | 'custom';
  itemId?: string;
  name: string;
  nameBn?: string;
  price: number;
  quantity: number;
  gsm?: number;
  notes?: string;
}

export interface POSSale {
  id: string;
  invoiceNumber: string;
  cashierId: string;
  cashierName: string;
  customerName?: string;
  customerPhone?: string;
  items: POSCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
  paymentTrxId?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  lastRestocked: string;
}

export interface InventoryLog {
  id: string;
  inventoryId: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  reference?: string;
  notes?: string;
  createdByName: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'rent' | 'electricity' | 'paper_stock' | 'ink_toner' | 'maintenance' | 'salary' | 'snacks' | 'other';
  title: string;
  titleBn: string;
  amount: number;
  date: string;
  description: string;
  addedById: string;
  addedByName: string;
  receiptUrl?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'pdf';
  size: string;
  dimensions?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  published: boolean;
  lastUpdated: string;
}

export interface NavigationMenu {
  id: string;
  label: string;
  labelBn: string;
  url: string;
  isExternal?: boolean;
  isActive: boolean;
  order: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ip?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleBn: string;
  message: string;
  messageBn: string;
  type: 'order' | 'application' | 'inventory' | 'payment' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  type: 'photo' | 'video';
  src: string;
  poster?: string;
  tagEn: string;
  tagBn: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  accentColor?: string;
  order?: number;
}

export interface SectionSEO {
  sectionId: 'home' | 'services' | 'shop' | 'tracker' | 'about' | 'contact';
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType?: string;
  canonicalUrl?: string;
}

export interface WebsiteSettings {
  businessName: string;
  businessNameBn: string;
  tagline: string;
  taglineBn: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  bkashNumber: string;
  nagadNumber: string;
  email: string;
  address: string;
  addressBn: string;
  openingHours: string;
  openingHoursBn: string;
  isShopOpen?: boolean;
  heroIntervalSeconds?: number;
  heroBackgroundOpacity?: number;
  noticeBanner: string;
  noticeBannerBn: string;
  showNoticeBanner: boolean;
  tejgaonCollegeHighlight: string;
  tejgaonCollegeHighlightBn: string;
  facebookUrl: string;
  whatsappUrl: string;
  googleMapUrl: string;
  currencySymbol: string;
  taxRate: number;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  minOrderAmount: number;
  maintenanceMode: boolean;
}

export type StoreExpenseCategory =
  | 'tea_refreshment'  // চা-নাস্তা ও আপ্যায়ন
  | 'paper_supplies'   // পেপার রিম ও স্টেশনারি ক্রয়
  | 'toner_ink'        // টোনার ও প্রিন্টার কালি
  | 'electricity_gen'  // বিদ্যুৎ বিল ও জেনারেটর
  | 'shop_rent'        // দোকান ভাড়া ও সার্ভিস চার্জ
  | 'internet_wifi'    // ইন্টারনেট ও রাউটার বিল
  | 'transport'        // যাতায়াত ও মালামাল পরিবহন
  | 'equipment_repair' // মেশিন সার্ভিসিং ও যন্ত্রাংশ
  | 'salary_advance'   // কর্মচারী অগ্রিম বেতন
  | 'miscellaneous';   // বিবিধ খুচরা খরচ

export interface DailyCounterSale {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: 'photocopy_print' | 'online_admission' | 'studio_photo' | 'stationery_retail' | 'computer_service' | 'lamination_binding' | 'other_counter';
  title: string;
  customerName?: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'card';
  amount: number;
  operatorId?: string;
  operatorName?: string;
  counterNo?: string;
  notes?: string;
}

export interface StoreExpenseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: StoreExpenseCategory;
  title: string;
  amount: number;
  voucherNo?: string;
  paidBy?: string;
  note?: string;
}

export interface OperatorDailyLedger {
  id: string;
  date: string; // YYYY-MM-DD
  operatorId: string;
  operatorName: string;
  operatorPhone?: string;
  counterNo: string;
  shift: 'morning' | 'evening' | 'full_day';
  grossServiceSales: number; // সারাদিনের মোট সেবা ইনকাম
  counterCashInHand: number; // ক্যাশ ড্রয়ারে ক্যাশ
  digitalCollection: number; // বিকাশ/নগদে আদায়
  deductionPercentage: number; // default 60% (সেটিংস অনুযায়ী অ্যাডজাস্টেবল)
  deductionAmount: number; // 60% বাদ দিলে কত হয়
  netAfterDeduction: number; // মোট থেকে 60% বাদ দিলে অবশিষ্ট বা শেয়ার
  pagesPrintedCount?: number;
  paperReamsUsed?: number;
  status: 'settled' | 'pending' | 'verified';
  verifiedBy?: string;
  notes?: string;
}

export interface StoreLedgerSettings {
  defaultDeductionPercentage: number; // 60
  shopShareLabel: string;
  operatorShareLabel: string;
  enableVoucherNumbering: boolean;
}

