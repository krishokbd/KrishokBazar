import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { 
  MessageSquare, Sparkles, X, Send, Bot, HelpCircle, 
  Apple, DollarSign, Calendar, ChefHat, Type, ChevronLeft, ArrowRight,
  Mic, MicOff
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const RiktazAI: React.FC = () => {
  const { currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggest_title' | 'write_description' | 'suggest_price' | 'grocery_estimation' | 'healthy_suggestions'>('chat');
  const [suggestionTab, setSuggestionTab] = useState<'buyer' | 'farmer'>('buyer');
  
  // Custom chat states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি **রিকতাজ এআই (Riktaz AI)**। কৃষক বাজারে আপনাকে স্বাগতম। \n\nআমি আপনাকে পণ্যের আকর্ষণীয় টাইটেল ও বিবরণ লিখতে, বাজারের সঠিক মূল্য নির্ধারণ করতে, সাপ্তাহিক বাজারের বাজেট হিসাব করতে এবং পুষ্টিকর ও অর্গানিক সুস্বাদু খাবারের রেসিপি দিতে সাহায্য করব। কোন বিষয়ে সাহায্য করতে পারি বলুন?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Speech recognition states & referencing
  const [isListening, setIsListening] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [recordingField, setRecordingField] = useState<'chat' | 'prodTitle' | 'prodContext' | 'dietNote' | null>(null);

  // Active focused field mapping state
  const [focusedField, setFocusedField] = useState<'chat' | 'prodTitle' | 'prodContext' | 'dietNote'>('chat');
  const focusedFieldRef = useRef<'chat' | 'prodTitle' | 'prodContext' | 'dietNote'>('chat');

  // Global voice-to-text mode toggling state
  const [globalVoiceActive, setGlobalVoiceActive] = useState(false);
  const globalVoiceActiveRef = useRef(false);

  const recognitionRef = useRef<any>(null);
  const chatInputRef = useRef('');
  const handsFreeRef = useRef(false);
  const recordingFieldRef = useRef<'chat' | 'prodTitle' | 'prodContext' | 'dietNote'>('chat');

  // Sync state values with refs for asynchronous Speech Recognition callbacks
  useEffect(() => {
    chatInputRef.current = chatInput;
  }, [chatInput]);

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  useEffect(() => {
    recordingFieldRef.current = recordingField || 'chat';
  }, [recordingField]);

  useEffect(() => {
    focusedFieldRef.current = focusedField;
    // In global voice mode, keep recordingField synced with the focusedField
    if (globalVoiceActive) {
      setRecordingField(focusedField);
    }
  }, [focusedField, globalVoiceActive]);

  useEffect(() => {
    globalVoiceActiveRef.current = globalVoiceActive;
  }, [globalVoiceActive]);

  // Handle Speech Recognition initiation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; // continuous is false to trigger auto-send cleanly on pauses
      rec.interimResults = true;
      rec.lang = 'bn-BD'; // Bangla (Bangladesh) language pack

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          // If globalVoiceActive is true, map dynamically to the currently active focused field
          const currentTarget = globalVoiceActiveRef.current 
            ? focusedFieldRef.current 
            : recordingFieldRef.current;

          if (currentTarget === 'chat') {
            setChatInput(text);
          } else if (currentTarget === 'prodTitle') {
            setProdTitleWord(text);
          } else if (currentTarget === 'prodContext') {
            setProdContext(text);
          } else if (currentTarget === 'dietNote') {
            setDietNote(text);
          }
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('মাইক্রোফোন ব্যবহারের অনুমতি নেই।');
        } else if (event.error === 'no-speech') {
          // Silent or brief hint
        } else {
          setSpeechError(`ত্রুটি: ${event.error}`);
        }
        setIsListening(false);
        // If in global voice mode, don't clear the recording field on momentary pause
        if (!globalVoiceActiveRef.current) {
          setRecordingField(null);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        const lastField = globalVoiceActiveRef.current 
          ? focusedFieldRef.current 
          : recordingFieldRef.current;

        // Auto-send exclusively triggers on chat inputs when handsFree is toggled
        if (lastField === 'chat' && handsFreeRef.current) {
          const finalRecordedText = chatInputRef.current;
          if (finalRecordedText.trim()) {
            handleSendCustomMessage(finalRecordedText);
          }
        }

        // If global voice mode is active, restart listening for the currently focused field!
        if (globalVoiceActiveRef.current) {
          setRecordingField(focusedFieldRef.current);
          try {
            // Short timeout to avoid calling start while a stop operation is still winding down in the browser engine
            setTimeout(() => {
              if (globalVoiceActiveRef.current && rec) {
                rec.start();
              }
            }, 150);
          } catch (e) {
            console.error('Failed to restart speech recognition:', e);
          }
        } else {
          setRecordingField(null);
        }
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = (field: 'chat' | 'prodTitle' | 'prodContext' | 'dietNote') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। ক্রোম বা সাফারি ব্যবহার করুন।');
      return;
    }

    // Turn off global mode if we manually trigger a specific field listening toggle
    if (globalVoiceActive) {
      setGlobalVoiceActive(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setRecordingField(null);
    } else {
      setSpeechError(null);
      setRecordingField(field);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const toggleGlobalVoiceActive = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। ক্রোম বা সাফারি ব্যবহার করুন।');
      return;
    }

    if (globalVoiceActive) {
      setGlobalVoiceActive(false);
      setRecordingField(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setSpeechError(null);
      try {
        // Explicitly check/request microphone permissions using modern navigator API
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream right away to release the hardware, since SpeechRecognition will request its own session
        stream.getTracks().forEach(track => track.stop());

        setGlobalVoiceActive(true);
        setRecordingField(focusedFieldRef.current);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err: any) {
        console.error('Microphone permission or start failure:', err);
        setSpeechError('মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজার পারমিশন দিন।');
        setGlobalVoiceActive(false);
      }
    }
  };

  // Workflow states
  const [prodTitleWord, setProdTitleWord] = useState('');
  const [prodContext, setProdContext] = useState('');
  const [familyCount, setFamilyCount] = useState('4');
  const [dietNote, setDietNote] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendCustomMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    if (!customText) {
      setChatInput('');
    }

    // Append User Message
    const userMsgId = `msg-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await fetch('/api/riktaz-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'chat',
          prompt: textToSend
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "দুঃখিত, এআই সার্ভার কোনো উত্তর তৈরি করতে পারেনি। দয়া করে আবার চেষ্টা করুন।",
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ নেটওয়ার্ক বা সাময়িক সার্ভার সমস্যার কারণে উত্তর তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunWorkflow = async (type: 'suggest_title' | 'write_description' | 'suggest_price' | 'grocery_estimation' | 'healthy_suggestions') => {
    setIsLoading(true);
    let promptSubject = '';
    let promptContext = '';

    if (type === 'suggest_title' || type === 'write_description' || type === 'suggest_price') {
      promptSubject = prodTitleWord || 'টমেটো';
      promptContext = prodContext;
    } else if (type === 'grocery_estimation') {
      promptSubject = familyCount;
      promptContext = dietNote;
    } else if (type === 'healthy_suggestions') {
      promptSubject = prodTitleWord || 'মধু ও রসুন';
    }

    // Move view back to chat to show generation
    setActiveTab('chat');

    // Append descriptive user starting request
    let displayUserRequest = '';
    if (type === 'suggest_title') {
      displayUserRequest = `💡 '${promptSubject}' আইটেমের জন্য ৫টি আকর্ষণীয় ও বিক্রি বাড়ানোর টাইটেল আইডিয়া দিন। ${promptContext ? `[অতিরিক্ত তথ্য: ${promptContext}]` : ''}`;
    } else if (type === 'write_description') {
      displayUserRequest = `📝 '${promptSubject}' আইটেমের জন্য একটি নিরাপদ-খাদ্য ও গল্প নির্ভর চমৎকার পণ্যের বিবরণ লিখে দিন। ${promptContext ? `[উৎপাদন তথ্য: ${promptContext}]` : ''}`;
    } else if (type === 'suggest_price') {
      displayUserRequest = `৳ '${promptSubject}' পণ্যের জন্য বাজারে সঠিক মূল্য নির্ধারণ ও বিক্রির টেকনিক্যাল পরামর্শ দিন। ${promptContext ? `[চাষ ধরন: ${promptContext}]` : ''}`;
    } else if (type === 'grocery_estimation') {
      displayUserRequest = `🛒 ${promptSubject} জনের মধ্যবিত্ত ফ্যামিলির জন্য সাপ্তাহিক খাঁটি ও অর্গানিক বাজারের বাজেট ও হিসাব দিন। ${promptContext ? `[বিশেষ নোট: ${promptContext}]` : ''}`;
    } else if (type === 'healthy_suggestions') {
      displayUserRequest = `🥗 '${promptSubject}' উপাদানটি ব্যবহার করে রোগ প্রতিরোধ ক্ষমতা বাড়ানো স্বাস্থ্যকর খাবার বা রেসিপি দিন।`;
    }

    setMessages(prev => [...prev, {
      id: `workflow-user-${Date.now()}`,
      sender: 'user',
      text: displayUserRequest,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/riktaz-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          prompt: promptSubject,
          context: promptContext
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `workflow-assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "কোনো উত্তর পাওয়া যায়নি।",
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `workflow-err-${Date.now()}`,
        sender: 'assistant',
        text: '⚠️ দুঃখিত, রিকতাজ এআই সার্ভার সংযোগ করতে পারেনি। আপনার এপিআই কী বা সার্ভার কনফিগারেশন চেক করুন।',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      // Clean up fields
      setProdTitleWord('');
      setProdContext('');
      setDietNote('');
    }
  };

  // Convert double-asterisk Markdown bold into React HTML
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, blockIdx) => {
      // Direct translation for bold syntax (**word**)
      let replaced = line;
      let segments: React.ReactNode[] = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          segments.push(line.substring(lastIndex, match.index));
        }
        segments.push(<strong key={match.index} className="font-extrabold text-emerald-950">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        segments.push(line.substring(lastIndex));
      }

      return (
        <p key={blockIdx} className="mb-2 text-xs sm:text-sm leading-relaxed last:mb-0">
          {segments.length > 0 ? segments : line}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-24 right-5 sm:right-6 z-40 select-none">
      
      {/* 1. FLOATING CHAT TRIGGER MODULE */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-white border border-emerald-50 relative animate-pulse"
          style={{ boxShadow: '0 10px 25px -4px rgba(16, 185, 129, 0.4)' }}
          title="রিকতাজ AI সহকারী (Riktaz AI)"
        >
          {/* Active indicator dot */}
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
          <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
        </button>
      )}

      {/* 2. CHAT POPUP LAYOUT BOX */}
      {isOpen && (
        <div 
          className="w-full max-w-[340px] sm:w-[420px] sm:max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[80vh] min-h-[480px]"
          style={{ boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.25)' }}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-650 px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-white/10 p-1.5 border border-white/15">
                <Bot className="h-5 w-5 text-emerald-150 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-wide font-sans flex items-center gap-1">
                  Riktaz AI
                  <span className="text-[9px] bg-emerald-700/60 text-emerald-50 font-semibold px-1 rounded">সহকারী</span>
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-[10px] text-emerald-100/90 font-medium">সম্পূর্ণ সচল • নিরাপদ এগ্রি-হেল্পার</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleGlobalVoiceActive}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase transition-all shadow-sm cursor-pointer border ${
                  globalVoiceActive
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                    : 'bg-emerald-750 border-emerald-500/50 text-emerald-100 hover:text-white'
                }`}
                title="গ্লোবাল ভয়েস-টু-টেক্সট অন/অফ করুন"
              >
                {globalVoiceActive ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                    <span>ভয়েস অন</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-3 w-3 animate-pulse" />
                    <span>ভয়েস অফ</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-black/10 p-1 text-white/95 hover:bg-black/20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Selection Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 text-[10px] sm:text-xs overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2.5 font-extrabold border-b-2 transition-all cursor-pointer ${
                activeTab === 'chat' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              💬 চ্যাট
            </button>
            <button
              onClick={() => setActiveTab('suggest_title')}
              className={`px-3 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'suggest_title' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              💡 টাইটেল
            </button>
            <button
              onClick={() => setActiveTab('write_description')}
              className={`px-3 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'write_description' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              📝 বিবরণ
            </button>
            <button
              onClick={() => setActiveTab('suggest_price')}
              className={`px-3 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'suggest_price' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              ৳ মূল্য নির্ধারণ
            </button>
            <button
              onClick={() => setActiveTab('grocery_estimation')}
              className={`px-3 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'grocery_estimation' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              🛒 সাপ্তাহিক বাজার
            </button>
            <button
              onClick={() => setActiveTab('healthy_suggestions')}
              className={`px-3 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'healthy_suggestions' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              🥗 রেসিপি ও পুষ্টি
            </button>
          </div>

          {/* VIEWPORT CONTROLLER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 min-h-0">
            
            {/* TAB 1: INTERACTIVE CHAT PORTAL */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex gap-2.5 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {m.sender === 'assistant' && (
                      <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0 mt-0.5 text-xs">
                        R
                      </div>
                    )}
                    <div 
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-sm ${
                        m.sender === 'user' 
                          ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-tr-none' 
                          : 'bg-white border border-emerald-50 text-gray-700 rounded-tl-none'
                      }`}
                    >
                      {renderMessageText(m.text)}
                      <p className={`text-[8px] mt-1.5 text-right font-mono ${m.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0 mt-0.5 text-xs animate-bounce">
                      R
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-white border border-emerald-50 text-gray-500 rounded-tl-none shadow-sm text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      <span className="font-medium text-[10px]">রিকতাজ চিন্তা করছে...</span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>
            )}

            {/* TAB 2: SUGGEST_TITLE FORM */}
            {activeTab === 'suggest_title' && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Type className="h-5 w-5 shrink-0 animate-pulse" />
                    <h5 className="text-xs font-black">কৃষক পণ্য টাইটেল মেকার</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    চ্যাটে ফিরে যান
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">কোনো কাঁচা সবজি বা ফলের নাম দিন, রিকতাজ গ্রাহক আকর্ষণ করার মতো ৫টি চমৎকার টাইটেল বানিয়ে দেবে।</p>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">ধাপ ১: সবজি/ফল/পণ্যের মূল নাম দিন</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: আম, আলু, বাগদা চিংড়ি"
                      value={prodTitleWord}
                      onChange={(e) => setProdTitleWord(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodTitle');
                        if (globalVoiceActive) {
                          setRecordingField('prodTitle');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodTitle')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodTitle'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodTitle' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">ধাপ ২: খামারের অবস্থান বা গুণগত তথ্য (ঐচ্ছিক)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: রাজশাহী বাঘা খামার, রাসায়নিক মুক্ত"
                      value={prodContext}
                      onChange={(e) => setProdContext(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodContext');
                        if (globalVoiceActive) {
                          setRecordingField('prodContext');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodContext')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodContext'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodContext' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunWorkflow('suggest_title')}
                  className="w-full rounded-xl bg-emerald-650 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  টাইটেল আইডিয়া তৈরি করুন
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* TAB 3: WRITE DESCRIPTION */}
            {activeTab === 'write_description' && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <ChefHat className="h-5 w-5 shrink-0 animate-pulse" />
                    <h5 className="text-xs font-black">অর্গানিক স্টোরি বিবরণ লেখক</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    চ্যাটে ফিরে যান
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">আপনার ক্ষেতের অর্গানিক পণ্যটির বিবরণ লিখুন, রিকতাজ ভেজালমুক্ত নিরাপদ স্বাস্থ্যের গল্প সাজিয়ে ১০১টি শব্দে কাস্টমারকে আকর্ষণ করবে।</p>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">পণ্যটির নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: সুন্দরবনের খলিসা মধু, পদ্মার ইলিশ"
                      value={prodTitleWord}
                      onChange={(e) => setProdTitleWord(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodTitle');
                        if (globalVoiceActive) {
                          setRecordingField('prodTitle');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodTitle')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodTitle'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodTitle' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">উৎপাদন এলাকা/চাষ পদ্ধতি (ঐচ্ছিক)</label>
                  <div className="relative">
                    <textarea
                      placeholder="যেমন: কাঠের চাকে জমানো মৌয়ালদের সংগৃহীত"
                      value={prodContext}
                      onChange={(e) => setProdContext(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodContext');
                        if (globalVoiceActive) {
                          setRecordingField('prodContext');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 p-2.5 text-xs outline-none focus:border-emerald-500 h-16 resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodContext')}
                      className={`absolute left-3 top-4 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodContext'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodContext' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunWorkflow('write_description')}
                  className="w-full rounded-xl bg-emerald-650 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  বিবরণ সাজিয়ে লিখুন
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* TAB 4: SUGGEST PRICE */}
            {activeTab === 'suggest_price' && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <DollarSign className="h-5 w-5 shrink-0 animate-pulse" />
                    <h5 className="text-xs font-black">কৃষি বাজার সঠিক মূল্য পরামর্শক</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    চ্যাটে ফিরে যান
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">আপনার ফসল বা মাছের সঠিক খুচরা বাজার মূল্য কত হওয়া উচিত? রিকতাজ থেকে সঠিক মূল্য পরামর্শন নিন।</p>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">পণ্যের ক্যাটাগরি ও নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: দেশী কচি লাউ, তাজা শোল মাছ"
                      value={prodTitleWord}
                      onChange={(e) => setProdTitleWord(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodTitle');
                        if (globalVoiceActive) {
                          setRecordingField('prodTitle');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodTitle')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodTitle'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodTitle' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">উৎপাদন খরচ বা চাষ কোয়ালিটি (ঐচ্ছিক)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: শুধুমাত্র জৈব সার ব্যবহার করেছি"
                      value={prodContext}
                      onChange={(e) => setProdContext(e.target.value)}
                      onFocus={() => {
                        setFocusedField('prodContext');
                        if (globalVoiceActive) {
                          setRecordingField('prodContext');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('prodContext')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'prodContext'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'prodContext' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunWorkflow('suggest_price')}
                  className="w-full rounded-xl bg-emerald-650 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  বাজার মূল্য যাচাই করুন
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* TAB 5: GROCERY_ESTIMATION */}
            {activeTab === 'grocery_estimation' && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Calendar className="h-5 w-5 shrink-0 animate-pulse" />
                    <h5 className="text-xs font-black">সাপ্তাহিক পুষ্টিকর বাজার বাজেট হিসাবক</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    চ্যাটে ফিরে যান
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">আপনার পরিবারের সদস্য সংখ্যার উপর ভিত্তি করে সপ্তাহিক স্বাস্থ্যকর ও অর্গানিক বাজারের একটি সম্ভাব্য ব্যালেন্স শীট তৈরি করুন।</p>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">পরিবারের সক্রিয় সদস্য সংখ্যা</label>
                  <select
                    value={familyCount}
                    onChange={(e) => setFamilyCount(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs bg-white text-gray-700 font-bold"
                  >
                    <option value="2">২ জন (ছোট পরিবার)</option>
                    <option value="3">৩ জন (মাঝারি ছোট)</option>
                    <option value="4">৪ জন (আদর্শ মধ্যবিত্ত)</option>
                    <option value="5">৫ জন (যৌথ বড় পরিবার)</option>
                    <option value="6">৬ জন বা তার বেশি</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">কোনো বিশেষ ডায়েট বা পছন্দ (ঐচ্ছিক)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: লাল চালের ভাত, ডায়াবেটিক রোগী আছে, বেশি মাছ"
                      value={dietNote}
                      onChange={(e) => setDietNote(e.target.value)}
                      onFocus={() => {
                        setFocusedField('dietNote');
                        if (globalVoiceActive) {
                          setRecordingField('dietNote');
                        }
                      }}
                      className="w-full rounded-xl border border-gray-200 pl-10 pr-2.5 py-2.5 text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => toggleListening('dietNote')}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all cursor-pointer ${
                        isListening && recordingField === 'dietNote'
                          ? 'text-red-500 bg-red-50 animate-pulse'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                      title="কণ্ঠস্বরের মাধ্যমে ইনপুট দিন"
                    >
                      {isListening && recordingField === 'dietNote' ? (
                        <MicOff className="h-3.5 w-3.5 animate-bounce" />
                      ) : (
                        <Mic className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunWorkflow('grocery_estimation')}
                  className="w-full rounded-xl bg-emerald-650 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  সাপ্তাহিক বাজার বের করুন
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* TAB 6: HEALTHY SUGGESTIONS */}
            {activeTab === 'healthy_suggestions' && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-50 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <Apple className="h-5 w-5 shrink-0 animate-pulse" />
                    <h5 className="text-xs font-black">নিরাপদ ডায়েট ও অর্গানিক রেসিপি</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    চ্যাটে ফিরে যান
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal font-medium">যেকোনো ভেষজ উপাদান বা খড়খড়ে উপাদানের নাম লিখুন, রিকতাজ তার রোগ প্রতিরোধ ক্ষমতা বাড়াবার গুণাবলী ও ঘরোয়া রেসিপি দেবে।</p>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">উপাদানের নাম দিন</label>
                  <input
                    type="text"
                    placeholder="যেমন: সজনে পাতা, কালোজিরা মধু, টক দই"
                    value={prodTitleWord}
                    onChange={(e) => setProdTitleWord(e.target.value)}
                    onFocus={() => {
                      setFocusedField('prodTitle');
                      if (globalVoiceActive) {
                        setRecordingField('prodTitle');
                      }
                    }}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRunWorkflow('healthy_suggestions')}
                  className="w-full rounded-xl bg-emerald-650 hover:bg-emerald-700 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  পুষ্টি তথ্য ও রেসিপি দেখুন
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* CHAT INPUT AREA FOOTER */}
          <div className="p-4 bg-white border-t border-gray-150 space-y-2">

            {/* SUGGESTED QUESTIONS MODULE */}
            {activeTab === 'chat' && (
              <div className="border-b border-gray-100 pb-3 mb-2 space-y-2 font-sans">
                {/* Switch Tabs */}
                <div className="flex items-center justify-between gap-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">🤔 একটু সাহায্য লাগবে? (Suggestions):</span>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSuggestionTab('buyer')}
                      className={`px-2 py-1 rounded-md text-[9px] font-black transition-all cursor-pointer flex items-center gap-1 leading-none ${
                        suggestionTab === 'buyer'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      আমি ক্রেতা 🛒
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuggestionTab('farmer')}
                      className={`px-2 py-1 rounded-md text-[9px] font-black transition-all cursor-pointer flex items-center gap-1 leading-none ${
                        suggestionTab === 'farmer'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      আমি কৃষক 🚜
                    </button>
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="grid grid-cols-2 gap-1.5 max-h-[85px] overflow-y-auto pr-0.5 custom-scrollbar">
                  {suggestionTab === 'buyer' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("আজকের কম্বো বাস্কেটে কী আছে?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        আজকের কম্বো বাস্কেটে কী আছে?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("আমার অর্ডার ট্র্যাক করব কীভাবে?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        আমার অর্ডার ট্র্যাক করব কীভাবে?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("বিকাশ/নগদে পেমেন্ট কীভাবে করব?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        বিকাশ/নগদে পেমেন্ট কীভাবে করব?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("সাপ্তাহিক সবজি সাবস্ক্রিপশন কী?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        সাপ্তাহিক সবজি সাবস্ক্রিপশন কী?
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("আমার ফসলের সঠিক দাম কীভাবে পাব?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        আমার ফসলের সঠিক দাম কীভাবে পাব?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("এই সপ্তাহে কোন সবজির চাহিদা বেশি?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        এই সপ্তাহে কোন সবজির চাহিদা বেশি?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("কৃষক ড্যাশবোর্ডে পণ্য আপলোড কীভাবে করব?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        কৃষক ড্যাশবোর্ডে পণ্য আপলোড কীভাবে করব?
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendCustomMessage("কৃষক বাজার আমার পণ্য কীভাবে সংগ্রহ করবে?")}
                        className="text-left px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100/60 rounded-xl transition-all font-bold hover:scale-[1.01] active:scale-[0.98] cursor-pointer text-[10px] sm:text-[11px] leading-snug tracking-tight"
                      >
                        কৃষক বাজার আমার পণ্য কীভাবে সংগ্রহ করবে?
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Real-time microphone listening visual or error indicator */}
            {(isListening || speechError || handsFree) && (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/75 rounded-2xl text-[10px] sm:text-xs text-emerald-950 border border-emerald-100/50">
                <div className="flex items-center gap-2 font-medium">
                  {isListening ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      <span className="text-emerald-800 font-semibold animate-pulse">আমি আপনার কথা শুনছি... বাংলায় বলুন...</span>
                    </>
                  ) : speechError ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">⚠️ {speechError}</span>
                  ) : (
                    <span className="text-emerald-700/80">ভয়েস ডিকটেশন সচল</span>
                  )}
                </div>
                
                {/* Autocomplete Hands-free direct send toggle */}
                <button
                  type="button"
                  onClick={() => setHandsFree(!handsFree)}
                  className={`px-2 py-1 rounded-xl text-[9px] font-black tracking-wider uppercase transition-all shadow-sm cursor-pointer ${
                    handsFree 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:brightness-110' 
                      : 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200/80'
                  }`}
                  title="কথা বলা শেষ হলে মেসেজটি নিজে নিজেই পাঠানো হবে"
                >
                  {handsFree ? '● হাতছাড়া অন (Auto-send)' : 'হাতছাড়া অফ'}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              {/* Main Chat Dictation Microphone Button */}
              <button
                type="button"
                onClick={() => toggleListening('chat')}
                className={`rounded-2xl p-3 shrink-0 cursor-pointer transition-all active:scale-95 border flex items-center justify-center ${
                  isListening && recordingField === 'chat'
                    ? 'bg-red-500 border-red-200 text-white animate-pulse'
                    : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                }`}
                title="ভয়েসের মাধ্যমে বাংলায় প্রশ্ন করুন"
              >
                {isListening && recordingField === 'chat' ? (
                  <MicOff className="h-4.5 w-4.5 text-white" />
                ) : (
                  <Mic className="h-4.5 w-4.5" />
                )}
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={() => {
                  setFocusedField('chat');
                  if (globalVoiceActive) {
                    setRecordingField('chat');
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCustomMessage()}
                placeholder="রিকতাজকে যেকোনো প্রশ্ন বাংলায় করুন..."
                disabled={isLoading}
                className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-xs sm:text-sm outline-none focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-400 font-medium"
              />
              
              <button
                onClick={() => handleSendCustomMessage()}
                disabled={isLoading || !chatInput.trim()}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white p-3 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer transition-all active:scale-95 text-xs font-bold flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
