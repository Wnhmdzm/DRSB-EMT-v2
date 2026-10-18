import React from 'react';
import { AuditRecord } from '../types';
import { History, UserCheck, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuditTrackRecordProps {
  auditTrail: AuditRecord[];
  lastUpdated?: string;
  updatedBy?: string;
  onClearHistory?: () => void;
  className?: string;
}

export const AuditTrackRecord: React.FC<AuditTrackRecordProps> = ({
  auditTrail,
  lastUpdated,
  updatedBy,
  className = ''
}) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
              Change Track Record & Audit Log
            </h3>
            <p className="text-[10px] text-slate-500">
              Verified record of responders who published live dashboard changes
            </p>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          {auditTrail.length} public updates recorded
        </div>
      </div>

      {/* Latest Synced Header Banner */}
      {updatedBy && (
        <div className="mb-3 px-3 py-2 bg-gradient-to-r from-purple-50/80 to-blue-50/80 border border-purple-200/60 rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-slate-600 text-[11px] truncate">
              Latest Public Update by: <strong className="text-slate-900 font-semibold">{updatedBy}</strong>
            </span>
          </div>
          <span className="font-mono text-[10px] text-purple-700 bg-white/80 px-2 py-0.5 rounded-full border border-purple-200/80 shrink-0">
            {lastUpdated || 'Live'}
          </span>
        </div>
      )}

      {/* Audit Log Timeline */}
      <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
        {auditTrail.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No public updates logged yet. Changes will be recorded when you click "Save & Push Public".
          </div>
        ) : (
          auditTrail.map((record, index) => (
            <div
              key={record.id || index}
              className={`p-2.5 rounded-xl border transition-all ${
                index === 0
                  ? 'bg-purple-50/40 border-purple-200/70 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    {record.userName.charAt(0)}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {record.userName}
                  </span>
                  {record.staffId && (
                    <span className="text-[9px] font-mono text-slate-400">
                      ({record.staffId})
                    </span>
                  )}
                  <span className="text-[10px] text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-medium truncate">
                    {record.userRole.split('(')[0].trim()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{record.timestamp}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-700 pl-6 flex items-start gap-1">
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{record.summary}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
