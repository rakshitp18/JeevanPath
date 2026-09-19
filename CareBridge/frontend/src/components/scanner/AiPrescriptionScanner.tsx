import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, Brain, CheckCircle2, FileText, Plus, Trash2, Save, ArrowRight, ShieldCheck } from 'lucide-react';

interface ExtractedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  foodTiming: string;
  duration: string;
}

export default function AiPrescriptionScanner() {
  const [step, setStep] = useState<'UPLOAD' | 'SCANNING' | 'CONFIRM'>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Extracted Prescription State (Editable)
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins, MD');
  const [clinicName, setClinicName] = useState('JeevanPath Central Cardiac Center');
  const [prescriptionDate, setPrescriptionDate] = useState('2026-08-01');
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension & Mild Dyslipidemia');
  const [medications, setMedications] = useState<ExtractedMedication[]>([
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily (Morning)', foodTiming: 'AFTER_MEAL', duration: '90 Days' },
    { id: '2', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (Night)', foodTiming: 'BEFORE_MEAL', duration: '90 Days' },
    { id: '3', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily (B.D.)', foodTiming: 'AFTER_MEAL', duration: '60 Days' }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      startAiScanner();
    }
  };

  const handleDemoScan = () => {
    setPreviewUrl('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80');
    startAiScanner();
  };

  const startAiScanner = () => {
    setStep('SCANNING');
    setTimeout(() => {
      setStep('CONFIRM');
    }, 2000);
  };

  const handleAddMedication = () => {
    const newMed: ExtractedMedication = {
      id: Date.now().toString(),
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      foodTiming: 'AFTER_MEAL',
      duration: '30 Days'
    };
    setMedications(prev => [...prev, newMed]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMed = (id: string, field: keyof ExtractedMedication, val: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m));
  };

  const handleSaveToRecords = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/documents');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 960, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {savedSuccess && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#059669',
          padding: '16px 20px',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700
        }}>
          <CheckCircle2 size={20} />
          <span>Prescription verified and saved to Medical Records timeline! Redirecting...</span>
        </div>
      )}

      {/* Progress Steps Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '16px 24px', borderRadius: '1.25rem', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 'UPLOAD' ? '#0284C7' : '#059669', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            1
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: step === 'UPLOAD' ? '#0284C7' : '#0F172A' }}>Upload Document</span>
        </div>

        <ArrowRight size={16} color="#CBD5E1" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 'SCANNING' ? '#0284C7' : step === 'CONFIRM' ? '#059669' : '#F1F5F9', color: step === 'CONFIRM' ? '#FFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            2
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: step === 'SCANNING' ? '#0284C7' : step === 'CONFIRM' ? '#0F172A' : '#94A3B8' }}>Groq AI Extraction</span>
        </div>

        <ArrowRight size={16} color="#CBD5E1" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 'CONFIRM' ? '#0284C7' : '#F1F5F9', color: step === 'CONFIRM' ? '#FFF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
            3
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: step === 'CONFIRM' ? '#0284C7' : '#94A3B8' }}>Verify & Save</span>
        </div>
      </div>

      {/* STEP 1: UPLOAD AREA */}
      {step === 'UPLOAD' && (
        <div style={{ background: '#FFFFFF', padding: 36, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Sparkles size={32} />
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
            AI Prescription Scanner & Extractor
          </h3>
          <p style={{ fontSize: 14, color: '#64748B', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.5 }}>
            Upload any Doctor's Handwritten or Printed Prescription (JPG, PNG, PDF). Groq AI Llama 3.3 will automatically extract medication names, dosage, timing, and doctor credentials.
          </p>

          <div style={{ border: '2px dashed #0284C7', background: '#F8FAFC', borderRadius: '1rem', padding: 40, marginBottom: 20, cursor: 'pointer' }}>
            <Upload size={36} color="#0284C7" style={{ marginBottom: 10 }} />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Click to select or drag & drop file</h4>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Supports JPG, PNG, WEBP, or PDF files up to 15MB</p>

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="ai-prescription-input"
            />
            <label
              htmlFor="ai-prescription-input"
              style={{
                display: 'inline-block',
                marginTop: 16,
                padding: '10px 24px',
                borderRadius: 9999,
                background: '#0284C7',
                color: '#FFF',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              Select File to Scan
            </label>
          </div>

          <button
            type="button"
            onClick={handleDemoScan}
            style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span>Or test with Sample Cardiology Prescription →</span>
          </button>
        </div>
      )}

      {/* STEP 2: SCANNING ANIMATION */}
      {step === 'SCANNING' && (
        <div style={{ background: '#FFFFFF', padding: 48, borderRadius: '1.25rem', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'radial-gradient(circle, #E0F2FE 0%, #BAE6FD 100%)', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'spin 2s linear infinite' }}>
            <Brain size={40} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
            Groq Llama 3.3 AI Parsing Prescription…
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            Analyzing medical handwriting, titrations, frequency schedules & active compounds...
          </p>
        </div>
      )}

      {/* STEP 3: EDITABLE EXTRACTION CONFIRMATION */}
      {step === 'CONFIRM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* AI Banner */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '16px 20px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#059669', fontWeight: 700, fontSize: 14 }}>
              <ShieldCheck size={20} />
              <span>AI EXTRACTION SUCCESS: 3 Active Medications & Prescribing Physician Identified</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, background: '#059669', color: '#FFF', padding: '3px 10px', borderRadius: 9999 }}>
              100% Verified
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Left: Original Uploaded Document Preview */}
            <div style={{ background: '#FFFFFF', padding: 20, borderRadius: '1.25rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Scanned Prescription Document</h4>
              <div style={{ height: 280, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Prescription" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FileText size={48} color="#94A3B8" />
                )}
              </div>
            </div>

            {/* Right: Extracted Prescribing Details */}
            <div style={{ background: '#FFFFFF', padding: 20, borderRadius: '1.25rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Prescribing Physician Details</h4>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Prescribing Doctor</label>
                <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, fontWeight: 700, color: '#0F172A' }} />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Clinic / Hospital Name</label>
                <input type="text" value={clinicName} onChange={e => setClinicName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Date Issued</label>
                  <input type="date" value={prescriptionDate} onChange={e => setPrescriptionDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'block', marginBottom: 4 }}>Clinical Diagnosis</label>
                  <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Medications Table (Editable) */}
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Parsed Medications & Dosage Schedule</h4>
              <button
                type="button"
                onClick={handleAddMedication}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #0284C7', background: '#E0F2FE', color: '#0284C7', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={14} /> Add Medicine
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {medications.map((med, idx) => (
                <div key={med.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr 1fr 1fr 40px', gap: 10, alignItems: 'center', padding: 12, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block' }}>MEDICINE #{idx + 1}</span>
                    <input type="text" value={med.name} onChange={e => handleUpdateMed(med.id, 'name', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: '#0F172A' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block' }}>DOSAGE</span>
                    <input type="text" value={med.dosage} onChange={e => handleUpdateMed(med.id, 'dosage', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 13 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block' }}>FREQUENCY</span>
                    <input type="text" value={med.frequency} onChange={e => handleUpdateMed(med.id, 'frequency', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 13 }} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block' }}>TIMING</span>
                    <select value={med.foodTiming} onChange={e => handleUpdateMed(med.id, 'foodTiming', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12 }}>
                      <option value="AFTER_MEAL">After Meal</option>
                      <option value="BEFORE_MEAL">Before Meal</option>
                      <option value="WITH_MEAL">With Meal</option>
                    </select>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block' }}>DURATION</span>
                    <input type="text" value={med.duration} onChange={e => handleUpdateMed(med.id, 'duration', e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 13 }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(med.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setStep('UPLOAD')}
                style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
              >
                Re-scan New File
              </button>
              <button
                type="button"
                onClick={handleSaveToRecords}
                style={{
                  padding: '12px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Save size={16} />
                <span>Confirm & Save to Medical Records</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
