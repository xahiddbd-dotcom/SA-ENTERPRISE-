import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import {
  Video,
  Camera,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Move,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  Copy,
  Check,
  Download,
  Settings,
  Shield,
  Wifi,
  Radio,
  Clock,
  MapPin,
  X,
  Eye,
  Sliders,
  Smartphone,
  ExternalLink,
  Activity,
  AlertCircle
} from 'lucide-react';

interface DahuaLiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DahuaLiveCameraModal: React.FC<DahuaLiveCameraModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { settings, updateSettings } = useData();

  const cameraConfig = settings.cctvCamera || {
    model: 'Dahua DH-IPC-H5AS 5MP Indoor Pan & Tilt WiFi Camera',
    locationName: 'Saiful Enterprise - Indira Road Main Counter',
    locationNameBn: 'সাইফুল এন্টারপ্রাইজ - ইন্দিরা রোড প্রধান কাউন্টার ও সেবা কেন্দ্র',
    streamUrl: '',
    webrtcUrl: '',
    rtspUrl: 'rtsp://admin:saiful9696@192.168.1.108:554/cam/realmonitor?channel=1&subtype=0',
    p2pCloudId: '9L05B77PAC82491',
    ipAddress: '192.168.1.108',
    port: 554,
    enabled: true,
    allowPublicLiveView: true,
    ptzSupported: true,
    resolution: '5MP 3K QHD (2880 × 1620)',
    fps: 25
  };

  // PTZ State
  const [panAngle, setPanAngle] = useState(145);
  const [tiltAngle, setTiltAngle] = useState(15);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAutoPatrol, setIsAutoPatrol] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('counter1');

  // Audio / Video states
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);
  const [streamQuality, setStreamQuality] = useState<'main' | 'sub' | 'mobile'>('main');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'live' | 'ptz' | 'settings' | 'dmss'>('live');

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bitrate, setBitrate] = useState('4,180 kbps');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Settings edit form
  const [streamUrlInput, setStreamUrlInput] = useState(cameraConfig.streamUrl || '');
  const [rtspUrlInput, setRtspUrlInput] = useState(cameraConfig.rtspUrl || '');
  const [p2pInput, setP2pInput] = useState(cameraConfig.p2pCloudId || '9L05B77PAC82491');
  const [ipInput, setIpInput] = useState(cameraConfig.ipAddress || '192.168.1.108');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clock ticking effect
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Slight fluctuation in bitrate for authenticity
      const kbps = Math.floor(4050 + Math.random() * 250);
      setBitrate(`${kbps.toLocaleString()} kbps`);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Auto patrol animation
  useEffect(() => {
    if (!isAutoPatrol || !isOpen) return;
    const interval = setInterval(() => {
      setPanAngle(prev => (prev >= 340 ? 20 : prev + 15));
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoPatrol, isOpen]);

  // Canvas drawing for realistic simulated CCTV feed
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Base interior room gradient (Store interior perspective)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0a1017');
      grad.addColorStop(0.4, '#121c27');
      grad.addColorStop(0.7, '#182430');
      grad.addColorStop(1, '#0c151e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Store floor grid lines (perspective view of Indira Road shop)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(width / 2 + (panAngle - 180) * 2, height * 0.35);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Shop Counter silhouettes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      // Counter-1 (Photocopy & Printing desk)
      const counterOffset = (panAngle - 145) * 2.5;
      ctx.fillRect(100 - counterOffset, height * 0.52, 280, 160);
      // Counter outline
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.strokeRect(100 - counterOffset, height * 0.52, 280, 160);

      // Label on Counter 1
      ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.font = '11px monospace';
      ctx.fillText('COUNTER-01: PHOTOCOPY & TYPING', 110 - counterOffset, height * 0.56);

      // Photocopier Machine silhouette
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.fillRect(130 - counterOffset, height * 0.38, 120, 90);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.strokeRect(130 - counterOffset, height * 0.38, 120, 90);
      // Status light on copier
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(230 - counterOffset, height * 0.41, 3, 0, Math.PI * 2);
      ctx.fill();

      // Counter-2 (Online Application & Student Registration desk)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(440 - counterOffset, height * 0.50, 320, 180);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.strokeRect(440 - counterOffset, height * 0.50, 320, 180);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.font = '11px monospace';
      ctx.fillText('COUNTER-02: ADMISSION & BMET PORTAL', 450 - counterOffset, height * 0.54);

      // Monitor screen at counter 2
      ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
      ctx.fillRect(470 - counterOffset, height * 0.36, 110, 75);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.strokeRect(470 - counterOffset, height * 0.36, 110, 75);

      // Entrance Glass Door silhouette in background
      ctx.fillStyle = 'rgba(30, 58, 86, 0.3)';
      ctx.fillRect(800 - counterOffset, height * 0.22, 130, 260);
      ctx.strokeStyle = 'rgba(94, 234, 212, 0.25)';
      ctx.strokeRect(800 - counterOffset, height * 0.22, 130, 260);
      ctx.fillStyle = 'rgba(94, 234, 212, 0.7)';
      ctx.font = '10px monospace';
      ctx.fillText('INDIRA ROAD ENTRANCE', 805 - counterOffset, height * 0.26);

      // Target Motion Detection Box (Simulating Dahua Smart Human Detection)
      const nowMs = Date.now();
      const waveX = Math.sin(nowMs / 1800) * 30;
      const targetX = 520 - counterOffset + waveX;
      const targetY = height * 0.42;

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(targetX, targetY, 65, 115);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
      ctx.font = '10px monospace';
      ctx.fillText('TARGET: OPERATOR', targetX, targetY - 6);

      // Subtle CCTV Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // Digital Noise / Grain (subtle)
      const scanLineY = (nowMs / 8) % height;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.fillRect(0, scanLineY, width, 2);

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isOpen, panAngle, tiltAngle, zoomLevel]);

  if (!isOpen) return null;

  const handlePan = (direction: 'left' | 'right' | 'up' | 'down') => {
    setIsAutoPatrol(false);
    if (direction === 'left') setPanAngle(p => Math.max(0, p - 10));
    if (direction === 'right') setPanAngle(p => Math.min(355, p + 10));
    if (direction === 'up') setTiltAngle(t => Math.min(80, t + 5));
    if (direction === 'down') setTiltAngle(t => Math.max(-5, t - 5));
  };

  const handleSelectPreset = (preset: 'counter1' | 'counter2' | 'entrance' | 'cash') => {
    setActivePreset(preset);
    setIsAutoPatrol(false);
    if (preset === 'counter1') {
      setPanAngle(145);
      setTiltAngle(15);
      setZoomLevel(1);
    } else if (preset === 'counter2') {
      setPanAngle(210);
      setTiltAngle(12);
      setZoomLevel(1.2);
    } else if (preset === 'entrance') {
      setPanAngle(310);
      setTiltAngle(20);
      setZoomLevel(1);
    } else if (preset === 'cash') {
      setPanAngle(175);
      setTiltAngle(10);
      setZoomLevel(1.5);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleTakeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.download = `saiful-enterprise-cctv-${timestamp}.jpg`;
      link.href = dataUrl;
      link.click();
      setSnapshotTaken(true);
      setTimeout(() => setSnapshotTaken(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      cctvCamera: {
        ...cameraConfig,
        streamUrl: streamUrlInput,
        rtspUrl: rtspUrlInput,
        p2pCloudId: p2pInput,
        ipAddress: ipInput
      }
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const formattedDate = currentTime.toLocaleDateString('en-CA');
  const formattedTime = currentTime.toTimeString().split(' ')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        ref={videoContainerRef}
        className={`bg-neutral-900 border border-neutral-700/80 rounded-3xl w-full ${
          isFullscreen ? 'max-w-none h-screen rounded-none' : 'max-w-5xl max-h-[94vh]'
        } overflow-y-auto shadow-2xl flex flex-col text-white font-sans my-auto`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <Video className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-neutral-900 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {cameraConfig.model}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>LIVE 5MP 3K</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  {bitrate}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>
                  {language === 'bn' ? cameraConfig.locationNameBn : cameraConfig.locationName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Tabs */}
            <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'live' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'লাইভ ফিড' : 'Live Feed'}
              </button>
              <button
                onClick={() => setActiveTab('ptz')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'ptz' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'ক্যামেরা কন্ট্রোল (PTZ)' : 'PTZ Controls'}
              </button>
              <button
                onClick={() => setActiveTab('dmss')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'dmss' ? 'bg-emerald-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'bn' ? 'মোবাইল / RTSP' : 'Mobile / RTSP'}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-1.5 rounded-lg transition-all ${
                  activeTab === 'settings' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Camera Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-950/60 hover:text-rose-400 text-neutral-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          {/* Main Video Surveillance Screen */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl group">
            {/* Realtime Canvas Renderer simulating Dahua 5MP Stream */}
            <canvas
              ref={canvasRef}
              width={960}
              height={540}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-out'
              }}
            />

            {/* OSD - Top Bar (authentic CCTV overlay) */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] sm:text-xs font-mono text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <strong className="text-white">CAM-01 [MAIN_SHOP_COUNTER]</strong>
                </span>
                <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm hidden sm:inline-block">
                  DAHUA DH-IPC-H5AS 5MP 3K
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-black/60 px-2 py-1 rounded backdrop-blur-sm text-white">
                  {formattedDate} {formattedTime}
                </span>
                <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  25 FPS
                </span>
              </div>
            </div>

            {/* OSD - Bottom Bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                <span className="text-emerald-400">PAN: {panAngle}°</span>
                <span>|</span>
                <span className="text-teal-400">TILT: {tiltAngle}°</span>
                <span>|</span>
                <span className="text-amber-400">ZOOM: {zoomLevel}x</span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">5GHz WiFi 98%</span>
                <span>•</span>
                <span>H.265+ {bitrate}</span>
              </div>
            </div>

            {/* In-Video Action Controls (Overlay on Hover) */}
            <div className="absolute bottom-12 right-4 flex items-center gap-2 z-20">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                  !isAudioMuted
                    ? 'bg-emerald-600/90 border-emerald-400 text-white'
                    : 'bg-black/70 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
                title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
              </button>

              <button
                onClick={() => setIsMicActive(!isMicActive)}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                  isMicActive
                    ? 'bg-rose-600/90 border-rose-400 text-white animate-pulse'
                    : 'bg-black/70 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
                title={isMicActive ? 'Mic Active (2-Way Talk)' : 'Activate Mic (2-Way Talk)'}
              >
                {isMicActive ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={handleTakeSnapshot}
                className="p-2 rounded-xl bg-black/70 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors"
                title="Capture Snapshot"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Feedback message for snapshot */}
          {snapshotTaken && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'bn'
                  ? 'সিসিটিভি ফ্রেম স্ন্যাপশট সফলভাবে ডাউনলোড করা হয়েছে!'
                  : 'CCTV frame snapshot successfully captured and downloaded!'}
              </span>
            </div>
          )}

          {/* TAB 1: LIVE FEED & QUICK PTZ PRESETS */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              {/* Presets Grid */}
              <div>
                <span className="text-xs font-bold text-neutral-300 block mb-2">
                  {language === 'bn' ? 'দোকানের নির্দিষ্ট স্থানসমূহ (Quick Camera Views):' : 'Camera Position Presets:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <button
                    onClick={() => handleSelectPreset('counter1')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activePreset === 'counter1'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="font-bold block text-emerald-400">কাউন্টার-০১</span>
                    <span className="text-[11px] text-neutral-400">ফটোকপি ও টাইপিং এরিয়া</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('counter2')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activePreset === 'counter2'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="font-bold block text-teal-400">কাউন্টার-০২</span>
                    <span className="text-[11px] text-neutral-400">ভর্তি ও অনলাইন আবেদন</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('cash')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activePreset === 'cash'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="font-bold block text-amber-400">ক্যাশ ও ডেলিভারি</span>
                    <span className="text-[11px] text-neutral-400">বিলিং ও ক্যাশ ড্রয়ার</span>
                  </button>

                  <button
                    onClick={() => handleSelectPreset('entrance')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activePreset === 'entrance'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-white shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <span className="font-bold block text-sky-400">দোকানের প্রবেশপথ</span>
                    <span className="text-[11px] text-neutral-400">ইন্দিরা রোড সম্মুখ গেট</span>
                  </button>
                </div>
              </div>

              {/* Status & Tech Specifications Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">ক্যামেরা মডেল</span>
                  <strong className="text-white text-xs">Dahua DH-IPC-H5AS</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">ভিডিও রেজোলিউশন</span>
                  <strong className="text-emerald-400 font-mono text-xs">5MP 3K (2880×1620)</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">প্যান ও টিল্ট কোণ</span>
                  <strong className="text-white font-mono text-xs">0°-355° Pan, -5°-80° Tilt</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">দ্বিমুখী অডিও</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    Two-Way Talk সক্রিয়
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED PTZ JOYSTICK & ZOOM CONTROLS */}
          {activeTab === 'ptz' && (
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* 4-Way D-Pad Directional Controller */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-neutral-300">
                    {language === 'bn' ? 'প্যান ও টিল্ট জয়স্টিক (Pan & Tilt Direction):' : 'Directional PTZ:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2 w-36 h-36">
                    <div />
                    <button
                      onClick={() => handlePan('up')}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-emerald-400 active:scale-95 shadow"
                      title="Tilt Up"
                    >
                      <ChevronUp className="w-5 h-5" />
                    </button>
                    <div />

                    <button
                      onClick={() => handlePan('left')}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-emerald-400 active:scale-95 shadow"
                      title="Pan Left"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setPanAngle(180);
                        setTiltAngle(15);
                        setZoomLevel(1);
                      }}
                      className="p-3 bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400 rounded-xl flex items-center justify-center text-white active:scale-95 shadow font-bold text-[10px]"
                      title="Center Preset"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePan('right')}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-emerald-400 active:scale-95 shadow"
                      title="Pan Right"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div />
                    <button
                      onClick={() => handlePan('down')}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl flex items-center justify-center text-emerald-400 active:scale-95 shadow"
                      title="Tilt Down"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <div />
                  </div>
                </div>

                {/* PTZ Sliders & Patrol */}
                <div className="flex-1 space-y-4 max-w-md w-full">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">ডিজিটাল জুম (Digital Zoom):</span>
                      <span className="font-mono font-bold text-emerald-400">{zoomLevel}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.1"
                      value={zoomLevel}
                      onChange={e => setZoomLevel(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">প্যান ডিগ্রি (Pan Angle 0°-355°):</span>
                      <span className="font-mono font-bold text-teal-400">{panAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="355"
                      value={panAngle}
                      onChange={e => {
                        setIsAutoPatrol(false);
                        setPanAngle(Number(e.target.value));
                      }}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setIsAutoPatrol(!isAutoPatrol)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isAutoPatrol
                          ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {isAutoPatrol ? 'অটো-প্যাট্রোল সক্রিয় (360° Patrol ON)' : 'অটো-প্যাট্রোল চালু করুন (Auto Patrol)'}
                    </button>

                    <button
                      onClick={() => {
                        setPanAngle(145);
                        setTiltAngle(15);
                        setZoomLevel(1);
                      }}
                      className="text-xs text-neutral-400 hover:text-white underline"
                    >
                      ডিফল্ট পজিশন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DAHUA DMSS MOBILE APP & RTSP ACCESS */}
          {activeTab === 'dmss' && (
            <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Dahua DMSS মোবাইল অ্যাপ ও ক্লাউড P2P অ্যাক্সেস</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    মোবাইল থেকে সরাসরি 24/7 লাইভ দেখার জন্য Dahua DMSS অ্যাপ ব্যবহার করুন।
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[11px]">
                  Cloud P2P Online
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RTSP Stream URL */}
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-300 block">
                    RTSP লোকাল / নেটওয়ার্ক স্ট্রিম লিংক:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cameraConfig.rtspUrl}
                      className="flex-1 p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 font-mono text-[11px] focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(cameraConfig.rtspUrl || '', 'rtsp')}
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                      title="Copy RTSP URL"
                    >
                      {copiedField === 'rtsp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    VLC Player, OBS Studio বা NVR সিস্টেমে সরাসরি ইনপুট হিসেবে ব্যবহারযোগ্য।
                  </p>
                </div>

                {/* P2P Cloud Serial Number */}
                <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-300 block">
                    Dahua P2P ক্লাউড সিরিয়াল নম্বর (SN):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cameraConfig.p2pCloudId}
                      className="flex-1 p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-emerald-400 font-mono font-bold text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(cameraConfig.p2pCloudId || '', 'p2p')}
                      className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                      title="Copy Serial Number"
                    >
                      {copiedField === 'p2p' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    DMSS অ্যাপে Device Serial Number হিসেবে পেস্ট করে সরাসরি লাইভ দেখতে পাবেন।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <strong className="text-white text-xs block">Dahua DMSS মোবাইল অ্যাপ ডাউনলোড:</strong>
                  <span className="text-[11px] text-neutral-400">Android (Google Play) ও iOS (App Store) এর জন্য উপলব্ধ</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.mm.android.DMSS"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Google Play</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://apps.apple.com/app/dmss/id1493946327"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>App Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAMERA CONFIGURATION SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span>ক্যামেরা নেটওয়ার্ক ও স্ট্রিমিং কনফিগারেশন</span>
                </h4>
                {settingsSaved && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                    সেটিংস সংরক্ষিত হয়েছে!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">ক্যামেরার আইপি অ্যাড্রেস (IP Address):</label>
                  <input
                    type="text"
                    value={ipInput}
                    onChange={e => setIpInput(e.target.value)}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">ক্লাউড P2P সিরিয়াল নম্বর:</label>
                  <input
                    type="text"
                    value={p2pInput}
                    onChange={e => setP2pInput(e.target.value)}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">RTSP স্ট্রিম ইউআরএল (RTSP URL):</label>
                  <input
                    type="text"
                    value={rtspUrlInput}
                    onChange={e => setRtspUrlInput(e.target.value)}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">কাস্টম WebRTC / HLS স্ট্রিমিং লিংক (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    placeholder="https://your-stream-server.com/live/stream.m3u8"
                    value={streamUrlInput}
                    onChange={e => setStreamUrlInput(e.target.value)}
                    className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-950"
                >
                  {language === 'bn' ? 'ক্যামেরা সেটিংস আপডেট করুন' : 'Save Camera Settings'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-950/90 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'bn'
                ? 'সাইফুল এন্টারপ্রাইজ সার্বক্ষণিক সিসিটিভি নজরদারি ব্যবস্থা'
                : 'Saiful Enterprise 24/7 Security CCTV Monitoring System'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close Viewer'}
          </button>
        </div>
      </div>
    </div>
  );
};
