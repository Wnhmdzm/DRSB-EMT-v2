import React from 'react';
import {
  Menu,
  Maximize,
  Edit3,
  RefreshCw,
  ShieldAlert,
  UserCheck,
  Shield,
  CheckCircle2,
  History,
  Droplet
} from 'lucide-react';
import { IncidentDetails, User } from '../types';

export interface CloudSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  isPermissionError?: boolean;
  lastUpdated?: string;
  errorMessage?: string;
}

interface HeaderProps {
  incident: IncidentDetails;
  currentUser: User;
  cloudSyncStatus: CloudSyncStatus;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onToggleLeftMenu: () => void;
  onToggleEditMode: () => void;
  onOpenEditPortal?: () => void;
  onOpenPersonalInfo: () => void;
  onOpenDiagnostics: () => void;
  onRefreshSync: () => void;
  onToggleGlobalFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  incident,
  currentUser,
  cloudSyncStatus,
  isEditMode,
  hasUnsavedChanges,
  onToggleLeftMenu,
  onToggleEditMode,
  onOpenEditPortal,
  onOpenPersonalInfo,
  onOpenDiagnostics,
  onRefreshSync,
  onToggleGlobalFullscreen
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-2xl border-b border-black/[0.07] sticky top-0 z-40 transition-colors shadow-2xs">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Left Menu Trigger + DIALOG Logo + Incident Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Menu Trigger Button (Opens Left-Side Menu Drawer) */}
          <button
            onClick={onToggleLeftMenu}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-800 text-xs font-bold transition cursor-pointer active:scale-95 shrink-0"
            title="Open Menu & Officer Profile"
          >
            <Menu className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline font-semibold">Menu</span>
          </button>

          {/* DIALOG Brand Teal Monogram */}
          <div className="hidden xs:inline-flex items-center justify-center bg-[#008985] text-white px-2 py-1 rounded shadow-xs font-bold text-[11px] tracking-wider shrink-0">
            DIALOG
          </div>

          {/* Title block */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase truncate">
                DRSB EMT
              </h1>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline truncate">
                Emergency Management Team
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium truncate">
              <span>{incident.field}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-700 font-semibold">{incident.location}</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="hidden sm:inline-block font-mono text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                {incident.id}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Controls: Personal Profile + Infront Edit Mode + Cloud Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active Personal Info Pill (Clickable to view/edit user credentials) */}
          <button
            onClick={onOpenPersonalInfo}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-black/[0.07] transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Click to view or edit Officer Personal Information"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
              {currentUser.avatar || currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block min-w-0">
              <div className="text-[11px] font-bold text-slate-900 leading-none truncate max-w-[130px]">
                {currentUser.name}
              </div>
              <div className="text-[9px] text-slate-500 font-medium leading-none truncate max-w-[130px] mt-0.5">
                {currentUser.role.split('(')[0].trim()}
              </div>
            </div>
          </button>

          {/* Upfront "Direct Edit Mode" Toggle */}
          <button
            onClick={onToggleEditMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 border ${
              isEditMode
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-slate-950 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-900 text-white'
            }`}
            title={isEditMode ? 'Exit infront direct editing mode' : 'Enable infront direct create, modify & delete'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isEditMode ? 'Editing Active' : 'Edit Dashboard'}</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            )}
          </button>

          {/* Cloud Database Sync Status */}
          <button
            onClick={onOpenDiagnostics}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer shadow-2xs active:scale-95 ${
              cloudSyncStatus.isPermissionError
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : cloudSyncStatus.isSyncing
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : cloudSyncStatus.isConnected
                ? 'bg-slate-50 hover:bg-slate-100 border-black/[0.07] text-slate-700'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
            title="Cloud Firestore Sync Status - Click for Diagnostics"
          >
            {cloudSyncStatus.isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="hidden md:inline font-bold">Syncing...</span>
              </>
            ) : cloudSyncStatus.isPermissionError ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="hidden md:inline font-bold text-rose-700">Rules Blocked</span>
              </>
            ) : cloudSyncStatus.isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden md:inline font-semibold text-slate-700">Cloud DB</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="hidden md:inline font-bold text-amber-800">Offline Cache</span>
              </>
            )}
          </button>

          {/* Pull Fresh State from Cloud */}
          <button
            onClick={onRefreshSync}
            type="button"
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-black/[0.07] text-slate-600 hover:text-slate-900 transition shadow-2xs cursor-pointer"
            title="Pull latest live public state from Cloud DB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus.isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleGlobalFullscreen}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-black/[0.07] transition shadow-2xs cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
