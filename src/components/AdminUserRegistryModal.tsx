import React, { useState } from 'react';
import { User } from '../types';
import {
  X,
  Users,
  UserPlus,
  Shield,
  Mail,
  Key,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Radio,
  Building2,
  Trash2
} from 'lucide-react';

interface AdminUserRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAddUser: (newUser: User) => Promise<void>;
  onDeleteUser?: (userId: string) => Promise<void>;
  currentUser: User;
}

export const AdminUserRegistryModal: React.FC<AdminUserRegistryModalProps> = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  onDeleteUser,
  currentUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operations Section Chief (OSC)',
    department: 'Offshore Operations',
    staffId: '',
    phone: '',
    dutyStation: 'MOCC Miri Shore Base',
    callSign: 'OPS-2',
    isAdmin: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      department: formData.department,
      staffId: formData.staffId || `DRSB-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: formData.phone || '+60 12-000 0000',
      dutyStation: formData.dutyStation,
      callSign: formData.callSign,
      avatar: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      password: 'Dialog123',
      needsPasswordChange: true,
      isAdmin: formData.isAdmin,
      registeredAt: new Date().toISOString(),
      lastLoginAt: 'Never'
    };

    try {
      await onAddUser(newUser);
      setSuccessMessage(`User "${newUser.name}" added successfully with initial password "Dialog123".`);
      setFormData({
        name: '',
        email: '',
        role: 'Operations Section Chief (OSC)',
        department: 'Offshore Operations',
        staffId: '',
        phone: '',
        dutyStation: 'MOCC Miri Shore Base',
        callSign: 'OPS-2',
        isAdmin: false
      });
      setShowAddForm(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-teal-400">ADMIN CONTROL</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-slate-300 font-semibold uppercase">Responder Directory</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                All Registered Responders & Platform Users ({users.length})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            Responders can log in via corporate email. Initial password is <strong className="font-mono text-slate-900">Dialog123</strong>.
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Register New Responder'}</span>
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Add New Responder Form */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-600" />
                Register New Emergency Responder
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohd Faris bin Salleh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Corporate Email Address (Login ID)</label>
                  <input
                    type="email"
                    required
                    placeholder="name@dialogasia.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">EMT Tactical Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Incident Commander (IC)">Incident Commander (IC)</option>
                    <option value="Operations Section Chief (OSC)">Operations Section Chief (OSC)</option>
                    <option value="Planning Section Chief (PSC)">Planning Section Chief (PSC)</option>
                    <option value="Logistics Lead (LOG)">Logistics Lead (LOG)</option>
                    <option value="HSSE & Safety Officer (SO)">HSSE & Safety Officer (SO)</option>
                    <option value="Duty EMT Observer">Duty EMT Observer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Offshore Production / MOCC"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Staff ID Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. DRSB-1290"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Duty Station & Location</label>
                  <input
                    type="text"
                    placeholder="e.g. SLDP-A Platform / Miri Shore Base"
                    value={formData.dutyStation}
                    onChange={(e) => setFormData({ ...formData, dutyStation: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  Initial password assigned: <strong className="font-mono text-slate-800">Dialog123</strong> (User will be prompted to change on first login).
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? 'Registering...' : 'Save & Provision Responder'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Responders Table / Grid */}
          <div className="space-y-2.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {u.avatar || u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">{u.name}</span>
                      {u.isAdmin && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
                          Admin
                        </span>
                      )}
                      {u.needsPasswordChange && (
                        <span className="text-[9px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded-full">
                          Pending Passkey Change
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-blue-700 font-semibold truncate mt-0.5">{u.role}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {u.email}
                      </span>
                      <span>·</span>
                      <span>Station: {u.dutyStation || u.department}</span>
                      {u.staffId && (
                        <>
                          <span>·</span>
                          <span className="font-mono">{u.staffId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-right shrink-0">
                  <div className="text-[10px] text-slate-400 hidden sm:block">
                    <div>Registered: {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : 'Baseline'}</div>
                    <div>Last Active: {u.lastLoginAt || 'Recent'}</div>
                  </div>
                  {onDeleteUser && users.length > 1 && u.id !== currentUser.id && (
                    <button
                      onClick={() => onDeleteUser(u.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Remove Responder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Emergency Command Authentication · Synced to Firestore <code className="font-mono text-slate-700 font-bold">dialog-drsb-emt</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
