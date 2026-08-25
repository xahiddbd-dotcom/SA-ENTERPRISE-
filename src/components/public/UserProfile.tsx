import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Order, OrderStatus, Application, Product } from '../../types';
import { Image } from '../common/Image';
import { OrderItemCard } from './OrderItemCard';
import { OrderQuickViewModal } from './OrderQuickViewModal';
import { jsPDF } from 'jspdf';
import {
  User,
  Package,
  Clock,
  CheckCircle2,
  Box,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Printer,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Download,
  Lock,
  Edit3,
  Save,
  X,
  CreditCard,
  Building,
  Sparkles,
  ArrowRight,
  FileCheck,
  Layers,
  Bell,
  CheckCheck,
  Volume2,
  PartyPopper,
  ShoppingCart,
  Plus,
  ArrowUpDown,
  Eye,
  Star
} from 'lucide-react';

interface UserProfileProps {
  onNavigate?: (tab: string) => void;
  onOpenTrackerWithId?: (id: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenCart?: () => void;
}

// Vertical Order Status Step Definition
interface StatusStep {
  key: OrderStatus;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ORDER_TIMELINE_STEPS: StatusStep[] = [
  {
    key: 'pending',
    titleBn: 'অর্ডার গৃহীত হয়েছে (Order Placed)',
    titleEn: 'Order Placed & Received',
    descBn: 'অর্ডার সফলভাবে সাইফুর এন্টারপ্রাইজের কেন্দ্রীয় সিস্টেমে যুক্ত হয়েছে।',
    descEn: 'Order details recorded in system and queued for verification.',
    icon: Clock
  },
  {
    key: 'confirmed',
    titleBn: 'অর্ডার নিশ্চিত (Confirmed)',
    titleEn: 'Order Confirmed',
    descBn: 'স্টক এবং পেমেন্ট যাচাই করে অর্ডার চূড়ান্তভাবে গ্রহণ করা হয়েছে।',
    descEn: 'Stock availability verified and order confirmed by counter desk.',
    icon: CheckCircle2
  },
  {
    key: 'processing',
    titleBn: 'প্রক্রিয়াধীন ও কাটিং/প্যাকেজিং (Processing)',
    titleEn: 'Processing & Packaging',
    descBn: 'পেপার সাইজিং, মান যাচাই ও ইন্দিরা রোড শাখায় পণ্য প্যাকেটজাত হচ্ছে।',
    descEn: 'Products are being sized, quality checked, and packaged.',
    icon: Box
  },
  {
    key: 'ready',
    titleBn: 'ডেলিভারির জন্য প্রস্তুত / আউট ফর ডেলিভারি',
    titleEn: 'Ready for Pickup / Out for Delivery',
    descBn: 'কাউন্টার থেকে নেওয়ার জন্য তৈরি অথবা রাইডারের কাছে হস্তান্তর করা হয়েছে।',
    descEn: 'Package ready at counter or handed over to courier delivery agent.',
    icon: Truck
  },
  {
    key: 'delivered',
    titleBn: 'ডেলিভারি সম্পন্ন (Delivered)',
    titleEn: 'Order Delivered & Completed',
    descBn: 'গ্রাহকের নিকট সফলভাবে পণ্য পৌঁছে দেওয়া হয়েছে। ধন্যবাদ!',
    descEn: 'Products successfully received by customer. Thank you for choosing us!',
    icon: CheckCircle2
  }
];

// Helper to determine step progress index
const getStatusStepIndex = (status: OrderStatus): number => {
  switch (status) {
    case 'pending':
      return 0;
    case 'confirmed':
      return 1;
    case 'processing':
      return 2;
    case 'ready':
      return 3;
    case 'delivered':
      return 4;
    case 'cancelled':
      return -1;
    default:
      return 0;
  }
};

export interface OrderStatusToast {
  id: string;
  orderId: string;
  orderNumber: string;
  previousStatus?: OrderStatus;
  newStatus: 'ready' | 'delivered' | OrderStatus;
  statusType: 'shipped' | 'delivered' | 'other';
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  timestamp: Date;
  itemsCount: number;
  total: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onNavigate,
  onOpenTrackerWithId,
  onOpenAuthModal,
  onOpenCart
}) => {
  const { currentUser, isAuthenticated, updateCurrentUserProfile } = useAuth();
  const { orders, applications, products, addToCart, updateOrderStatus, addOrderReview } = useData();
  const { language } = useLanguage();

  // Active Profile Tab
  const [activeSection, setActiveSection] = useState<'orders' | 'applications' | 'settings'>('orders');

  // Search, Filter, Sort & Pagination State for Orders
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // UI States
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedQuickViewOrder, setSelectedQuickViewOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Re-order Alert Notification Banner State
  const [reorderAlert, setReorderAlert] = useState<{
    orderNumber: string;
    itemCount: number;
    total: number;
    itemNames: string[];
  } | null>(null);

  // REAL-TIME TOAST NOTIFICATIONS STATE FOR 'SHIPPED' & 'DELIVERED'
  const [toasts, setToasts] = useState<OrderStatusToast[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousOrdersRef = useRef<Map<string, OrderStatus>>(new Map());
  const isInitialMount = useRef(true);

  // Synthesized Web Audio API sound chime for delivery/shipped alerts
  const playNotificationSound = (type: 'shipped' | 'delivered') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'delivered') {
        // Joyful chord melody (Arpeggio: E5 -> G#5 -> B5)
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(830.61, now + 0.1);
        osc.frequency.setValueAtTime(987.77, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      } else {
        // Crisp dual chime (D5 -> A5)
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880.0, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {
      // Audio playback suppressed or unsupported
    }
  };

  // Toast removal helper
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Manually trigger a toast notification (e.g. for testing / direct actions)
  const triggerStatusToast = (
    order: Order,
    newStatus: OrderStatus,
    previousStatus?: OrderStatus
  ) => {
    const isShipped = newStatus === 'ready';
    const isDelivered = newStatus === 'delivered';

    if (!isShipped && !isDelivered) return;

    const toastId = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const statusType: 'shipped' | 'delivered' = isDelivered ? 'delivered' : 'shipped';

    const newToast: OrderStatusToast = {
      id: toastId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      previousStatus,
      newStatus,
      statusType,
      titleBn: isDelivered
        ? '🎉 আপনার অর্ডারটি ডেলিভারি সম্পন্ন হয়েছে!'
        : '🚚 আপনার অর্ডারটি প্রেরিত / প্রস্তুত হয়েছে (Shipped)!',
      titleEn: isDelivered
        ? '🎉 Order Successfully Delivered!'
        : '🚚 Order Shipped & Ready for Delivery!',
      messageBn: isDelivered
        ? `অর্ডার #${order.orderNumber} সফলভাবে পৌঁছানো হয়েছে। মোট ৳${order.total}। সাইফুর এন্টারপ্রাইজের সাথে থাকার জন্য ধন্যবাদ!`
        : `অর্ডার #${order.orderNumber} ফার্মগেট শাখা থেকে ডেলিভারির উদ্দেশ্যে পাঠানো হয়েছে অথবা কাউন্টার থেকে সংগ্রহের জন্য প্রস্তুত।`,
      messageEn: isDelivered
        ? `Order #${order.orderNumber} has been safely delivered to customer. Total bill: ৳${order.total}. Thank you!`
        : `Order #${order.orderNumber} is now dispatched for delivery or ready for counter pickup.`,
      timestamp: new Date(),
      itemsCount: order.items.reduce((s, i) => s + i.quantity, 0),
      total: order.total
    };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    playNotificationSound(statusType);

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      removeToast(toastId);
    }, 7000);
  };

