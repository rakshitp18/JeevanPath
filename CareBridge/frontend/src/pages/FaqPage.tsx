import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle, Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown,
  MessageSquare, Mail, PhoneCall, ShieldCheck, Sparkles, CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function FaqPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Questions');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: number]: 'yes' | 'no' }>({});
  const [supportMessageSent, setSupportMessageSent] = useState(false);

  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      question: 'What is JeevanPath and how does it protect my health records?',
      answer: 'JeevanPath is an AI-powered digital healthcare platform that aggregates your medical history, diagnostic reports, and emergency profiles into an AES-256 encrypted vault. You control access permissions for specialist doctors and emergency paramedics.'
    },
    {
      id: 2,
      category: 'AI Diagnostics',
      question: 'How fast is the Groq AI diagnostic lab report analyzer?',
      answer: 'The Groq Llama 3.3 engine processes complex blood panels, ECG telemetry readings, and radiology notes in under 0.4 seconds, identifying critical biomarker deviations with 99.4% precision.'
    },
    {
      id: 3,
      category: 'Emergency QR',
      question: 'How does the Emergency QR Card work for first responders?',
      answer: 'First responders or ER doctors can scan your offline Emergency QR code using any smartphone camera. It displays critical medical info such as blood group, chronic allergies, active prescriptions, and emergency kin contacts without requiring an app download.'
    },
    {
      id: 4,
      category: 'Privacy & Encryption',
      question: 'Who has access to my uploaded medical documents?',
      answer: 'Only you and the healthcare providers you explicitly authorize can decrypt and view your medical records. Every view is recorded in a transparent, immutable access audit log.'
    },
    {
      id: 5,
      category: 'Doctor Consultation',
      question: 'How do I schedule a video call with a specialist doctor?',
      answer: 'Navigate to our Doctors & Experts section, select your required specialty (e.g., Cardiology or Neurology), pick an available time slot, and confirm. You can join the HD video room directly from your dashboard.'
    },
    {
      id: 6,
      category: 'Billing',
      question: 'Is JeevanPath free for patients?',
      answer: 'Yes! Core features such as health record storage, emergency QR generation, and basic AI report summaries are 100% free for patients. Specialized teleconsultations carry flat, transparent doctor fee schedules.'
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All Questions' || faq.category === selectedCategory;
    const matchesQuery = !searchQuery.trim() ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportMessageSent(true);
    setTimeout(() => setSupportMessageSent(false), 3500);
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar activeTab="FAQ" />

      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)', color: '#FFFFFF', padding: '80px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 800, color: '#34D399', marginBottom: '24px' }}>
            <HelpCircle size={16} />
            <span>24/7 HELP CENTER & FAQ DESK</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            How can we help you today?
          </h1>
          <p style={{ fontSize: '18px', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Search our knowledge base for answers regarding AI report analysis, emergency QR vaults, doctor consultations, and privacy compliance.
          </p>

          {/* Search Box */}
          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative' }}>
            <Search size={22} color="#94A3B8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Type your question (e.g., Emergency QR, AI report time, Encryption)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '18px 24px 18px 56px', borderRadius: '9999px', border: 'none', fontSize: '16px', color: '#0F172A', outline: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            />
          </div>
        </div>
      </section>

      {/* Category Pills & FAQs List */}
      <section style={{ maxWidth: '960px', margin: '60px auto 100px', padding: '0 32px' }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {['All Questions', 'Getting Started', 'AI Diagnostics', 'Emergency QR', 'Privacy & Encryption', 'Billing'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 22px', borderRadius: '9999px', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                background: selectedCategory === cat ? '#047857' : '#FFFFFF',
                color: selectedCategory === cat ? '#FFFFFF' : '#475569',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(4, 120, 87, 0.28)' : '0 2px 6px rgba(0,0,0,0.04)',
                border: selectedCategory === cat ? 'none' : '1px solid #E2E8F0',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: '#FFFFFF', borderRadius: '20px', border: isExpanded ? '2px solid #059669' : '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden', transition: 'all 0.2s'
                }}
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  style={{
                    width: '100%', padding: '24px', background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0 }}>
                      ?
                    </div>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                      {faq.question}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="#059669" /> : <ChevronDown size={20} color="#94A3B8" />}
                </button>

                {isExpanded && (
                  <div style={{ padding: '0 24px 24px 74px', animation: 'fadeIn 0.3s ease-out' }}>
                    <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>
                      {faq.answer}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                      <span>Was this helpful?</span>
                      <button
                        onClick={() => setFeedbackMap({ ...feedbackMap, [faq.id]: 'yes' })}
                        style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: feedbackMap[faq.id] === 'yes' ? '#ECFDF5' : '#FFF', cursor: 'pointer' }}
                      >
                        👍 Yes
                      </button>
                      <button
                        onClick={() => setFeedbackMap({ ...feedbackMap, [faq.id]: 'no' })}
                        style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', background: feedbackMap[faq.id] === 'no' ? '#FEF2F2' : '#FFF', cursor: 'pointer' }}
                      >
                        👎 No
                      </button>
                      {feedbackMap[faq.id] && <span style={{ color: '#059669', fontWeight: 800 }}>Thanks for your feedback!</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Need Help Box */}
        <div style={{ marginTop: '60px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', borderRadius: '28px', padding: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Still have questions?</h3>
          <p style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '24px' }}>Our support team and clinical engineers are available 24/7 to assist you.</p>

          {supportMessageSent ? (
            <div style={{ background: '#ECFDF5', color: '#047857', padding: '16px', borderRadius: '14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} />
              <span>Inquiry received! Our team will respond to your email within 15 minutes.</span>
            </div>
          ) : (
            <form onSubmit={handleSupportSubmit} style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', gap: '10px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ padding: '12px 24px', borderRadius: '12px', background: '#059669', color: '#FFF', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '60px 32px 30px', textAlign: 'center', fontSize: '13px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>© 2026 JeevanPath AI Healthcare Network. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>Services</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/global-network')}>Global Network</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/reviews')}>Reviews</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/faq')}>FAQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
