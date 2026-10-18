import React from 'react';
import { IncidentDetails, WeatherData, Vessel, IncidentLevel } from '../types';
import { OffshoreMap } from './OffshoreMap';
import {
  ShieldAlert,
  MapPin,
  Users,
  Wind,
  FileText,
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Waves,
  Thermometer,
  Compass
} from 'lucide-react';

interface IncidentExecutivePanelProps {
  incident: IncidentDetails;
  weather: WeatherData;
  vessel: Vessel;
  isEditMode: boolean;
  onUpdateIncidentField: <K extends keyof IncidentDetails>(field: K, value: IncidentDetails[K]) => void;
  onUpdateWeatherField: <K extends keyof WeatherData>(field: K, value: WeatherData[K]) => void;
  onAddPriority: () => void;
  onUpdatePriority: (index: number, value: string) => void;
  onDeletePriority: (index: number) => void;
  onAddObjective: () => void;
  onUpdateObjective: (index: number, value: string) => void;
  onDeleteObjective: (index: number) => void;
  onAddSitrepBullet: () => void;
  onUpdateSitrepBullet: (index: number, value: string) => void;
  onDeleteSitrepBullet: (index: number) => void;
  className?: string;
}

export const IncidentExecutivePanel: React.FC<IncidentExecutivePanelProps> = ({
  incident,
  weather,
  vessel,
  isEditMode,
  onUpdateIncidentField,
  onUpdateWeatherField,
  onAddPriority,
  onUpdatePriority,
  onDeletePriority,
  onAddObjective,
  onUpdateObjective,
  onDeleteObjective,
  onAddSitrepBullet,
  onUpdateSitrepBullet,
  onDeleteSitrepBullet,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. TOP 4 KEY METRIC CARDS (DIRECTLY EDITABLE INFRONT WHEN EDIT MODE IS ON) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1: Emergency Status Level */}
        <div className="bg-gradient-to-br from-rose-50/70 via-white to-white border border-rose-200/80 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-tight uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>INCIDENT LEVEL</span>
            </div>
            {isEditMode && (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                Editable
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {isEditMode ? (
              <select
                value={incident.level}
                onChange={(e) => onUpdateIncidentField('level', e.target.value as IncidentLevel)}
                className="w-full text-xs font-bold text-rose-700 bg-white border border-rose-300 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="LEVEL 1 (LOCAL)">LEVEL 1 (LOCAL)</option>
                <option value="LEVEL 2 (STABILISING)">LEVEL 2 (STABILISING)</option>
                <option value="LEVEL 3 (CRISIS)">LEVEL 3 (CRISIS)</option>
              </select>
            ) : (
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-rose-700 tracking-tight">
                  {incident.level}
                </div>
                <div className="text-[10.5px] text-slate-600 font-medium">Source Isolated · ESD-1</div>
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Facility & Location */}
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-white border border-blue-200/80 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-tight uppercase">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>FACILITY & FIELD</span>
            </div>
            {isEditMode && (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                Editable
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {isEditMode ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={incident.location}
                  onChange={(e) => onUpdateIncidentField('location', e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-blue-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Facility Name"
                />
                <input
                  type="text"
                  value={incident.field}
                  onChange={(e) => onUpdateIncidentField('field', e.target.value)}
                  className="w-full text-[10px] text-blue-700 bg-white border border-blue-200 rounded-lg p-1"
                  placeholder="Field Name"
                />
              </div>
            ) : (
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {incident.location}
                </div>
                <div className="text-[10.5px] text-blue-700 font-medium truncate">{incident.field}</div>
              </div>
            )}
          </div>
        </div>

        {/* Metric 3: Personnel Onboard (POB) Accountability */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-200/80 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-tight uppercase">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>POB MUSTER COUNT</span>
            </div>
            {isEditMode && (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                Editable
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block">Accounted:</span>
                  <input
                    type="number"
                    value={incident.accountedPersonnel}
                    onChange={(e) => onUpdateIncidentField('accountedPersonnel', Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg p-1"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block">Total POB:</span>
                  <input
                    type="number"
                    value={incident.totalPersonnel}
                    onChange={(e) => onUpdateIncidentField('totalPersonnel', Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg p-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {incident.accountedPersonnel} / {incident.totalPersonnel} POB
                </div>
                <div className="text-[10.5px] text-emerald-700 font-medium">100% Accounted For</div>
              </div>
            )}
          </div>
        </div>

        {/* Metric 4: Offshore Metocean Weather */}
        <div className="bg-gradient-to-br from-sky-50/70 via-white to-white border border-sky-200/80 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-tight uppercase">
              <Wind className="w-3.5 h-3.5 text-sky-600" />
              <span>WEATHER & OCEAN</span>
            </div>
            {isEditMode && (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded">
                Editable
              </span>
            )}
          </div>

          <div className="mt-1.5">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block">Wind (kt):</span>
                  <input
                    type="number"
                    value={weather.windSpeedKt}
                    onChange={(e) => onUpdateWeatherField('windSpeedKt', Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-sky-300 rounded-lg p-1"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-slate-400 block">Sea (m):</span>
                  <input
                    type="number"
                    step="0.1"
                    value={weather.seaStateM}
                    onChange={(e) => onUpdateWeatherField('seaStateM', Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-sky-300 rounded-lg p-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {weather.windSpeedKt} kt · {weather.seaStateM} m sea
                </div>
                <div className="text-[10.5px] text-sky-700 font-medium truncate">
                  {weather.windDirection} · Flight Conditions Suitable
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PHOTOREALISTIC OFFSHORE OPERATIONS GIS MAP                              */}
      {/* ========================================================================= */}
      <div className="rounded-2xl overflow-hidden shadow-xs border border-black/[0.08]">
        <OffshoreMap
          vessel={vessel}
          weather={weather}
          className="w-full h-[360px] sm:h-[440px]"
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. SITUATION REPORT (SITREP) - FULL INFRONT CREATE, MODIFY & DELETE        */}
      {/* ========================================================================= */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.04]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Situation Report (SITREP #{incident.latestSitrepNumber})
                </h3>
                {isEditMode && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                    Direct Edit Mode
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">
                Official operational status broadcast across command posts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={incident.latestSitrepNumber}
                  onChange={(e) => onUpdateIncidentField('latestSitrepNumber', e.target.value)}
                  className="w-12 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg p-1 text-center"
                  title="SITREP Number"
                />
                <button
                  type="button"
                  onClick={onAddSitrepBullet}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add SITREP Point</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full font-bold border border-indigo-100">
                Next Report: {incident.nextSitrepTime}
              </span>
            )}
          </div>
        </div>

        {/* SITREP Bullet Items List (Editable infront) */}
        <div className="space-y-2">
          {incident.latestSitrepText.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 group">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-2" />
              {isEditMode ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => onUpdateSitrepBullet(idx, e.target.value)}
                    className="flex-1 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteSitrepBullet(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                    title="Delete SITREP bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{bullet}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STRATEGIC PRIORITIES & OBJECTIVES - INFRONT CREATE, MODIFY, DELETE      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Card A: Priorities */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.04]">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-900">Current Command Priorities</h3>
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={onAddPriority}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Priority</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {incident.currentPriorities.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                {isEditMode ? (
                  <div className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={p}
                      onChange={(e) => onUpdatePriority(idx, e.target.value)}
                      className="flex-1 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => onDeletePriority(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-800 font-medium leading-snug">{p}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card B: Objectives */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.04]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Strategic Response Objectives</h3>
            </div>
            {isEditMode && (
              <button
                type="button"
                onClick={onAddObjective}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Objective</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {incident.incidentObjectives.map((obj, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {isEditMode ? (
                  <div className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => onUpdateObjective(idx, e.target.value)}
                      className="flex-1 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => onDeleteObjective(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-800 font-medium leading-snug">{obj}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
