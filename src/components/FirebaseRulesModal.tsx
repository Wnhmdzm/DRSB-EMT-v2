import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, ExternalLink, AlertCircle, FileCode } from 'lucide-react';

interface FirebaseRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FIREBASE_FIRESTORE_RULES_CONTENT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    // 1. Live EMT Dashboard Document (Incident state, SITREP, action items, audit trail)
    match /emt_dashboard/{docId} {
      // Allow read for all connected responder screens & control room monitors
      allow read: if true;

      // Allow write for authorized responders updating dashboard state & user registry
      allow write: if true;
    }

    // 2. User Profiles and Registered Responders Collection
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }

    // 3. Fallback deny for unauthorized root collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`;

export const FirebaseRulesModal: React.FC<FirebaseRulesModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FIREBASE_FIRESTORE_RULES_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
                Firebase Firestore Security Rules
              </h2>
              <p className="text-xs text-slate-400">
                Ready-to-paste rules for project: <strong className="text-amber-400 font-mono">dialog-drsb-emt</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Easy 2-Step Setup in Firebase Console:
            </div>
            <ol className="list-decimal list-inside pl-1 space-y-0.5 text-[11px] text-amber-800">
              <li>Open <a href="https://console.firebase.google.com/project/dialog-drsb-emt/firestore/rules" target="_blank" rel="noreferrer" className="underline font-bold text-amber-950">Firebase Console → Firestore Database → Rules tab</a>.</li>
              <li>Paste the snippet below and click <strong>"Publish"</strong>.</li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-mono rounded-t-xl border border-b-0 border-slate-700">
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>firestore.rules</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-[11px] font-bold transition shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Rules</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-b-xl border border-slate-700 overflow-x-auto max-h-64 leading-relaxed selection:bg-blue-600 selection:text-white">
              {FIREBASE_FIRESTORE_RULES_CONTENT}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <a
            href="https://console.firebase.google.com/project/dialog-drsb-emt/firestore/rules"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
          >
            <span>Open Firebase Rules Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
