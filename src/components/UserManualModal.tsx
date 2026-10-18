import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Shield,
  Compass,
  UploadCloud,
  Users,
  CheckCircle2,
  Key,
  AlertTriangle,
  Radio,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'editing' | 'tiers' | 'map' | 'roles' | 'auth'>('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-teal-400">DRSB EMT</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-slate-300 font-semibold uppercase">Official Operational Manual</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Emergency Management Team User Guide & Standard Operating Procedures
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveSection('quickstart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'quickstart'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            🚀 Quick Start & Navigation
          </button>
          <button
            onClick={() => setActiveSection('editing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'editing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            ✏️ Infront Direct Editing & Publish
          </button>
          <button
            onClick={() => setActiveSection('tiers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'tiers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            🚨 Emergency Incident Tiers
          </button>
          <button
            onClick={() => setActiveSection('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'map'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            🗺️ Tactical Map & Safety Zones
          </button>
          <button
            onClick={() => setActiveSection('roles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'roles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            👥 EMT Roles & Chain of Command
          </button>
          <button
            onClick={() => setActiveSection('auth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSection === 'auth'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            🔐 Security & Password Policy
          </button>
        </div>

        {/* Manual Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed flex-1">
          {activeSection === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80">
                <h3 className="font-bold text-blue-900 text-base mb-1">
                  1. Platform Purpose & Overview
                </h3>
                <p className="text-xs text-blue-800 leading-normal">
                  The <strong>DRSB EMT Command System</strong> is Dialog Resources Sdn. Bhd.’s digital crisis management console for the <strong>Baram Junior Cluster (Salbiah & Fatimah Offshore Fields)</strong>. It synchronizes live SITREP data, offshore marine positioning, muster accountability, and action item logs across ECC (Kuala Lumpur), MOCC (Miri Shore Base), and offshore installations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">1</span>
                    Left-Side Menu Drawer
                  </div>
                  <p className="text-xs text-slate-600">
                    Click the <strong>Menu (☰)</strong> button on the top-left of the header to open the slide-out navigation panel. From here, view your officer profile, switch between tactical tabs, access responder directories, and check cloud sync.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">2</span>
                    Real-Time Cloud Synchronization
                  </div>
                  <p className="text-xs text-slate-600">
                    The top header displays the live <strong>Cloud DB status</strong> indicator. When green, all updates are broadcast to connected laptops, control room videowalls, and mobile phones instantaneously.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'editing' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
                <h3 className="font-bold text-amber-900 text-base mb-1">
                  2. Direct Infront Editing & "Save and Push Public" Workflow
                </h3>
                <p className="text-xs text-amber-800 leading-normal">
                  Authorized EMT Officers can create, modify, and delete any dashboard parameter directly in front on the live dashboard with full draft isolation.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Step 1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Click "Edit Dashboard" in the Header</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      The dashboard enters <strong>Direct Edit Mode</strong>. Interactive controls (inputs, dropdowns, add/delete buttons) become enabled on all SITREP blocks, action items, timelines, logistics assets, and weather widgets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Step 2
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Perform Modifications in Draft Preview</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      All changes are isolated in your local draft session. Other users and big screens do not see partial or unverified edits until you choose to publish.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    Step 3
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Choose "Save & Push Public" or "Cancel"</h4>
                    <ul className="text-xs text-slate-600 mt-1 list-disc list-inside space-y-1">
                      <li><strong>Save & Push Public</strong>: Commits edits, writes to Firebase Firestore, updates all connected screens, and logs a verified track record in the Audit Trail with your name and role.</li>
                      <li><strong>Cancel</strong>: Discards all pending draft changes and returns to the previous live dashboard state safely.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tiers' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                3. Emergency Incident Classification Levels
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Level 1 — Local Incident (Field Managed)
                  </div>
                  <p className="text-xs text-emerald-900 mt-1">
                    Event can be managed within local site resources (e.g. minor machinery trip, small contained sheen). MOCC informed on standby. ECC kept informed via scheduled SITREP.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
                  <div className="flex items-center gap-2 font-bold text-amber-800 text-xs uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    Level 2 — Significant / Stabilising Incident (EMT Activated)
                  </div>
                  <p className="text-xs text-amber-900 mt-1">
                    Incident requires external shore support and logistics mobilisation (e.g. subsea ESD shutdown, gas release isolated, medical evacuation required). EMT fully activated. Fast crew boat and search & rescue placed on alert.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80">
                  <div className="flex items-center gap-2 font-bold text-rose-800 text-xs uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    Level 3 — Major Crisis (Crisis Management Team Activated)
                  </div>
                  <p className="text-xs text-rose-900 mt-1">
                    Major catastrophic event with potential loss of life, facility abandonment, or massive offsite environmental consequence. Corporate CMT in KL activated with national authorities (APMM, BOMBA, DOSH).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'map' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                4. Tactical Offshore GIS Map & Maritime Zones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-rose-600 block mb-1">500m Safety Exclusion Zone</span>
                  <p className="text-slate-600">
                    Represented by the red dashed perimeter around SLDP-A. Unauthorized vessels are strictly prohibited from entering this zone without prior OIM permission.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-amber-600 block mb-1">1.5 Nautical Mile Caution Ring</span>
                  <p className="text-slate-600">
                    The outer yellow nautical boundary for approaching vessels. Approaching supply craft must make VHF contact on Marine Ch 16 / Ch 67.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-blue-600 block mb-1">High-Resolution Esri Satellite Imagery</span>
                  <p className="text-slate-600">
                    Real satellite optical imagery with ocean bathymetry tiles. Toggle layer modes between Satellite, Hydrographic Ocean, and Night Tactical Dark.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-emerald-600 block mb-1">Vessel Vectors & Flight Paths</span>
                  <p className="text-slate-600">
                    Shows real-time live heading, vessel speed in knots, estimated time of arrival (ETA), and helicopter search & rescue flight range.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">
                5. EMT Key Role Matrix
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded shrink-0">IC</span>
                  <div>
                    <strong>Incident Commander</strong>: Overall tactical and strategic command of emergency response. Declares incident level and approves public SITREPs.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">OSC</span>
                  <div>
                    <strong>Operations Section Chief</strong>: Directs all offshore and on-scene response operations, platform isolations, and fire/gas mitigation.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded shrink-0">LOG</span>
                  <div>
                    <strong>Logistics Lead</strong>: Mobilizes fast crew boats, medevac helicopters, emergency medical personnel, and shore supplies.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded shrink-0">SO</span>
                  <div>
                    <strong>HSSE & Safety Officer</strong>: Monitors responder safety, gas exposure thresholds, PPE requirements, and statutory reporting (DOSH/DOE).
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'auth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80">
                <h3 className="font-bold text-indigo-900 text-base mb-1">
                  6. Authentication & Password Security Policy
                </h3>
                <p className="text-xs text-indigo-800 leading-normal">
                  All responders log in with their corporate employee email address.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-600" />
                    First-Time Login Access
                  </h4>
                  <p className="text-slate-600 mt-1">
                    When registering or logging in for the first time, use the default emergency passkey: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">Dialog123</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Mandatory Password Update
                  </h4>
                  <p className="text-slate-600 mt-1">
                    Upon entering with the default passkey, the system prompts you to set a permanent, confidential password before proceeding to the live workspace.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Administrator Registry Overview
                  </h4>
                  <p className="text-slate-600 mt-1">
                    The Incident Commander / Administrator has access to the User Registry from the left-side menu to audit registered officers, review last login timestamps, and provision new responders.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            Dialog Resources Sdn. Bhd. · Emergency Management Team (EMT) SOP v1.0.4
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Acknowledge & Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