  // Initialize edit form when currentUser is available
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Securely filter orders linked ONLY to currently logged-in user
  const userOrders = useMemo(() => {
    if (!currentUser) return [];

    const userPhone = currentUser.phone?.trim();
    const userEmail = currentUser.email?.trim().toLowerCase();
    const userName = currentUser.name?.trim().toLowerCase();
    const userId = currentUser.id;

    return orders.filter(order => {
      // Direct user/customer ID match
      if ((order as any).userId && (order as any).userId === userId) return true;
      if ((order as any).customerId && (order as any).customerId === userId) return true;

      // Phone number match
      if (userPhone && order.customerPhone && order.customerPhone.trim() === userPhone) return true;

      // Email match
      if (userEmail && order.customerEmail && order.customerEmail.trim().toLowerCase() === userEmail) return true;

      // Name fallback match
      if (userName && order.customerName && order.customerName.trim().toLowerCase() === userName) return true;

      return false;
    });
  }, [orders, currentUser]);

  // Filter user applications
  const userApplications = useMemo(() => {
    if (!currentUser) return [];
    const userPhone = currentUser.phone?.trim();
    const userEmail = currentUser.email?.trim().toLowerCase();
    const userName = currentUser.name?.trim().toLowerCase();

    return applications.filter(app => {
      if (userPhone && app.applicantPhone && app.applicantPhone.trim() === userPhone) return true;
      if (userEmail && app.applicantEmail && app.applicantEmail.trim().toLowerCase() === userEmail) return true;
      if (userName && app.applicantName && app.applicantName.trim().toLowerCase() === userName) return true;
      return false;
    });
  }, [applications, currentUser]);

  // REAL-TIME ORDER STATUS WATCHER
  // Automatically detects when an order's status transitions to 'ready' (shipped/out for delivery) or 'delivered'
  useEffect(() => {
    if (userOrders.length === 0) return;

    if (isInitialMount.current) {
      // Seed initial map of known order statuses
      userOrders.forEach(ord => {
        previousOrdersRef.current.set(ord.id, ord.orderStatus);
      });
      isInitialMount.current = false;
      return;
    }

    // Check for status changes on subsequent updates
    userOrders.forEach(ord => {
      const prevStatus = previousOrdersRef.current.get(ord.id);
      
      if (prevStatus && prevStatus !== ord.orderStatus) {
        // Trigger Toast when status transitions to 'ready' (Shipped / Out for Delivery) or 'delivered'
        if (ord.orderStatus === 'ready' || ord.orderStatus === 'delivered') {
          triggerStatusToast(ord, ord.orderStatus, prevStatus);
        }
      }
      // Update tracking map
      previousOrdersRef.current.set(ord.id, ord.orderStatus);
    });
  }, [userOrders]);

