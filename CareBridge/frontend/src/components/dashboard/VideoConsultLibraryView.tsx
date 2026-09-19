import React, { useState, useEffect } from 'react';
import { Play, Video, X, Stethoscope, Search, ShieldCheck, CheckCircle2, Filter } from 'lucide-react';
import { fetchDoctorConsultancyVideos, type DoctorVideoConsultancy } from '../../services/youtubeService';

interface VideoConsultLibraryViewProps {
  onVideoSelect?: (video: DoctorVideoConsultancy) => void;
}

export default function VideoConsultLibraryView({ onVideoSelect }: VideoConsultLibraryViewProps) {
  const [videos, setVideos] = useState<DoctorVideoConsultancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Consultancy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<DoctorVideoConsultancy | null>(null);

  const loadVideos = async (cat: string, queryStr?: string) => {
    setLoading(true);
    let q = queryStr && queryStr.trim() ? `${queryStr} doctor medical consultation` : 'medical doctor consultancy advice';
    if (!queryStr || !queryStr.trim()) {
      if (cat === 'Cardiology') q = 'cardiology doctor consultation blood pressure hypertension';
      if (cat === 'Neurology') q = 'neurology doctor consultation brain health migraine';
      if (cat === 'Diabetes') q = 'diabetes doctor consultation blood sugar management insulin';
      if (cat === 'Pediatrics') q = 'pediatrics doctor consultation child healthcare asthma';
    }

    const res = await fetchDoctorConsultancyVideos(q);
    setVideos(res);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        loadVideos(activeCategory, searchQuery);
      } else {
        loadVideos(activeCategory);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery('');
    loadVideos(cat);
  };

  const handleCardClick = (vid: DoctorVideoConsultancy) => {
    setSelectedVideo(vid);
    if (onVideoSelect) onVideoSelect(vid);
  };

  return (
    <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={18} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              DOCTOR CONSULTANCY & HEALTH WEBINARS
            </h3>

            {/* Subtle Emerald Status Chip */}
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0',
              padding: '3px 10px',
              borderRadius: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
              Live source connected
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', fontWeight: 500 }}>
            Watch verified specialist consultations, medical advice broadcasts, and preventive care video guides
          </p>
        </div>

        {/* Search Input Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 9999, padding: '6px 14px', width: 260 }}>
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search specialist videos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#0F172A' }}
          />
        </div>
      </div>

      {/* Category Pills Bar (matching Quick Actions pill styling) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {['All Consultancy', 'Cardiology', 'Neurology', 'Diabetes', 'Pediatrics'].map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 700,
                border: isActive ? '1px solid #0284C7' : '1px solid #E2E8F0',
                background: isActive ? '#0284C7' : '#F8FAFC',
                color: isActive ? '#FFFFFF' : '#0F172A',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontWeight: 600, fontSize: 14 }}>
          Fetching verified medical consultancy videos from YouTube Data API…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {videos.map(vid => (
            <div
              key={vid.id}
              onClick={() => handleCardClick(vid)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* 16:9 Thumbnail with Overlay & Specialty Tag */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0F172A', overflow: 'hidden' }}>
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EF4444', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.5)' }}>
                    <Play size={18} fill="#FFF" style={{ marginLeft: 2 }} />
                  </div>
                </div>

                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)',
                  color: '#FFFFFF', fontSize: 11, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 9999
                }}>
                  {vid.specialty}
                </span>

                {/* Verified Badge Overlay */}
                {vid.isVerifiedSpecialist && (
                  <span style={{
                    position: 'absolute', top: 10, right: 10,
                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                    color: '#059669', fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 9999,
                    display: 'flex', alignItems: 'center', gap: 3
                  }}>
                    <CheckCircle2 size={11} color="#059669" />
                    Verified Specialist
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0284C7', marginBottom: 4 }}>
                    <Stethoscope size={14} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{vid.doctorName}</span>
                  </div>

                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', lineHeight: 1.35, margin: 0 }}>
                    {vid.title}
                  </h4>

                  <p style={{
                    fontSize: 12, color: '#64748B', marginTop: 4, margin: '4px 0 0',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {vid.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: 10, marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{vid.publishedAt}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0284C7', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Watch Consult <Play size={10} fill="#0284C7" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App Video Modal Overlay */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.25rem',
            width: '100%',
            maxWidth: 860,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Stethoscope size={20} color="#38BDF8" />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{selectedVideo.doctorName}</h3>
                  <span style={{ fontSize: 12, color: '#38BDF8', fontWeight: 600 }}>{selectedVideo.specialty} • Verified Specialist</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                style={{ background: 'transparent', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Video iFrame Container */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                src={`${selectedVideo.embedUrl}?autoplay=1`}
                title={selectedVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Description */}
            <div style={{ padding: '20px 24px' }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                {selectedVideo.title}
              </h4>
              <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
