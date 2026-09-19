import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle2, Building2, Globe2, Search, MapPin, ChevronRight, Zap, Play, Pause } from 'lucide-react';

export interface BranchLocation {
  id: string;
  city: string;
  country: string;
  region: 'India' | 'International';
  hospitalName: string;
  doctorsCount: number;
  status: 'Active' | 'Expanding';
  lat: number;
  lng: number;
}

export const BRANCH_LOCATIONS: BranchLocation[] = [
  // ── Indian Locations ──
  { id: 'b-1', city: 'Delhi NCR', country: 'India', region: 'India', hospitalName: 'JeevanPath AI Super Specialty Institute', doctorsCount: 850, status: 'Active', lat: 28.6139, lng: 77.2090 },
  { id: 'b-2', city: 'Mumbai', country: 'India', region: 'India', hospitalName: 'JeevanPath Multi-Specialty Hospital', doctorsCount: 920, status: 'Active', lat: 19.0760, lng: 72.8777 },
  { id: 'b-3', city: 'Bengaluru', country: 'India', region: 'India', hospitalName: 'JeevanPath MedTech & Cardiac Center', doctorsCount: 780, status: 'Active', lat: 12.9716, lng: 77.5946 },
  { id: 'b-4', city: 'Hyderabad', country: 'India', region: 'India', hospitalName: 'JeevanPath Neuro & Trauma Hospital', doctorsCount: 650, status: 'Active', lat: 17.3850, lng: 78.4867 },
  { id: 'b-5', city: 'Chennai', country: 'India', region: 'India', hospitalName: 'JeevanPath Oncology & Surgical Center', doctorsCount: 710, status: 'Active', lat: 13.0827, lng: 80.2707 },
  { id: 'b-6', city: 'Kolkata', country: 'India', region: 'India', hospitalName: 'JeevanPath Eastern Regional Hospital', doctorsCount: 540, status: 'Active', lat: 22.5726, lng: 88.3639 },
  { id: 'b-7', city: 'Ahmedabad', country: 'India', region: 'India', hospitalName: 'JeevanPath Heart & Vascular Care', doctorsCount: 490, status: 'Active', lat: 23.0225, lng: 72.5714 },
  { id: 'b-8', city: 'Pune', country: 'India', region: 'India', hospitalName: 'JeevanPath Orthopedic Institute', doctorsCount: 430, status: 'Active', lat: 18.5204, lng: 73.8567 },
  { id: 'b-9', city: 'Lucknow', country: 'India', region: 'India', hospitalName: 'JeevanPath General & ER Center', doctorsCount: 380, status: 'Active', lat: 26.8467, lng: 80.9462 },
  { id: 'b-10', city: 'Jaipur', country: 'India', region: 'India', hospitalName: 'JeevanPath Desert Healthcare Hub', doctorsCount: 350, status: 'Active', lat: 26.9124, lng: 75.7873 },
  { id: 'b-11', city: 'Kochi', country: 'India', region: 'India', hospitalName: 'JeevanPath Coastal Cardiac Hospital', doctorsCount: 460, status: 'Active', lat: 9.9312, lng: 76.2673 },
  { id: 'b-12', city: 'Chandigarh', country: 'India', region: 'India', hospitalName: 'JeevanPath Northern Medical Hub', doctorsCount: 410, status: 'Active', lat: 30.7333, lng: 76.7794 },

  // ── International Locations ──
  { id: 'b-29', city: 'New York', country: 'United States', region: 'International', hospitalName: 'JeevanPath Manhattan Medical Center', doctorsCount: 520, status: 'Active', lat: 40.7128, lng: -74.0060 },
  { id: 'b-30', city: 'London', country: 'United Kingdom', region: 'International', hospitalName: 'JeevanPath Harley Street Hospital', doctorsCount: 480, status: 'Active', lat: 51.5074, lng: -0.1278 },
  { id: 'b-31', city: 'Toronto', country: 'Canada', region: 'International', hospitalName: 'JeevanPath Ontario Health Hub', doctorsCount: 390, status: 'Active', lat: 43.6532, lng: -79.3832 },
  { id: 'b-32', city: 'Dubai', country: 'United Arab Emirates', region: 'International', hospitalName: 'JeevanPath Healthcare City Center', doctorsCount: 610, status: 'Active', lat: 25.2048, lng: 55.2708 },
  { id: 'b-33', city: 'Singapore', country: 'Singapore', region: 'International', hospitalName: 'JeevanPath ASEAN General Hospital', doctorsCount: 450, status: 'Active', lat: 1.3521, lng: 103.8198 },
  { id: 'b-34', city: 'Tokyo', country: 'Japan', region: 'International', hospitalName: 'JeevanPath Shinjuku AI Medical Center', doctorsCount: 430, status: 'Active', lat: 35.6762, lng: 139.6503 },
  { id: 'b-35', city: 'Sydney', country: 'Australia', region: 'International', hospitalName: 'JeevanPath Pacific Cardiac Institute', doctorsCount: 360, status: 'Active', lat: -33.8688, lng: 151.2093 },
  { id: 'b-36', city: 'Berlin', country: 'Germany', region: 'International', hospitalName: 'JeevanPath European Health Campus', doctorsCount: 410, status: 'Active', lat: 52.5200, lng: 13.4050 },
  { id: 'b-37', city: 'Paris', country: 'France', region: 'International', hospitalName: 'JeevanPath Seine Clinical Center', doctorsCount: 380, status: 'Active', lat: 48.8566, lng: 2.3522 },
  { id: 'b-43', city: 'Seoul', country: 'South Korea', region: 'International', hospitalName: 'JeevanPath Gangnam Robotics & Health', doctorsCount: 420, status: 'Active', lat: 37.5665, lng: 126.9780 }
];

