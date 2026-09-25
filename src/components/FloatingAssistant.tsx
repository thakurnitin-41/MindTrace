import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  X,
  ChevronDown,
  RotateCcw,
  MessageSquare,
  ArrowRight,
  Search,
  School,
  Phone,
  Lock,
  Flame,
  UserPlus,
  ShieldCheck,
  Building2,
  Trash2
} from 'lucide-react';
import {
  MINDTRACE_FAQS,
  FAQ_CATEGORIES,
  POPULAR_QUESTIONS,
  FaqItem
} from '../data/faqData';
import { useApp } from '../context/AppContext';

interface FloatingAssistantProps {
  onOpenAuth?: (mode?: 'register' | 'login') => void;
  onSwitchMode?: (mode: 'register' | 'login') => void;
  isInsideModal?: boolean;
  onFocusField?: (fieldName: string) => void;
}

interface ChatEntry {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
  suggestedAction?: {
    label: string;
    onClick: () => void;
  };
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  onOpenAuth,
  onSwitchMode,
  isInsideModal = false,
  onFocusField
}) => {
  const { setCurrentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faqs'>('chat');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchFaq, setSearchFaq] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-reg-1');

  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your MindTrace AI Onboarding & FAQ Assistant. Ask me anything about registration, country codes (+91), searching your college (IITs, DY Patil, SRM), day 2 dynamic streaks, login, or platform diagnostics!',
      time: 'Just now',
      suggestedAction: onOpenAuth
        ? {
            label: 'Open Registration Form',
            onClick: () => onOpenAuth('register')
          }
        : undefined
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab, isTyping]);

  const handleActionExecution = (actionType?: string) => {
    if (!actionType) return;
    if (actionType === 'switchToLogin') {
      if (onSwitchMode) onSwitchMode('login');
      else if (onOpenAuth) onOpenAuth('login');
    } else if (actionType === 'switchToRegister') {
      if (onSwitchMode) onSwitchMode('register');
      else if (onOpenAuth) onOpenAuth('register');
    } else if (actionType === 'focusPhone') {
      if (onFocusField) onFocusField('phone');
    } else if (actionType === 'focusInstitution') {
      if (onFocusField) onFocusField('institution');
    } else if (actionType === 'viewDashboard') {
      setCurrentPage('dashboard');
    } else if (actionType === 'viewAutopsy') {
      setCurrentPage('autopsy');
    }
  };

  // Comprehensive AI FAQ Answer Matcher
  const generateAssistantAnswer = (userQuery: string): { reply: string; action?: { label: string; onClick: () => void } } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Phone / +91 / Country Codes
    if (q.includes('phone') || q.includes('mobile') || q.includes('+91') || q.includes('country code') || q.includes('india') || q.includes('number') || q.includes('flag')) {
      return {
        reply: 'Mobile numbers include smart international country code detection. By default, +91 (India) validates standard 10-digit mobile numbers. You can also click the country flag to select from 40+ countries (e.g., +1 US/Canada, +44 UK, +971 UAE, +65 Singapore) with auto-formatted inputs.',
        action: {
          label: 'Check Phone Number Field',
          onClick: () => handleActionExecution('focusPhone')
        }
      };
    }

    // 2. College / IIT / DY Patil / SRM / Lucknow / Noida search
    if (q.includes('college') || q.includes('university') || q.includes('iit') || q.includes('dy patil') || q.includes('srm') || q.includes('lucknow') || q.includes('noida') || q.includes('institution') || q.includes('gps')) {
      return {
        reply: 'The institution search supports a global GPS directory! For example:\n• Type "IIT" to see all 23 IITs (Delhi, Mumbai, Ropar, Kanpur, Kharagpur, etc.)\n• Type "DY Patil" for Mumbai & Pune campuses\n• Type "SRM" for Chennai, AP & NCR campuses\n• Type "Lucknow" or "Noida" for local institutes.\nYou can also click "+ Add Custom Institution" to enter any institution worldwide.',
        action: {
          label: 'Search Institutions',
          onClick: () => handleActionExecution('focusInstitution')
        }
      };
    }

    // 3. Dynamic Streak / Day 2
    if (q.includes('streak') || q.includes('day 2') || q.includes('second day') || q.includes('2 day') || q.includes('check in') || q.includes('flame') || q.includes('milestone')) {
      return {
        reply: 'MindTrace features dynamic calendar tracking! If this is your second day, your profile automatically synchronizes to "Day 2 Active 🔥". You can also use the interactive 7-day visual roadmap and the "+1 Check In" button on the Dashboard to record practice and earn milestone badges like Momentum Builder.',
        action: {
          label: 'Go to Dashboard',
          onClick: () => handleActionExecution('viewDashboard')
        }
      };
    }

    // 4. Registration
    if (q.includes('register') || q.includes('signup') || q.includes('sign up') || q.includes('create account') || q.includes('join') || q.includes('new user')) {
      return {
        reply: 'To create a new account, enter your Full Name, Email, Mobile Number with Country Code (+91), College/University, Degree, Target Exam, and a 6+ character password. You can also upload a photo or snap a webcam photo instantly!',
        action: {
          label: 'Go to Registration Form',
          onClick: () => handleActionExecution('switchToRegister')
        }
      };
    }

    // 5. Login & Account Switch
    if (q.includes('login') || q.includes('log in') || q.includes('sign in') || q.includes('signin') || q.includes('existing') || q.includes('password')) {
      return {
        reply: 'Existing students can sign in using their registered Email and Password. Quick-select cards allow instant one-tap profile selection. If you forget your password, you can check the prefill or reset hint.',
        action: {
          label: 'Switch to Sign In',
          onClick: () => handleActionExecution('switchToLogin')
        }
      };
    }

    // 6. Delete Account
    if (q.includes('delete') || q.includes('remove') || q.includes('trash') || q.includes('erase')) {
      return {
        reply: 'You can remove your account profile directly on the Sign In page by clicking the red Delete/Trash button on your saved card or using the Delete Account option. Confirmation is required to prevent accidental removal.',
        action: {
          label: 'Manage Accounts in Sign In',
          onClick: () => handleActionExecution('switchToLogin')
        }
      };
    }

    // 7. Root Gap & Diagnostic
    if (q.includes('root') || q.includes('gap behind') || q.includes('bottleneck') || q.includes('autopsy') || q.includes('diagnostic') || q.includes('twin')) {
      return {
        reply: 'The "Gap Behind the Gap" concept recognizes that mistakes in advanced topics like Binary Search Trees often originate from unreinforced prerequisite foundations (such as Recursion or Stack Memory). The Diagnostic Assessment and Learning Autopsy isolate these exact cognitive bottlenecks.',
        action: {
          label: 'View Learning Autopsy',
          onClick: () => handleActionExecution('viewAutopsy')
        }
      };
    }

    // 8. Rescue Mode Sprint
    if (q.includes('rescue') || q.includes('sprint') || q.includes('exam') || q.includes('15 min') || q.includes('30 min')) {
      return {
        reply: 'Rescue Mode is a rapid revision sprint (15, 30, or 60 minutes) engineered for last-minute exam or interview preparation, focusing exclusively on high-impact concepts and error traps.',
        action: {
          label: 'Open Rescue Mode',
          onClick: () => setCurrentPage('rescue')
        }
      };
    }

    // 9. Match against FAQ Database
    const matchedFaq = MINDTRACE_FAQS.find((f) =>
      f.keywords.some((k) => q.includes(k.toLowerCase())) ||
      f.question.toLowerCase().includes(q)
    );

    if (matchedFaq) {
      return {
        reply: matchedFaq.answer,
        action: matchedFaq.suggestedAction
          ? {
              label: matchedFaq.suggestedAction.label,
              onClick: () => handleActionExecution(matchedFaq.suggestedAction?.actionType)
            }
          : undefined
      };
    }

    // Default intelligent assistance fallback
    return {
      reply: `Thank you for your question about "${userQuery}". You can register, explore college suggestions (e.g. all 23 IITs, DY Patil, SRM), test phone country codes (+91), or check the Knowledge Base tab for full FAQs!`
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatEntry = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const { reply, action } = generateAssistantAnswer(text);
      const assistantMsg: ChatEntry = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 350);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history reset. How can I assist you with MindTrace registration, phone codes (+91), college search, or dynamic streaks?',
        time: 'Just now'
      }
    ]);
  };

  const filteredFaqs = MINDTRACE_FAQS.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      !searchFaq.trim() ||
      f.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchFaq.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={`fixed z-50 ${isInsideModal ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 hover:from-blue-700 hover:to-indigo-900 text-white rounded-full shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/20 cursor-pointer"
          aria-label="Open AI FAQ Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold tracking-wide flex items-center gap-1.5">
              <span>AI FAQ Assistant</span>
              <span className="bg-blue-400/30 text-[10px] px-1.5 py-0.2 rounded text-blue-200 uppercase font-semibold">
                Instant
              </span>
            </div>
            <div className="text-[10px] text-blue-200">
              Need help? Ask about +91, IITs, Streaks
            </div>
          </div>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-xs">
                <Bot className="w-5 h-5 text-blue-200" />
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <span>MindTrace AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-blue-200">
                  Onboarding Support • FAQs • Live Q&A
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI Chatbot</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faqs')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'faqs'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Knowledge Base & FAQs</span>
            </button>
          </div>

          {/* Tab 1: AI Chatbot Panel */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>

                      {m.suggestedAction && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center">
                          <button
                            type="button"
                            onClick={m.suggestedAction.onClick}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1 border border-blue-200 cursor-pointer"
                          >
                            <span>{m.suggestedAction.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    <span>MindTrace AI is drafting an answer...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar shrink-0">
                <span className="text-slate-400 shrink-0 font-medium">Quick:</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How does +91 mobile verification work?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span>+91 Mobile Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How do I search for my college or IIT?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <School className="w-3 h-3 text-indigo-600" />
                  <span>College / IIT Search</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How does the Day 2 streak work?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Day 2 Streak</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How do I register a new account?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3 text-emerald-600" />
                  <span>Register</span>
                </button>
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Ask any question about registration, login, +91, IITs..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-2xs cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Frequently Asked Questions & Knowledge Base */}
          {activeTab === 'faqs' && (
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              {/* Search & Categories */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search all FAQs & questions..."
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {FAQ_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCategory(c)}
                      className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                        selectedCategory === c
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ Accordion List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No FAQs matched your query. Ask the AI assistant directly in the Chat tab!
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full p-3 text-left bg-slate-50/60 hover:bg-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-900 transition-colors cursor-pointer"
                        >
                          <span className="pr-2">{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="p-3 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-200/70 space-y-2">
                            <p className="whitespace-pre-line">{faq.answer}</p>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] text-blue-600 font-medium">
                                {faq.category}
                              </span>
                              <div className="flex items-center gap-2">
                                {faq.suggestedAction && (
                                  <button
                                    type="button"
                                    onClick={() => handleActionExecution(faq.suggestedAction?.actionType)}
                                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 cursor-pointer"
                                  >
                                    {faq.suggestedAction.label}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('chat');
                                    handleSendMessage(`Explain more about: ${faq.question}`);
                                  }}
                                  className="text-[10px] font-semibold text-slate-600 hover:text-blue-600 underline cursor-pointer"
                                >
                                  Ask AI
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
