export type Language = 'bn' | 'en';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'accountant' | 'service_operator' | 'customer';

export interface Permission {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  category: 'dashboard' | 'services' | 'products' | 'orders' | 'applications' | 'staff' | 'pos' | 'inventory' | 'expenses' | 'reports' | 'cms' | 'settings';
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
  joiningDate?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  isActive: boolean;
  permissions?: string[];
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
  assignedStaffId?: string;
  assignedStaffName?: string;
  deadline?: string;
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
