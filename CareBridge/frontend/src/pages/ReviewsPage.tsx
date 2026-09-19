import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star, Quote, ThumbsUp, CheckCircle2, MessageSquare, Plus,
  ShieldCheck, User, Stethoscope, Sparkles, X, Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Reviews');
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // Review List State with Helpful counter interactivity
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Ananya Deshmukh',
      role: 'Patient • Mumbai',
      category: 'Verified Patients',
      rating: 5,
      date: 'August 2, 2026',
      title: 'Saved critical time during my father’s cardiac emergency',
      comment: 'When my father experienced chest discomfort, the emergency QR code allowed ER doctors to view his cardiac history and blood allergy details within seconds. Incredible platform!',
      helpful: 48,
      voted: false
    },
    {
      id: 2,
      name: 'Dr. Vikram Malhotra',
      role: 'Senior Cardiologist • Fortis Hospital',
      category: 'Specialists',
      rating: 5,
      date: 'July 28, 2026',
      title: 'Groq AI report analyzer simplifies diagnostic triage',
      comment: 'The sub-second Groq Llama 3.3 telemetry scanning provides remarkably accurate summaries of complex ECG and lab panels. It helps our clinical team prioritize emergency cases faster.',
      helpful: 92,
      voted: false
    },
    {
      id: 3,
      name: 'Rajesh & Priya Verma',
      role: 'Patient Family • New Delhi',
      category: 'Emergency QR',
      rating: 5,
      date: 'July 15, 2026',
      title: 'Peace of mind for elderly parents living alone',
      comment: 'Having our parents’ medical records encrypted in JeevanPath gives us immense confidence. The emergency QR card is printed on their keychains.',
      helpful: 35,
      voted: false
    },
    {
      id: 4,
      name: 'Dr. Sarah Jenkins',
      role: 'Chief of Neurology • AIIMS Corridor',
      category: 'Specialists',
      rating: 5,
      date: 'June 30, 2026',
      title: 'Zero-knowledge encryption & HIPAA compliance',
      comment: 'Data security in healthcare is paramount. JeevanPath’s cryptographic vault gives patients full control over who accesses their confidential health history.',
      helpful: 64,
      voted: false
    }
  ]);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    name: '',
    role: 'Patient',
    rating: 5,
    title: '',
    comment: ''
  });

  const handleHelpfulClick = (id: number) => {
    setReviewsList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          helpful: item.voted ? item.helpful - 1 : item.helpful + 1,
          voted: !item.voted
        };
      }
      return item;
    }));
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.title || !newReview.comment) return;

    const created = {
      id: Date.now(),
      name: newReview.name,
      role: `${newReview.role} • Verified User`,
      category: newReview.role === 'Doctor' ? 'Specialists' : 'Verified Patients',
      rating: newReview.rating,
      date: 'Just Now',
      title: newReview.title,
      comment: newReview.comment,
      helpful: 0,
      voted: false
    };

    setReviewsList([created, ...reviewsList]);
    setShowAddReviewModal(false);
    setNewReview({ name: '', role: 'Patient', rating: 5, title: '', comment: '' });
  };

  const filteredReviews = reviewsList.filter(r =>
    selectedCategory === 'All Reviews' || r.category === selectedCategory
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar activeTab="Reviews" />

      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)', color: '#FFFFFF', padding: '80px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 800, color: '#34D399', marginBottom: '24px' }}>
            <Star size={16} fill="#34D399" />
            <span>4.9 / 5.0 RATING • OVER 12,400 VERIFIED REVIEWS</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Trusted by Patients & Healthcare Professionals
          </h1>
          <p style={{ fontSize: '18px', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Read real stories from families, ER physicians, and specialist doctors using JeevanPath to transform clinical workflows and emergency response.
          </p>

          <button
            onClick={() => setShowAddReviewModal(true)}
            style={{
              padding: '16px 36px', borderRadius: '9999px', background: '#059669', color: '#FFFFFF', fontSize: '16px', fontWeight: 800, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 28px rgba(5, 150, 105, 0.35)', transition: 'all 0.2s'
            }}
          >
            <Plus size={20} />
            <span>Write a Testimonial</span>
          </button>
        </div>
      </section>

      {/* Ratings Breakdown Grid */}
      <section style={{ maxWidth: '1280px', margin: '-40px auto 60px', padding: '0 32px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0', paddingRight: '32px' }}>
            <div style={{ fontSize: '56px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>4.9</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '12px 0' }}>
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="#D97706" color="#D97706" />)}
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>Based on 12,480 verified ratings</div>
          </div>

          <div>
            {[
              { stars: '5 Stars', pct: '94%', count: '11,731' },
              { stars: '4 Stars', pct: '5%', count: '624' },
              { stars: '3 Stars', pct: '1%', count: '125' }
            ].map((bar, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155', width: '60px' }}>{bar.stars}</span>
                <div style={{ flex: 1, height: '10px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: bar.pct, height: '100%', background: '#059669', borderRadius: '9999px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, width: '60px', textAlign: 'right' }}>{bar.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs & Review Cards */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {['All Reviews', 'Verified Patients', 'Specialists', 'Emergency QR'].map(cat => (
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

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '28px' }}>
          {filteredReviews.map(rev => (
            <div
              key={rev.id}
              style={{
                background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="#D97706" color="#D97706" />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>{rev.date}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                  "{rev.title}"
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                  {rev.comment}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{rev.name}</div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>{rev.role}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1',
                    background: rev.voted ? '#ECFDF5' : '#F8FAFC',
                    color: rev.voted ? '#047857' : '#64748B',
                    fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                  }}
                >
                  <ThumbsUp size={14} color={rev.voted ? '#047857' : '#64748B'} />
                  <span>Helpful ({rev.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', maxWidth: '500px', width: '100%', padding: '32px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <button
              onClick={() => setShowAddReviewModal(false)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="#0F172A" />
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>Share Your Experience</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Help others discover JeevanPath AI Healthcare Network.</p>

            <form onSubmit={handleAddReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Sharma or Rahul M."
                  value={newReview.name}
                  onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: num })}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: newReview.rating === num ? '2px solid #D97706' : '1px solid #CBD5E1', background: newReview.rating === num ? '#FEF3C7' : '#FFF', cursor: 'pointer', fontWeight: 800 }}
                    >
                      ★ {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life-saving emergency access"
                  value={newReview.title}
                  onChange={e => setNewReview({ ...newReview, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Detailed Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details of your experience with JeevanPath..."
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#059669', color: '#FFF', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

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
