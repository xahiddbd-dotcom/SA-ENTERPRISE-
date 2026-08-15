import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Service, ServiceCategory } from '../../types';
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
  AlertCircle
} from 'lucide-react';

interface ServicesSectionProps {
  onOpenTrackerWithId?: (appId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenTrackerWithId }) => {
  const { language, t } = useLanguage();
  const { services, categories, createApplication, settings } = useData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);

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
    <section id="services-marketplace" className="py-16 bg-neutral-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অনলাইন সেবা ও আবেদন ক্যাটালগ' : 'Digital Services & Online Catalog'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {language === 'bn' ? 'আমাদের সকল ডিজিটাল সেবা' : 'Explore All Digital Services'}
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base">
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
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
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
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <span>{language === 'bn' ? cat.nameBn : cat.name}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="service-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'সার্ভিস খুঁজুন...' : 'Search services...'}
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const category = categories.find(c => c.id === service.categoryId);
            const IconComponent = getCategoryIcon(category?.iconName || 'Layers');

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20 group"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <IconComponent className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span>{language === 'bn' ? category?.nameBn : category?.name}</span>
                    </div>

                    {service.isPopular && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                        🔥 {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
                    {language === 'bn' ? service.nameBn : service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                    {language === 'bn' ? service.descriptionBn : service.description}
                  </p>

                  {/* Required Documents Tags */}
                  {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                    <div className="mb-4 space-y-1.5 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-850">
                      <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-emerald-400" />
                        {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র:' : 'Required Docs:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(language === 'bn' ? service.requiredDocumentsBn : service.requiredDocuments).slice(0, 3).map((doc, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 truncate max-w-[200px]"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Price & Action */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 block uppercase font-medium">
                      {service.startingPrice ? (language === 'bn' ? 'শুরু মাত্র' : 'Starting From') : (language === 'bn' ? 'মূল্য' : 'Price')}
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      ৳{service.price}
                    </span>
                  </div>

                  <button
                    id={`apply-service-btn-${service.id}`}
                    onClick={() => handleOpenModal(service)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
                  >
                    <span>{t('apply_online')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Application Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase">
                  {language === 'bn' ? 'অনলাইন আবেদন ও সেবা ফরম' : 'Online Service Request'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {language === 'bn' ? activeServiceModal.nameBn : activeServiceModal.name}
                </h3>
              </div>
              <button
                id="close-service-modal-btn"
                onClick={() => setActiveServiceModal(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {createdAppNumber ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {language === 'bn' ? 'আবেদন সফলভাবে গ্রহণ করা হয়েছে!' : 'Application Successfully Submitted!'}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      {language === 'bn'
                        ? 'আমাদের অপারেটর আপনার আবেদনটি পর্যালোচনা শুরু করেছেন।'
                        : 'Our staff operator is now processing your request.'}
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-emerald-500/30 rounded-xl p-4 max-w-md mx-auto space-y-2">
                    <span className="text-xs text-neutral-400 uppercase tracking-wide">
                      {language === 'bn' ? 'আপনার আবেদন ট্র্যাকিং নম্বর' : 'Your Application Tracking ID'}
                    </span>
                    <div className="text-2xl font-mono font-extrabold text-emerald-400 tracking-wider">
                      {createdAppNumber}
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {language === 'bn'
                        ? 'এই নম্বরটি দিয়ে যেকোনো সময় আবেদন স্ট্যাটাস ট্র্যাক করতে পারবেন।'
                        : 'Use this ID to track your status anytime.'}
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <button
                      id="view-tracker-now-btn"
                      onClick={() => {
                        if (onOpenTrackerWithId && createdAppNumber) {
                          onOpenTrackerWithId(createdAppNumber);
                        }
                        setActiveServiceModal(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2"
                    >
                      <span>{t('track_status')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id="close-success-modal-btn"
                      onClick={() => setActiveServiceModal(null)}
                      className="px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold"
                    >
                      {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Service info summary */}
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-neutral-400 block">{language === 'bn' ? 'আনুমানিক সময়:' : 'Estimated Time:'}</span>
                      <span className="text-neutral-200 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {language === 'bn' ? activeServiceModal.estimatedTimeBn : activeServiceModal.estimatedTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">{language === 'bn' ? 'সার্ভিস চার্জ:' : 'Service Fee:'}</span>
                      <span className="text-emerald-400 font-mono font-bold text-base">
                        ৳{activeServiceModal.price}
                      </span>
                    </div>
                  </div>

                  {/* Required Documents reminder */}
                  {activeServiceModal.requiredDocuments && (
                    <div className="bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl text-xs space-y-1">
                      <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'প্রয়োজনীয় তথ্য ও ডকুমেন্টসমূহ:' : 'Required Information & Documents:'}</span>
                      </div>
                      <p className="text-neutral-300 text-[11px]">
                        {(language === 'bn' ? activeServiceModal.requiredDocumentsBn : activeServiceModal.requiredDocuments).join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'আবেদনকারীর পুরো নাম *' : 'Applicant Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        id="applicant-name-input"
                        value={applicantName}
                        onChange={e => setApplicantName(e.target.value)}
                        placeholder="e.g. Md. Sakib Al Amin"
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {language === 'bn' ? 'সচল মোবাইল নম্বর *' : 'Mobile Number (for SMS & OTP) *'}
                      </label>
                      <input
                        type="tel"
                        required
                        id="applicant-phone-input"
                        value={applicantPhone}
                        onChange={e => setApplicantPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 font-mono focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                    </label>
                    <input
                      type="email"
                      id="applicant-email-input"
                      value={applicantEmail}
                      onChange={e => setApplicantEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'প্রয়োজনীয় বিবরণ / রোল / রেজিস্ট্রেশন / তথ্য' : 'Application Details / Roll / Reg / Special Instructions'}
                    </label>
                    <textarea
                      rows={2}
                      id="applicant-notes-input"
                      value={customerNotes}
                      onChange={e => setCustomerNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: তেজগাঁও কলেজ BBA ৪র্থ সেমিস্টার, রোল: ১২৩৪৫...' : 'e.g., Tejgaon College Roll, SSC Reg number, Army Batch details...'}
                      className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs sm:text-sm text-neutral-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Document upload attachment */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {language === 'bn' ? 'ডকুমেন্ট বা ছবি ফাইল সংযুক্ত করুন (ঐচ্ছিক)' : 'Attach Documents / Photos (Optional)'}
                    </label>
                    <div className="border-2 border-dashed border-neutral-700 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer bg-neutral-950 relative">
                      <input
                        type="file"
                        multiple
                        id="document-upload-input"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                      <p className="text-xs text-neutral-300">
                        {language === 'bn' ? 'ফাইল সিলেক্ট করতে এখানে ক্লিক করুন (PDF, JPG, PNG)' : 'Click to browse files (PDF, JPG, PNG)'}
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {uploadedFiles.map((file, i) => (
                          <span key={i} className="text-[11px] px-2 py-1 rounded bg-neutral-800 text-emerald-400 border border-neutral-700">
                            📎 {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment selection */}
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <label className="block text-xs font-semibold text-white">
                      {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Payment Preference'}
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        id="pay-cash-btn"
                        onClick={() => setPaymentMethod('cash_counter')}
                        className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'cash_counter'
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        {language === 'bn' ? 'দোকানে নগদ' : 'Cash at Shop'}
                      </button>

                      <button
                        type="button"
                        id="pay-bkash-btn"
                        onClick={() => setPaymentMethod('bkash')}
                        className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'bkash'
                            ? 'bg-pink-950/40 border-pink-500 text-pink-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        bKash
                      </button>

                      <button
                        type="button"
                        id="pay-nagad-btn"
                        onClick={() => setPaymentMethod('nagad')}
                        className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                          paymentMethod === 'nagad'
                            ? 'bg-amber-950/40 border-amber-500 text-amber-400'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                        }`}
                      >
                        Nagad
                      </button>
                    </div>

                    {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                      <div className="text-xs space-y-2 bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                        <p className="text-neutral-300 text-[11px]">
                          {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Personal: <strong className="text-emerald-400 font-mono">{settings.bkashNumber}</strong>
                        </p>
                        <input
                          type="text"
                          id="payment-trx-id-input"
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          placeholder="Enter Transaction TrxID (e.g. BK99X8821Z)"
                          className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100 font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveServiceModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      id="confirm-application-btn"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>{language === 'bn' ? 'দাখিল হচ্ছে...' : 'Submitting...'}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'bn' ? 'আবেদন দাখিল করুন' : 'Submit Application'}</span>
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
