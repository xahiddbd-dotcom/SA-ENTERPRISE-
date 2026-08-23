import {
  ServiceCategory,
  Service,
  GsmOption,
  Product,
  User,
  Order,
  Application,
  Expense,
  WebsiteSettings,
  NavigationMenu,
  CMSPage,
  InventoryItem,
  POSSale,
  HeroSlide,
  SectionSEO,
  DailyCounterSale,
  StoreExpenseRecord,
  OperatorDailyLedger,
  StoreLedgerSettings
} from '../types';

export const initialSettings: WebsiteSettings = {
  businessName: "Saiful Enterprise",
  businessNameBn: "সাইফুল এন্টারপ্রাইজ",
  tagline: "Computer, Photocopy, Printing, Online Application & Digital Service Center",
  taglineBn: "আপনার বিশ্বস্ত ডিজিটাল সার্ভিস, কম্পিউটার ও অনলাইন আবেদন সেন্টার",
  phonePrimary: "01540004966",
  phoneSecondary: "01517992585",
  whatsappNumber: "01517992585",
  bkashNumber: "01517992585",
  nagadNumber: "01517992585",
  email: "saifulenterprise.dhaka@gmail.com",
  address: "20/1, Sagar-Saikat Market, Shop No. 02, Indira Road, Beside Tejgaon College, Farmgate, Dhaka-1215",
  addressBn: "২০/১, সাগর-সৈকত মার্কেট, দোকান নং ০২, ইন্দিরা রোড, তেজগাঁও কলেজের পাশে, ফার্মগেট, ঢাকা-১২১৫",
  openingHours: "Saturday - Thursday: 8:30 AM - 10:30 PM, Friday: 2:30 PM - 10:00 PM",
  openingHoursBn: "শনিবার - বৃহস্পতিবার: সকাল ৮:৩০ - রাত ১০:৩০, শুক্রবার: দুপুর ২:৩০ - রাত ১০:০০",
  isShopOpen: true,
  heroIntervalSeconds: 35,
  heroBackgroundOpacity: 50,
  noticeBanner: "🔥 বিশেষ সেবা: তেজগাঁও কলেজ ভর্তি ও সেমিস্টার ফি জমা, বিএমইটি (BMET) ও পুলিশ ক্লিয়ারেন্স আবেদন চলছে।",
  noticeBannerBn: "🔥 বিশেষ সেবা: তেজগাঁও কলেজ ভর্তি ও সেমিস্টার ফি জমা, বিএমইটি (BMET) ও পুলিশ ক্লিয়ারেন্স আবেদন চলছে।",
  showNoticeBanner: true,
  tejgaonCollegeHighlight: "Official Student Assistance Point for Tejgaon College - Right Next Door!",
  tejgaonCollegeHighlightBn: "তেজগাঁও কলেজের পাশে আমাদের দোকান থেকে দ্রুততম সময়ে ভর্তি ফরম ও ফি প্রদান করুন।",
  facebookUrl: "https://facebook.com",
  whatsappUrl: "https://wa.me/8801517992585",
  googleMapUrl: "https://maps.google.com/?q=Tejgaon+College+Indira+Road+Dhaka",
  currencySymbol: "৳",
  taxRate: 0,
  deliveryChargeInsideDhaka: 60,
  deliveryChargeOutsideDhaka: 120,
  minOrderAmount: 100,
  maintenanceMode: false
};

export const initialCategories: ServiceCategory[] = [
  {
    id: "cat_education",
    slug: "education-admission",
    name: "Education & Admission Services",
    nameBn: "শিক্ষা ও কলেজ ভর্তি সেবা",
    description: "Tejgaon College admission, fee payment, NU certificates and online forms",
    descriptionBn: "তেজগাঁও কলেজ ভর্তি ও ফি জমা, জাতীয় বিশ্ববিদ্যালয় সার্টিফিকেট ও মার্কশীট আবেদন",
    iconName: "GraduationCap",
    featured: true,
    order: 1
  },
  {
    id: "cat_defense",
    slug: "defense-recruitment",
    name: "Defense Recruitment Assistance",
    nameBn: "প্রতিরক্ষা বাহিনী অনলাইন আবেদন",
    description: "Bangladesh Army, Navy, Air Force, ISSB and Cadet College online application assistance",
    descriptionBn: "বাংলাদেশ সেনাবাহিনী, নৌবাহিনী, বিমানবাহিনী, আইএসএসবি ও ক্যাডেট কলেজ আবেদন",
    iconName: "ShieldAlert",
    featured: true,
    order: 2
  },
  {
    id: "cat_govt",
    slug: "govt-services",
    name: "Government & Online Services",
    nameBn: "সরকারি ও জরুরি অনলাইন সেবা",
    description: "BMET registration, Police Clearance, Birth Registration correction, E-Passport assistance",
    descriptionBn: "বিএমইটি (BMET) রেজিস্ট্রেশন, পুলিশ ক্লিয়ারেন্স, ই-পাসপোর্ট ও সরকারি চাকরির আবেদন",
    iconName: "Building2",
    featured: true,
    order: 3
  },
  {
    id: "cat_computer_print",
    slug: "computer-printing",
    name: "Computer & Printing Services",
    nameBn: "কম্পিউটার ও প্রিন্টিং সেবা",
    description: "Typing, Color/B&W printing, high-speed photocopy, scanning, PDF conversion & formatting",
    descriptionBn: "কম্পিউটার টাইপিং, কালার ও সাদা-কালো প্রিন্ট, ফটোকপি, স্ক্যান, পিডিএফ এডিটিং",
    iconName: "Printer",
    featured: true,
    order: 4
  },
  {
    id: "cat_photo",
    slug: "photo-services",
    name: "Photo & Studio Services",
    nameBn: "ফটো ও স্টুডিও সার্ভিস",
    description: "Instant passport photo, stamp size, photo from old photo, background change, resize",
    descriptionBn: "জরুরি পাসপোর্ট ছবি, ছবি থেকে ছবি, ব্যাকগ্রাউন্ড চেঞ্জ, আইডি কার্ড সাইজ প্রিন্ট",
    iconName: "Camera",
    featured: true,
    order: 5
  },
  {
    id: "cat_physical",
    slug: "binding-seal",
    name: "Lamination, Binding & Seals",
    nameBn: "লেমিনেশন, বাইন্ডিং ও সিল মোহর",
    description: "Spiral binding, book binding, hot lamination, computerized rubber seals",
    descriptionBn: "স্পাইরাল বাইন্ডিং, বই বাঁধাই, হট লেমিনেশন ও নিখুঁত কম্পিউটারাইজড রাবার সিল",
    iconName: "Layers",
    featured: false,
    order: 6
  }
];

