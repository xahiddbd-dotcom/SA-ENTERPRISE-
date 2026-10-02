import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Service, ServiceCategory } from '../../types';
import { buildUrl } from '../../utils/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Printer,
  GraduationCap,
  ShieldAlert,
  Building2,
  Camera,
  Layers,
  Clock,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Upload,
  X,
  Sparkles,
  Search,
  Phone,
  AlertCircle,
  ImageIcon
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenTrackerWithId?: (appId: string) => void;
  initialServiceId?: string | null;
  onServiceSelect?: (serviceId: string | null) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenTrackerWithId,
  initialServiceId,
  onServiceSelect
}) => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const { services, categories, createApplication, settings } = useData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

  // Sync initialServiceId when deep-linked
  useEffect(() => {
    if (initialServiceId && services.length > 0) {
      const found = services.find(s => s.id === initialServiceId);
      if (found) {
        setActiveServiceModal(found);
      }
    }
  }, [initialServiceId, services]);

  const handleCloseModal = () => {
    setActiveServiceModal(null);
    setCreatedAppNumber(null);
    if (onServiceSelect) {
      onServiceSelect(null);
    }
  };

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'cash_counter'>('cash_counter');
  const [trxId, setTrxId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string }[]>([]);
  const [createdAppNumber, setCreatedAppNumber] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered services
  const filteredServices = services.filter(service => {
    if (!service.isActive) return false;
    const matchesCategory = selectedCategoryId === 'all' || service.categoryId === selectedCategoryId;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nameBn.includes(searchQuery) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.descriptionBn.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'ShieldAlert': return ShieldAlert;
      case 'Building2': return Building2;
      case 'Printer': return Printer;
      case 'Camera': return Camera;
      default: return Layers;
    }
  };

  const handleOpenModal = (service: Service) => {
    setActiveServiceModal(service);
    setCreatedAppNumber(null);
    setApplicantName('');
    setApplicantPhone('');
    setApplicantEmail('');
    setCustomerNotes('');
    setPaymentMethod('cash_counter');
    setTrxId('');
    setUploadedFiles([]);
    if (onServiceSelect) {
      onServiceSelect(service.id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const mapped = files.map(f => ({ name: f.name, type: f.type || 'document' }));
      setUploadedFiles(prev => [...prev, ...mapped]);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceModal) return;
    if (!applicantName.trim() || !applicantPhone.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর দিন।' : 'Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newApp = createApplication({
        serviceId: activeServiceModal.id,
        serviceName: activeServiceModal.name,
        serviceNameBn: activeServiceModal.nameBn,
        applicantName,
        applicantPhone,
        applicantEmail,
        category: activeServiceModal.categoryId,
        status: 'new',
        paymentStatus: trxId ? 'verified' : 'pending',
        paymentMethod,
        amount: activeServiceModal.price,
        paidAmount: trxId ? activeServiceModal.price : 0,
        customerNotes: customerNotes + (trxId ? ` [TrxID: ${trxId}]` : ''),
        documents: uploadedFiles.map((f, i) => ({
          id: `doc_${Date.now()}_${i}`,
          name: f.name,
          url: '#',
          type: f.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Customer'
        }))
      });

      setCreatedAppNumber(newApp.applicationNumber);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <section id="services-marketplace" className={`py-16 transition-colors duration-200 ${isDark ? 'bg-neutral-950/60' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অনলাইন সেবা ও আবেদন ক্যাটালগ' : 'Digital Services & Online Catalog'}</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'bn' ? 'আমাদের সকল ডিজিটাল সেবা' : 'Explore All Digital Services'}
          </h2>

          <p className={`text-sm sm:text-base ${isDark ? 'text-neutral-400' : 'text-slate-600 font-medium'}`}>
            {language === 'bn'
              ? 'নিখুঁত কম্পিউটার কম্পোজ, ফটো ল্যাব, ডিফেন্স ও সরকারি চাকরির আবেদন এবং শিক্ষা সম্পর্কিত সব সমাধান এক ছাদের নিচে।'
              : 'One-stop solution for college admissions, defense applications, high-res printing, passport photography & computerized seals.'}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              id="cat-tab-all"
              onClick={() => setSelectedCategoryId('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isDark
                  ? 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              {language === 'bn' ? 'সকল সেবা' : 'All Services'}
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDark
                    ? 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-neutral-400' : 'text-slate-400'}`} />
            <input
              type="text"
              id="service-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'সার্ভিস খুঁজুন...' : 'Search services...'}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-100 placeholder:text-neutral-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-xs'
              }`}
            />
          </div>
        </div>

        {/* Services Grid with Visual Photography Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const category = categories.find(c => c.id === service.categoryId);
              const IconComponent = getCategoryIcon(category?.iconName || 'Layers');

              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: [0.25, 1, 0.5, 1] }}
                  whileHover={{ y: -5 }}
                  id={`service-card-${service.id}`}
                  className={`border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                    isDark
                      ? 'bg-neutral-900/90 border-neutral-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40'
                      : 'bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xl shadow-sm'
                  }`}
                >
                  <div>
                    {/* Service Photo Display Banner */}
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-950">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-950/50 via-neutral-900 to-teal-950/50 flex items-center justify-center">
                          <IconComponent className="w-12 h-12 text-emerald-400/40" />
                        </div>
                      )}

                      {/* Always dark gradient overlay on photo for crystal clear contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 pointer-events-none" />

                      {/* Floating Top Bar on Photo: Category & Popular Tag */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] font-semibold shadow-sm">
                          <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'bn' ? category?.nameBn : category?.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {service.isPopular && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-extrabold shadow-md flex items-center gap-1">
                              <span>🔥</span>
                              <span>{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom-right on Photo: Estimated Time Badge */}
                      <div className="absolute bottom-2.5 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-medium text-white">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{language === 'bn' ? service.estimatedTimeBn : service.estimatedTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 pt-4 space-y-3">
                      {/* Title */}
                      <h3 className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                        isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
                      }`}>
                        {language === 'bn' ? service.nameBn : service.name}
                      </h3>

                      {/* Description */}
                      <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                        isDark ? 'text-neutral-400' : 'text-slate-600'
                      }`}>
                        {language === 'bn' ? service.descriptionBn : service.description}
                      </p>

                      {/* Required Documents Tags */}
                      {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                        <div className={`space-y-1.5 p-2.5 rounded-xl border ${
                          isDark ? 'bg-neutral-950/70 border-neutral-800/80' : 'bg-slate-50 border-slate-200/90'
                        }`}>
                          <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                            isDark ? 'text-neutral-400' : 'text-slate-600 font-bold'
                          }`}>
                            <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র:' : 'Required Docs:'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(language === 'bn' ? service.requiredDocumentsBn : service.requiredDocuments).slice(0, 3).map((doc, idx) => (
                              <span
                                key={idx}
                                className={`text-[10px] px-2 py-0.5 rounded truncate max-w-[190px] border ${
                                  isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
                                }`}
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Bar: Price & Action */}
                  <div className={`p-5 pt-3 border-t flex items-center justify-between gap-3 ${
                    isDark ? 'border-neutral-800/80 bg-neutral-900/40' : 'border-slate-100 bg-slate-50/70'
                  }`}>
                    <div>
                      <span className={`text-[10px] block uppercase font-semibold ${
                        isDark ? 'text-neutral-400' : 'text-slate-500'
                      }`}>
                        {service.startingPrice ? (language === 'bn' ? 'শুরু মাত্র' : 'Starting From') : (language === 'bn' ? 'মূল্য' : 'Price')}
                      </span>
                      <span className={`text-lg sm:text-xl font-extrabold font-mono ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}>
                        ৳{service.price}
                      </span>
                    </div>

                    <button
                      id={`apply-service-btn-${service.id}`}
                      onClick={() => handleOpenModal(service)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all active:scale-95 hover:shadow-lg"
                    >
                      <span>{t('apply_online')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Service Application Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header with Visual Banner */}
            <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-neutral-950 shrink-0">
              {activeServiceModal.image ? (
                <img
                  src={activeServiceModal.image}
                  alt={activeServiceModal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-emerald-950 via-neutral-900 to-teal-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

              {/* Modal Close Button */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <button
                  id="close-service-modal-btn"
                  onClick={handleCloseModal}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header Details on Photo */}
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                  {language === 'bn' ? 'অনলাইন সেবা ও আবেদন' : 'Online Service Request'}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {language === 'bn' ? activeServiceModal.nameBn : activeServiceModal.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {createdAppNumber ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {language === 'bn' ? 'আবেদন সফলভাবে গ্রহণ করা হয়েছে!' : 'Application Successfully Submitted!'}
                    </h4>
                    <p className={`text-xs mt-1 ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                      {language === 'bn'
                        ? 'আমাদের অপারেটর আপনার আবেদনটি পর্যালোচনা শুরু করেছেন।'
                        : 'Our staff operator is now processing your request.'}
                    </p>
                  </div>

                  <div className={`border rounded-xl p-4 max-w-md mx-auto space-y-2 ${
                    isDark ? 'bg-neutral-950 border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <span className={`text-xs uppercase tracking-wide ${isDark ? 'text-neutral-400' : 'text-emerald-800 font-semibold'}`}>
                      {language === 'bn' ? 'আপনার আবেদন ট্র্যাকিং নম্বর' : 'Your Application Tracking ID'}
                    </span>
                    <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                      {createdAppNumber}
                    </div>
                    <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                      {language === 'bn'
                        ? 'এই নম্বরটি দিয়ে যেকোনো সময় আবেদন স্ট্যাটাস ট্র্যাক করতে পারবেন।'
                        : 'Use this ID to track your status anytime.'}
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (createdAppNumber) {
                          navigator.clipboard.writeText(createdAppNumber);
                          alert(language === 'bn' ? 'আবেদন নম্বর কপি করা হয়েছে!' : 'Tracking ID copied!');
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{language === 'bn' ? 'নম্বর কপি করুন' : 'Copy ID'}</span>
                    </button>

                    <button
                      id="view-tracker-now-btn"
                      onClick={() => {
                        if (onOpenTrackerWithId && createdAppNumber) {
                          onOpenTrackerWithId(createdAppNumber);
                        }
                        handleCloseModal();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <span>{t('track_status')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id="close-success-modal-btn"
                      onClick={handleCloseModal}
                      className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <form onSubmit={handleSubmitApplication} className="space-y-4">

                  {/* Service info summary */}
                  <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
                    isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className={`block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{language === 'bn' ? 'আনুমানিক সময়:' : 'Estimated Time:'}</span>
                      <span className={`font-semibold flex items-center gap-1 ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {language === 'bn' ? activeServiceModal.estimatedTimeBn : activeServiceModal.estimatedTime}
                      </span>
                    </div>
                    <div>
                      <span className={`block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>{language === 'bn' ? 'সার্ভিস চার্জ:' : 'Service Fee:'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-base">
                        ৳{activeServiceModal.price}
                      </span>
                    </div>
                  </div>

                  {/* Required Documents reminder */}
                  {activeServiceModal.requiredDocuments && (
                    <div className={`border p-3 rounded-xl text-xs space-y-1 ${
                      isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
                    }`}>
                      <div className={`font-semibold flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'প্রয়োজনীয় তথ্য ও ডকুমেন্টসমূহ:' : 'Required Information & Documents:'}</span>
                      </div>
                      <p className={`text-[11px] ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {(language === 'bn' ? activeServiceModal.requiredDocumentsBn : activeServiceModal.requiredDocuments).join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'আবেদনকারীর পুরো নাম *' : 'Applicant Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        id="applicant-name-input"
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        placeholder="e.g. Md. Sakib Al Amin"
                        className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:border-emerald-500 focus:outline-none transition-colors ${
                          isDark ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'সচল মোবাইল নম্বর *' : 'Mobile Number (for SMS & OTP) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        id="applicant-phone-input"
                        value={applicantPhone}
                        onChange={e => setApplicantPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono border focus:border-emerald-500 focus:outline-none transition-colors ${
                          isDark ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      id="applicant-email-input"
                      value={applicantEmail}
                      onChange={e => setApplicantEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:border-emerald-500 focus:outline-none transition-colors ${
                        isDark ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>

                  {/* Customer Notes / Extra info */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'কাস্টমার নোট / বিশেষ নির্দেশনা' : 'Customer Notes / Instructions'}
                    </label>
                    <textarea
                      rows={2}
                      id="applicant-notes-input"
                      value={customerNotes}
                      onChange={e => setCustomerNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'রোল নং, রেজিস্ট্রেশন নং বা জরুরি কোনো তথ্য লিখুন...' : 'Enter roll no, reg no, or any specific details...'}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border focus:border-emerald-500 focus:outline-none transition-colors ${
                        isDark ? 'bg-neutral-950 border-neutral-700 text-neutral-100 placeholder:text-neutral-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>

                  {/* Document upload / attachment */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'প্রয়োজনীয় ফাইল / ছবি আপলোড (ঐচ্ছিক)' : 'Upload Files / Photos (Optional)'}
                    </label>
                    <div className={`border border-dashed rounded-xl p-4 text-center relative transition-colors ${
                      isDark ? 'border-neutral-700 bg-neutral-950/60 hover:border-emerald-500/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-500'
                    }`}>
                      <input
                        type="file"
                        multiple
                        id="applicant-file-input"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className={`w-5 h-5 mx-auto mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-400'}`} />
                      <span className={`text-xs block ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                        {language === 'bn' ? 'ছবি বা পিডিএফ ফাইল ড্র্যাগ করুন অথবা ক্লিক করুন' : 'Click or Drag files to attach'}
                      </span>
                      <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>JPG, PNG, PDF (Max 10MB)</span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadedFiles.map((file, i) => (
                          <div key={i} className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs ${
                            isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}>
                            <span className="truncate max-w-[200px]">{file.name}</span>
                            <span className="text-[10px] text-emerald-500 font-semibold">Attached</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className={`block text-xs font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                      {language === 'bn' ? 'পেমেন্ট পদ্ধতি নির্বাচন করুন' : 'Select Payment Method'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        id="pay-cash-btn"
                        onClick={() => setPaymentMethod('cash_counter')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'cash_counter'
                            ? (isDark ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold')
                            : (isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-700')
                        }`}
                      >
                        🏪 {language === 'bn' ? 'দোকানে ক্যাশ' : 'Cash at Counter'}
                      </button>

                      <button
                        type="button"
                        id="pay-bkash-btn"
                        onClick={() => setPaymentMethod('bkash')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'bkash'
                            ? (isDark ? 'bg-pink-600/20 border-pink-500 text-pink-300' : 'bg-pink-50 border-pink-500 text-pink-800 font-bold')
                            : (isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-700')
                        }`}
                      >
                        📱 বিকাশ (bKash)
                      </button>

                      <button
                        type="button"
                        id="pay-nagad-btn"
                        onClick={() => setPaymentMethod('nagad')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'nagad'
                            ? (isDark ? 'bg-orange-600/20 border-orange-500 text-orange-300' : 'bg-orange-50 border-orange-500 text-orange-800 font-bold')
                            : (isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-700')
                        }`}
                      >
                        💳 নগদ (Nagad)
                      </button>
                    </div>
                  </div>

                  {/* TrxID input for bKash/Nagad */}
                  {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                    <div className={`p-3 rounded-xl space-y-2 text-xs border ${
                      isDark ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      <p>
                        {language === 'bn'
                          ? `আমাদের ${paymentMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পার্সোনাল/মার্চেন্ট নম্বরে ৳${activeServiceModal.price} সেন্ড মানি করুন:`
                          : `Send ৳${activeServiceModal.price} to our ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number:`}
                        <strong className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mt-0.5">
                          {settings.phone || '01540004966'}
                        </strong>
                      </p>
                      <div>
                        <label className={`block mb-1 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                          {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) দিন' : 'Enter Transaction ID (TrxID)'}
                        </label>
                        <input
                          type="text"
                          id="trxid-input"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          placeholder="e.g. 9J8A7K6L"
                          className={`w-full px-3 py-1.5 rounded-lg text-xs font-mono border focus:border-emerald-500 focus:outline-none ${
                            isDark ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className={`pt-3 flex items-center justify-end gap-3 border-t ${
                    isDark ? 'border-neutral-800' : 'border-slate-200'
                  }`}>
                    <button
                      type="button"
                      id="cancel-service-app-btn"
                      onClick={() => setActiveServiceModal(null)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      id="submit-service-app-btn"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{language === 'bn' ? 'সাবমিট হচ্ছে...' : 'Submitting...'}</span>
                      ) : (
                        <>
                          <span>{language === 'bn' ? 'আবেদন নিশ্চিত করুন' : 'Confirm Application'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
