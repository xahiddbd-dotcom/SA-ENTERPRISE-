import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Application, ApplicationStatus } from '../../types';
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
  Sparkles
} from 'lucide-react';

interface StaffPortalProps {
  onOpenPOS: () => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ onOpenPOS }) => {
  const { language } = useLanguage();
  const { applications, updateApplicationStatus, addApplicationDocument, updateApplicationNotes } = useData();
  const { currentUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'queue' | 'my_tasks' | 'completed'>('queue');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchTime] = useState('09:15 AM');

  const filteredApps = applications.filter(app => {
    if (activeTab === 'queue') return app.status === 'new' || app.status === 'processing';
    if (activeTab === 'my_tasks') return app.assignedStaffId === currentUser?.id || !app.assignedStaffId;
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
        id: `doc_${Date.now()}`,
        name: file.name,
        url: '#',
        type: file.type || 'document',
        uploadedAt: new Date().toISOString(),
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
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <span>Open POS Counter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <span className="text-xs text-neutral-400 uppercase block">Pending Queue</span>
          <span className="text-2xl font-bold font-mono text-amber-400">
            {applications.filter(a => a.status === 'new' || a.status === 'processing').length}
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <span className="text-xs text-neutral-400 uppercase block">Completed Today</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {applications.filter(a => a.status === 'completed' || a.status === 'delivered').length}
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <span className="text-xs text-neutral-400 uppercase block">Total System Apps</span>
          <span className="text-2xl font-bold font-mono text-white">
            {applications.length}
          </span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <span className="text-xs text-neutral-400 uppercase block">Staff Status</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active Online
          </span>
        </div>
      </div>

      {/* Task Queue Tabs & Application Processing Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'queue' ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              Active Queue ({applications.filter(a => a.status === 'new' || a.status === 'processing').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              Delivered / Completed ({applications.filter(a => a.status === 'completed' || a.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
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
      </div>
    </div>
  );
};
