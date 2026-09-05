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

export interface OrderReview {
  rating: number; // 1 to 5 stars
  feedback: string;
  createdAt: string;
  userName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerId?: string;
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
  review?: OrderReview;
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

export type BackgroundPatternType = 'none' | 'dots' | 'grid' | 'circuit' | 'diagonal_stripes' | 'hexagons' | 'paper_grain' | 'mesh_glow';
export type BackgroundWallpaperPreset = 'none' | 'cyber_workspace' | 'printing_press' | 'digital_matrix' | 'dark_modern_geometric' | 'tech_glow' | 'custom';
export type BackgroundOverlayTint = 'dark' | 'emerald' | 'navy' | 'slate' | 'pure_black';

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

  // Background Texture & Wallpaper Settings
  backgroundType?: 'default' | 'texture' | 'wallpaper' | 'combo';
  texturePattern?: BackgroundPatternType;
  textureOpacity?: number; // 0 to 100
  wallpaperPreset?: BackgroundWallpaperPreset;
  customWallpaperUrl?: string;
  wallpaperOpacity?: number; // 0 to 100
  wallpaperBlur?: number; // 0 to 20 px
  wallpaperFixed?: boolean;
  backgroundOverlayTint?: BackgroundOverlayTint;
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
  | 'miscellaneous'    // বিবিধ খুচরা খরচ
  | string;            // কাস্টম ইউজার তৈরি করা ক্যাটাগরি

export interface CustomLedgerCategory {
  id: string;
  name: string;
  nameBn: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  isCustom?: boolean;
}

export interface DailyCounterSale {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: string;
  title: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'card' | 'bank' | 'due';
  amount: number;
  operatorId?: string;
  operatorName?: string;
  counterNo?: string;
  voucherNo?: string;
  notes?: string;
  createdAt?: string;
}

export interface StoreExpenseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  category: string;
  title: string;
  amount: number;
  paymentMethod?: 'cash' | 'bkash' | 'nagad' | 'bank';
  voucherNo?: string;
  paidBy?: string;
  paidTo?: string;
  note?: string;
  notes?: string;
  createdAt?: string;
}

export interface OperatorDailyLedger {
  id: string;
  date: string; // YYYY-MM-DD
  operatorId: string;
  operatorName: string;
  operatorAvatar?: string;
  operatorDesignation?: string;
  operatorPhone?: string;
  counterNo: string;
  shift: 'morning' | 'evening' | 'full_day' | 'night';
  grossServiceSales: number; // সারাদিনের মোট সেবা ইনকাম / কাজ (Gross Sales)
  operatorExpenses?: number; // কর্মীর কাজের খরচ বা ব্যয় (যেমন পেপার, কালি, নাস্তা ইত্যাদি)
  netServiceIncome?: number; // খরচ বাদ দিয়ে নিট সেবা আয়
  ownerSharePercentage?: number; // ডিফল্ট ৬০% মালিকের অংশ
  ownerShareAmount?: number; // মালিকের ৬০% মুনাফার পরিমাণ
  workerSharePercentage?: number; // ডিফল্ট ৪০% কর্মীর অংশ
  workerShareAmount?: number; // কর্মীর ৪০% পারিশ্রমিক/কমিশন
  cashDepositedToOwner?: number; // কর্মীর মালিকের ক্যাশে জমা দেওয়া নগদ টাকা
  counterCashInHand: number; // ক্যাশ ড্রয়ারে ক্যাশ / কর্মীর কাছে ক্যাশ
  digitalCollection: number; // বিকাশ/নগদে আদায়
  deductionPercentage: number; // default 60% (সেটিংস অনুযায়ী অ্যাডজাস্টেবল)
  deductionAmount: number; // 60% বাদ দিলে কত হয়
  netAfterDeduction: number; // মোট থেকে 60% বাদ দিলে অবশিষ্ট বা শেয়ার
  syncedToShopLedger?: boolean; // মালিকের ৬০% মুনাফা দৈনিক দোকানের হিসাব খাতায় যুক্ত হয়েছে কিনা
  shopLedgerSaleId?: string; // DailyCounterSale id
  pagesPrintedCount?: number;
  paperReamsUsed?: number;
  status: 'settled' | 'pending' | 'verified';
  verifiedBy?: string;
  notes?: string;
  createdAt?: string;
}

export interface CashNoteCount {
  note1000: number;
  note500: number;
  note200: number;
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
  coins: number;
}

export interface DailyCashReconciliation {
  id: string;
  date: string;
  openingCash: number;
  totalCashIn: number;
  totalCashOut: number;
  digitalIn: number;
  closingCashExpected: number;
  actualCashCounted: number;
  discrepancy: number; // actual - expected
  noteCounts?: CashNoteCount;
  status: 'balanced' | 'surplus' | 'deficit';
  closedBy?: string;
  notes?: string;
}

export interface StoreLedgerSettings {
  defaultOpeningCash: number;
  defaultDeductionPercentage: number; // 60%
  shopShareLabel: string;
  operatorShareLabel: string;
  enableVoucherNumbering: boolean;
  voucherPrefix: string;
  currencySymbol: string;
  autoReconciliation: boolean;
  businessNameBn?: string;
  addressBn?: string;
  phonePrimary?: string;
  customCategories: CustomLedgerCategory[];
}

// ----------------------------------------------------
// JUDICIAL STAMP & CARTRIDGE PAPER REGISTER (স্ট্যাম্প ও কার্টিজ হিসাব)
// ----------------------------------------------------
export type StampItemType =
  | 'stamp_50'
  | 'stamp_100'
  | 'stamp_200'
  | 'stamp_300'
  | 'stamp_500'
  | 'cartridge_paper'
  | 'stamp_writing'
  | 'custom_stamp';

export interface StampItemConfig {
  id: StampItemType | string;
  name: string;
  nameBn: string;
  faceValue: number; // 50, 100, 200, 300, 500, 0
  defaultBuyPrice: number; // 50tk -> 55, 100tk -> 105, cartridge -> 5
  defaultSalePrice: number; // 50tk -> 70, 100tk -> 120, cartridge -> 10
  currentStock: number;
  lowStockThreshold: number;
  category: 'stamp' | 'cartridge' | 'service';
  descriptionBn?: string;
}

export interface StampSaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  itemType: StampItemType | string;
  itemName: string;
  itemNameBn: string;
  quantity: number;
  buyPricePerUnit: number; // e.g. 55
  salePricePerUnit: number; // e.g. 70
  totalBuyCost: number; // quantity * buyPricePerUnit
  totalSaleAmount: number; // quantity * salePricePerUnit
  totalProfit: number; // totalSaleAmount - totalBuyCost
  serialNumbers?: string; // e.g. "খ গ ১৮৭৩২১-১৮৭৩২৫"
  deedType?: string; // বায়না দলিল, চুক্তিপত্র, হলফনামা, আমমোক্তারনামা, ভাড়ানামা
  customerName?: string;
  customerPhone?: string;
  advocateOrVendor?: string; // অ্যাডভোকেট / দলিল লেখক
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank' | 'due';
  operatorName?: string;
  notes?: string;
  createdAt: string;
}

export interface StampStockPurchase {
  id: string;
  date: string; // YYYY-MM-DD
  itemType: StampItemType | string;
  itemNameBn: string;
  quantity: number;
  buyPricePerUnit: number;
  totalCost: number;
  vendorSource?: string; // ট্রেজারি / ভেন্ডার / মহুরী
  serialRange?: string; // ক্রমিক নম্বর রেঞ্জ
  paidBy?: string;
  note?: string;
  createdAt: string;
}