  // Comprehensive useMemo-based Search, Status Filter & Sorting on User Orders
  const filteredOrders = useMemo(() => {
    let result = userOrders.filter(order => {
      // 1. Status Filter
      if (statusFilter !== 'all' && order.orderStatus !== statusFilter) {
        return false;
      }

      // 2. Local Search Query filter (matches order ID, orderNumber, product names in EN/BN, GSM, TrxID, notes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesTrx = order.paymentTrxId ? order.paymentTrxId.toLowerCase().includes(q) : false;
        const matchesAddress = order.deliveryAddress ? order.deliveryAddress.toLowerCase().includes(q) : false;
        const matchesPhone = order.customerPhone ? order.customerPhone.toLowerCase().includes(q) : false;
        const matchesPaymentMethod = order.paymentMethod ? order.paymentMethod.toLowerCase().includes(q) : false;
        const matchesDeliveryType = order.deliveryType ? order.deliveryType.toLowerCase().includes(q) : false;
        
        const matchesItem = order.items.some(
          item =>
            item.productName.toLowerCase().includes(q) ||
            (item.productNameBn && item.productNameBn.toLowerCase().includes(q)) ||
            (item.gsm && item.gsm.toString().includes(q)) ||
            (item.productId && item.productId.toLowerCase().includes(q))
        );

        return (
          matchesNumber ||
          matchesId ||
          matchesTrx ||
          matchesItem ||
          matchesAddress ||
          matchesPhone ||
          matchesPaymentMethod ||
          matchesDeliveryType
        );
      }

      return true;
    });

    // 3. Sorting logic
    return [...result].sort((a, b) => {
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'amount_high') {
        return (b.total || 0) - (a.total || 0);
      }
      if (sortOption === 'amount_low') {
        return (a.total || 0) - (b.total || 0);
      }
      // default: 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [userOrders, statusFilter, searchQuery, sortOption]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Reset page to 1 on filter/search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOption]);

  // Memoized Action Handlers with useCallback to prevent re-renders
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleToggleExpand = useCallback((orderId: string) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  }, []);

  const handleQuickView = useCallback((order: Order) => {
    setSelectedQuickViewOrder(order);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setSelectedQuickViewOrder(null);
  }, []);

  const handleOpenInvoice = useCallback((order: Order) => {
    setSelectedInvoiceOrder(order);
  }, []);

  const handleOpenTracker = useCallback((orderNumber: string) => {
    if (onOpenTrackerWithId) {
      onOpenTrackerWithId(orderNumber);
    }
  }, [onOpenTrackerWithId]);

  const handleSimulateStatus = useCallback((orderId: string, status: 'ready' | 'delivered') => {
    updateOrderStatus(orderId, status);
  }, [updateOrderStatus]);

  const handleSubmitReview = useCallback((orderId: string, rating: number, feedback: string) => {
    addOrderReview(orderId, rating, feedback, currentUser?.name);
  }, [addOrderReview, currentUser?.name]);

  // Profile Save Handler
  const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setIsSavingProfile(true);
    setProfileSaveSuccess(null);

    try {
      const res = await updateCurrentUserProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim()
      });

