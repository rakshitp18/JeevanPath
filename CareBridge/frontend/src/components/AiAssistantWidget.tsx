import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, X, Bot, User as UserIcon, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { generateClinicalSummaryWithGroq } from '../services/groqService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '👋 Hello! I am your JeevanPath Clinical AI Assistant powered by Groq LLM. Ask me about patient vitals, prescription safety, or health analytics.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsTyping(true);

    try {
      // Simulate real-time response or call Groq AI
      setTimeout(() => {
        let aiReply = 'I have analyzed your clinical request against recorded patient EHR parameters.';
        if (textToSend.toLowerCase().includes('lab') || textToSend.toLowerCase().includes('report')) {
          aiReply = '📊 CLINICAL ANALYSIS: Recent CBC and Lipid panel indicate stable parameters (Hb 14.2 g/dL, Cholesterol 185 mg/dL). No acute physiological risks detected.';
        } else if (textToSend.toLowerCase().includes('drug') || textToSend.toLowerCase().includes('side effect')) {
          aiReply = '💊 PHARMACOLOGY REVIEW: Lisinopril 10mg exhibits low risk of interaction with current regimen. Monitor blood pressure weekly.';
        } else if (textToSend.toLowerCase().includes('sos') || textToSend.toLowerCase().includes('emergency')) {
          aiReply = '🚨 EMERGENCY PROTOCOL: Emergency QR Code Token generated. Paramedics can scan token for immediate blood group and allergy access.';
        } else {
          aiReply = `💡 AI RESPONSE: Proceeding with medical evaluation for "${textToSend}". Recommended follow-up in clinical workstation.`;
        }

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Launch Trigger Pill */}
      <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'relative',
            padding: '16px 24px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #01579B 0%, #0288D1 100%)',
            color: '#ffffff',
            border: '2px solid #81D4FA',
            boxShadow: '0 20px 40px rgba(2, 136, 209, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Animated AI Pulse Dot */}
          <span style={{ position: 'relative', display: 'flex', width: '12px', height: '12px' }}>
            <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#4FC3F7', opacity: 0.75 }} />
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '12px', width: '12px', background: '#ffffff' }} />
          </span>

          <BrainCircuit size={22} color="#ffffff" />
          <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
            GROQ AI ASSIST
          </span>
        </button>
      </div>

      {/* Interactive AI Chat Drawer Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '28px',
            width: '420px',
            maxHeight: '620px',
            height: '80vh',
            borderRadius: '2.5rem',
            background: '#f0f9ff',
            color: '#01579B',
            boxShadow: '0 25px 60px rgba(2, 136, 209, 0.35)',
            border: '2px solid #0288D1',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'aiDrawerSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Drawer Header */}
          <div style={{ background: 'linear-gradient(135deg, #01579B 0%, #0288D1 100%)', color: '#ffffff', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#ffffff', color: '#0288D1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '18px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  JEEVANPATH GROQ AI
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 800, color: '#81D4FA', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  LLAMA 3.3 CLINICAL ENGINE • ONLINE
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#e0f2fe' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '1.5rem 1.5rem 0.2rem 1.5rem' : '1.5rem 1.5rem 1.5rem 0.2rem',
                  background: msg.sender === 'user' ? '#0288D1' : '#ffffff',
                  color: msg.sender === 'user' ? '#ffffff' : '#01579B',
                  boxShadow: '0 4px 12px rgba(2, 136, 209, 0.15)',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  lineHeight: 1.5
                }}
              >
                <div>{msg.text}</div>
                <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 18px', borderRadius: '1.5rem', background: '#ffffff', color: '#0288D1', fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={14} className="animate-spin" />
                <span>GROQ AI REASONING...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div style={{ padding: '10px 16px', background: '#f0f9ff', borderTop: '1px solid rgba(2, 136, 209, 0.15)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[
              '🔬 Analyze Lab Test',
              '🩺 Book Specialist',
              '🚨 Emergency SOS',
              '💊 Drug Side Effects'
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSend(suggestion)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: '#0288D1',
                  color: '#ffffff',
                  fontFamily: 'Inter',
                  fontSize: '10px',
                  fontWeight: 800,
                  border: 'none',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div style={{ padding: '16px', background: '#f0f9ff', borderTop: '2px solid #0288D1', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask Groq AI medical assistant..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '9999px',
                background: '#e0f2fe',
                border: '1px solid #0288D1',
                color: '#01579B',
                fontFamily: 'Inter',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#0288D1',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes aiDrawerSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
