import React, { useState } from 'react';
import { ActionItem, TimelineEvent, Vessel, Helicopter, User, AuditRecord } from '../types';
import { PersonalProfileCard } from './PersonalProfileCard';
import { AuditTrackRecord } from './AuditTrackRecord';
import {
  CheckSquare,
  Clock,
  Ship,
  Navigation,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Edit2
} from 'lucide-react';

interface OperationsActionPanelProps {
  currentUser: User;
  actions: ActionItem[];
  timeline: TimelineEvent[];
  vessels: Vessel[];
  helicopter: Helicopter;
  auditTrail: AuditRecord[];
  lastUpdated?: string;
  updatedBy?: string;
  isEditMode: boolean;
  onEditProfile: () => void;
  // Action Tracker handlers
  onAddAction: () => void;
  onUpdateAction: (id: number, field: keyof ActionItem, value: any) => void;
  onDeleteAction: (id: number) => void;
  onToggleActionStatus: (id: number) => void;
  // Timeline handlers
  onAddTimeline: () => void;
  onUpdateTimeline: (id: string, field: keyof TimelineEvent, value: any) => void;
  onDeleteTimeline: (id: string) => void;
  // Vessel handlers
  onAddVessel: () => void;
  onUpdateVessel: (id: string, field: keyof Vessel, value: any) => void;
  onDeleteVessel: (id: string) => void;
  // Helicopter handlers
  onUpdateHelicopter: (field: keyof Helicopter, value: any) => void;
  className?: string;
}

