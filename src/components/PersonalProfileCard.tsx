import React from 'react';
import { User } from '../types';
import { UserCheck, Shield, Phone, Radio, Building2, Edit2 } from 'lucide-react';

interface PersonalProfileCardProps {
  currentUser: User;
  onEditProfile: () => void;
  className?: string;
}

export const PersonalProfileCard: React.FC<PersonalProfileCardProps> = ({
  currentUser,
  onEditProfile,
  className = ''
}) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.05]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {currentUser.avatar || currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
                {currentUser.staffId && (
                  <span className="text-[9px] font-mono text-slate-400 font-semibold shrink-0">
                    {currentUser.staffId}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-blue-700 font-semibold truncate">{currentUser.role}</p>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition cursor-pointer shrink-0"
            title="Edit Duty Officer Personal Information"
          >
            <Edit2 className="w-3 h-3 text-blue-600" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="bg-slate-50/80 rounded-xl p-2 border border-black/[0.03]">
            <span className="text-[9px] font-semibold text-slate-400 block uppercase">Duty Station</span>
            <span className="font-medium text-slate-800 truncate block mt-0.5">
              {currentUser.dutyStation || currentUser.department}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-2 border border-black/[0.03]">
            <span className="text-[9px] font-semibold text-slate-400 block uppercase">VHF / Call Sign</span>
            <span className="font-mono font-bold text-emerald-700 truncate block mt-0.5">
              {currentUser.callSign || 'COMMANDER-1'}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-2 border border-black/[0.03]">
            <span className="text-[9px] font-semibold text-slate-400 block uppercase">Emergency Phone</span>
            <span className="font-medium text-slate-800 truncate block mt-0.5">
              {currentUser.phone || '+60 12-389 4410'}
            </span>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-2 border border-black/[0.03]">
            <span className="text-[9px] font-semibold text-slate-400 block uppercase">Audit Attribution</span>
            <span className="font-medium text-purple-700 truncate block mt-0.5">
              Attached to Changes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
