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
}

const VALID_TABS = [
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
 * Parses the current window location (pathname, search params, and hash)
 * into a structured route object.
 */
export function parseCurrentRoute(): ParsedRoute {
  if (typeof window === 'undefined') {
    return { tab: 'home', productId: null, serviceId: null, trackerId: null, categoryId: null };
  }

  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');

  let tab = 'home';
  let productId: string | null = searchParams.get('product') || searchParams.get('prod') || null;
  let serviceId: string | null = searchParams.get('service') || searchParams.get('srv') || null;
  let trackerId: string | null = searchParams.get('app') || searchParams.get('tracker') || searchParams.get('tracking') || null;
  let categoryId: string | null = searchParams.get('category') || searchParams.get('cat') || null;

  // 1. Check path matches (e.g. /services, /shop, /product/123, /service/123, /tracker/APP-123)
  const pathSegments = pathname.split('/').filter(Boolean);

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
    } else if (VALID_TABS.includes(firstSegment)) {
      tab = firstSegment;
    }
  }

  // 2. Check query parameter overrides (e.g. ?tab=services)
  const tabParam = searchParams.get('tab');
  if (tabParam && VALID_TABS.includes(tabParam.toLowerCase())) {
    tab = tabParam.toLowerCase();
  }

  // 3. Check hash overrides (e.g. #services, #product=123, #service=123)
  if (hash) {
    if (VALID_TABS.includes(hash)) {
      tab = hash;
    } else if (hash.startsWith('product=')) {
      tab = 'shop';
      productId = hash.replace('product=', '');
    } else if (hash.startsWith('service=')) {
      tab = 'services';
      serviceId = hash.replace('service=', '');
    } else if (hash.startsWith('tracker=') || hash.startsWith('app=')) {
      tab = 'tracker';
      trackerId = hash.replace(/^(tracker|app)=/, '');
    }
  }

  // If a product is specified, default to shop tab if still on home
  if (productId && tab === 'home') {
    tab = 'shop';
  }

  // If a service is specified, default to services tab if still on home
  if (serviceId && tab === 'home') {
    tab = 'services';
  }

  // If a tracker ID is specified, default to tracker tab
  if (trackerId && tab === 'home') {
    tab = 'tracker';
  }

  return { tab, productId, serviceId, trackerId, categoryId };
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
}): string {
  const currentOrigin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://saentbd.vercel.app';

  const tab = route.tab || 'home';
  let path = tab === 'home' ? '/' : `/${tab}`;
  const params = new URLSearchParams();

  if (route.productId) {
    params.set('product', route.productId);
    if (tab !== 'shop') path = '/shop';
  } else if (route.serviceId) {
    params.set('service', route.serviceId);
    if (tab !== 'services') path = '/services';
  } else if (route.trackerId) {
    params.set('app', route.trackerId);
    if (tab !== 'tracker') path = '/tracker';
  }

  if (route.categoryId) {
    params.set('category', route.categoryId);
  }

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return `${currentOrigin}${path}${queryStr}`;
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
  }

  if (route.categoryId) {
    params.set('category', route.categoryId);
  }

  const queryStr = params.toString() ? `?${params.toString()}` : '';
  const newUrl = `${path}${queryStr}`;

  const currentRelative = `${window.location.pathname}${window.location.search}`;
  if (currentRelative !== newUrl) {
    if (replace) {
      window.history.replaceState({ tab, ...route }, '', newUrl);
    } else {
      window.history.pushState({ tab, ...route }, '', newUrl);
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