export const initialServices: Service[] = [
  // Education
  {
    id: "srv_tc_admission",
    categoryId: "cat_education",
    name: "Tejgaon College Admission Form Fill-up",
    nameBn: "তেজগাঁও কলেজ ভর্তি ফরম পূরণ ও সাবমিশন",
    description: "Fast, error-free online admission form fill-up for Honors, Degree, HSC & Masters of Tejgaon College with invoice copy.",
    descriptionBn: "তেজগাঁও কলেজের অনার্স, ডিগ্রি, এইচএসসি ও মাস্টার্স ভর্তি ফরম নিখুঁতভাবে পূরণ এবং কনফার্মেশন প্রিন্ট।",
    price: 100,
    startingPrice: true,
    estimatedTime: "15 - 30 Minutes",
    estimatedTimeBn: "১৫ - ৩০ মিনিট",
    requiredDocuments: ["Roll & Registration number", "Passport size photo (Soft copy)", "Mobile number", "SSC/HSC Transcript"],
    requiredDocumentsBn: ["রোল ও রেজিস্ট্রেশন নম্বর", "পাসপোর্ট সাইজ ছবি", "সচল মোবাইল নম্বর", "মার্কশীট/ট্রান্সক্রিপ্ট"],
    instructions: "Please bring your original marksheets and mobile for SMS verification code.",
    instructionsBn: "এসএমএস ওটিপি ভেরিফিকেশনের জন্য সচল সিমযুক্ত মোবাইল সাথে রাখুন।",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 1
  },
  {
    id: "srv_tc_fees",
    categoryId: "cat_education",
    name: "Tejgaon College Semester & Exam Fee Payment",
    nameBn: "তেজগাঁও কলেজ সেমিস্টার ও পরীক্ষার ফি প্রদান",
    description: "Instant college fee payment via Sonali e-Sheba/bKash/Nagad student gateway with verified money receipt.",
    descriptionBn: "সোনালী ই-সেবা বা ডিজিটাল গেটওয়ের মাধ্যমে দ্রুত কলেজ ফি পেমেন্ট ও ভেরিফাইড মানি রিসিট।",
    price: 50,
    startingPrice: true,
    estimatedTime: "10 Minutes",
    estimatedTimeBn: "১০ মিনিট",
    requiredDocuments: ["Student ID / College Roll", "Payment Slip / Notice", "Fee amount"],
    requiredDocumentsBn: ["স্টুডেন্ট আইডি / কলেজ রোল", "পেমেন্ট নোটিশ", "নির্দিষ্ট ফি"],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 2
  },
  {
    id: "srv_nu_services",
    categoryId: "cat_education",
    name: "National University Certificate & Transcript Apply",
    nameBn: "জাতীয় বিশ্ববিদ্যালয় মূল সনদ ও ট্রান্সক্রিপ্ট আবেদন",
    description: "Online application processing for Provisional Certificate, Original Certificate, Marksheet & Corrections in NU portal.",
    descriptionBn: "জাতীয় বিশ্ববিদ্যালয়ের সাময়িক ও মূল সনদ, নম্বরপত্র উত্তোলন এবং সংশোধনের পূর্ণাঙ্গ অনলাইন আবেদন।",
    price: 250,
    startingPrice: true,
    estimatedTime: "1 - 2 Hours",
    estimatedTimeBn: "১ - ২ ঘন্টা",
    requiredDocuments: ["Admit Card Copy", "Registration Card", "Marksheet Copy", "National ID (NID)"],
    requiredDocumentsBn: ["প্রবেশপত্র", "রেজিস্ট্রেশন কার্ড", "নম্বরপত্র", "জাতীয় পরিচয়পত্র"],
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: false,
    isActive: true,
    order: 3
  },
  // Defense Services
  {
    id: "srv_army_apply",
    categoryId: "cat_defense",
    name: "Bangladesh Army Recruitment Application",
    nameBn: "বাংলাদেশ সেনাবাহিনী সৈনিক ও অফিসার ক্যাডেট আবেদন",
    description: "Complete online application assistance with accurate quota, trade selection, photo resize & admit card download.",
    descriptionBn: "সৈনিক ও অফিসার ক্যাডেট পদের নিখুঁত ফরম পূরণ, সঠিক ট্রেড নির্বাচন, ছবি-স্বাক্ষর রিসাইজ ও অ্যাডমিট ডাউনলোড।",
    price: 200,
    startingPrice: true,
    estimatedTime: "20 - 30 Minutes",
    estimatedTimeBn: "২০ - ৩০ মিনিট",
    requiredDocuments: ["SSC/HSC Roll & Reg", "Passport Photo & Signature", "Height/Weight & Guardian NID"],
    requiredDocumentsBn: ["এসএসসি/এইচএসসি তথ্য", "পাসপোর্ট ছবি ও স্বাক্ষর", "উচ্চতা/ওজন ও অভিভাবকের এনআইডি"],
    instructions: "Notice: We only provide technical application fill-up assistance.",
    instructionsBn: "সতর্কবার্তা: আমরা কেবল আবেদন ফরম পূরণের কারিগরি সহায়তা প্রদান করি।",
    image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 4
  },
  {
    id: "srv_navy_airforce",
    categoryId: "cat_defense",
    name: "Navy & Air Force Online Application Assistance",
    nameBn: "নৌবাহিনী ও বিমানবাহিনী নাবিক/অফিসার আবেদন",
    description: "Assistance with official sailor, airman & officer cadet online application processing.",
    descriptionBn: "নৌবাহিনী নাবিক ও বিমানবাহিনী বিমানসেনা ও অফিসার পদের জন্য অনলাইন আবেদন ফরম পূরণ।",
    price: 200,
    startingPrice: true,
    estimatedTime: "20 - 30 Minutes",
    estimatedTimeBn: "২০ - ৩০ মিনিট",
    requiredDocuments: ["Certificates & Photos", "Signature & NID/Birth Reg"],
    requiredDocumentsBn: ["সনদপত্র ও পাসপোর্ট ছবি", "স্বাক্ষর ও এনআইডি/জন্মনিবন্ধন"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isActive: true,
    order: 5
  },
  // Government & Online
  {
    id: "srv_bmet_reg",
    categoryId: "cat_govt",
    name: "BMET Biometric & Ami Probashi Registration",
    nameBn: "বিএমইটি (BMET) ও আমি প্রবাসী রেজিস্ট্রেশন",
    description: "Biometric appointment, passport profile verification, BMET clearance card online form fill-up for foreign employment.",
    descriptionBn: "বিদেশগামী কর্মীদের বিএমইটি ফিঙ্গারপ্রিন্ট অ্যাপয়েন্টমেন্ট, প্রোফাইল তৈরি ও কার্ড আবেদন।",
    price: 300,
    startingPrice: true,
    estimatedTime: "30 - 45 Minutes",
    estimatedTimeBn: "৩০ - ৪৫ মিনিট",
    requiredDocuments: ["Original Passport", "NID / Birth Certificate", "Active Mobile No"],
    requiredDocumentsBn: ["মূল পাসপোর্ট", "জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন", "সচল মোবাইল নম্বর"],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 6
  },
  {
    id: "srv_police_clearance",
    categoryId: "cat_govt",
    name: "Online Police Clearance Certificate Application",
    nameBn: "অনলাইন পুলিশ ক্লিয়ারেন্স সার্টিফিকেট আবেদন",
    description: "Official Police Clearance portal application, 500 BDT treasury chalan automated submission, and real-time tracking.",
    descriptionBn: "বাংলাদেশ পুলিশ ক্লিয়ারেন্স সার্টিফিকেট অনলাইন আবেদন, ৫০০ টাকার চালান ফি জমা ও ট্র্যাকিং।",
    price: 300,
    startingPrice: true,
    estimatedTime: "30 - 45 Minutes",
    estimatedTimeBn: "৩০ - ৪৫ মিনিট",
    requiredDocuments: ["Passport Copy (Attested)", "500 BDT Treasury Chalan", "Ward Commissioner/Chairman Certificate", "NID Copy"],
    requiredDocumentsBn: ["পাসপোর্টের সত্যায়িত কপি", "৫০০ টাকার ট্রেজারি চালান", "কাউন্সিলর/চেয়ারম্যান প্রত্যয়ন", "এনআইডি"],
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 7
  },
  // Printing & Computer
  {
    id: "srv_typing_bengali_english",
    categoryId: "cat_computer_print",
    name: "Bangla & English Fast Typing & Document Design",
    nameBn: "বাংলা ও ইংরেজি দ্রুত টাইপিং এবং ডকুমেন্ট ডিজাইন",
    description: "High-speed professional Bangla (Bijoy/Avro) and English typing, CV/Resume creation, project report formatting.",
    descriptionBn: "বাংলা ও ইংরেজি দ্রুত ও নির্ভুল টাইপিং, সিভি/বায়োডাটা তৈরি এবং অফিশিয়াল ডকুমেন্ট ফরম্যাটিং।",
    price: 30,
    startingPrice: true,
    estimatedTime: "15 - 30 Minutes",
    estimatedTimeBn: "১৫ - ৩০ মিনিট",
    requiredDocuments: ["Draft / Written Copy"],
    requiredDocumentsBn: ["খসড়া কপি বা ফাইল"],
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isActive: true,
    order: 8
  },
  {
    id: "srv_laser_print_photocopy",
    categoryId: "cat_computer_print",
    name: "High-Speed Laser Printing & Heavy Duty Photocopy",
    nameBn: "হাই-স্পিড লেজার প্রিন্ট ও ফটোকপি (A4/Legal)",
    description: "Crystal clear monochrome & laser color prints, book photocopy, thesis printing on 70/80 GSM Paper.",
    descriptionBn: "লেজার প্রিন্ট ও বাল্ক ফটোকপি, প্রজেক্ট বুক ও থিসিস প্রিন্ট সাশ্রয়ী মূল্যে।",
    price: 3,
    startingPrice: true,
    estimatedTime: "Instant (5-15 Mins)",
    estimatedTimeBn: "তাত্ক্ষণিক (৫-১৫ মিনিট)",
    requiredDocuments: ["Pen Drive / PDF / Docx / Hard Copy"],
    requiredDocumentsBn: ["পেনড্রাইভ / পিডিএফ ফাইল / মূল কপি"],
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 9
  },
  // Photo
  {
    id: "srv_passport_photo",
    categoryId: "cat_photo",
    name: "5-Minute Urgent Passport & Stamp Size Photo",
    nameBn: "জরুরি পাসপোর্ট ও স্ট্যাম্প সাইজ ছবি (৫ মিনিটে)",
    description: "DSLR digital studio capture, dress change, background change to white/blue, instant lab-quality glossy photo print.",
    descriptionBn: "ডিএসএলআর স্টুডিও ছবি, কোট-টাই/ড্রেস পরিবর্তন, ব্যাকগ্রাউন্ড চেঞ্জ ও ওয়াটারপ্রুফ গ্লসি প্রিন্ট।",
    price: 50,
    startingPrice: true,
    estimatedTime: "5 - 10 Minutes",
    estimatedTimeBn: "৫ - ১০ মিনিট",
    requiredDocuments: ["Self present for capture OR old photo/softcopy"],
    requiredDocumentsBn: ["সরাসরি ছবি তোলা অথবা পুরনো ছবি"],
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPopular: true,
    isActive: true,
    order: 10
  },
  // Physical / Binding
  {
    id: "srv_spiral_binding_lamination",
    categoryId: "cat_physical",
    name: "Spiral Binding, Hard Binding & Hot Lamination",
    nameBn: "স্পাইরাল বাইন্ডিং, হার্ড কভার ও হট লেমিনেশন",
    description: "Durable PVC spiral ring binding, certificate hot pouch lamination, project hard cover with gold embossing.",
    descriptionBn: "পিভিসি স্পাইরাল বাইন্ডিং, সার্টিফিকেট ও এনআইডি হট লেমিনেশন এবং হার্ড কভার বাইন্ডিং।",
    price: 40,
    startingPrice: true,
    estimatedTime: "10 - 20 Minutes",
    estimatedTimeBn: "১০ - ২০ মিনিট",
    requiredDocuments: ["Printed Sheets or Certificate"],
    requiredDocumentsBn: ["প্রিন্ট করা কাগজ বা মূল সনদ"],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    isActive: true,
    order: 11
  }
];

export const initialGsmOptions: GsmOption[] = [
  { id: "gsm_70", gsm: 70, label: "70 GSM", description: "Standard photocopying, office draft printing & everyday college notes." },
  { id: "gsm_75", gsm: 75, label: "75 GSM", description: "High-speed laser printing & double-sided smooth photocopying." },
  { id: "gsm_80", gsm: 80, label: "80 GSM", description: "Premium executive paper, official project reports, contracts & presentations." },
  { id: "gsm_100", gsm: 100, label: "100 GSM", description: "Heavyweight letterheads, certificates, and premium color brochures." },
  { id: "gsm_120", gsm: 120, label: "120 GSM", description: "Ultra-premium presentation sheets, covers and graphic art prints." }
];

export const initialProducts: Product[] = [
  {
    id: "prod_a4_70",
    sku: "PAP-DA-A4-70",
    name: "Double A Copier Paper A4 70 GSM",
    nameBn: "ডাবল এ ফটোকপি পেপার A4 ৭০ জিএসএম",
    description: "Premium smooth Thai copy paper for jam-free printing and crystal clear photocopy. 500 sheets per ream.",
    descriptionBn: "থাইল্যান্ডের প্রিমিয়াম কোয়ালিটি ডাবল এ ফটোকপি পেপার। জাম-মুক্ত প্রিন্টিং ও দীর্ঘস্থায়ী উজ্জ্বলতা। ৫০০ শিট প্রতি রিম।",
    categoryId: "paper_a4",
    brand: "Double A",
    gsm: 70,
    packSize: "1 Ream (500 Sheets)",
    packSizeBn: "১ রিম (৫০০ শিট)",
    price: 360,
    discountPrice: 340,
    stock: 120,
    lowStockThreshold: 15,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    specifications: {
      "Size": "A4 (210 x 297 mm)",
      "GSM": "70 GSM",
      "Sheets": "500 Sheets/Ream",
      "Origin": "Thailand",
      "Whiteness": "148-152 CIE"
    }
  },
  {
    id: "prod_a4_80",
    sku: "PAP-DA-A4-80",
    name: "Double A Premium Paper A4 80 GSM",
    nameBn: "ডাবল এ প্রিমিয়াম পেপার A4 ৮০ জিএসএম",
    description: "Extra thick 80 GSM high whiteness paper for professional thesis, legal contracts, and high-impact color laser printing.",
    descriptionBn: "অতিরিক্ত পুরু ৮০ জিএসএম কাগজ। থিসিস পেপার, অফিশিয়াল চুক্তিপত্র এবং নিখুঁত কালার লেজার প্রিন্টের জন্য সেরা।",
    categoryId: "paper_a4",
    brand: "Double A",
    gsm: 80,
    packSize: "1 Ream (500 Sheets)",
    packSizeBn: "১ রিম (৫০০ শিট)",
    price: 430,
    discountPrice: 410,
    stock: 85,
    lowStockThreshold: 10,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    specifications: {
      "Size": "A4 (210 x 297 mm)",
      "GSM": "80 GSM",
      "Sheets": "500 Sheets/Ream",
      "Origin": "Thailand",
      "Whiteness": "165 CIE"
    }
  },
  {
    id: "prod_paperone_80",
    sku: "PAP-PO-A4-80",
    name: "PaperOne Digital Copier Paper A4 80 GSM",
    nameBn: "পেপার ওয়ান ডিজিটাল ফটোকপি পেপার A4 ৮০ জিএসএম",
    description: "ProDigi HD Print technology enhanced paper with fast ink drying and sharp contrast for color inkjet and laser.",
    descriptionBn: "প্রোডিজি এইচডি টেকনোলজি সমৃদ্ধ পেপার ওয়ান ৮০ জিএসএম পেপার। দ্রুত শুকায় এবং কালার প্রিন্ট হয় চমৎকার।",
    categoryId: "paper_a4",
    brand: "PaperOne",
    gsm: 80,
    packSize: "1 Ream (500 Sheets)",
    packSizeBn: "১ রিম (৫০০ শিট)",
    price: 420,
    discountPrice: 395,
    stock: 65,
    lowStockThreshold: 10,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    specifications: {
      "Size": "A4 (210 x 297 mm)",
      "GSM": "80 GSM",
      "Sheets": "500 Sheets/Ream",
      "Origin": "Indonesia"
    }
  },
  {
    id: "prod_legal_80",
    sku: "PAP-DA-LEG-80",
    name: "Double A Legal Size Paper 80 GSM (8.5 x 14 in)",
    nameBn: "ডাবল এ লিগ্যাল সাইজ পেপার ৮০ জিএসএম",
    description: "Standard Legal length paper for court documents, deeds, land stamp prints & legal agreements.",
    descriptionBn: "কোর্ট এফিডেভিট, জমিজমার দলিল, চুক্তিপত্র ও সরকারি আইনি দলিলের জন্য লিগ্যাল সাইজ প্রিমিয়াম পেপার।",
    categoryId: "paper_legal",
    brand: "Double A",
    gsm: 80,
    packSize: "1 Ream (500 Sheets)",
    packSizeBn: "১ রিম (৫০০ শিট)",
    price: 520,
    discountPrice: 490,
    stock: 40,
    lowStockThreshold: 8,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    specifications: {
      "Size": "Legal (8.5 x 14 inches / 216 x 356 mm)",
      "GSM": "80 GSM",
      "Sheets": "500 Sheets/Ream"
    }
  },
  {
    id: "prod_photo_paper_230",
    sku: "STA-PHOTO-230",
    name: "High Gloss Waterproof RC Photo Paper A4 230 GSM",
    nameBn: "হাই গ্লস ওয়াটারপ্রুফ ফটো পেপার A4 ২৩০ জিএসএম",
    description: "Professional resin-coated instant-dry waterproof photo paper for ultra-vivid portraits, studio photos and album prints.",
    descriptionBn: "প্রফেশনাল স্টুডিও কোয়ালিটি গ্লসি ফটো পেপার। ছবি থাকে দীর্ঘস্থায়ী ও পানিরোধক। ২০ শিটের প্যাক।",
    categoryId: "photo_paper",
    brand: "Kodak / Premier",
    gsm: 230,
    packSize: "1 Pack (20 Sheets)",
    packSizeBn: "১ প্যাক (২০ শিট)",
    price: 220,
    discountPrice: 190,
    stock: 50,
    lowStockThreshold: 10,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    specifications: {
      "Size": "A4 (210 x 297 mm)",
      "GSM": "230 GSM",
      "Sheets": "20 Sheets/Pack",
      "Coating": "Resin Coated Cast Glossy"
    }
  },
  {
    id: "prod_lamination_pouch",
    sku: "STA-LAM-100MIC",
    name: "Premium Hot Lamination Film Pouches A4 (100 Micron)",
    nameBn: "প্রিমিয়াম হট লেমিনেশন পাউচ A4 (১০০ মাইক্রন)",
    description: "Crystal clear, bubble-free thermal lamination film for NID, certificates, driving license and student ID protection.",
    descriptionBn: "১০০ মাইক্রন থার্মাল লেমিনেশন পাউচ। সার্টিফিকেট ও এনআইডিকে আর্দ্রতা ও ধুলাবালি থেকে সুরক্ষিত রাখে। ১০০ শিট।",
    categoryId: "lamination_binding",
    brand: "GBC / Royal",
    packSize: "1 Box (100 Pouches)",
    packSizeBn: "১ বক্স (১০০ পাউচ)",
    price: 650,
    discountPrice: 600,
    stock: 35,
    lowStockThreshold: 5,
    minOrderQty: 1,
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
    specifications: {
      "Size": "A4 (225 x 310 mm)",
      "Thickness": "100 Micron",
      "Quantity": "100 Pouches/Box"
    }
  }
];

export const initialStaff: User[] = [
  {
    id: "usr_admin",
    name: "Saiful Islam",
    nameBn: "সাইফুল ইসলাম (প্রধান অ্যাডমিন)",
    email: "sent9696@gmail.com",
    phone: "01540004966",
    role: "super_admin",
    employeeId: "SE-ADMIN-01",
    designation: "Founder & Managing Director",
    designationBn: "প্রতিষ্ঠাতা ও প্রধান স্বত্বাধিকারী",
    bio: "Visionary entrepreneur leading Saiful Enterprise since 2018. Expert in digital public services, academic admissions, high-speed press printing, and B2B paper distribution across Dhaka.",
    bioBn: "২০১৮ সাল থেকে সাইফুল এন্টারপ্রাইজ পরিচালনা করছেন। ডিজিটাল নাগরিক সেবা, তেজগাঁও কলেজ ভর্তি ফরম, প্রিন্টিং ও পেপার সাপ্লাই ব্যবস্থাপনায় অত্যন্ত অভিজ্ঞ।",
    skills: ["Business Operations", "Digital Governance", "Paper Import & B2B Sales", "Client Management"],
    skillsBn: ["ব্যবসায়িক পরিচালনা", "ডিজিটাল সেবা", "কাগজ আমদানি ও সাপ্লাই", "গ্রাহক সেবা"],
    socialLinks: {
      phone: "01540004966",
      whatsapp: "01540004966",
      facebook: "https://facebook.com/saifulenterprise.bd",
      linkedin: "https://linkedin.com",
      email: "sent9696@gmail.com"
    },
    joiningDate: "2018-01-01",
    bloodGroup: "B+",
    emergencyContact: "01517992585",
    address: "Farmgate, Tejgaon, Dhaka",
    isActive: true,
    isBlocked: false,
    salary: 85000,
    shift: "Day & Management Shift",
    performanceScore: 99,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  }
];

export const initialCustomers: User[] = [];

export const initialOrders: Order[] = [
  {
    id: "ord_101",
    orderNumber: "SE-2026-00001",
    customerName: "Kamrul Hasan",
    customerPhone: "01712345678",
    customerEmail: "kamrul@gmail.com",
    deliveryAddress: "Tejgaon College Hostel, Indira Road, Dhaka",
    deliveryType: "pickup",
    items: [
      {
        id: "item_1",
        productId: "prod_a4_70",
        productName: "Double A Copier Paper A4 70 GSM",
        productNameBn: "ডাবল এ ফটোকপি পেপার A4 ৭০ জিএসএম",
        price: 450,
        quantity: 2,
        gsm: 70,
        total: 900
      }
    ],
    subtotal: 900,
    deliveryFee: 0,
    discount: 0,
    total: 900,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    paymentTrxId: "BK99X8821Z",
    orderStatus: "ready",
    notes: "Please pack properly for college library.",
    createdAt: "2026-08-14T10:30:00Z",
    updatedAt: "2026-08-14T11:00:00Z"
  },
  {
    id: "ord_102",
    orderNumber: "SE-2026-00002",
    customerName: "Anisur Rahman",
    customerPhone: "01811223344",
    deliveryAddress: "House 14, Road 4, Dhanmondi, Dhaka",
    deliveryType: "delivery",
    items: [
      {
        id: "item_2",
        productId: "prod_photo_180",
        productName: "Kodak High Glossy Photo Paper 180 GSM",
        productNameBn: "কোডাক হাই গ্লসি ফটো পেপার ১৮০ জিএসএম",
        price: 290,
        quantity: 1,
        gsm: 180,
        total: 290
      },
      {
        id: "item_3",
        productId: "prod_a4_80",
        productName: "Double A Premium Printing Paper A4 80 GSM",
        productNameBn: "ডাবল এ প্রিমিয়াম প্রিন্টিং পেপার A4 ৮০ জিএসএম",
        price: 510,
        quantity: 1,
        gsm: 80,
        total: 510
      }
    ],
    subtotal: 800,
    deliveryFee: 60,
    discount: 20,
    total: 840,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "processing",
    createdAt: "2026-08-15T01:15:00Z",
    updatedAt: "2026-08-15T01:30:00Z"
  }
];

export const initialApplications: Application[] = [
  {
    id: "app_201",
    applicationNumber: "APP-2026-0001",
    serviceId: "srv_tc_admission",
    serviceName: "Tejgaon College Admission Form Fill-up",
    serviceNameBn: "তেজগাঁও কলেজ ভর্তি ফরম পূরণ ও সাবমিশন",
    applicantName: "Md. Sakib Al Amin",
    applicantPhone: "01799887766",
    applicantEmail: "sakib.tc@gmail.com",
    category: "Education",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "bkash",
    amount: 100,
    paidAmount: 100,
    assignedStaffId: "usr_operator_1",
    assignedStaffName: "Tanvir Ahmed",
    deadline: "2026-08-20",
    notes: "Application submitted successfully to NU portal for Tejgaon College BBA department.",
    customerNotes: "Roll: 402911, Reg: 191022394",
    timeline: [
      {
        id: "tl_1",
        status: "new",
        title: "Application Received & Logged",
        titleBn: "আবেদন গ্রহণ ও নথিবদ্ধকরণ সম্পন্ন",
        description: "Application details, SSC transcript copy and photo received via online desk.",
        descriptionBn: "অনলাইন ডেস্কের মাধ্যমে আবেদনকারীর তথ্য, মার্কশীটের কপি ও ছবি সংরক্ষিত হয়েছে।",
        updatedBy: "System Desk",
        timestamp: "2026-08-14T08:45:00Z"
      },
      {
        id: "tl_2",
        status: "processing",
        title: "Verification & Data Entry by Operator",
        titleBn: "অপারেটর দ্বারা তথ্য যাচাই ও ডাটা এন্ট্রি",
        description: "Assigned to Tanvir Ahmed. Verified SSC GPA and Tejgaon College subject eligibility.",
        descriptionBn: "তানভীর আহমেদকে দায়িত্ব অর্পণ করা হয়েছে। তেজগাঁও কলেজ বিবিএ ডিপার্টমেন্টের যোগ্যতা যাচাই সম্পন্ন।",
        updatedBy: "Tanvir Ahmed (Operator)",
        timestamp: "2026-08-14T09:05:00Z"
      },
      {
        id: "tl_3",
        status: "submitted",
        title: "Final Submission to NU Gateway",
        titleBn: "জাতীয় বিশ্ববিদ্যালয় পোর্টালে অনলাইন সাবমিশন",
        description: "Form uploaded and verified with registration code. Online submission successful.",
        descriptionBn: "রেজিস্ট্রেশন কোড সহ ফরম জাতীয় বিশ্ববিদ্যালয় পোর্টালে সাবমিট করা হয়েছে।",
        updatedBy: "Tanvir Ahmed (Operator)",
        timestamp: "2026-08-14T09:15:00Z"
      },
      {
        id: "tl_4",
        status: "completed",
        title: "Admission Slip Ready for Download & Pickup",
        titleBn: "ভর্তি কনফার্মেশন স্লিপ ডাউনলোড ও প্রিন্টের জন্য প্রস্তুত",
        description: "Official acknowledgment slip generated with barcode. Available in tracker and printed at counter.",
        descriptionBn: "অফিসিয়াল ভর্তি কনফার্মেশন স্লিপ প্রস্তুত করা হয়েছে। কাউন্টার থেকে প্রিন্ট সংগ্রহ করা যাবে।",
        updatedBy: "Tanvir Ahmed (Operator)",
        timestamp: "2026-08-14T09:20:00Z"
      }
    ],
    documents: [
      {
        id: "doc_1",
        name: "SSC_Marksheet_Sakib.pdf",
        url: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80",
        type: "pdf",
        uploadedAt: "2026-08-14T09:00:00Z",
        uploadedBy: "Customer"
      },
      {
        id: "doc_2",
        name: "Admission_Confirmation_Slip.pdf",
        url: "https://images.unsplash.com/photo-1618042164219-62c820f10723?w=600&auto=format&fit=crop&q=80",
        type: "pdf",
        uploadedAt: "2026-08-14T09:20:00Z",
        uploadedBy: "Tanvir Ahmed"
      }
    ],
    createdAt: "2026-08-14T08:45:00Z",
    updatedAt: "2026-08-14T09:20:00Z"
  },
  {
    id: "app_202",
    applicationNumber: "APP-2026-0002",
    serviceId: "srv_police_clearance",
    serviceName: "Police Clearance Certificate Online Application",
    serviceNameBn: "অনলাইন পুলিশ ক্লিয়ারেন্স সার্টিফিকেট আবেদন",
    applicantName: "Farhana Yasmin",
    applicantPhone: "01511223344",
    applicantEmail: "farhana.y@gmail.com",
    category: "Government",
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "nagad",
    amount: 300,
    paidAmount: 300,
    assignedStaffId: "usr_manager",
    assignedStaffName: "Md. Rafiqul Hassan",
    deadline: "2026-08-22",
    notes: "Challan verified. Uploaded ward commissioner certificate.",
    timeline: [
      {
        id: "tl_21",
        status: "new",
        title: "Police Clearance Request Received",
        titleBn: "পুলিশ ক্লিয়ারেন্স আবেদন নথিভুক্ত হয়েছে",
        description: "Passport scan, NID copy and address verification submitted.",
        descriptionBn: "পাসপোর্ট স্ক্যান কপি ও ঠিকানা যাচাইয়ের জন্য প্রাথমিক তথ্য গ্রহণ করা হয়েছে।",
        updatedBy: "System Desk",
        timestamp: "2026-08-15T01:50:00Z"
      },
      {
        id: "tl_22",
        status: "processing",
        title: "Treasury Challan ৳500 Verified & Uploaded",
        titleBn: "ট্রেজারি চালান ৳৫০০ কোড যাচাই ও পোর্টালে আপলোড",
        description: "e-Challan payment confirmed at Sonali Bank. Files currently in review before police station routing.",
        descriptionBn: "সোনালী ব্যাংক ই-চালান পেমেন্ট যাচাই সম্পন্ন। স্থানীয় তেজগাঁও থানায় ফরোয়ার্ডের প্রস্তুতি চলছে।",
        updatedBy: "Md. Rafiqul Hassan (Branch Manager)",
        timestamp: "2026-08-15T02:10:00Z"
      }
    ],
    documents: [
      {
        id: "doc_3",
        name: "Passport_Scan_Farhana.jpg",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        type: "image",
        uploadedAt: "2026-08-15T02:00:00Z",
        uploadedBy: "Customer"
      }
    ],
    createdAt: "2026-08-15T01:50:00Z",
    updatedAt: "2026-08-15T02:10:00Z"
  },
  {
    id: "app_203",
    applicationNumber: "APP-2026-0003",
    serviceId: "srv_army_apply",
    serviceName: "Bangladesh Army Recruitment Application",
    serviceNameBn: "বাংলাদেশ সেনাবাহিনী সৈনিক ও অফিসার ক্যাডেট আবেদন",
    applicantName: "Rakibul Islam",
    applicantPhone: "01688990011",
    category: "Defense",
    status: "new",
    paymentStatus: "pending",
    paymentMethod: "cash_counter",
    amount: 200,
    paidAmount: 0,
    customerNotes: "Applying for GD Soldier batch.",
    timeline: [
      {
        id: "tl_31",
        status: "new",
        title: "Army Recruitment Intake Created",
        titleBn: "সেনাবাহিনী সৈনিক আবেদনের ড্রাফট তৈরি হয়েছে",
        description: "Awaiting applicant physical measurement data and photo crop at counter.",
        descriptionBn: "কাউন্টারে ছবি ও শিক্ষাগত তথ্যের ভেরিফিকেশন ও পেমেন্ট বাকি আছে।",
        updatedBy: "Counter Reception",
        timestamp: "2026-08-15T02:05:00Z"
      }
    ],
    documents: [],
    createdAt: "2026-08-15T02:05:00Z",
    updatedAt: "2026-08-15T02:05:00Z"
  }
];

export const initialExpenses: Expense[] = [
  {
    id: "exp_1",
    category: "paper_stock",
    title: "Double A Paper 10 Cartons Wholesale",
    titleBn: "ডাবল এ পেপার ১০ কার্টুন পাইকারি ক্রয়",
    amount: 21500,
    date: "2026-08-12",
    description: "Purchased from Patuatuly Wholesale Market for shop inventory.",
    addedById: "usr_admin",
    addedByName: "Saiful Islam"
  },
  {
    id: "exp_2",
    category: "ink_toner",
    title: "Canon & Epson Laser Toner & Refill Ink",
    titleBn: "ক্যানন ও এপসন লেজার টোনার ও রিফিল কালি",
    amount: 6400,
    date: "2026-08-13",
    description: "Black toner cartridge 2 pcs + 4 Color dye ink bottles.",
    addedById: "usr_manager",
    addedByName: "Md. Rafiqul Hassan"
  },
  {
    id: "exp_3",
    category: "electricity",
    title: "Shop Electricity Bill (July 2026)",
    titleBn: "দোকানের বিদ্যুৎ বিল (জুলাই ২০২৬)",
    amount: 3850,
    date: "2026-08-10",
    description: "DESCO prepaid electric meter recharge.",
    addedById: "usr_admin",
    addedByName: "Saiful Islam"
  },
  {
    id: "exp_4",
    category: "snacks",
    title: "Staff Afternoon Tea & Snacks",
    titleBn: "স্টাফ বিকালের নাস্তা ও চা",
    amount: 350,
    date: "2026-08-14",
    description: "Daily tea and snacks for shop staff.",
    addedById: "usr_accountant",
    addedByName: "Nusrat Jahan"
  }
];

export const initialPOSSales: POSSale[] = [
  {
    id: "sale_pos_01",
    invoiceNumber: "INV-2026-0001",
    cashierId: "usr_operator",
    cashierName: "Tanvir Ahmed",
    customerName: "Walk-in Student",
    customerPhone: "01700000000",
    items: [
      {
        id: "item_p1",
        type: "product",
        itemId: "prod_a4_80",
        name: "Double A Premium Printing Paper A4 80 GSM",
        price: 510,
        quantity: 1,
        gsm: 80
      }
    ],
    subtotal: 510,
    discount: 10,
    total: 500,
    paidAmount: 500,
    changeAmount: 0,
    paymentMethod: "cash_counter",
    createdAt: "2026-08-15T03:00:00Z"
  }
];

export const initialHeroSlides: HeroSlide[] = [
  {
    id: "slide_1",
    type: "photo",
    src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1920&auto=format&fit=crop",
    tagEn: "Live Digital Counter",
    tagBn: "লাইভ ডিজিটাল কাউন্টার",
    titleEn: "Computer & Online Services Hub",
    titleBn: "কম্পিউটার ও অনলাইন সার্ভিসেস হাব",
    descriptionEn: "High-speed typing, admission forms, defense & government recruitment center in Farmgate.",
    descriptionBn: "দ্রুত টাইপিং, ভর্তি ফরম, প্রতিরক্ষা বাহিনী ও সরকারি চাকরির আবেদন কেন্দ্র।",
    accentColor: "emerald",
    order: 1
  },
  {
    id: "slide_2",
    type: "photo",
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop",
    tagEn: "Commercial Printing",
    tagBn: "কমার্শিয়াল প্রিন্টিং",
    titleEn: "Heavy Duty Digital Color & B/W Printing",
    titleBn: "হেভি ডিউটি ডিজিটাল কালার ও সাদা-কালো প্রিন্ট",
    descriptionEn: "Sharp laser printing, high-speed photocopying, thesis & spiral binding.",
    descriptionBn: "হাই-স্পিড ফটোকপি, নির্ভুল লেজার প্রিন্ট, প্রজেক্ট ও থিসিস বুক বাইন্ডিং।",
    accentColor: "sky",
    order: 2
  },
  {
    id: "slide_3",
    type: "photo",
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop",
    tagEn: "Tejgaon College Portal",
    tagBn: "তেজগাঁও কলেজ পোর্টাল",
    titleEn: "Academic Forms, NU Marksheet & Fee Deposit",
    titleBn: "কলেজ ভর্তি, জাতীয় বিশ্ববিদ্যালয় মার্কশীট ও ফি জমা",
    descriptionEn: "Instant online form submission, admit card download, and verified payment printout.",
    descriptionBn: "ভর্তি ফরম পূরণ, প্রবেশপত্র ডাউনলোড এবং নিশ্চায়ন ফি পেমেন্ট স্লিপ প্রিন্ট।",
    accentColor: "amber",
    order: 3
  },
  {
    id: "slide_4",
    type: "photo",
    src: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1920&auto=format&fit=crop",
    tagEn: "Paper & Supply Depot",
    tagBn: "পেপার ও স্টেশনারি ডিপো",
    titleEn: "A4, Legal, Double A & Glossy Photo Paper",
    titleBn: "A4, লিগ্যাল, ডাবল এ ও গ্লসি ফটো পেপার পাইকারি ও খুচরা",
    descriptionEn: "Premium 70-300 GSM paper reams, sticker paper, ID card lamination sheets.",
    descriptionBn: "৭০ থেকে ৩০০ জিএসএম পেপার রিম, স্টিকার পেপার, ল্যামিনেশন রোল।",
    accentColor: "purple",
    order: 4
  },
  {
    id: "slide_5",
    type: "photo",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1920&auto=format&fit=crop",
    tagEn: "Instant Studio",
    tagBn: "জরুরি স্টুডিও ফটো",
    titleEn: "5-Minute Biometric Passport & Visa Photo",
    titleBn: "৫ মিনিটে বায়োমেট্রিক পাসপোর্ট ও ভিসা সাইজ ছবি",
    descriptionEn: "White/blue background change, digital retouching, and premium lab photo print.",
    descriptionBn: "ব্যাকগ্রাউন্ড পরিবর্তন, ফেস রিটাচ এবং প্রিমিয়াম ল্যাব কোয়ালিটি ছবি ডেলিভারি।",
    accentColor: "teal",
    order: 5
  }
];

export const initialSEOSettings: Record<string, SectionSEO> = {
  home: {
    sectionId: 'home',
    title: 'Saiful Enterprise | Digital Service, Computer & Online Application Center',
    titleBn: 'সাইফুল এন্টারপ্রাইজ | ডিজিটাল সার্ভিস, কম্পিউটার ও অনলাইন আবেদন সেন্টার',
    description: 'Saiful Enterprise - Computer, Photocopy, Printing, Online Application & Digital Service Center in Indira Road, Farmgate, Dhaka.',
    descriptionBn: 'সাইফুল এন্টারপ্রাইজ - কম্পিউটার টাইপিং, কালার ও লেজার প্রিন্ট, ফটোকপি, তেজগাঁও কলেজ ভর্তি ও অনলাইন আবেদন কেন্দ্র। ইন্দিরা রোড, ফার্মগেট, ঢাকা।',
    keywords: 'Saiful Enterprise, Indira Road computer shop, Farmgate photocopy, Tejgaon college admission, BMET registration, police clearance, online application',
    ogTitle: 'Saiful Enterprise - Your Trusted Digital & Print Solutions Hub',
    ogDescription: 'Fast, secure computer printing, college admissions, online job application & passport photo services in Farmgate, Dhaka.',
    ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/'
  },
  services: {
    sectionId: 'services',
    title: 'Digital & Online Services Catalog | Saiful Enterprise',
    titleBn: 'সকল অনলাইন ও কম্পিউটার সেবাসমূহ | সাইফুল এন্টারপ্রাইজ',
    description: 'Explore full catalog of services: Tejgaon College admission, BMET registration, police clearance, defense application, typing & photo lab.',
    descriptionBn: 'তেজগাঁও কলেজ ভর্তি সহায়তা, বিএমইটি রেজিস্ট্রেশন, পুলিশ ক্লিয়ারেন্স, সেনা/নৌ/বিমানবাহিনী আবেদন ও প্রিন্টিং সেবা।',
    keywords: 'Tejgaon college admission help, BMET biometric registration, Bangladesh police clearance online, laser print Farmgate',
    ogTitle: 'Services Catalog - Saiful Enterprise Farmgate',
    ogDescription: 'Instant online applications, government portal submissions, laser printing & urgent photo services.',
    ogImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/services'
  },
  shop: {
    sectionId: 'shop',
    title: 'Paper & Printing Supplies Shop | Saiful Enterprise',
    titleBn: 'পেপার ও স্টেশনারি অনলাইন শপ | সাইফুল এন্টারপ্রাইজ',
    description: 'Order wholesale & retail Double A, PaperOne, 70/80 GSM A4, Legal, Glossy Photo Paper & Binding supplies.',
    descriptionBn: 'ডাবল এ, পেপার ওয়ান, ৭০ ও ৮০ জিএসএম এ৪ পেপার, লিগ্যাল ও প্রিমিয়াম ফটো পেপার অনলাইনে অর্ডার করুন।',
    keywords: 'Double A paper Dhaka, A4 paper price Farmgate, glossy photo paper, lamination sheets, stationery wholesale',
    ogTitle: 'Premium Paper & Stationery Depot - Saiful Enterprise',
    ogDescription: 'Best prices on Double A, 80 GSM paper, photo paper and printing accessories with fast delivery in Dhaka.',
    ogImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/shop'
  },
  tracker: {
    sectionId: 'tracker',
    title: 'Track Application Status Online | Saiful Enterprise',
    titleBn: 'আবেদনের অগ্রগতি লাইভ ট্র্যাক করুন | সাইফুল এন্টারপ্রাইজ',
    description: 'Track your online application status, progress milestones and download receipts using your tracking number.',
    descriptionBn: 'আপনার আবেদন নম্বর বা মোবাইল নম্বর দিয়ে সরকারি আবেদন, ভর্তি ও অন্যান্য সার্ভিসের বর্তমান অগ্রগতি জানুন।',
    keywords: 'application tracking Saiful Enterprise, check application status, online slip download',
    ogTitle: 'Application Tracker - Saiful Enterprise',
    ogDescription: 'Real-time application verification, status check and digital money receipt download.',
    ogImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/tracker'
  },
  about: {
    sectionId: 'about',
    title: 'About Us & Expert Team | Saiful Enterprise Farmgate',
    titleBn: 'আমাদের সম্পর্কে ও টিম পরিচিতি | সাইফুল এন্টারপ্রাইজ',
    description: 'Serving Farmgate & Tejgaon for over 15 years with dedication, digital technology and trusted customer support.',
    descriptionBn: 'ফার্মগেট ও ইন্দিরা রোডে ১৫ বছরেরও বেশি সময় ধরে কম্পিউটার সেবা, ডিজিটাল প্রিন্ট ও ছাত্র-ছাত্রীদের সহায়তা।',
    keywords: 'Saiful Enterprise about us, Saiful Islam proprietor, Farmgate computer shop history',
    ogTitle: 'About Saiful Enterprise - 15+ Years of Trust',
    ogDescription: 'Meet the dedicated team behind the most trusted digital center in Farmgate.',
    ogImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/about'
  },
  contact: {
    sectionId: 'contact',
    title: 'Contact Us & Location | Saiful Enterprise Indira Road',
    titleBn: 'যোগাযোগ ও দোকানের লোকেশন | সাইফুল এন্টারপ্রাইজ',
    description: 'Visit us beside Tejgaon College, Indira Road, Farmgate or call/WhatsApp 01517992585.',
    descriptionBn: 'আমাদের দোকান: ২০/১, সাগর-সৈকত মার্কেট, দোকান নং ০২, ইন্দিরা রোড, তেজগাঁও কলেজের পাশে, ফার্মগেট, ঢাকা।',
    keywords: 'Saiful Enterprise contact, Indira Road shop number, WhatsApp 01517992585, Tejgaon college map',
    ogTitle: 'Contact Saiful Enterprise Farmgate',
    ogDescription: 'Call, WhatsApp or visit our computer & digital solutions center in Indira Road, Dhaka.',
    ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
    ogType: 'website',
    canonicalUrl: 'https://saifulenterprise.com/contact'
  }
};

