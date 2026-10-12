import React, { useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { User } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { generateStaffQRPayload, downloadCanvasAsPng } from '../../utils/staffQrUtils';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Phone,
  Clock,
  Sparkles,
  QrCode
} from 'lucide-react';

interface StaffQRCodeBadgeModalProps {
  staff: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan?: (qrPayload: string) => void;
}

export const StaffQRCodeBadgeModal: React.FC<StaffQRCodeBadgeModalProps> = ({
  staff,
  isOpen,
  onClose,
  onSimulateScan
}) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !staff) return null;

  const qrPayload = generateStaffQRPayload(staff);

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasAsPng(canvasRef.current, `Staff-QR-${staff.employeeId || staff.id}.png`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {language === 'bn' ? 'স্টাফ কিউআর পাস ও আইডি কার্ড' : 'Staff QR Pass & ID Badge'}
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono">
                {staff.employeeId || staff.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content / Printable ID Card */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Physical ID Badge Preview Frame */}
          <div
            id="printable-staff-badge"
            className="w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden space-y-4"
          >
            {/* Top Security Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />

            {/* Shop Brand Header */}
            <div className="pt-1">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-black block">
                SAIFUL ENTERPRISE
              </span>
              <span className="text-[9px] text-neutral-400 block font-sans">
                {language === 'bn' ? 'ডিজিটাল সার্ভিস ও সাইবার সেন্টার • ফার্মগেট, ঢাকা' : 'Digital Service & Cyber Center • Farmgate, Dhaka'}
              </span>
            </div>

            {/* Staff Photo & Details */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <img
                  src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt={staff.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-neutral-950">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-white leading-tight">
                  {staff.name}
                </h4>
                {staff.nameBn && (
                  <p className="text-xs text-neutral-300 font-medium mt-0.5">
                    {staff.nameBn}
                  </p>
                )}
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {staff.designation || staff.role?.replace('_', ' ') || 'Staff Specialist'}
                </span>
              </div>
            </div>

            {/* Shift & Employee ID Pills */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-neutral-950/80 p-2.5 rounded-xl border border-neutral-800 text-left">
              <div>
                <span className="text-[9px] text-neutral-400 block">EMPLOYEE ID</span>
                <span className="font-bold text-white text-xs">{staff.employeeId || staff.id}</span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 block">SHIFT</span>
                <span className="font-semibold text-emerald-400 truncate block text-[11px]">{staff.shift || 'Day Shift'}</span>
              </div>
            </div>

            {/* Unique High-Contrast QR Code Card */}
            <div className="p-4 bg-white rounded-2xl shadow-inner inline-flex flex-col items-center justify-center space-y-2 mx-auto">
              {/* Visible SVG for crisp UI rendering */}
              <QRCodeSVG
                value={qrPayload}
                size={170}
                level="H"
                includeMargin={false}
              />
              {/* Hidden Canvas used for direct PNG download */}
              <div className="hidden">
                <QRCodeCanvas
                  ref={canvasRef}
                  value={qrPayload}
                  size={400}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <span className="text-[10px] text-neutral-900 font-mono font-bold tracking-tight">
                POS ATTENDANCE PASS
              </span>
            </div>

            {/* Scan Instruction Footer */}
            <div className="pt-1">
              <p className="text-[10px] text-neutral-400 leading-tight">
                {language === 'bn'
                  ? 'পস ক্যাশিয়ার কাউন্টারে ক্যামেরা বা কিউআর স্ক্যানারে ধরে হাজিরা দিন'
                  : 'Scan this QR code at the POS counter to check in or check out'}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'পিএনজি ডাউনলোড' : 'Download PNG'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'আইডি কার্ড প্রিন্ট' : 'Print Badge'}</span>
              </button>
            </div>

            {onSimulateScan && (
              <button
                type="button"
                onClick={() => {
                  onSimulateScan(qrPayload);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:brightness-110 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{language === 'bn' ? 'পস কাউন্টারে হাজিরা টেস্ট স্ক্যান করুন' : 'Simulate Scan at POS Counter'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2 px-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{language === 'bn' ? 'কিউআর ডাটা কপি হয়েছে' : 'QR Data Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>{language === 'bn' ? 'কিউআর পে-লোড কপি করুন' : 'Copy QR Payload String'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