export default function GlobalGlobe() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'India' | 'International'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBranch, setHoveredBranch] = useState<BranchLocation | null>(null);
  const [activeBranch, setActiveBranch] = useState<BranchLocation | null>(BRANCH_LOCATIONS[0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const globeContainerRef = useRef<HTMLDivElement>(null);

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotate || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle(prev => (prev + 0.35) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotate, isDragging]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setRotationAngle(prev => (prev + deltaX * 0.4) % 360);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Filter locations by tab & search query
  const filteredLocations = BRANCH_LOCATIONS.filter(b => {
    const matchesTab = selectedFilter === 'All' || b.region === selectedFilter;
    const matchesSearch = b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Select city & rotate globe to bring it to front
  const handleSelectBranch = (branch: BranchLocation) => {
    setActiveBranch(branch);
    setIsAutoRotate(false);
    // Calculate required rotation angle to center target longitude
    const targetAngle = (270 - branch.lng + 360) % 360;
    setRotationAngle(targetAngle);
  };

  return (
    <section
      id="global-globe-section"
      style={{
        background: '#F8FAFC',
        color: '#0F172A',
        padding: '60px 32px 80px',
        position: 'relative'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.9; }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .globe-drag-area {
          cursor: grab;
        }
        .globe-drag-area:active {
          cursor: grabbing;
        }
      ` }} />

      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', gap: '20px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '9999px',
              background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)',
              fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#047857',
              marginBottom: '12px'
            }}>
              <Globe2 size={14} color="#047857" />
              <span>3D Interactive World Map</span>
            </div>

            <h2 style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
              Global Hospital Infrastructure
            </h2>
          </div>

          {/* Region Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '9999px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            {(['All', 'India', 'International'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.25s ease',
                  background: selectedFilter === filter ? '#059669' : 'transparent',
                  color: selectedFilter === filter ? '#FFFFFF' : '#64748B',
                  boxShadow: selectedFilter === filter ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none'
                }}
              >
                {filter === 'All' ? 'ALL LOCATIONS' : filter === 'India' ? 'INDIA HUBS' : 'INTERNATIONAL'}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Split Interactive Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            gap: '24px',
            borderRadius: '32px',
            background: '#0F172A',
            border: '1px solid #1E293B',
            color: '#FFFFFF',
            padding: '28px',
            boxShadow: '0 25px 50px rgba(15, 23, 42, 0.15)',
            minHeight: '620px'
          }}
        >
          
          {/* Left Column: Interactive City Directory Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(255, 255, 255, 0.04)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#BEF264', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Medical Hubs ({filteredLocations.length})</span>
              <Zap size={15} color="#BEF264" />
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, hospital..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>

            {/* Scrollable City List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '450px', paddingRight: '4px' }} className="hide-scrollbar">
              {filteredLocations.map((loc) => {
                const isSelected = activeBranch?.id === loc.id;
                const isIndia = loc.region === 'India';
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectBranch(loc)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: isSelected ? 'rgba(5, 150, 105, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #BEF264' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#BEF264' : '#FFFFFF' }}>
                          {loc.city}
                        </span>
                        <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '9999px', background: isIndia ? 'rgba(190, 242, 100, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: isIndia ? '#BEF264' : '#38BDF8' }}>
                          {loc.country}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {loc.hospitalName}
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? '#BEF264' : '#64748B' }}>
                      {loc.doctorsCount} Drs
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Interactive Drag-to-Rotate Globe Visualizer */}
          <div
            ref={globeContainerRef}
            className="globe-drag-area"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              padding: '10px',
              userSelect: 'none'
            }}
          >
            {/* Top Bar Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#BEF264', boxShadow: '0 0 10px #BEF264' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#BEF264' }}>
                  DRAG GLOBE TO ROTATE • {activeBranch?.city || 'Delhi NCR'} ACTIVE
                </span>
              </div>

              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  background: isAutoRotate ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  color: isAutoRotate ? '#38BDF8' : '#94A3B8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAutoRotate ? <Pause size={12} /> : <Play size={12} />}
                <span>{isAutoRotate ? 'AUTO ROTATING' : 'PAUSED'}</span>
              </button>
            </div>

            {/* 3D Sphere Canvas Projection */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              
              {/* Outer Atmospheric Orbit Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: '460px',
                  height: '460px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(190, 242, 100, 0.25)',
                  animation: 'orbitSpin 60s linear infinite',
                  pointerEvents: 'none'
                }}
              />

              {/* 3D Main Globe Sphere */}
              <div
                style={{
                  position: 'relative',
                  width: '400px',
                  height: '400px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #047857 0%, #064E3B 60%, #0F172A 100%)',
                  boxShadow: 'inset 0 0 80px rgba(190, 242, 100, 0.3), 0 0 100px rgba(4, 120, 87, 0.4)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Lat/Long Grid Texture */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    opacity: 0.28,
                    backgroundImage: 'radial-gradient(circle, rgba(190, 242, 100, 0.7) 1px, transparent 1px), linear-gradient(to right, rgba(56, 189, 248, 0.35) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                    transform: `rotate(${rotationAngle}deg)`
                  }}
                />

                {/* Render Marker Nodes */}
                {filteredLocations.map((loc) => {
                  const adjustedLng = loc.lng + rotationAngle;
                  const radLat = (loc.lat * Math.PI) / 180;
                  const radLng = (adjustedLng * Math.PI) / 180;

                  const x = 50 + 42 * Math.cos(radLat) * Math.sin(radLng);
                  const y = 50 - 42 * Math.sin(radLat);
                  const isVisible = Math.cos(radLat) * Math.cos(radLng) > -0.2;

                  if (!isVisible) return null;

                  const isHovered = hoveredBranch?.id === loc.id;
                  const isActive = activeBranch?.id === loc.id;
                  const nodeColor = loc.region === 'India' ? '#BEF264' : '#38BDF8';

                  return (
                    <div
                      key={loc.id}
                      style={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isHovered || isActive ? 50 : 30
                      }}
                      onMouseEnter={() => {
                        setHoveredBranch(loc);
                        setIsAutoRotate(false);
                      }}
                      onMouseLeave={() => setHoveredBranch(null)}
                      onClick={() => handleSelectBranch(loc)}
                    >
                      <div style={{ position: 'relative' }}>
                        {/* Radar pulse animation for active branch */}
                        {isActive && (
                          <span
                            style={{
                              position: 'absolute',
                              inset: '-6px',
                              borderRadius: '50%',
                              background: nodeColor,
                              animation: 'pulseGlow 2s infinite ease-in-out',
                              pointerEvents: 'none'
                            }}
                          />
                        )}

                        <span
                          style={{
                            display: 'block',
                            borderRadius: '50%',
                            transition: 'all 0.25s ease',
                            width: isActive ? '16px' : isHovered ? '14px' : '10px',
                            height: isActive ? '16px' : isHovered ? '14px' : '10px',
                            background: nodeColor,
                            boxShadow: isActive ? `0 0 20px ${nodeColor}` : `0 0 10px ${nodeColor}`
                          }}
                        />
                      </div>

                      {/* Tooltip Hover Card */}
                      {(isHovered || isActive) && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginBottom: '12px',
                            width: '230px',
                            padding: '14px 16px',
                            borderRadius: '18px',
                            background: 'rgba(15, 23, 42, 0.96)',
                            backdropFilter: 'blur(20px)',
                            border: `1.5px solid ${nodeColor}`,
                            color: '#FFFFFF',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            pointerEvents: 'none',
                            zIndex: 100
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: nodeColor }}>{loc.city}</span>
                            <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF' }}>
                              {loc.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px', lineHeight: 1.3 }}>
                            {loc.hospitalName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '6px', color: '#94A3B8' }}>
                            <span>{loc.country}</span>
                            <span style={{ color: nodeColor }}>{loc.doctorsCount} DOCTORS</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Location Bottom Details Bar */}
            {activeBranch && (
              <div
                style={{
                  position: 'relative',
                  zIndex: 20,
                  padding: '16px 20px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(190, 242, 100, 0.3)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(190, 242, 100, 0.25) 0%, rgba(5, 150, 105, 0.35) 100%)', border: '1px solid rgba(190, 242, 100, 0.4)', color: '#BEF264', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>{activeBranch.hospitalName}</h4>
                      <span style={{ padding: '2px 8px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                        {activeBranch.city}, {activeBranch.country}
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', margin: 0 }}>
                      {activeBranch.doctorsCount} Certified Doctors • 24×7 Emergency Dispatch & Real-Time Vault Synchronized
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#BEF264', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  <CheckCircle2 size={15} />
                  <span>VAULT ONLINE</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
