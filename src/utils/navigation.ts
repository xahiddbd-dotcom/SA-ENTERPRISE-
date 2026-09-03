/**
 * Advanced Deep-Linking and Navigation Utilities for Saiful Enterprise
 * Supports clean URLs, URL parameters, hash routing, Vercel SPA rewrites,
 * and shareable proof links for products, services, and tracker applications.
 */

export interface ParsedRoute {
  tab: string;
  productId: string | null;
  serviceId: string | null;
  trackerId: string | null;
  categoryId: string | null;
  adminSection: string | null;
}

export const VALID_TABS = [
  'home',
  'services',
  'shop',
  'about',
  'contact',
  'tracker',
  'profile',
  'admin',
  'staff',
  'ledger',
  'pos'
];

/**
 * Gets the production canonical domain or current window origin
 */
export function getCanonicalDomain(): string {
  if (typeof window === 'undefined') return 'https://saentbd.vercel.app';
  const origin = window.location.origin;
  // If previewing in local container, default canonical to the user's Vercel deployment
  if (origin && !origin.includes('localhost') && !origin.includes('3000')) {
    return origin;
  }
  return 'https://saentbd.vercel.app';
}

/**
 * Parses the current window location (pathname, search params, and hash)
 * into a structured route object.
 */
export function parseCurrentRoute(): ParsedRoute {
  if (typeof window === 'undefined') {
    return { tab: 'home', productId: null, serviceId: null, trackerId: null, categoryId: null, adminSection: null };
  }

  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  // Normalize hash (strip leading # and #/)
  const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  let tab = 'home';
  let productId: string | null = searchParams.get('product') || searchParams.get('prod') || null;
  let serviceId: string | null = searchParams.get('service') || searchParams.get('srv') || null;
  let trackerId: string | null = searchParams.get('app') || searchParams.get('tracker') || searchParams.get('tracking') || null;
  let categoryId: string | null = searchParams.get('category') || searchParams.get('cat') || null;
  let adminSection: string | null = searchParams.get('section') || searchParams.get('sec') || searchParams.get('adminTab') || null;

  // 1. Check path matches (e.g. /services, /shop, /product/123, /service/123, /tracker/APP-123, /admin/stamps)
  const pathSegments = rawPath.split('/').filter(seg => seg && seg !== 'index.html');

  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0];

    if (firstSegment === 'products' || firstSegment === 'shop') {
      tab = 'shop';
      if (pathSegments.length > 1) {
        productId = pathSegments[1];
      }
    } else if (firstSegment === 'product') {
      tab = 'shop';
      if (pathSegments.length > 1) {
        productId = pathSegments[1];
      }
    } else if (firstSegment === 'services') {
      tab = 'services';
      if (pathSegments.length > 1) {
        serviceId = pathSegments[1];
      }
    } else if (firstSegment === 'service') {
      tab = 'services';
      if (pathSegments.length > 1) {
        serviceId = pathSegments[1];
      }
    } else if (firstSegment === 'tracker' || firstSegment === 'tracking') {
      tab = 'tracker';
      if (pathSegments.length > 1) {
        trackerId = pathSegments[1];
      }
    } else if (firstSegment === 'admin') {
      tab = 'admin';
      if (pathSegments.length > 1) {
        adminSection = pathSegments[1];
      }
    } else if (VALID_TABS.includes(firstSegment)) {
      tab = firstSegment;
    }
  }

  // 2. Check query parameter overrides (e.g. ?tab=services, ?tab=shop, ?tab=admin&section=stamps)
  const tabParam = searchParams.get('tab');
  if (tabParam && VALID_TABS.includes(tabParam.toLowerCase())) {
    tab = tabParam.toLowerCase();
  }

  // 3. Check hash overrides (e.g. #services, #/services, #admin/stamps, #section=stamps)
  if (rawHash) {
    const cleanHash = rawHash.replace(/^\/+/, '');
    const hashSegments = cleanHash.split('/').filter(Boolean);
    const hashFirst = hashSegments[0];

    if (VALID_TABS.includes(hashFirst)) {
      tab = hashFirst;
      if (hashSegments.length > 1) {
        if (hashFirst === 'services') serviceId = hashSegments[1];
        if (hashFirst === 'shop') productId = hashSegments[1];
        if (hashFirst === 'tracker') trackerId = hashSegments[1];
        if (hashFirst === 'admin') adminSection = hashSegments[1];
      }
    } else if (cleanHash.startsWith('product=')) {
      tab = 'shop';
      productId = cleanHash.replace('product=', '');
    } else if (cleanHash.startsWith('service=')) {
      tab = 'services';
      serviceId = cleanHash.replace('service=', '');
    } else if (cleanHash.startsWith('tracker=') || cleanHash.startsWith('app=')) {
      tab = 'tracker';
      trackerId = cleanHash.replace(/^(tracker|app)=/, '');
    } else if (cleanHash.startsWith('section=') || cleanHash.startsWith('admin=')) {
      tab = 'admin';
      adminSection = cleanHash.replace(/^(section|admin)=/, '');
    }
  }

  // If a product is specified, ensure tab is shop
  if (productId && (tab === 'home' || tab === 'services')) {
    tab = 'shop';
  }

  // If a service is specified, ensure tab is services
  if (serviceId && (tab === 'home' || tab === 'shop')) {
    tab = 'services';
  }

  // If a tracker ID is specified, ensure tab is tracker
  if (trackerId && tab === 'home') {
    tab = 'tracker';
  }

  // If an admin section is specified, ensure tab is admin
  if (adminSection && tab === 'home') {
    tab = 'admin';
  }

  return { tab, productId, serviceId, trackerId, categoryId, adminSection };
}