      if (res.success) {
        setProfileSaveSuccess(language === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile updated successfully!');
        setIsEditingProfile(false);
        setTimeout(() => setProfileSaveSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  }, [editName, editPhone, editAddress, updateCurrentUserProfile, language]);

  // Re-order items: Pre-fills shopping cart with items from the past order
  const handleReorder = useCallback((order: Order, specificItem?: Order['items'][0]) => {
    const itemsToReorder = specificItem ? [specificItem] : order.items;
    let addedCount = 0;
    let addedTotal = 0;
    const addedItemNames: string[] = [];

    itemsToReorder.forEach(item => {
      // Find matching live product in catalog to preserve latest specs, stock & images
      const catalogMatch = products.find(
        p => p.id === item.productId || p.name.toLowerCase() === item.productName.toLowerCase()
      );

      const productToAdd: Product = catalogMatch || {
        id: item.productId,
        sku: item.productId,
        name: item.productName,
        nameBn: item.productNameBn,
        description: '',
        descriptionBn: '',
        categoryId: 'cat_paper',
        brand: 'Standard',
        price: item.price,
        stock: 50,
        lowStockThreshold: 5,
        minOrderQty: 1,
        images: item.image ? [item.image] : [],
        isActive: true
      };

      addToCart(productToAdd, item.quantity, item.gsm);
      addedCount += item.quantity;
      addedTotal += (item.price * item.quantity);
      addedItemNames.push(language === 'bn' && item.productNameBn ? item.productNameBn : item.productName);
    });

    // Play notification sound
    playNotificationSound('delivered');

    // Trigger Re-order success alert with direct Cart action
    setReorderAlert({
      orderNumber: order.orderNumber,
      itemCount: addedCount,
      total: addedTotal,
      itemNames: addedItemNames
    });

    // Auto-dismiss reorder notification after 10s
    setTimeout(() => {
      setReorderAlert(prev => prev?.orderNumber === order.orderNumber ? null : prev);
    }, 10000);
  }, [products, addToCart, language, playNotificationSound]);

  // Order Metrics Calculations
  const stats = useMemo(() => {
    const totalCount = userOrders.length;
    const deliveredCount = userOrders.filter(o => o.orderStatus === 'delivered').length;
    const inProgressCount = userOrders.filter(o => ['pending', 'confirmed', 'processing', 'ready'].includes(o.orderStatus)).length;
    const totalSpent = userOrders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return { totalCount, deliveredCount, inProgressCount, totalSpent };
  }, [userOrders]);

  // Export User Order History to CSV
  const handleExportOrdersCsv = useCallback(() => {
    if (userOrders.length === 0) return;

    try {
      const headers = ['Order Number', 'Date', 'Status', 'Total (BDT)', 'Payment Status', 'Payment Method', 'Items Count', 'Items Detail', 'Delivery Type'];
      const rows = userOrders.map(o => {
        const itemsSummary = o.items.map(i => `${i.productName} (x${i.quantity})`).join('; ');
        return [
          `"${o.orderNumber}"`,
          `"${new Date(o.createdAt).toLocaleDateString()}"`,
          `"${o.orderStatus.toUpperCase()}"`,
          `"${o.total}"`,
          `"${o.paymentStatus || 'pending'}"`,
          `"${o.paymentMethod || 'cash'}"`,
          `"${o.items.reduce((s, i) => s + i.quantity, 0)}"`,
          `"${itemsSummary.replace(/"/g, '""')}"`,
          `"${o.deliveryType || 'standard'}"`
        ];
      });

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Saiful_Enterprise_Orders_${currentUser?.name ? currentUser.name.replace(/\s+/g, '_') : 'Customer'}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('CSV Export Error:', err);
    }
  }, [userOrders, currentUser]);

  // Export User Order History to PDF
  const handleExportOrdersPdf = useCallback(() => {
    if (userOrders.length === 0) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      let y = 14;

      // Header Banner
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text('SAIFUL ENTERPRISE', margin + 6, y + 8);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Customer Purchase & Order History Statement', margin + 6, y + 14);
      pdf.text('20/1 Sagar-Saikat Market, Indira Road, Farmgate, Dhaka | Cell: 01540004966', margin + 6, y + 19);

      // Customer Info Box
      y += 28;
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`Customer: ${currentUser?.name || 'Valued Customer'}`, margin + 4, y + 6);
      pdf.text(`Total Orders: ${userOrders.length} | Total Spent: BDT ${stats.totalSpent.toLocaleString()}`, margin + contentWidth - 75, y + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Phone: ${currentUser?.phone || '-'} | Email: ${currentUser?.email || '-'}`, margin + 4, y + 12);
      pdf.text(`Delivery Address: ${currentUser?.address || 'Indira Road / Farmgate'}`, margin + 4, y + 17);

      y += 25;

      // Orders Table Header
      const colWidths = [28, 24, 28, 26, 52, 24]; // Total 182mm
      const headers = ['Order #', 'Date', 'Status', 'Payment', 'Items Summary', 'Total (BDT)'];

      pdf.setFillColor(30, 41, 59);
      pdf.rect(margin, y, contentWidth, 7, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(255, 255, 255);

      let curX = margin;
      headers.forEach((h, hIdx) => {
        pdf.text(h, curX + 2, y + 4.8);
        curX += colWidths[hIdx];
      });
      y += 7;

      // Orders Table Rows
      userOrders.forEach((ord, oIdx) => {
        if (y + 8 > pageHeight - 20) {
          pdf.addPage();
          y = 15;
          pdf.setFillColor(30, 41, 59);
          pdf.rect(margin, y, contentWidth, 7, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7);
          pdf.setTextColor(255, 255, 255);
          let tx = margin;
          headers.forEach((h, hIdx) => {
            pdf.text(h, tx + 2, y + 4.8);
            tx += colWidths[hIdx];
          });
          y += 7;
        }

        const isEven = oIdx % 2 === 0;
        pdf.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
        pdf.rect(margin, y, contentWidth, 6.5, 'F');
        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.1);
        pdf.line(margin, y + 6.5, margin + contentWidth, y + 6.5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.8);
        pdf.setTextColor(51, 65, 85);

        const itemsText = ord.items.map(i => `${i.productName} x${i.quantity}`).join(', ').slice(0, 32);
        const rowVals = [
          ord.orderNumber,
          new Date(ord.createdAt).toLocaleDateString(),
          ord.orderStatus.toUpperCase(),
          ord.paymentMethod ? ord.paymentMethod.toUpperCase() : 'CASH',
          itemsText,
          `BDT ${ord.total}`
        ];

        let rx = margin;
        rowVals.forEach((val, cIdx) => {
          if (cIdx === 0) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 41, 59);
          } else if (cIdx === 2) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(ord.orderStatus === 'delivered' ? 16 : ord.orderStatus === 'cancelled' ? 239 : 245, ord.orderStatus === 'delivered' ? 185 : ord.orderStatus === 'cancelled' ? 68 : 158, ord.orderStatus === 'delivered' ? 129 : ord.orderStatus === 'cancelled' ? 68 : 11);
          } else if (cIdx === 5) {
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(16, 185, 129);
          } else {
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 65, 85);
          }
          pdf.text(val, rx + 2, y + 4.5);
          rx += colWidths[cIdx];
        });

        y += 6.5;
      });

      // Footer
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setDrawColor(203, 213, 225);
        pdf.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text('Saiful Enterprise - Customer Service Desk: 01540004966', margin, pageHeight - 8);
        pdf.text(`Page ${p} of ${totalPages}`, margin + contentWidth - 20, pageHeight - 8);
      }

      pdf.save(`Saiful_Enterprise_Orders_${currentUser?.name ? currentUser.name.replace(/\s+/g, '_') : 'Customer'}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
    }
  }, [userOrders, currentUser, stats]);

