import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';

interface DynamicSEOProps {
  currentTab: string;
  activeProductId?: string | null;
  activeServiceId?: string | null;
}

export const DynamicSEO: React.FC<DynamicSEOProps> = ({
  currentTab,
  activeProductId,
  activeServiceId
}) => {
  const { seoSettings, settings, products, services } = useData();
  const { language } = useLanguage();

  useEffect(() => {
    // Map currentTab to SEO section key
    let sectionKey = 'home';
    if (currentTab === 'services') sectionKey = 'services';
    else if (currentTab === 'shop') sectionKey = 'shop';
    else if (currentTab === 'tracker') sectionKey = 'tracker';
    else if (currentTab === 'about') sectionKey = 'about';
    else if (currentTab === 'contact') sectionKey = 'contact';

    const currentSEO = seoSettings[sectionKey] || seoSettings['home'] || {
      title: 'Saiful Enterprise | Digital Service & Computer Solutions',
      titleBn: 'সাইফুল এন্টারপ্রাইজ | ডিজিটাল সার্ভিস ও কম্পিউটার সলিউশন',
      description: 'Saiful Enterprise - Computer, Photocopy, Printing & Online Application Center in Farmgate, Dhaka.',
      descriptionBn: 'সাইফুল এন্টারপ্রাইজ - কম্পিউটার টাইপিং, কালার ও লেজার প্রিন্ট, ফটোকপি ও অনলাইন আবেদন কেন্দ্র।',
      keywords: 'Saiful Enterprise, Indira Road, Farmgate, Tejgaon College, photocopy, online application',
      ogTitle: 'Saiful Enterprise - Farmgate, Dhaka',
      ogDescription: 'Computer, printing, admission and digital solutions center.',
      ogImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop'
    };

    // Check if a specific product or service is active for proof deep-linking
    let specificTitle: string | null = null;
    let specificDesc: string | null = null;
    let specificImage: string | null = null;

    if (activeProductId && products) {
      const prod = products.find(p => p.id === activeProductId || p.sku === activeProductId);
      if (prod) {
        const prodName = language === 'bn' ? prod.nameBn : prod.name;
        const price = prod.discountPrice || prod.price;
        specificTitle = `${prodName} (৳${price}) | ${language === 'bn' ? settings.businessNameBn : settings.businessName}`;
        specificDesc = language === 'bn' ? prod.descriptionBn : prod.description;
        if (prod.images && prod.images[0]) {
          specificImage = prod.images[0];
        }
      }
    } else if (activeServiceId && services) {
      const srv = services.find(s => s.id === activeServiceId);
      if (srv) {
        const srvName = language === 'bn' ? srv.nameBn : srv.name;
        specificTitle = `${srvName} - ৳${srv.price} | ${language === 'bn' ? settings.businessNameBn : settings.businessName}`;
        specificDesc = language === 'bn' ? srv.descriptionBn : srv.description;
        if (srv.image) {
          specificImage = srv.image;
        }
      }
    }

    // Update document title
    const baseTitle = language === 'bn' 
      ? (currentSEO.titleBn || currentSEO.title || settings.businessNameBn || 'সাইফুল এন্টারপ্রাইজ')
      : (currentSEO.title || settings.businessName || 'Saiful Enterprise');
    const pageTitle = specificTitle || baseTitle;
    document.title = pageTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const description = specificDesc || (language === 'bn' 
      ? (currentSEO.descriptionBn || currentSEO.description || settings.taglineBn || '')
      : (currentSEO.description || settings.tagline || ''));
    const ogImage = specificImage || currentSEO.ogImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop';

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', currentSEO.keywords || '');
    setMetaTag('name', 'author', settings.businessName || 'Saiful Enterprise');

    // Open Graph meta tags
    setMetaTag('property', 'og:title', currentSEO.ogTitle || pageTitle);
    setMetaTag('property', 'og:description', currentSEO.ogDescription || description);
    setMetaTag('property', 'og:image', currentSEO.ogImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop');
    setMetaTag('property', 'og:type', currentSEO.ogType || 'website');
    setMetaTag('property', 'og:site_name', language === 'bn' ? (settings.businessNameBn || 'সাইফুল এন্টারপ্রাইজ') : (settings.businessName || 'Saiful Enterprise'));

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', currentSEO.ogTitle || pageTitle);
    setMetaTag('name', 'twitter:description', currentSEO.ogDescription || description);
    setMetaTag('name', 'twitter:image', currentSEO.ogImage || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop');

    // Canonical link
    if (currentSEO.canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', currentSEO.canonicalUrl);
    }
  }, [currentTab, activeProductId, activeServiceId, products, services, seoSettings, settings, language]);

  return null;
};