export const OperationsActionPanel: React.FC<OperationsActionPanelProps> = ({
  currentUser,
  actions,
  timeline,
  vessels,
  helicopter,
  auditTrail,
  lastUpdated,
  updatedBy,
  isEditMode,
  onEditProfile,
  onAddAction,
  onUpdateAction,
  onDeleteAction,
  onToggleActionStatus,
  onAddTimeline,
  onUpdateTimeline,
  onDeleteTimeline,
  onAddVessel,
  onUpdateVessel,
  onDeleteVessel,
  onUpdateHelicopter,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* 1. Active Duty Officer Personal Profile Card */}
      <PersonalProfileCard
        currentUser={currentUser}
        onEditProfile={onEditProfile}
      />

      {/* 2. Priority Action Items Matrix (Full Infront Create, Modify, Delete) */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Action Items Tracker
              </h3>
              <p className="text-[10px] text-slate-500 font-normal">
                {actions.filter((a) => a.status === 'Completed').length} of {actions.length} completed
              </p>
            </div>
          </div>

          {isEditMode ? (
            <button
              type="button"
              onClick={onAddAction}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action Item</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Click badge to toggle</span>
          )}
        </div>

        {/* Action Items List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {actions.map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition flex items-start gap-2.5"
            >
              <span className="font-mono text-[10px] text-slate-400 font-bold mt-1 shrink-0">
                #{act.id}
              </span>

              {isEditMode ? (
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={act.action}
                    onChange={(e) => onUpdateAction(act.id, 'action', e.target.value)}
                    className="w-full text-xs text-slate-900 bg-white border border-slate-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    placeholder="Action item description"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={act.responsible}
                      onChange={(e) => onUpdateAction(act.id, 'responsible', e.target.value)}
                      className="w-32 text-[10px] text-slate-700 bg-white border border-slate-300 rounded-lg p-1"
                      placeholder="Responsible Owner"
                    />
                    <select
                      value={act.status}
                      onChange={(e) => onUpdateAction(act.id, 'status', e.target.value)}
                      className="text-[10px] font-bold rounded-lg p-1 bg-white border border-slate-300 text-slate-800"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onDeleteAction(act.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer ml-auto"
                      title="Delete action item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 leading-snug break-words">
                      {act.action}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      Assigned: <strong className="text-blue-700">{act.responsible}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleActionStatus(act.id)}
                    className="shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition"
                    title="Click to toggle status"
                  >
                    {act.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                      </span>
                    ) : act.status === 'In Progress' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Pending
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Chronological Incident Timeline (Full Infront Create, Modify, Delete) */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Incident Timeline Log
              </h3>
              <p className="text-[10px] text-slate-500 font-normal">
                Time-stamped chronology of emergency response actions
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={onAddTimeline}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {timeline.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-2 text-xs py-1.5 px-2 rounded-xl bg-slate-50/70 border border-black/[0.04]"
            >
              {isEditMode ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => onUpdateTimeline(item.id, 'time', e.target.value)}
                    className="w-16 font-mono text-[11px] font-bold text-blue-700 bg-white border border-slate-300 rounded-lg p-1 text-center"
                    placeholder="14:00"
                  />
                  <input
                    type="text"
                    value={item.event}
                    onChange={(e) => onUpdateTimeline(item.id, 'event', e.target.value)}
                    className="flex-1 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg p-1"
                    placeholder="Event description"
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteTimeline(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete timeline event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/80 shrink-0">
                    {item.time}
                  </span>
                  <span className="text-slate-800 leading-snug flex-1 font-medium">{item.event}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Marine & Aviation Logistics Assets */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.04]">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Logistics Assets & Deployment
            </h3>
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={onAddVessel}
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Vessel</span>
            </button>
          )}
        </div>

        {/* Vessels List */}
        <div className="space-y-2">
          {vessels.map((v) => (
            <div
              key={v.id}
              className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs"
            >
              {isEditMode ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => onUpdateVessel(v.id, 'name', e.target.value)}
                      className="flex-1 font-bold text-xs bg-white border border-slate-300 rounded-lg p-1"
                      placeholder="Vessel Name"
                    />
                    <select
                      value={v.status}
                      onChange={(e) => onUpdateVessel(v.id, 'status', e.target.value)}
                      className="text-[10px] font-bold bg-white border border-slate-300 rounded-lg p-1"
                    >
                      <option value="En route">En route</option>
                      <option value="On site">On site</option>
                      <option value="Standby">Standby</option>
                      <option value="Docked">Docked</option>
                    </select>
                    {vessels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteVessel(v.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Speed (kt):</span>
                      <input
                        type="number"
                        value={v.speedKnots}
                        onChange={(e) => onUpdateVessel(v.id, 'speedKnots', Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded p-1"
                      />
                    </div>
                    <div>
                      <span className="text-slate-400 block">ETA:</span>
                      <input
                        type="text"
                        value={v.eta}
                        onChange={(e) => onUpdateVessel(v.id, 'eta', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded p-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Speed: {v.speedKnots} kt · ETA: {v.eta}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {v.status}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Helicopter Asset */}
          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs">
            {isEditMode ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={helicopter.name}
                    onChange={(e) => onUpdateHelicopter('name', e.target.value)}
                    className="flex-1 font-bold text-xs bg-white border border-slate-300 rounded-lg p-1"
                  />
                  <select
                    value={helicopter.status}
                    onChange={(e) => onUpdateHelicopter('status', e.target.value)}
                    className="text-[10px] font-bold bg-white border border-slate-300 rounded-lg p-1"
                  >
                    <option value="Available">Available</option>
                    <option value="Mobilised">Mobilised</option>
                    <option value="Grounded">Grounded</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Conditions:</span>
                    <input
                      type="text"
                      value={helicopter.conditions}
                      onChange={(e) => onUpdateHelicopter('conditions', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mobilisation:</span>
                    <input
                      type="text"
                      value={helicopter.mobilisationTime}
                      onChange={(e) => onUpdateHelicopter('mobilisationTime', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded p-1"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{helicopter.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    Conditions: {helicopter.conditions} · Mobilisation: {helicopter.mobilisationTime}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  {helicopter.status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Change Track Record & Audit Trail (Who made the changes) */}
      <AuditTrackRecord
        auditTrail={auditTrail}
        lastUpdated={lastUpdated}
        updatedBy={updatedBy}
      />
    </div>
  );
};
