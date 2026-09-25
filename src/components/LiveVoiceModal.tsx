import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Radio,
  RotateCcw,
  Zap,
  Bot,
  User,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Flame,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { pcmToBase64, LiveAudioPlayer } from '../utils/audioLiveUtils';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

interface MessageTurn {
  id: string;
  sender: 'student' | 'gemini';
  text: string;
  timestamp: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  studentName = 'Learner'
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [statusText, setStatusText] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'interrupted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [transcripts, setTranscripts] = useState<MessageTurn[]>([]);
  const [textInput, setTextInput] = useState('');

  // Refs for audio lifecycle
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);
  const isMutedRef = useRef(isMicMuted);
  const isSpeakerMutedRef = useRef(isSpeakerMuted);

  useEffect(() => {
    isMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => {
    isSpeakerMutedRef.current = isSpeakerMuted;
  }, [isSpeakerMuted]);

  // Auto-scroll transcripts
  useEffect(() => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Stop session when closed
  useEffect(() => {
    if (!isOpen) {
      cleanupLiveSession();
    }
  }, [isOpen]);

  const cleanupLiveSession = () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.close();
        playerRef.current = null;
      }
    } catch (e) {
      console.error('Error during live session cleanup:', e);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setStatusText('idle');
    setMicVolume(0);
  };

  const startLiveConversation = async () => {
    setErrorMessage(null);
    setIsConnecting(true);
    setStatusText('connecting');

    try {
      // 1. Initialize Player
      playerRef.current = new LiveAudioPlayer();

      // 2. Request mic access (16kHz preferred)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 3. Setup AudioContext for recording
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = inputCtx;
      if (inputCtx.state === 'suspended') {
        await inputCtx.resume();
      }

      const source = inputCtx.createMediaStreamSource(stream);
      // 4096 buffer size gives a good balance of responsiveness and processing overhead
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      // 4. Connect WebSocket to backend bridge
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[LiveVoice] WebSocket opened with backend');
        setIsConnected(true);
        setIsConnecting(false);
        setStatusText('listening');
        setTranscripts((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'gemini',
            text: `Connected to Gemini Live (gemini-3.8-live). Hi ${studentName}, start speaking anytime! Ask about DSA algorithms, tree traversals, or root cause concepts.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'audio' && msg.audio) {
            if (!isSpeakerMutedRef.current) {
              setStatusText('speaking');
              playerRef.current?.playChunk(msg.audio);
            }
          }

          if (msg.type === 'text' && msg.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === 'gemini') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text }
                ];
              }
              return [
                ...prev,
                {
                  id: `gemini-${Date.now()}`,
                  sender: 'gemini',
                  text: msg.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ];
            });
          }

          if (msg.type === 'interrupted') {
            setStatusText('interrupted');
            playerRef.current?.stopAndClear();
            setTimeout(() => setStatusText('listening'), 800);
          }

          if (msg.type === 'turnComplete') {
            setStatusText('listening');
          }

          if (msg.type === 'error') {
            setErrorMessage(msg.error || 'Gemini Live encountered an error.');
            setStatusText('error');
          }
        } catch (err) {
          console.error('[LiveVoice] Error parsing WS message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('[LiveVoice] WebSocket error:', err);
        setErrorMessage('Failed to connect to the Gemini Live server stream.');
        setStatusText('error');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('[LiveVoice] WebSocket closed');
        setIsConnected(false);
        setIsConnecting(false);
        setStatusText('idle');
      };

      // 5. Stream mic audio to WebSocket
      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) {
          setMicVolume(0);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate simple volume meter
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / inputData.length);
        setMicVolume(Math.min(100, Math.round(rms * 400)));

        if (ws.readyState === WebSocket.OPEN) {
          const base64Audio = pcmToBase64(inputData);
          ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      console.error('[LiveVoice] Initialization error:', err);
      setErrorMessage(
        err?.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser.'
          : err?.message || 'Could not start voice session.'
      );
      setStatusText('error');
      setIsConnecting(false);
    }
  };

  const sendTextQuery = (textToSend?: string) => {
    const q = (textToSend || textInput).trim();
    if (!q) return;

    setTranscripts((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'student',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setTextInput('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text: q }));
    } else {
      // If not live connected, auto-connect or inform
      startLiveConversation();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-950 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Headphones className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">MindTrace Live Voice Tutor</h3>
                <span className="bg-blue-500/30 text-blue-100 text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? 'bg-emerald-400 animate-pulse'
                      : isConnecting
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-400'
                  }`}
                />
                {isConnected
                  ? statusText === 'speaking'
                    ? 'Gemini is speaking...'
                    : statusText === 'interrupted'
                    ? 'Interrupted by student'
                    : 'Listening live — speak freely'
                  : isConnecting
                  ? 'Connecting to Live API stream...'
                  : 'Ready to connect'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Audio Waveform / Live Visualizer */}
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-radial from-blue-600/20 via-transparent to-transparent pointer-events-none" />

          {/* Animated visualizer orb */}
          <div className="relative flex items-center justify-center my-3">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-blue-500/30 flex items-center justify-center transition-all duration-300 ${
                isConnected
                  ? statusText === 'speaking'
                    ? 'scale-110 shadow-lg shadow-indigo-500/50 bg-indigo-600/30'
                    : 'bg-blue-600/20 shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/40'
              }`}
            >
              {/* Pulsing ring matching mic volume or speaking */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white transition-transform duration-100"
                style={{
                  transform: isConnected
                    ? statusText === 'speaking'
                      ? 'scale(1.15)'
                      : `scale(${1 + micVolume / 250})`
                    : 'scale(1)'
                }}
              >
                {isConnected ? (
                  statusText === 'speaking' ? (
                    <Volume2 className="w-8 h-8 animate-pulse text-amber-200" />
                  ) : isMicMuted ? (
                    <MicOff className="w-8 h-8 text-rose-300" />
                  ) : (
                    <Mic className="w-8 h-8 animate-bounce" />
                  )
                ) : (
                  <Radio className="w-8 h-8 text-slate-300" />
                )}
              </div>
            </div>

            {/* Ripple rings when active */}
            {isConnected && statusText === 'speaking' && (
              <span className="absolute w-36 h-36 rounded-full border border-indigo-400/40 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Live Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 z-10">
            {!isConnected ? (
              <button
                onClick={startLiveConversation}
                disabled={isConnecting}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-xs font-bold tracking-wide shadow-lg shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Mic className="w-4 h-4" />
                <span>{isConnecting ? 'Starting Live API...' : 'Start Voice Conversation'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicMuted
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isMicMuted ? 'Muted' : 'Mic On'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSpeakerMuted(!isSpeakerMuted);
                    if (!isSpeakerMuted) {
                      playerRef.current?.stopAndClear();
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSpeakerMuted
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {isSpeakerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-blue-300" />}
                  <span>{isSpeakerMuted ? 'Speaker Off' : 'Speaker On'}</span>
                </button>

                <button
                  onClick={cleanupLiveSession}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-xs font-semibold transition-colors border border-slate-700 cursor-pointer"
                >
                  End Call
                </button>
              </>
            )}
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="mt-4 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 text-left max-w-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Conversation Transcript Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50 min-h-[160px] max-h-[260px]">
          {transcripts.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              <p>No audio messages yet. Click "Start Voice Conversation" to speak directly with Gemini Live.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[11px]">
                <button
                  onClick={() => sendTextQuery('Explain the difference between BST and Heap')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-700 transition-colors"
                >
                  Difference between BST and Heap
                </button>
                <button
                  onClick={() => sendTextQuery('Why is Recursion connected to Call Stack Memory?')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-700 transition-colors"
                >
                  Recursion & Call Stack Gap
                </button>
                <button
                  onClick={() => sendTextQuery('How does Dynamic Programming find optimal substructure?')}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-700 transition-colors"
                >
                  Dynamic Programming Memoization
                </button>
              </div>
            </div>
          ) : (
            transcripts.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs ${
                    m.sender === 'student' ? 'bg-blue-600' : 'bg-slate-900'
                  }`}
                >
                  {m.sender === 'student' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-blue-300" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    m.sender === 'student'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      m.sender === 'student' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={transcriptsEndRef} />
        </div>

        {/* Text fallback input bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={
              isConnected
                ? 'You can also type a question while connected...'
                : 'Type or start voice call above...'
            }
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendTextQuery();
              }
            }}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            onClick={() => sendTextQuery()}
            disabled={!textInput.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
