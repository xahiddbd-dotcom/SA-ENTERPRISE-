import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { StaffTtsSettings } from '../types';
import {
  playChime,
  queueSpeech,
  stopAllSpeech,
  unlockAudioEngine,
  formatOrderNumberForSpeech
} from '../utils/audioAlerts';

export interface TTSAnnouncementItem {
  id: string;
  type: 'order' | 'assistance' | 'test';
  title: string;
  titleBn: string;
  textBn: string;
  textEn: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface TTSNotificationContextType {
  ttsSettings: StaffTtsSettings;
  updateTtsSettings: (newSettings: Partial<StaffTtsSettings>) => void;
  announceNewOrder: (order: {
    orderNumber: string;
    customerName: string;
    total: number;
    itemCount?: number;
  }) => void;
  announceAssistanceRequest: (request: {
    customerName: string;
    topic: string;
    topicBn: string;
    location?: string;
  }) => void;
  speakCustomMessage: (textBn: string, textEn?: string) => void;
  testOrderAlert: () => void;
  testAssistanceAlert: () => void;
  recentAnnouncements: TTSAnnouncementItem[];
  replayAnnouncement: (id: string) => void;
  clearAnnouncements: () => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  audioUnlocked: boolean;
  unlockAudio: () => void;
}

const DEFAULT_TTS_SETTINGS: StaffTtsSettings = {
  enabled: true,
  chimeEnabled: true,
  volume: 0.9,
  rate: 0.95,
  pitch: 1.0,
  language: 'bn',
  announceNewOrders: true,
  announceAssistanceRequests: true,
  repeatUnattendedIntervalMinutes: 2
};

const TTSNotificationContext = createContext<TTSNotificationContextType | undefined>(undefined);

export const TTSNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ttsSettings, setTtsSettings] = useState<StaffTtsSettings>(() => {
    try {
      const saved = localStorage.getItem('se_staff_tts_settings');
      if (saved) {
        return { ...DEFAULT_TTS_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return DEFAULT_TTS_SETTINGS;
  });

  const [recentAnnouncements, setRecentAnnouncements] = useState<TTSAnnouncementItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Sync settings with localStorage
  const updateTtsSettings = useCallback((newSettings: Partial<StaffTtsSettings>) => {
    setTtsSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('se_staff_tts_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Unlock audio engine on first interaction
  const unlockAudio = useCallback(() => {
    const success = unlockAudioEngine();
    if (success) {
      setAudioUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      unlockAudio();
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [unlockAudio]);


  const addAnnouncementToLog = useCallback((item: TTSAnnouncementItem) => {
    setRecentAnnouncements(prev => [item, ...prev.slice(0, 19)]);
  }, []);

  // Announce New Order
  const announceNewOrder = useCallback(
    async (order: {
      orderNumber: string;
      customerName: string;
      total: number;
      itemCount?: number;
    }) => {
      if (!ttsSettings.enabled || !ttsSettings.announceNewOrders) return;

      unlockAudioEngine();

      const spokenOrderNum = formatOrderNumberForSpeech(order.orderNumber);
      const textBn = `মনোযোগ দিন! নতুন অর্ডার এসেছে। অর্ডার নম্বর ${spokenOrderNum}, গ্রাহক ${order.customerName}, মোট মূল্য ${order.total} টাকা।`;
      const textEn = `Attention staff! New order received. Order number ${order.orderNumber}, from ${order.customerName}, total amount ${order.total} Taka.`;

      const announcementItem: TTSAnnouncementItem = {
        id: `ann_ord_${Date.now()}`,
        type: 'order',
        title: `New Order: ${order.orderNumber}`,
        titleBn: `নতুন অর্ডার: ${order.orderNumber}`,
        textBn,
        textEn,
        timestamp: new Date().toISOString(),
        details: order
      };
      addAnnouncementToLog(announcementItem);

      // Play melodic chime first if enabled
      if (ttsSettings.chimeEnabled) {
        await playChime('order', ttsSettings.volume);
      }

      setIsSpeaking(true);

      const finishSpeaking = () => setIsSpeaking(false);

      if (ttsSettings.language === 'bn') {
        queueSpeech(textBn, {
          lang: 'bn-BD',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: finishSpeaking
        });
      } else if (ttsSettings.language === 'en') {
        queueSpeech(textEn, {
          lang: 'en-US',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: finishSpeaking
        });
      } else {
        // Bilingual: Bangla first, followed by concise English alert
        queueSpeech(textBn, {
          lang: 'bn-BD',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: () => {
            queueSpeech(`New order ${order.orderNumber}, ${order.total} Taka.`, {
              lang: 'en-US',
              volume: ttsSettings.volume,
              rate: ttsSettings.rate * 1.05,
              pitch: ttsSettings.pitch,
              onEnd: finishSpeaking
            });
          }
        });
      }
    },
    [ttsSettings, addAnnouncementToLog]
  );

  // Announce Customer Assistance Request
  const announceAssistanceRequest = useCallback(
    async (request: {
      customerName: string;
      topic: string;
      topicBn: string;
      location?: string;
    }) => {
      if (!ttsSettings.enabled || !ttsSettings.announceAssistanceRequests) return;

      unlockAudioEngine();

      const loc = request.location || 'দোকান কাউন্টার';
      const textBn = `জরুরি স্টাফ নোটিফিকেশন! গ্রাহক সহায়তা অনুরোধ এসেছে। বিষয়: ${request.topicBn}। গ্রাহক: ${request.customerName}। অবস্থান: ${loc}।`;
      const textEn = `Staff alert! Customer assistance requested. Topic: ${request.topic}. Customer: ${request.customerName}. Location: ${request.location || 'Shop Counter'}.`;

      const announcementItem: TTSAnnouncementItem = {
        id: `ann_req_${Date.now()}`,
        type: 'assistance',
        title: `Assistance: ${request.topic}`,
        titleBn: `সহায়তা অনুরোধ: ${request.topicBn}`,
        textBn,
        textEn,
        timestamp: new Date().toISOString(),
        details: request
      };
      addAnnouncementToLog(announcementItem);

      // Play urgent 2-tone harmonic chime first
      if (ttsSettings.chimeEnabled) {
        await playChime('assistance', ttsSettings.volume);
      }

      setIsSpeaking(true);
      const finishSpeaking = () => setIsSpeaking(false);

      if (ttsSettings.language === 'bn') {
        queueSpeech(textBn, {
          lang: 'bn-BD',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: finishSpeaking
        });
      } else if (ttsSettings.language === 'en') {
        queueSpeech(textEn, {
          lang: 'en-US',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: finishSpeaking
        });
      } else {
        // Bilingual
        queueSpeech(textBn, {
          lang: 'bn-BD',
          volume: ttsSettings.volume,
          rate: ttsSettings.rate,
          pitch: ttsSettings.pitch,
          onEnd: () => {
            queueSpeech(`Customer assistance requested at ${request.location || 'counter'}.`, {
              lang: 'en-US',
              volume: ttsSettings.volume,
              rate: ttsSettings.rate * 1.05,
              pitch: ttsSettings.pitch,
              onEnd: finishSpeaking
            });
          }
        });
      }
    },
    [ttsSettings, addAnnouncementToLog]
  );

  // Decoupled window event listeners for app-wide event dispatching
  useEffect(() => {
    const handleNewOrderEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        announceNewOrder(customEvent.detail);
      }
    };

    const handleAssistanceEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        announceAssistanceRequest(customEvent.detail);
      }
    };

    window.addEventListener('se:new-order', handleNewOrderEvent);
    window.addEventListener('se:assistance-request', handleAssistanceEvent);

    return () => {
      window.removeEventListener('se:new-order', handleNewOrderEvent);
      window.removeEventListener('se:assistance-request', handleAssistanceEvent);
    };
  }, [announceNewOrder, announceAssistanceRequest]);

  const speakCustomMessage = useCallback(
    async (textBn: string, textEn?: string) => {
      if (!ttsSettings.enabled) return;
      unlockAudioEngine();

      if (ttsSettings.chimeEnabled) {
        await playChime('test', ttsSettings.volume);
      }

      setIsSpeaking(true);
      const targetText = ttsSettings.language === 'en' && textEn ? textEn : textBn;
      const targetLang = ttsSettings.language === 'en' ? 'en-US' : 'bn-BD';

      queueSpeech(targetText, {
        lang: targetLang,
        volume: ttsSettings.volume,
        rate: ttsSettings.rate,
        pitch: ttsSettings.pitch,
        onEnd: () => setIsSpeaking(false)
      });
    },
    [ttsSettings]
  );

  // Test New Order Alert
  const testOrderAlert = useCallback(() => {
    announceNewOrder({
      orderNumber: 'SE-2026-TEST',
      customerName: 'তানভীর আহমেদ',
      total: 350,
      itemCount: 2
    });
  }, [announceNewOrder]);

  // Test Customer Assistance Alert
  const testAssistanceAlert = useCallback(() => {
    announceAssistanceRequest({
      customerName: 'রাকিবুল হাসান',
      topic: 'Online Admission Form Help',
      topicBn: 'অনলাইন ভর্তি ফরম পূরণ ও ছবি রিসাইজ সহায়তা',
      location: 'কাউন্টার ১ (সাইবার কর্নার)'
    });
  }, [announceAssistanceRequest]);

  // Replay a logged announcement
  const replayAnnouncement = useCallback(
    async (id: string) => {
      const item = recentAnnouncements.find(a => a.id === id);
      if (!item) return;

      unlockAudioEngine();
      if (ttsSettings.chimeEnabled) {
        await playChime(item.type === 'order' ? 'order' : 'assistance', ttsSettings.volume);
      }

      setIsSpeaking(true);
      const text = ttsSettings.language === 'en' ? item.textEn : item.textBn;
      const lang = ttsSettings.language === 'en' ? 'en-US' : 'bn-BD';

      queueSpeech(text, {
        lang,
        volume: ttsSettings.volume,
        rate: ttsSettings.rate,
        pitch: ttsSettings.pitch,
        onEnd: () => setIsSpeaking(false)
      });
    },
    [recentAnnouncements, ttsSettings]
  );

  const clearAnnouncements = useCallback(() => {
    setRecentAnnouncements([]);
  }, []);

  const stopSpeaking = useCallback(() => {
    stopAllSpeech();
    setIsSpeaking(false);
  }, []);

  return (
    <TTSNotificationContext.Provider
      value={{
        ttsSettings,
        updateTtsSettings,
        announceNewOrder,
        announceAssistanceRequest,
        speakCustomMessage,
        testOrderAlert,
        testAssistanceAlert,
        recentAnnouncements,
        replayAnnouncement,
        clearAnnouncements,
        isSpeaking,
        stopSpeaking,
        audioUnlocked,
        unlockAudio
      }}
    >
      {children}
    </TTSNotificationContext.Provider>
  );
};

export const useTTSNotification = () => {
  const context = useContext(TTSNotificationContext);
  if (!context) {
    throw new Error('useTTSNotification must be used within a TTSNotificationProvider');
  }
  return context;
};
