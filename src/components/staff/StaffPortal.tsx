import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTTSNotification } from '../../context/TTSNotificationContext';
import { Application, ApplicationStatus, AssistanceRequestStatus } from '../../types';
import { StaffTTSControlWidget } from '../common/StaffTTSControlWidget';
import {
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Phone,
  MessageSquare,
  Upload,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  LogOut,
  Sparkles,
  Headphones,
  ShoppingBag,
  BellRing,
  RotateCcw,
  Check,
  Volume2,
  CheckCheck,
  User
} from 'lucide-react';

interface StaffPortalProps {
  onOpenPOS: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ onOpenPOS }) => {
  const { language } = useLanguage();
  const {
    applications,
    updateApplicationStatus,
    addApplicationDocument,
    assistanceRequests,
    updateAssistanceRequestStatus,
    orders,
    updateOrderStatus
  } = useData();
  const { currentUser, logout } = useAuth();
  const { announceAssistanceRequest, announceNewOrder } = useTTSNotification();

  const [activeTab, setActiveTab] = useState<'queue' | 'assistance' | 'orders' | 'completed'>('queue');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchTime] = useState('09:15 AM');

  const pendingAssistanceCount = assistanceRequests.filter(r => r.status === 'pending').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;

  const filteredApps = applications.filter(app => {
    if (activeTab === 'queue') return app.status === 'new' || app.status === 'processing';
    if (activeTab === 'completed') return app.status === 'completed' || app.status === 'delivered';
    return true;
  });

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus, statusNote ? `[${currentUser?.name}]: ${statusNote}` : undefined);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setStatusNote('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, appId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addApplicationDocument(appId, {
        name: file.name,
        url: '#',
        type: file.type || 'document',
        uploadedBy: currentUser?.name || 'Operator'
      });
      alert('Document attached successfully to application record.');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header / Attendance Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-neutral-900 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
            {currentUser?.name.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{currentUser?.name}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold uppercase">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Employee ID: <strong className="font-mono text-white">{currentUser?.employeeId || 'SE-EMP-001'}</strong> • Shift: Morning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPunchedIn(!isPunchedIn)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPunchedIn
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isPunchedIn ? `Punched In (${punchTime})` : 'Punch In Now'}</span>
          </button>

          <button
            onClick={onOpenPOS}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
          >
            <span>Open POS Counter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Staff Text-to-Speech Control Center (Integrated) */}
      <StaffTTSControlWidget variant="embedded" />

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('assistance')}
          className={`p-4 rounded-xl border text-left transition-all ${
            pendingAssistanceCount > 0
              ? 'bg-rose-950/30 border-rose-500/50 hover:bg-rose-950/40'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 uppercase">Assistance Requests</span>
            {pendingAssistanceCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <span className={`text-2xl font-bold font-mono ${
            pendingAssistanceCount > 0 ? 'text-rose-400' : 'text-white'
          }`}>
            {pendingAssistanceCount} <span className="text-xs font-normal text-neutral-400">pending</span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`p-4 rounded-xl border text-left transition-all ${
            pendingOrdersCount > 0
              ? 'bg-amber-950/30 border-amber-500/50 hover:bg-amber-950/40'
              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <span className="text-xs text-neutral-400 uppercase block">Pending Orders</span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {pendingOrdersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-left hover:border-neutral-700 transition-all"
        >
          <span className="text-xs text-neutral-400 uppercase block">Applications Queue</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {applications.filter(a => a.status === 'new' || a.status === 'processing').length}
          </span>
        </button>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <span className="text-xs text-neutral-400 uppercase block">Staff Status</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            TTS Audio Online
          </span>
        </div>
      </div>

      {/* Main Task Queues & Tables */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        {/* Sub-nav Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('assistance')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'assistance'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Customer Help Requests</span>
              {pendingAssistanceCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-600 font-mono text-[10px] font-bold">
                  {pendingAssistanceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Online Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-600 font-mono text-[10px] font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'queue' ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              Application Queue ({applications.filter(a => a.status === 'new' || a.status === 'processing').length})
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              Completed ({applications.filter(a => a.status === 'completed' || a.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* 1. CUSTOMER ASSISTANCE QUEUE */}
        {activeTab === 'assistance' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>দোকানের গ্রাহকদের সরাসরি সহায়তা অনুরোধ (ভয়েস স্পিচ অ্যালার্ট সংযুক্ত)</span>
              <span>মোট অনুরোধ: {assistanceRequests.length}</span>
            </div>

            {assistanceRequests.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                কোনো গ্রাহক সহায়তা অনুরোধ নেই।
              </div>
            ) : (
              assistanceRequests.map(req => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    req.status === 'pending'
                      ? 'bg-rose-950/20 border-rose-500/50'
                      : req.status === 'attending'
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{req.requestNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        req.status === 'pending'
                          ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                          : req.status === 'attending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.customerPhone && (
                        <a
                          href={`tel:${req.customerPhone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-emerald-400 text-xs flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{req.customerPhone}</span>
                        </a>
                      )}

                      <button
                        onClick={() =>
                          announceAssistanceRequest({
                            customerName: req.customerName,
                            topic: req.topic,
                            topicBn: req.topicBn,
                            location: req.location
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1"
                        title="Replay Voice Alert Announcement"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>ভয়েস শুনুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">
                        {language === 'bn' ? req.topicBn : req.topic}
                      </h4>
                      <span className="text-emerald-400 font-semibold">
                        📍 {req.location}
                      </span>
                    </div>
                    <p className="text-neutral-300">
                      গ্রাহক: <strong>{req.customerName}</strong>
                      {req.assignedStaffName && (
                        <span className="ml-3 text-amber-400">
                          (সাড়া দিচ্ছেন: {req.assignedStaffName})
                        </span>
                      )}
                    </p>
                    {req.notes && (
                      <p className="text-neutral-400 italic bg-neutral-950 p-2 rounded border border-neutral-800/80 mt-1">
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-800 text-xs">
                    {req.status === 'pending' && (
                      <button
                        onClick={() =>
                          updateAssistanceRequestStatus(req.id, 'attending', currentUser?.name || 'Staff')
                        }
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1 shadow-sm"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>সাড়া দিন (Attending)</span>
                      </button>
                    )}

                    {req.status !== 'resolved' && (
                      <button
                        onClick={() =>
                          updateAssistanceRequestStatus(req.id, 'resolved', currentUser?.name || 'Staff')
                        }
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>সম্পন্ন চিহ্নিত করুন (Resolved)</span>
                      </button>
                    )}

                    {req.status === 'resolved' && (
                      <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>সহায়তা প্রদান সম্পন্ন হয়েছে</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. ONLINE ORDERS QUEUE */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>অনলাইন অর্ডার তালিকা (টেক্সট-টু-স্পিচ অ্যালার্ট সমন্বিত)</span>
              <span>মোট অর্ডার: {orders.length}</span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 text-xs">
                কোনো অনলাইন অর্ডার রেকর্ড নেই।
              </div>
            ) : (
              orders.map(order => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    order.orderStatus === 'pending'
                      ? 'bg-amber-950/20 border-amber-500/50'
                      : 'bg-neutral-950 border-neutral-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{order.orderNumber}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.orderStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : order.orderStatus === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">৳{order.total}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          announceNewOrder({
                            orderNumber: order.orderNumber,
                            customerName: order.customerName,
                            total: order.total,
                            itemCount: order.items.length
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1"
                        title="Replay Order Speech Alert"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>ঘোষণা শুনুন</span>
                      </button>

                      {order.customerPhone && (
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{order.customerPhone}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800 text-xs space-y-1">
                    <p className="text-neutral-300">
                      গ্রাহক: <strong>{order.customerName}</strong> | ডেলিভারি: {order.deliveryAddress}
                    </p>
                    <p className="text-neutral-400">
                      পণ্যসমূহ: {order.items.map(it => `${it.productNameBn || it.productName} (x${it.quantity})`).join(', ')}
                    </p>
                    {order.paymentTrxId && (
                      <p className="text-emerald-400 font-mono text-[11px]">
                        TrxID: {order.paymentTrxId} ({order.paymentMethod.toUpperCase()})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-xs">
                    <span className="text-neutral-500">
                      তারিখ: {new Date(order.createdAt).toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px]"
                        >
                          Process Order
                        </button>
                      )}
                      {order.orderStatus !== 'completed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed', 'paid')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. APPLICATION QUEUE */}
        {(activeTab === 'queue' || activeTab === 'completed') && (
          <div className="space-y-3">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">
                        {app.applicationNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 uppercase font-bold">
                        {app.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        app.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40' : 'bg-amber-950 text-amber-400 border border-amber-600/40'
                      }`}>
                        ৳{app.amount} ({app.paymentStatus})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {language === 'bn' ? app.serviceNameBn : app.serviceName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${app.applicantPhone}`}
                      className="p-2 rounded-lg bg-neutral-900 text-emerald-400 hover:bg-neutral-800 text-xs flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{app.applicantPhone}</span>
                    </a>

                    <a
                      href={`https://wa.me/88${app.applicantPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Applicant & Details */}
                <div className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-lg border border-neutral-850 space-y-1">
                  <p><strong>Applicant:</strong> {app.applicantName} | <strong>Email:</strong> {app.applicantEmail || 'N/A'}</p>
                  {app.customerNotes && (
                    <p className="text-amber-300"><strong>Notes:</strong> {app.customerNotes}</p>
                  )}
                  {app.notes && (
                    <p className="text-emerald-400"><strong>Operator Update:</strong> {app.notes}</p>
                  )}
                </div>

                {/* Attached docs */}
                {app.documents && app.documents.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {app.documents.map(d => (
                      <span key={d.id} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-750 text-neutral-300 flex items-center gap-1">
                        📎 {d.name} ({d.uploadedBy})
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Pipeline Buttons */}
                <div className="pt-2 border-t border-neutral-850 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400">Update Status:</span>
                    {(['processing', 'submitted', 'completed', 'delivered'] as ApplicationStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(app.id, st)}
                        className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                          app.status === st
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 cursor-pointer flex items-center gap-1 text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Attach Confirmation Slip</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleFileUpload(e, app.id)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
