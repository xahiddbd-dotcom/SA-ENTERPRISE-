/**
 * Video Parser & Embed Generator for YouTube, Facebook & Direct MP4/WebM uploads
 */

export interface ParsedVideoInfo {
  type: 'youtube' | 'facebook' | 'direct' | 'upload';
  originalUrl: string;
  embedUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  isValid: boolean;
}

/**
 * Extract YouTube ID from various YouTube URL formats (watch, youtu.be, shorts, embed)
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();

  // 1. youtu.be/ID
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // 2. youtube.com/watch?v=ID
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 3. youtube.com/shorts/ID
  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 4. youtube.com/embed/ID
  const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 5. Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  return null;
}

/**
 * Check if URL is Facebook Video or fb.watch
 */
export function isFacebookVideo(url: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.includes('facebook.com') ||
    clean.includes('fb.watch') ||
    clean.includes('fb.com')
  );
}

/**
 * Parse any video source URL and return normalized metadata
 */
export function parseVideoSource(url: string, options: { autoplay?: boolean; muted?: boolean } = {}): ParsedVideoInfo {
  if (!url || !url.trim()) {
    return {
      type: 'direct',
      originalUrl: '',
      isValid: false
    };
  }

  const clean = url.trim();
  const autoplay = options.autoplay ?? true;
  const muted = options.muted ?? false;

  // Case 1: Base64 data URL (uploaded file)
  if (clean.startsWith('data:video/')) {
    return {
      type: 'upload',
      originalUrl: clean,
      isValid: true
    };
  }

  // Case 2: Blob URL (locally chosen file)
  if (clean.startsWith('blob:')) {
    return {
      type: 'upload',
      originalUrl: clean,
      isValid: true
    };
  }

  // Case 3: YouTube
  const ytId = extractYouTubeId(clean);
  if (ytId) {
    const embedParams = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1'
    });
    return {
      type: 'youtube',
      originalUrl: clean,
      youtubeId: ytId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?${embedParams.toString()}`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      isValid: true
    };
  }

  // Case 4: Facebook
  if (isFacebookVideo(clean)) {
    const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      clean
    )}&show_text=0&autoplay=${autoplay ? '1' : '0'}&mute=${muted ? '1' : '0'}`;
    return {
      type: 'facebook',
      originalUrl: clean,
      embedUrl: fbEmbedUrl,
      isValid: true
    };
  }

  // Case 5: Direct HTML5 Video (mp4, webm, etc.)
  return {
    type: 'direct',
    originalUrl: clean,
    isValid: true
  };
}