/**
 * Builds a clean canonical URL for a given route state
 */
export function buildUrl(route: {
  tab?: string;
  productId?: string | null;
  serviceId?: string | null;
  trackerId?: string | null;
  categoryId?: string | null;
  adminSection?: string | null;
}): string {
  const currentOrigin = getCanonicalDomain();

  const tab = route.tab || 'home';
  let path = tab === 'home' ? '/' : `/${tab}`;
  const params = new URLSearchParams();

  if (route.productId) {
    params.set('product', route.productId);
    path = '/shop';
  } else if (route.serviceId) {
    params.set('service', route.serviceId);
    path = '/services';
  } else if (route.trackerId) {
    params.set('app', route.trackerId);
    path = '/tracker';
  } else if (route.adminSection) {
    params.set('section', route.adminSection);
    path = '/admin';
  }

  if (route.categoryId && route.categoryId !== 'all') {
    params.set('category', route.categoryId);
  }

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return `${currentOrigin}${path}${queryStr}`;
}

/**
 * Builds a direct shareable URL for a specific Admin Dashboard option/module
 */
export function buildAdminSectionUrl(section: string): string {
  const currentOrigin = getCanonicalDomain();
  return `${currentOrigin}/admin?section=${encodeURIComponent(section)}`;
}

/**
 * Builds a WhatsApp share link with pre-filled message text
 */
export function buildWhatsAppShareUrl(title: string, url: string): string {
  const message = `*সাইফুল এন্টারপ্রাইজ (Saiful Enterprise)*\n${title}\n\n📌 বিস্তারিত ও সরাসরি প্রমাণ লিঙ্ক:\n${url}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Pushes or replaces the current browser URL history state without reloading the page
 */
export function updateBrowserUrl(
  route: {
    tab: string;
    productId?: string | null;
    serviceId?: string | null;
    trackerId?: string | null;
    categoryId?: string | null;
    adminSection?: string | null;
  },
  replace: boolean = false
) {
  if (typeof window === 'undefined' || !window.history) return;

  const tab = route.tab || 'home';
  let path = tab === 'home' ? '/' : `/${tab}`;
  const params = new URLSearchParams();

  if (route.productId) {
    params.set('product', route.productId);
    path = '/shop';
  } else if (route.serviceId) {
    params.set('service', route.serviceId);
    path = '/services';
  } else if (route.trackerId) {
    params.set('app', route.trackerId);
    path = '/tracker';
  } else if (route.adminSection) {
    params.set('section', route.adminSection);
    path = '/admin';
  }

  if (route.categoryId && route.categoryId !== 'all') {
    params.set('category', route.categoryId);
  }

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const newUrl = `${path}${queryStr}`;

  const currentRelative = `${window.location.pathname}${window.location.search}`;
  if (currentRelative !== newUrl) {
    try {
      if (replace) {
        window.history.replaceState({ tab, ...route }, '', newUrl);
      } else {
        window.history.pushState({ tab, ...route }, '', newUrl);
      }
    } catch (e) {
      try {
        // Fallback for restricted sandboxes
        window.location.hash = newUrl;
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Copies any text or URL to clipboard reliably across all devices
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to DOM execCommand
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (e) {
    console.error('Clipboard copy error:', e);
    return false;
  }
}
