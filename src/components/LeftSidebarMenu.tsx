import React from 'react';
import { User } from '../types';
import {
  X,
  LayoutGrid,
  Compass,
  Shield,
  History,
  BookOpen,
  Users,
  ShieldCheck,
  LogOut,
  Edit2,
  Phone,
  Radio,
  Building2,
  Mail,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { CloudSyncStatus } from './Header';
import { MobileTab } from '../App';

interface LeftSidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onEditProfile: () => void;
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  onOpenManual: () => void;
  onOpenUserRegistry: () => void;
  onOpenRulesGuide: () => void;
  onOpenDiagnostics: () => void;
  onLogout: () => void;
  cloudSyncStatus: CloudSyncStatus;
}

export const LeftSidebarMenu: React.FC<LeftSidebarMenuProps> = ({
  isOpen,
  onClose,
  currentUser,
  onEditProfile,
  activeTab,
  onSelectTab,
  onOpenManual,
  onOpenUserRegistry,
  onOpenRulesGuide,
  onOpenDiagnostics,
  onLogout,
  cloudSyncStatus
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <aside className="relative w-80 sm:w-96 bg-white shadow-2xl flex flex-col h-full z-10 border-r border-slate-200 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center bg-[#008985] text-white px-2.5 py-1 rounded shadow-xs font-bold text-xs tracking-wider">
              DIALOG
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>DRSB EMT</span>
              </div>
              <p className="text-[10px] text-teal-400 font-semibold tracking-wide">
                Emergency Management Team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Officer Personal Profile Details Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {currentUser.avatar || currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-blue-700 font-semibold truncate">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              {currentUser.isAdmin && (
                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded-full shrink-0">
                  Admin
                </span>
              )}
            </div>

            {/* Credential Details */}
            <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-black/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Staff ID:</span>
                <span className="font-mono font-bold text-slate-800">{currentUser.staffId || 'DRSB-0842'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Station:</span>
                <span className="font-medium text-slate-800 truncate max-w-[170px]">{currentUser.dutyStation || currentUser.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Call Sign:</span>
                <span className="font-mono font-bold text-emerald-700">{currentUser.callSign || 'COMMANDER-1'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-700 truncate max-w-[170px]">{currentUser.email}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Update Officer Profile</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Command Views & Layout
            </span>

            <button
              onClick={() => {
                onSelectTab('all');
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-blue-500" />
              <span>Unified Command (All Sections)</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('overview');
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-500" />
              <span>Overview & Tactical GIS Map</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('operations');
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'operations'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Priority Actions & Marine Logistics</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('audit');
                onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4 text-purple-500" />
              <span>Verified Change Track Record</span>
            </button>
          </div>

          {/* System & Documentation Links */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Platform & Tools
            </span>

            {/* User Manual Button */}
            <button
              onClick={() => {
                onClose();
                onOpenManual();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>DRSB EMT Platform User Manual</span>
            </button>

            {/* Responder Directory */}
            <button
              onClick={() => {
                onClose();
                onOpenUserRegistry();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition cursor-pointer"
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span>Responder Directory & Users Registry</span>
            </button>

            {/* Firebase Rules */}
            <button
              onClick={() => {
                onClose();
                onOpenRulesGuide();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Firebase Security Rules (dialog-drsb-emt)</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-200 shrink-0 space-y-2">
          {/* Cloud Sync State */}
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${cloudSyncStatus.isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>Firestore: <strong>{cloudSyncStatus.isConnected ? 'Connected' : 'Offline'}</strong></span>
            </span>
            <button
              onClick={onOpenDiagnostics}
              className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Diagnostics
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from EMT Dashboard</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
