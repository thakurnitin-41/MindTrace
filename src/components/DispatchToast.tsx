import React from 'react';
import { Mail, Smartphone, CheckCheck, X, ExternalLink, Send, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DispatchToast: React.FC = () => {
  const { latestDispatchToast, dismissDispatchToast, setIsNotificationModalOpen } = useApp();

  if (!latestDispatchToast) return null;

  const notif = latestDispatchToast;
  const isEmail = notif.channel === 'email';

  const cleanPhone = notif.to.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(
    notif.content
  )}`;

  const mailtoUrl = `mailto:${notif.to}?subject=${encodeURIComponent(
    notif.subject || notif.title
  )}&body=${encodeURIComponent(notif.content)}`;

  return (
    <div className="fixed bottom-4 right-4 sm:top-20 sm:bottom-auto sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              {isEmail ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isEmail ? 'Email Dispatched' : 'SMS Alert Dispatched'}
                </h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[240px]">
                To: <span className="text-blue-300 font-mono">{notif.to}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissDispatchToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-200 line-clamp-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 font-mono">
          {notif.subject || notif.content}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              dismissDispatchToast();
              setIsNotificationModalOpen(true);
            }}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Open Message Center</span>
          </button>

          <div className="flex items-center gap-1.5">
            {isEmail ? (
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Mail Client</span>
              </a>
            ) : (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