  // If Not Logged In - Prompt Login
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white">
              {language === 'bn' ? 'গ্রাহক প্রোফাইল ও অর্ডার হিস্টোরি' : 'Customer Profile & Order History'}
            </h2>
            <p className="text-sm text-neutral-400">
              {language === 'bn'
                ? 'আপনার পূর্ববর্তী সকল অর্ডারের লাইভ স্ট্যাটাস, ক্যাশ মেমো ও ডেলিভারি অগ্রগতি দেখতে লগইন করুন।'
                : 'Please sign in to your account to securely view your order history, track real-time delivery timelines, and access invoices.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="profile-login-btn"
              onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In to Account'}
            </button>
            <button
              id="profile-register-btn"
              onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-sm border border-neutral-700 transition-all"
            >
              {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি (Register)' : 'Create New Account'}
            </button>
          </div>

          <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{language === 'bn' ? '১০০% নিরাপদ ও এনক্রিপ্টেড গ্রাহক ডেটা' : '100% Secure & Privacy Encrypted'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* TOAST NOTIFICATION CONTAINER (Floating at top-right for real-time status alerts) */}
      <aside aria-label="Order Status Notifications" className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none">
        {toasts.map(toast => {
          const isDelivered = toast.statusType === 'delivered';
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 sm:p-5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all animate-in slide-in-from-right-5 duration-300 ${
                isDelivered
                  ? 'bg-neutral-900/95 border-emerald-500/50 shadow-emerald-950/80 text-white'
                  : 'bg-neutral-900/95 border-teal-500/50 shadow-teal-950/80 text-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    isDelivered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  {isDelivered ? <PartyPopper className="w-5 h-5" /> : <Truck className="w-5 h-5 animate-pulse" />}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isDelivered
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-teal-500/20 text-teal-300'
                      }`}
                    >
                      {isDelivered
                        ? language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'
                        : language === 'bn' ? 'প্রেরিত / প্রস্তুত (Shipped)' : 'Shipped'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {toast.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {language === 'bn' ? toast.titleBn : toast.titleEn}
                  </h5>

                  <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                    {language === 'bn' ? toast.messageBn : toast.messageEn}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80 mt-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {toast.itemsCount} {language === 'bn' ? 'টি পণ্য' : 'Items'} • ৳{toast.total}
                    </span>
                    <button
                      onClick={() => {
                        setExpandedOrderId(toast.orderId);
                        removeToast(toast.id);
                      }}
                      className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
                    >
                      <span>{language === 'bn' ? 'অর্ডার দেখুন' : 'View Order'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </aside>

      {/* RE-ORDER PRE-FILLED SHOPPING CART SUCCESS ALERT BANNER */}
      {reorderAlert && (
        <aside aria-label="Cart Pre-filled Alert" className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-emerald-950/95 via-neutral-900/95 to-neutral-900/95 border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-white">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-md">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কার্টে পণ্য যুক্ত হয়েছে' : 'Cart Pre-filled Successfully'}</span>
                  </span>
                  <button
                    onClick={() => setReorderAlert(null)}
                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {language === 'bn'
                    ? `অর্ডার #${reorderAlert.orderNumber}-এর ${reorderAlert.itemCount}টি আইটেম শপিং কার্টে প্রাক-পূরণ করা হয়েছে!`
                    : `${reorderAlert.itemCount} item(s) from Order #${reorderAlert.orderNumber} added to shopping cart!`}
                </p>

                <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                  <span>{language === 'bn' ? 'অর্ডারের পণ্যমূল্য:' : 'Items Total:'}</span>
                  <span className="font-extrabold text-emerald-400">৳{reorderAlert.total}</span>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                  {onOpenCart && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenCart();
                        setReorderAlert(null);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-all hover:scale-105"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'কার্ট ও চেকআউট দেখুন' : 'Open Cart & Checkout'}</span>
                    </button>
                  )}
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('shop');
                        setReorderAlert(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs transition-colors"
                    >
                      <span>{language === 'bn' ? 'শপ পেজ' : 'Shop Page'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Notifications / Feedback */}
      {profileSaveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold">{profileSaveSuccess}</p>
        </div>
      )}

      {/* User Info Header Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-xl shadow-emerald-950/60 border-2 border-emerald-400/30 shrink-0 overflow-hidden">
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  aspectRatio="1/1"
                  priority={true}
                />
              ) : (
                currentUser.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 capitalize">
                  {currentUser.role === 'customer'
                    ? language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Verified Customer'
                    : currentUser.role.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-neutral-400 pt-0.5">
                {currentUser.phone && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentUser.phone}</span>
                  </span>
                )}
                {currentUser.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{currentUser.email}</span>
                  </span>
                )}
                {currentUser.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate max-w-[200px]">{currentUser.address}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 flex items-center gap-2 border border-neutral-700 transition-all hover:border-emerald-500"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEditingProfile ? (language === 'bn' ? 'বন্ধ করুন' : 'Cancel') : (language === 'bn' ? 'ঠিকানা ও তথ্য পরিবর্তন' : 'Edit Profile')}</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('shop')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'দোকানে যান' : 'Shop Paper'}</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {language === 'bn' ? 'পূর্ণ নাম (Full Name)' : 'Full Name'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (Phone)' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {language === 'bn' ? 'ডেলিভারি ঠিকানা (Delivery Address)' : 'Default Delivery Address'}
              </label>
              <input
                type="text"
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                placeholder="Indira Road / Tejgaon / Dhaka"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick Analytics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-neutral-800/70 text-left">
          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-neutral-400 block font-medium">
              {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">{stats.totalCount}</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-amber-400/90 block font-medium">
              {language === 'bn' ? 'চলমান / প্রক্রিয়াধীন' : 'In Progress'}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">{stats.inProgressCount}</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-emerald-400/90 block font-medium">
              {language === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{stats.deliveredCount}</span>
          </div>

          <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-3.5">
            <span className="text-[11px] text-teal-400/90 block font-medium">
              {language === 'bn' ? 'মোট ক্রয়মূল্য' : 'Total Spent'}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-teal-400 font-mono">৳{stats.totalSpent}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSection('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'orders'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{language === 'bn' ? 'অর্ডার হিস্টোরি ও ট্র্যাকিং' : 'Order History & Timeline'}</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-950 text-neutral-300 font-mono">
            {userOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('applications')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'applications'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>{language === 'bn' ? 'অনলাইন আবেদনসমূহ' : 'My Applications'}</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-neutral-950 text-neutral-300 font-mono">
            {userApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSection === 'settings'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'bn' ? 'অ্যাকাউন্ট তথ্য ও ঠিকানা' : 'Account Details'}</span>
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY & STATUS TIMELINE */}
      {activeSection === 'orders' && (
        <div className="space-y-6">
          {/* Search, Filters and Real-Time Controls Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-3 sm:p-4 rounded-2xl shadow-sm">
              {/* Local Search Input with useMemo Filter */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="userprofile-order-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'অর্ডার নম্বর, পণ্যের নাম বা TrxID...'
                      : 'Search by Order ID, Product Name, TrxID...'
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
                    title={language === 'bn' ? 'অনুসন্ধান মুছুন' : 'Clear search'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="hidden sm:inline absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 font-mono">
                    Ctrl+/
                  </span>
                )}
              </div>

              {/* Status Filter Pills & Sort Dropdown */}
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value as any)}
                    className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer text-xs font-semibold"
                    aria-label="Sort Orders"
                  >
                    <option value="newest" className="bg-neutral-900 text-white">
                      {language === 'bn' ? 'সর্বশেষ আগে' : 'Newest'}
                    </option>
                    <option value="oldest" className="bg-neutral-900 text-white">
                      {language === 'bn' ? 'পুরাতন আগে' : 'Oldest'}
                    </option>
                    <option value="amount_high" className="bg-neutral-900 text-white">
                      {language === 'bn' ? 'মূল্য: বেশি ➔ কম' : 'Amount: High ➔ Low'}
                    </option>
                    <option value="amount_low" className="bg-neutral-900 text-white">
                      {language === 'bn' ? 'মূল্য: কম ➔ বেশি' : 'Amount: Low ➔ High'}
                    </option>
                  </select>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto">
                  {[
                    { key: 'all', labelBn: 'সকল অর্ডার', labelEn: 'All' },
                    { key: 'pending', labelBn: 'গৃহীত', labelEn: 'Pending' },
                    { key: 'confirmed', labelBn: 'নিশ্চিত', labelEn: 'Confirmed' },
                    { key: 'processing', labelBn: 'প্রক্রিয়াধীন', labelEn: 'Processing' },
                    { key: 'ready', labelBn: 'প্রস্তুত / প্রেরিত', labelEn: 'Ready' },
                    { key: 'delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered' }
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setStatusFilter(f.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        statusFilter === f.key
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {language === 'bn' ? f.labelBn : f.labelEn}
                    </button>
                  ))}
                </div>

                {/* Export Buttons: PDF & CSV */}
                {userOrders.length > 0 && (
                  <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-neutral-800">
                    <button
                      type="button"
                      id="export-user-orders-csv-btn"
                      onClick={handleExportOrdersCsv}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1 border border-neutral-800 transition-all hover:text-white"
                      title={language === 'bn' ? 'এক্সেল / CSV ফরম্যাটে অর্ডার হিস্টোরি ডাউনলোড' : 'Export Orders to CSV'}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">CSV</span>
                    </button>

                    <button
                      type="button"
                      id="export-user-orders-pdf-btn"
                      onClick={handleExportOrdersPdf}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/40 transition-all shadow-sm"
                      title={language === 'bn' ? 'পিডিএফ স্টেটমেন্ট ডাউনলোড করুন' : 'Export Orders to PDF Statement'}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">{language === 'bn' ? 'পিডিএফ' : 'PDF'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Query Feedback & Active Filter Counter Strip */}
            {(searchQuery.trim() || statusFilter !== 'all') && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-neutral-950/80 border border-neutral-800/80 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {language === 'bn'
                      ? `${filteredOrders.length}টি অর্ডার পাওয়া গেছে`
                      : `Found ${filteredOrders.length} matching ${filteredOrders.length === 1 ? 'order' : 'orders'}`}
                  </span>
                  {searchQuery.trim() && (
                    <span className="text-emerald-400 font-medium">
                      "{searchQuery.trim()}"
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-700 text-[10px] uppercase font-bold">
                      {statusFilter}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold"
                >
                  <X className="w-3 h-3" />
                  <span>{language === 'bn' ? 'সকল ফিল্টার রিসেট' : 'Clear Filters'}</span>
                </button>
              </div>
            )}

            {/* Real-Time Live Notification Status Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <span className="font-semibold text-neutral-200">
                  {language === 'bn' ? 'লাইভ অর্ডার স্ট্যাটাস নোটিফিকেশন সক্রিয়' : 'Real-time Live Order Notifications Active'}
                </span>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  {language === 'bn'
                    ? '(অর্ডার প্রেরিত / Shipped বা Delivered হলে স্বয়ংক্রিয় টোস্ট সতর্কবার্তা প্রদর্শিত হবে)'
                    : '(Instant toast alerts trigger when orders transition to Shipped or Delivered)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sound alert toggle */}
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Disable notification sounds' : 'Enable notification sounds'}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    soundEnabled
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-500'
                  }`}
                >
                  <Volume2 className={`w-3 h-3 ${soundEnabled ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span>{soundEnabled ? (language === 'bn' ? 'শব্দ চালু' : 'Sound ON') : (language === 'bn' ? 'শব্দ বন্ধ' : 'Sound OFF')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Empty Orders State */}
          {userOrders.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'কোনো অর্ডার হিস্টোরি নেই' : 'No Orders Found'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'bn'
                    ? 'আপনি এখনো কোনো পেপার বা স্টেশনারি পণ্যের অর্ডার করেননি। আজই অর্ডার করুন এবং দ্রুত ডেলিভারি উপভোগ করুন।'
                    : 'You have not placed any orders yet with this account. Browse our paper catalog to place your first order.'}
                </p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('shop')}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'bn' ? 'শপ পেপারে যান' : 'Browse Paper Shop'}</span>
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-white">
                {language === 'bn' ? 'অনুসন্ধানে কোনো অর্ডার মেলেনি' : 'No matching orders found'}
              </p>
              <p className="text-xs text-neutral-400">
                {language === 'bn' ? 'অন্য কীওয়ার্ড দিয়ে অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।' : 'Try changing your search term or filter options.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-emerald-400"
              >
                {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            /* Paginated Orders List with Memoized OrderItemCard */
            <div className="space-y-6">
              {paginatedOrders.map(order => (
                <OrderItemCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  copiedId={copiedId}
                  language={language}
                  onToggleExpand={handleToggleExpand}
                  onQuickView={handleQuickView}
                  onReorder={handleReorder}
                  onOpenInvoice={handleOpenInvoice}
                  onCopy={handleCopy}
                  onOpenTracker={handleOpenTracker}
                  onSimulateStatus={handleSimulateStatus}
                  onSubmitReview={handleSubmitReview}
                />
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-xs">
                  <span className="text-neutral-400">
                    {language === 'bn'
                      ? `দেখাচ্ছে ${(currentPage - 1) * itemsPerPage + 1} থেকে ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} (মোট ${filteredOrders.length} টি অর্ডারের মধ্যে)`
                      : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} orders`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-bold font-mono transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ONLINE APPLICATIONS */}
      {activeSection === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>{language === 'bn' ? 'আমার জমাকৃত অনলাইন আবেদনসমূহ' : 'My Service Applications'}</span>
            </h3>

            <button
              onClick={() => onNavigate && onNavigate('services')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              + {language === 'bn' ? 'নতুন সেবা আবেদন' : 'Apply for New Service'}
            </button>
          </div>

          {userApplications.length === 0 ? (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-neutral-600 mx-auto" />
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'কোনো অনলাইন আবেদন পাওয়া যায়নি' : 'No Applications Found'}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'তেজগাঁও কলেজ ভর্তি, জাতীয় বিশ্ববিদ্যালয় ফরম ফিলাপ, ড্রাইভিং লাইসেন্স বা পাসপোর্ট ফরম পূরণের আবেদন অনলাইনে জমা দিন।'
                  : 'You have not submitted any service applications yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userApplications.map(app => (
                <div
                  key={app.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 hover:border-neutral-700 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">{app.applicationNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'bn' && app.serviceNameBn ? app.serviceNameBn : app.serviceName}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      তারিখ: {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-mono">ফি: ৳{app.amount}</span>
                    {onOpenTrackerWithId && (
                      <button
                        onClick={() => onOpenTrackerWithId(app.applicationNumber)}
                        className="text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>ট্র্যাকারে দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS & SECURITY */}
      {activeSection === 'settings' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              <span>{language === 'bn' ? 'ব্যক্তিগত তথ্য ও ডেলিভারি ঠিকানা' : 'Account Details & Address'}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'bn'
                ? 'আপনার ফোন নম্বর এবং ডিফল্ট ডেলিভারি ঠিকানা আপডেট রাখুন যাতে দ্রুত পার্সেল পাঠানো যায়।'
                : 'Manage your verified personal credentials and primary shipping address.'}
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                {language === 'bn' ? 'গ্রাহকের পুরো নাম' : 'Customer Name'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (যাচাইকৃত)' : 'Verified Mobile Phone'}
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                {language === 'bn' ? 'ডিফল্ট ডেলিভারি ঠিকানা (বাসা/অফিস/হোস্টেল)' : 'Primary Delivery Address'}
              </label>
              <textarea
                rows={3}
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                placeholder="যেমন: রুম ২০৪, তেজগাঁও কলেজ হোস্টেল, ইন্দিরা রোড, ঢাকা"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingProfile ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (language === 'bn' ? 'তথ্য হালনাগাদ করুন' : 'Update Profile Info')}</span>
            </button>
          </form>
        </div>
      )}

      {/* Invoice Modal for Order Preview */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white">সাইফুল এন্টারপ্রাইজ (ক্যাশ মেমো)</h3>
              <p className="text-xs text-neutral-400">১৬/এ, ইন্দিরা রোড, ফার্মগেট, তেজগাঁও, ঢাকা</p>
              <p className="text-xs text-emerald-400 font-mono">মোবাইল: 01540004966</p>
            </div>

            <div className="space-y-1 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>অর্ডার নং:</span>
                <span className="font-mono font-bold text-white">{selectedInvoiceOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>গ্রাহক:</span>
                <span className="font-semibold text-white">{selectedInvoiceOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>ফোন:</span>
                <span className="font-mono text-white">{selectedInvoiceOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>তারিখ:</span>
                <span>{new Date(selectedInvoiceOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden text-xs">
              <div className="bg-neutral-950 p-2.5 font-bold text-neutral-300 flex justify-between">
                <span>বিবরণ</span>
                <span>মোট</span>
              </div>
              <div className="divide-y divide-neutral-800 bg-neutral-900/90">
                {selectedInvoiceOrder.items.map((item, i) => (
                  <div key={i} className="p-2.5 flex justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-[10px] text-neutral-400">
                        {item.gsm ? `${item.gsm} GSM • ` : ''} {item.quantity} x ৳{item.price}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">৳{item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
              <span>সর্বমোট প্রদেয়:</span>
              <span className="text-emerald-400 font-mono text-lg">৳{selectedInvoiceOrder.total}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal-Based Quick View for Order Details (Preserves User Context) */}
      {selectedQuickViewOrder && (
        <OrderQuickViewModal
          order={selectedQuickViewOrder}
          onClose={handleCloseQuickView}
          onReorder={handleReorder}
          onOpenInvoice={handleOpenInvoice}
          onOpenTracker={handleOpenTracker}
          onSubmitReview={handleSubmitReview}
          onSimulateStatus={handleSimulateStatus}
        />
      )}
    </div>
  );
};
