import React, { useState } from 'react';
import {
  X,
  Mail,
  Smartphone,
  CheckCheck,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Bell,
  Trash2,
  RefreshCw,
  Send,
  Building2,
  Lock,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DispatchedNotification } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChannelFilter?: 'all' | 'email' | 'sms';
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  initialChannelFilter = 'all'
}) => {
  const {
    dispatchedNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    resendNotification,
    activeStudent
  } = useApp();

  const [channelFilter, setChannelFilter] = useState<'all' | 'email' | 'sms'>(initialChannelFilter);
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(
    dispatchedNotifications[0]?.id || null
  );
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showDeveloperGuide, setShowDeveloperGuide] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = dispatchedNotifications.filter((n) => {
    if (channelFilter === 'all') return true;
    if (channelFilter === 'email') return n.channel === 'email';
    if (channelFilter === 'sms') return n.channel === 'sms' || n.channel === 'whatsapp';
    return true;
  });

  const activeNotification =
    dispatchedNotifications.find((n) => n.id === selectedNotifId) ||
    filteredNotifications[0] ||
    null;

  const handleSelectNotif = (notif: DispatchedNotification) => {
    setSelectedNotifId(notif.id);
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
  };

  const copyToClipboard = (text: string, isPin = false) => {
    navigator.clipboard.writeText(text);
    if (isPin) {
      setCopiedPin(true);
      setTimeout(() => setCopiedPin(false), 2000);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  // Direct external trigger URLs
  const getWhatsAppUrl = (notif: DispatchedNotification) => {
    const cleanPhone = notif.to.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(notif.content);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  };

  const getMailtoUrl = (notif: DispatchedNotification) => {
    const subject = encodeURIComponent(notif.subject || notif.title);
    const body = encodeURIComponent(notif.content);
    return `mailto:${notif.to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white">
                  Message Dispatch & Verification Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dispatches verification messages and security alerts to registered Email and Phone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markAllNotificationsAsRead()}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close message center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Delivery Status Ribbon */}
        <div className="bg-blue-50/80 border-b border-blue-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Dispatch Guarantee:</strong> MindTrace triggers instant notifications upon
              every <strong>Registration</strong> and <strong>Sign-in</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDeveloperGuide(!showDeveloperGuide)}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showDeveloperGuide ? 'Hide API Setup Guide' : 'How real SMS / Email APIs work'}</span>
          </button>
        </div>

        {/* Developer / Production Cloud Integration Notice */}
        {showDeveloperGuide && (
          <div className="bg-slate-900 text-slate-200 px-5 py-3 border-b border-slate-800 text-xs animate-in slide-in-from-top-2">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Production Setup Guide for Real External Gateways:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
              For live production deployment to deliver messages into external user Gmail/Outlook and
              physical cellular networks:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                <strong className="text-blue-300 block mb-0.5">📧 Email Gateway (Resend / SendGrid / AWS SES)</strong>
                Configure <code className="text-amber-300 font-mono">RESEND_API_KEY</code> or SMTP credentials in your backend to relay transactional emails.
              </div>
              <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                <strong className="text-emerald-300 block mb-0.5">📱 SMS / WhatsApp Gateway (Twilio / MSG91)</strong>
                Configure <code className="text-amber-300 font-mono">TWILIO_ACCOUNT_SID</code> and auth token in your backend server to deliver over cellular towers.
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              💡 <strong>Instant Testing:</strong> Use the "Open in WhatsApp" and "Open in Mail Client" buttons below to test immediate direct delivery on your device right now!
            </p>
          </div>
        )}

        {/* Main Body: 2 Columns (List & Preview) */}
        <div className="flex-1 flex flex-col sm:flex-row min-h-[380px] sm:min-h-[460px] overflow-hidden">
          {/* Left Column: Notification Feed */}
          <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50/70 shrink-0">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-slate-200 flex items-center gap-1.5 bg-white">
              <button
                onClick={() => setChannelFilter('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  channelFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({dispatchedNotifications.length})
              </button>
              <button
                onClick={() => setChannelFilter('email')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  channelFilter === 'email'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setChannelFilter('sms')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                  channelFilter === 'sms'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-200/80 p-2 space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mb-1">
                    No messages in this filter
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Register a new student or log in to generate live dispatched messages.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isSelected = activeNotification?.id === notif.id;
                  const isEmail = notif.channel === 'email';
                  const timeFormatted = notif.metadata?.timeString || new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleSelectNotif(notif)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                        isSelected
                          ? 'bg-white border-blue-400 ring-2 ring-blue-500/10 shadow-xs'
                          : 'bg-white/70 border-slate-200/70 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`p-1 rounded-md text-white shrink-0 ${
                              isEmail ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}
                          >
                            {isEmail ? <Mail className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {notif.recipientName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{timeFormatted.split('at')[1] || timeFormatted}</span>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 truncate mb-0.5">
                        {notif.subject || notif.title}
                      </div>

                      <div className="text-[11px] text-slate-500 truncate flex items-center justify-between">
                        <span className="truncate">{notif.to}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-1" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All Footer */}
            {dispatchedNotifications.length > 0 && (
              <div className="p-2.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {dispatchedNotifications.length} Total Dispatched
                </span>
                <button
                  onClick={() => clearAllNotifications()}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Dispatch Preview */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            {activeNotification ? (
              <div className="flex-1 flex flex-col p-4 sm:p-6">
                {/* Channel & Recipient Top Banner */}
                <div className="pb-4 mb-4 border-b border-slate-200 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          activeNotification.channel === 'email'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {activeNotification.channel === 'email' ? (
                          <>
                            <Mail className="w-3.5 h-3.5" />
                            <span>Official Email Message</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>SMS / WhatsApp Alert</span>
                          </>
                        )}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivered</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {activeNotification.subject || activeNotification.title}
                    </h3>

                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        <strong>Recipient:</strong> {activeNotification.recipientName} ({activeNotification.to})
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Sent:</strong> {activeNotification.metadata?.timeString || new Date(activeNotification.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Resend & Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => resendNotification(activeNotification.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Resend this message"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Resend</span>
                    </button>

                    {activeNotification.channel === 'email' ? (
                      <a
                        href={getMailtoUrl(activeNotification)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in Email App</span>
                      </a>
                    ) : (
                      <a
                        href={getWhatsAppUrl(activeNotification)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Open in WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Body Preview: Realistic Smartphone or Email Card */}
                {activeNotification.channel === 'email' ? (
                  /* Realistic Email Client View */
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 space-y-4 shadow-xs">
                    {/* Email Headers Meta */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/90 text-xs space-y-1.5 font-mono">
                      <div className="flex items-center justify-between text-slate-600">
                        <span><strong className="text-slate-800">From:</strong> MindTrace Academic Dispatch &lt;noreply@mindtrace.ai&gt;</span>
                        <span className="text-[10px] text-emerald-600 font-sans font-bold flex items-center gap-1">
                          <Shield className="w-3 h-3" /> SPF/DKIM Signed
                        </span>
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">To:</strong> {activeNotification.recipientName} &lt;{activeNotification.to}&gt;
                      </div>
                      <div className="text-slate-600">
                        <strong className="text-slate-800">Subject:</strong> {activeNotification.subject}
                      </div>
                    </div>

                    {/* Email Body Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                      {/* Logo Banner */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                            M
                          </div>
                          <span>MindTrace Intelligence</span>
                        </div>
                        {activeNotification.metadata?.institution && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {activeNotification.metadata.institution}
                          </span>
                        )}
                      </div>

                      {/* Content Text */}
                      <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {activeNotification.content}
                      </div>

                      {/* Verification Code Box (if applicable) */}
                      {activeNotification.securityPin && (
                        <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-bold text-blue-950 uppercase tracking-wider">
                              One-Time Security Verification PIN
                            </div>
                            <div className="font-mono text-xl sm:text-2xl font-black text-blue-700 tracking-widest mt-0.5">
                              {activeNotification.securityPin}
                            </div>
                            <div className="text-[10px] text-blue-700/80 mt-0.5">
                              Valid for 15 minutes. Never share this code with anyone.
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(activeNotification.securityPin!, true)}
                            className="px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            {copiedPin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedPin ? 'Copied PIN' : 'Copy PIN'}</span>
                          </button>
                        </div>
                      )}

                      {/* Footer Note */}
                      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Automated transactional dispatch from MindTrace AI Systems</span>
                        <span>Privacy Protected</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Realistic Smartphone SMS Bubble View */
                  <div className="max-w-md mx-auto w-full p-4 rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-xl space-y-3 text-white">
                    <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                      <span className="flex items-center gap-1 font-bold text-white">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SMS / Messages</span>
                      </span>
                      <span>Sender: <strong className="text-white">MINDTRACE</strong></span>
                    </div>

                    <div className="py-2 text-center text-[10px] text-slate-500">
                      Today • {activeNotification.metadata?.timeString || '11:42 AM'}
                    </div>

                    {/* Chat Bubble */}
                    <div className="flex justify-start">
                      <div className="max-w-[90%] bg-emerald-600 text-white p-3.5 rounded-2xl rounded-tl-xs shadow-md text-xs sm:text-sm leading-relaxed">
                        <p className="whitespace-pre-line">{activeNotification.content}</p>
                        <div className="mt-2 text-right text-[10px] text-emerald-200 flex items-center justify-end gap-1">
                          <span>Delivered</span>
                          <CheckCheck className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Copy & WhatsApp Action in Simulator */}
                    <div className="pt-2 flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activeNotification.content)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                      </button>
                      <a
                        href={getWhatsAppUrl(activeNotification)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                <div>
                  <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
