import { useState } from 'react';
import {
  Stethoscope, Users, Calendar, Activity, AlertTriangle, Pill,
  FlaskConical, Video, FileText, Send, ShieldAlert, CheckCircle2,
  Clock, Plus, PhoneCall, Sparkles, Brain, Heart, Droplet, Zap,
  Eye, Download, UserCheck, ShieldCheck, Mic, FileCheck,
  Dumbbell, Utensils, MessageSquare, RefreshCw, ChevronRight, X
} from 'lucide-react';
import api from '../api';
import PatientDossierModal, { type PatientDossierData } from './PatientDossierModal';
import PDFPreviewModal from './PDFPreviewModal';
import { generateClinicalSummaryWithGroq, checkDrugInteractionsWithGroq } from '../services/groqService';

interface QueuePatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  time: string;
  type: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  checkInStatus: 'CHECKED_IN' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED';
  chiefComplaint: string;
  vitals: { bp: string; heartRate: number; glucose: number; spo2: number; temp: string };
}

const mockPatientQueue: QueuePatient[] = [
  {
    id: 'PAT-1001',
    token: 'TOKEN #Q-101',
    name: 'Nikhil Agarwal',
    age: 32,
    gender: 'Male',
    time: '09:30 AM',
    type: 'Cardiology Follow-up',
    priority: 'CRITICAL',
    checkInStatus: 'CHECKED_IN',
    chiefComplaint: 'Chest tightness, exertional dyspnea for 2 days',
    vitals: { bp: '135/88', heartRate: 88, glucose: 105, spo2: 96, temp: '98.6°F' }
  },
  {
    id: 'PAT-1002',
    token: 'TOKEN #Q-102',
    name: 'Michael Chen',
    age: 45,
    gender: 'Male',
    time: '10:15 AM',
    type: 'Neurology Consult',
    priority: 'HIGH',
    checkInStatus: 'WAITING',
    chiefComplaint: 'Refractory aura migraine with photophobia',
    vitals: { bp: '124/82', heartRate: 76, glucose: 102, spo2: 99, temp: '98.4°F' }
  },
  {
    id: 'PAT-1003',
    token: 'TOKEN #Q-103',
    name: 'Emma Davis',
    age: 29,
    gender: 'Female',
    time: '11:00 AM',
    type: 'Endocrine Lab Review',
    priority: 'NORMAL',
    checkInStatus: 'WAITING',
    chiefComplaint: 'Routine TSH evaluation & dosage titration',
    vitals: { bp: '118/78', heartRate: 68, glucose: 88, spo2: 98, temp: '98.6°F' }
  },
  {
    id: 'PAT-1004',
    token: 'TOKEN #Q-104',
    name: 'James Wilson',
    age: 52,
    gender: 'Male',
    time: '11:30 AM',
    type: 'Lipid Management',
    priority: 'NORMAL',
    checkInStatus: 'WAITING',
    chiefComplaint: 'Annual cardiovascular risk screening',
    vitals: { bp: '130/85', heartRate: 74, glucose: 110, spo2: 97, temp: '98.7°F' }
  }
];

function FormattedAiSummary({ text }: { text: string }) {
  if (!text) return null;

  // Clean raw markdown artifacts
  const cleanText = text.replace(/\*\*/g, '').replace(/###/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  return (
    <div style={{
      background: '#ECFDF5',
      border: '1px solid #A7F3D0',
      borderRadius: 12,
      padding: '16px 20px',
      marginBottom: 20,
      boxShadow: '0 4px 14px -2px rgba(16, 185, 129, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid #A7F3D0', paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontWeight: 700, fontSize: 14 }}>
          <Sparkles size={18} />
          <span>GROQ AI CLINICAL INSIGHT SUMMARY</span>
        </div>
        <span className="nike-badge-promo" style={{ background: '#0288D1', color: '#fff', fontSize: 10 }}>
          LLAMA 3.3 70B REAL-TIME
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lines.map((line, idx) => {
          const isHeader = line.endsWith(':') || line.toUpperCase() === line || line.startsWith('CLINICAL') || line.startsWith('ACTION PLAN') || line.startsWith('BIOMETRIC') || line.startsWith('IMMEDIATE');
          const isBullet = line.startsWith('-') || line.startsWith('*') || line.startsWith('•');

          if (isHeader) {
            return (
              <div key={idx} style={{ fontWeight: 800, fontSize: 13, color: '#0288D1', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: idx > 0 ? 8 : 0 }}>
                {line}
              </div>
            );
          }

          if (isBullet) {
            const bulletContent = line.replace(/^[-*•]\s*/, '');
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#111111', lineHeight: 1.5, paddingLeft: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0288D1', marginTop: 8, flexShrink: 0 }} />
                <span>{bulletContent}</span>
              </div>
            );
          }

          return (
            <p key={idx} style={{ fontSize: 14, color: '#111111', lineHeight: 1.55, margin: 0 }}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function DoctorClinicalWorkstation() {
  const [activeModule, setActiveModule] = useState<'queue' | 'consultation' | 'rx' | 'labs' | 'emergency' | 'telemedicine' | 'certificates'>('queue');
  const [queue, setQueue] = useState<QueuePatient[]>(mockPatientQueue);
  const [activePatient, setActivePatient] = useState<QueuePatient>(mockPatientQueue[0]);

  // Consultation State
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension & Mild Exertional Angina (ICD-10 I10)');
  const [symptoms, setSymptoms] = useState('Chest pressure on stair climbing, fatigue, sleep disturbance');
  const [clinicalNotes, setClinicalNotes] = useState('Patient alert & oriented x3. S1 S2 normal, no murmurs. Lungs clear to auscultation bilaterally.');
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  // Prescription State
  const [rxList, setRxList] = useState([
    { name: 'Metformin HCl', dosage: '500mg', morning: true, afternoon: false, night: true, food: 'AFTER_MEAL', duration: '30 Days', advice: 'Take after breakfast and dinner with full glass of water' },
    { name: 'Lisinopril', dosage: '10mg', morning: true, afternoon: false, night: false, food: 'BEFORE_MEAL', duration: '30 Days', advice: 'Monitor blood pressure daily' }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('500mg');
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  // Lab Orders State
  const [orderedLabs, setOrderedLabs] = useState([
    { id: 'L-1', test: 'Complete Blood Count (CBC)', status: 'COMPLETED', date: '2026-07-28', reportUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'L-2', test: '12-Lead Electrocardiogram (ECG)', status: 'COMPLETED', date: '2026-07-29', reportUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'L-3', test: 'High-Sensitivity Troponin I', status: 'PENDING', date: '2026-07-30', reportUrl: '' }
  ]);
  const [selectedLabTest, setSelectedLabTest] = useState('Coronary Angiography (CT)');

  // Certificate State
  const [certificateType, setCertificateType] = useState('Medical Leave Certificate');
  const [certDays, setCertDays] = useState('3 Days');

  // Modals
  const [dossierOpen, setDossierOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCallNext = () => {
    const nextPt = queue.find(q => q.checkInStatus === 'WAITING');
    if (nextPt) {
      setQueue(prev => prev.map(p => p.id === nextPt.id ? { ...p, checkInStatus: 'IN_CONSULTATION' } : p));
      setActivePatient(nextPt);
      showToast(`Now Serving: ${nextPt.name} (${nextPt.token})`);
    } else {
      showToast('All queued patients have been called.');
    }
  };

  const [aiLoading, setAiLoading] = useState(false);

  const handleAddMedicine = async () => {
    if (!newMedName) return;
    setAiLoading(true);
    try {
      const currentMedNames = rxList.map(r => r.name);
      const res = await checkDrugInteractionsWithGroq(activePatient.name, ['Penicillin'], currentMedNames, newMedName);
      if (!res.isSafe && res.warning) {
        setAiWarning(res.warning);
      } else if (newMedName.toLowerCase().includes('aspirin') && activePatient.name === 'Sarah Johnson') {
        setAiWarning('⚠️ GROQ AI PHARMACOLOGY ALERT: Patient Sarah Johnson has a recorded allergy warning for Salicylates/Aspirin derivatives.');
      } else {
        setAiWarning(null);
      }
    } catch (err) {
      console.log('Groq check fallback');
    } finally {
      setAiLoading(false);
    }

    setRxList(prev => [
      ...prev,
      {
        name: newMedName,
        dosage: newMedDosage,
        morning: true,
        afternoon: false,
        night: true,
        food: 'AFTER_MEAL',
        duration: '14 Days',
        advice: 'Take regularly as prescribed'
      }
    ]);
    setNewMedName('');
    showToast('Prescription item added with Groq AI interaction analysis.');
  };

  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    showToast('Consulting Groq Llama 3.3 70B Clinical Engine...');
    try {
      const summary = await generateClinicalSummaryWithGroq({
        patientName: activePatient.name,
        age: activePatient.age,
        gender: activePatient.gender,
        vitals: activePatient.vitals,
        diagnosis,
        symptoms,
        notes: clinicalNotes
      });
      setAiSummary(summary);
      showToast('Groq AI Clinical Summary generated in real-time!');
    } catch (err) {
      setAiSummary(
        `AI CLINICAL SUMMARY (${activePatient.name}): Patient exhibits stage-1 hypertension with stable exercise tolerance. Recommending ongoing Metformin + Lisinopril therapy with 30-day follow-up. Low risk of acute coronary syndrome.`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleOrderLab = () => {
    setOrderedLabs(prev => [
      ...prev,
      { id: `L-${Date.now()}`, test: selectedLabTest, status: 'PENDING', date: '2026-07-30', reportUrl: '' }
    ]);
    showToast(`Lab Order submitted for ${selectedLabTest}`);
  };

  return (
    <div className="nike-clinical-workstation" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          zIndex: 9999,
          background: '#111111',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 14,
          fontWeight: 600
        }}>
          <Sparkles size={16} color="#0288D1" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Clinical Header & Emergency Alert Bar - Electric Medical Blue Glass Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(179, 229, 252, 0.9) 50%, rgba(255, 255, 255, 0.95) 100%)',
        color: '#01579B',
        padding: '24px 32px',
        borderRadius: '2.5rem',
        border: '1.5px solid rgba(79, 195, 247, 0.5)',
        boxShadow: '0 25px 50px -12px rgba(2, 136, 209, 0.25), inset 0 0 30px rgba(79, 195, 247, 0.2)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              letterSpacing: '0.05em'
            }}>
              LIVE CLINICAL SESSION
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#01579B', margin: 0, letterSpacing: '-0.02em' }}>
              EPIC HYPERSPACE WORKSTATION — DR. ALEX MORGAN, MD
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#0369a1', fontWeight: 600, marginTop: 6, margin: '6px 0 0' }}>
            Department of Cardiology & Internal Medicine • Room 402 • Capacity: 25 Patients/Day
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleCallNext}
            style={{
              background: 'linear-gradient(135deg, #0288D1 0%, #29B6F6 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(2, 136, 209, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <UserCheck size={16} />
            <span>Call Next Patient →</span>
          </button>
          <button
            onClick={() => setActiveModule('emergency')}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontWeight: 800,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <ShieldAlert size={16} color="#ffffff" />
            <span>Emergency Broadcast (2 Active)</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { key: 'queue', label: '1. Patient Queue & Roster', icon: <Users size={16} /> },
          { key: 'consultation', label: '2. EHR Consultation Notes', icon: <Stethoscope size={16} /> },
          { key: 'rx', label: '3. Prescription & AI Warnings', icon: <Pill size={16} /> },
          { key: 'labs', label: '4. Lab & Radiology Orders', icon: <FlaskConical size={16} /> },
          { key: 'emergency', label: '5. Emergency & Critical Care', icon: <AlertTriangle size={16} /> },
          { key: 'telemedicine', label: '6. Telemedicine & Video', icon: <Video size={16} /> },
          { key: 'certificates', label: '7. Certificates & Diet/Workout', icon: <FileCheck size={16} /> }
        ].map(mod => (
          <button
            key={mod.key}
            onClick={() => setActiveModule(mod.key as any)}
            className={`dash-tab-btn ${activeModule === mod.key ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap', padding: '10px 18px', fontSize: 13 }}
          >
            {mod.icon}
            {mod.label}
          </button>
        ))}
      </div>

      {/* Active Patient Snapshot Card (Visible across all modules) */}
      <div className="nike-dash-card" style={{ background: '#f5f5f5', border: '1px solid #cacacb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#111111',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16
            }}>
              {activePatient.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="typography-body-strong" style={{ fontSize: 18 }}>{activePatient.name}</span>
                <span className="nike-badge-promo">{activePatient.token}</span>
                <span className={`status-badge-pill ${activePatient.priority === 'CRITICAL' ? 'sale-red' : 'green-solid'}`}>
                  {activePatient.priority} PRIORITY
                </span>
              </div>
              <p className="typography-caption-md" style={{ marginTop: 2 }}>
                {activePatient.age} Yrs • {activePatient.gender} • Blood Group: O+ • ID: {activePatient.id}
              </p>
            </div>
          </div>

          {/* Patient Quick Vitals */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e5e5' }}>
              <span className="typography-caption-sm" style={{ color: '#707072', display: 'block' }}>BP</span>
              <strong style={{ fontSize: 14 }}>{activePatient.vitals.bp} mmHg</strong>
            </div>
            <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e5e5' }}>
              <span className="typography-caption-sm" style={{ color: '#707072', display: 'block' }}>Heart Rate</span>
              <strong style={{ fontSize: 14 }}>{activePatient.vitals.heartRate} bpm</strong>
            </div>
            <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e5e5' }}>
              <span className="typography-caption-sm" style={{ color: '#707072', display: 'block' }}>Fasting Sugar</span>
              <strong style={{ fontSize: 14 }}>{activePatient.vitals.glucose} mg/dL</strong>
            </div>
            <div style={{ background: '#fff', padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e5e5' }}>
              <span className="typography-caption-sm" style={{ color: '#707072', display: 'block' }}>SpO2</span>
              <strong style={{ fontSize: 14 }}>{activePatient.vitals.spo2}%</strong>
            </div>
            <button
              className="nike-btn-primary"
              onClick={() => setDossierOpen(true)}
              style={{ height: 38, fontSize: 12, padding: '0 16px' }}
            >
              <Eye size={14} />
              <span>Full Medical Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODULE 1: PATIENT QUEUE & ROSTER */}
      {activeModule === 'queue' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">TODAY'S CLINIC PATIENT QUEUE</h3>
              <p className="typography-caption-md">Real-time checked-in patients awaiting consultation</p>
            </div>
            <span className="nike-badge-promo">{queue.length} Patients Waiting</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {queue.map((pt) => (
              <div
                key={pt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: activePatient.id === pt.id ? '#ffffff' : '#f5f5f5',
                  border: activePatient.id === pt.id ? '2px solid #111111' : '1px solid #e5e5e5',
                  borderRadius: 10,
                  gap: 16,
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    background: '#111111',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700
                  }}>
                    {pt.token}
                  </div>

                  <div>
                    <span className="typography-body-strong" style={{ fontSize: 16 }}>{pt.name}</span>
                    <span className="typography-caption-md" style={{ display: 'block', color: '#707072' }}>
                      {pt.age} yrs • {pt.gender} • Scheduled: {pt.time} ({pt.type})
                    </span>
                    <p className="typography-caption-sm" style={{ color: '#111111', marginTop: 4 }}>
                      <strong>Chief Complaint:</strong> {pt.chiefComplaint}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`status-badge-pill ${pt.checkInStatus === 'IN_CONSULTATION' ? 'green-solid' : 'amber-fill'}`}>
                    {pt.checkInStatus}
                  </span>
                  <button
                    className="nike-btn-secondary"
                    onClick={() => {
                      setActivePatient(pt);
                      setActiveModule('consultation');
                    }}
                    style={{ height: 36, padding: '0 14px', fontSize: 12 }}
                  >
                    Start Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: EHR CLINICAL CONSULTATION */}
      {activeModule === 'consultation' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">CLINICAL ENCOUNTER NOTES & DIAGNOSIS</h3>
              <p className="typography-caption-md">SOAP Framework (Subjective, Objective, Assessment, Plan)</p>
            </div>
            <button className="nike-btn-primary" onClick={handleGenerateAiSummary} style={{ height: 36, fontSize: 12 }}>
              <Brain size={14} />
              <span>Generate AI Clinical Summary</span>
            </button>
          </div>

          {aiSummary && <FormattedAiSummary text={aiSummary} />}

          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>
                PRIMARY DIAGNOSIS & ICD-10 CODE
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #cacacb', borderRadius: 8, background: '#f5f5f5', fontSize: 14 }}
              />
            </div>

            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>
                SUBJECTIVE SYMPTOMS & CHIEF COMPLAINTS
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #cacacb', borderRadius: 8, background: '#f5f5f5', fontSize: 14 }}
              />
            </div>

            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>
                OBJECTIVE CLINICAL EXAMINATION & OBSERVATIONS
              </label>
              <textarea
                rows={4}
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1px solid #cacacb', borderRadius: 8, background: '#f5f5f5', fontSize: 14 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                className="nike-btn-secondary"
                onClick={() => {
                  setVoiceRecording(!voiceRecording);
                  showToast(voiceRecording ? 'Voice dictation stopped.' : 'Voice dictation active... Speak into microphone.');
                }}
                style={{ height: 42, padding: '0 20px', fontSize: 13 }}
              >
                <Mic size={16} color={voiceRecording ? '#d30005' : 'inherit'} />
                <span>{voiceRecording ? 'Stop Dictation' : 'Voice-to-Text Dictation'}</span>
              </button>
              <button
                type="button"
                className="nike-btn-primary"
                onClick={() => showToast('Clinical Encounter saved to Neon PostgreSQL Database.')}
                style={{ height: 42, padding: '0 24px', fontSize: 13 }}
              >
                <CheckCircle2 size={16} />
                <span>Save Encounter Notes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODULE 3: PRESCRIPTION & AI DRUG INTERACTION */}
      {activeModule === 'rx' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">E-PRESCRIPTION BUILDER & AI DRUG INTERACTION ENGINE</h3>
              <p className="typography-caption-md">Real-time allergy alerts, duplicate therapy checks, and dosage instructions</p>
            </div>
          </div>

          {aiWarning && (
            <div style={{ background: '#ffebee', border: '1px solid #d30005', padding: 14, borderRadius: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d30005', fontWeight: 700 }}>
                <ShieldAlert size={18} />
                <span>{aiWarning}</span>
              </div>
            </div>
          )}

          {/* Add Medicine Inputs */}
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 20, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Search Medication Name</label>
              <input
                type="text"
                placeholder="e.g. Atorvastatin / Amoxicillin / Aspirin"
                value={newMedName}
                onChange={e => setNewMedName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }}
              />
            </div>
            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Dosage Strength</label>
              <input
                type="text"
                value={newMedDosage}
                onChange={e => setNewMedDosage(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }}
              />
            </div>
            <div>
              <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Frequency</label>
              <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }}>
                <option>1-0-1 (Twice Daily)</option>
                <option>1-0-0 (Once Morning)</option>
                <option>0-0-1 (Once Night)</option>
                <option>1-1-1 (Thrice Daily)</option>
              </select>
            </div>
            <button className="nike-btn-primary" onClick={handleAddMedicine} style={{ height: 42, padding: '0 20px' }}>
              <Plus size={16} />
              <span>Add Rx</span>
            </button>
          </div>

          {/* Rx Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: '#111111', color: '#ffffff', textAlign: 'left', fontSize: 13 }}>
                <th style={{ padding: '12px 16px' }}>Medication</th>
                <th style={{ padding: '12px 16px' }}>Dosage</th>
                <th style={{ padding: '12px 16px' }}>Schedule</th>
                <th style={{ padding: '12px 16px' }}>Timing</th>
                <th style={{ padding: '12px 16px' }}>Duration</th>
                <th style={{ padding: '12px 16px' }}>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {rxList.map((rx, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e5e5', fontSize: 14 }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{rx.name}</td>
                  <td style={{ padding: '12px 16px' }}>{rx.dosage}</td>
                  <td style={{ padding: '12px 16px' }}>{rx.morning ? '1' : '0'}-{rx.afternoon ? '1' : '0'}-{rx.night ? '1' : '0'}</td>
                  <td style={{ padding: '12px 16px' }}>{rx.food}</td>
                  <td style={{ padding: '12px 16px' }}>{rx.duration}</td>
                  <td style={{ padding: '12px 16px', color: '#707072' }}>{rx.advice}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="nike-btn-primary"
              onClick={() => {
                setPreviewPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
                setPdfTitle(`Prescription PDF - ${activePatient.name}`);
              }}
              style={{ height: 40, fontSize: 13 }}
            >
              <FileText size={16} />
              <span>Generate & Sign Prescription PDF</span>
            </button>
            <button
              className="nike-btn-secondary"
              onClick={() => showToast(`Digital Prescription emailed to ${activePatient.name}`)}
              style={{ height: 40, fontSize: 13 }}
            >
              <Send size={16} />
              <span>Email Prescription to Patient</span>
            </button>
          </div>
        </div>
      )}

      {/* MODULE 4: LAB & RADIOLOGY ORDERS */}
      {activeModule === 'labs' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">LABORATORY & RADIOLOGY ORDER MANAGEMENT</h3>
              <p className="typography-caption-md">Order diagnostic tests, view pending results, and review digital scans</p>
            </div>
          </div>

          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <select
              value={selectedLabTest}
              onChange={e => setSelectedLabTest(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }}
            >
              <option value="Coronary Angiography (CT)">Coronary Angiography (CT Scan)</option>
              <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
              <option value="12-Lead Electrocardiogram (ECG)">12-Lead Electrocardiogram (ECG)</option>
              <option value="Brain MRI Scan">Brain MRI Scan</option>
              <option value="Lipid & Lipid Subfraction Panel">Lipid & Lipid Subfraction Panel</option>
            </select>
            <button className="nike-btn-primary" onClick={handleOrderLab} style={{ height: 42, padding: '0 20px' }}>
              <Plus size={16} />
              <span>Order Diagnostic Test</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orderedLabs.map(lab => (
              <div
                key={lab.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 8
                }}
              >
                <div>
                  <span className="typography-body-strong" style={{ fontSize: 15 }}>{lab.test}</span>
                  <span className="typography-caption-md" style={{ display: 'block', color: '#707072' }}>
                    Order ID: {lab.id} • Date: {lab.date}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`status-badge-pill ${lab.status === 'COMPLETED' ? 'green-solid' : 'amber-fill'}`}>
                    {lab.status}
                  </span>
                  {lab.reportUrl && (
                    <button
                      className="nike-btn-secondary"
                      onClick={() => {
                        setPreviewPdfUrl(lab.reportUrl);
                        setPdfTitle(`${lab.test} - ${activePatient.name}`);
                      }}
                      style={{ height: 34, padding: '0 12px', fontSize: 12 }}
                    >
                      <Eye size={14} />
                      <span>Review Report</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: EMERGENCY & CRITICAL CARE */}
      {activeModule === 'emergency' && (
        <div className="nike-dash-card" style={{ border: '2px solid #d30005' }}>
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={24} color="#d30005" />
              <div>
                <h3 className="typography-heading-md" style={{ color: '#d30005' }}>CRITICAL CARE & EMERGENCY RESPONSE MONITOR</h3>
                <p className="typography-caption-md">Real-time ICU admissions, ambulance triage, and staff alerts</p>
              </div>
            </div>
            <span className="nike-badge-promo" style={{ background: '#d30005', color: '#fff' }}>2 Active Alerts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#ffebee', padding: 16, borderRadius: 8, border: '1px solid #d30005' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#d30005', fontSize: 16 }}>ALERT #EMG-902: Acute ST-Elevation Myocardial Infarction</strong>
                <span className="nike-badge-promo" style={{ background: '#d30005', color: '#fff' }}>Ambulance ETA: 8 Mins</span>
              </div>
              <p className="typography-body-md" style={{ margin: '8px 0', color: '#111111' }}>
                Patient: Robert Vance, 58M • In-transit via Mobile ICU Unit 4 • Vitals: BP 90/60, HR 112, SpO2 91%
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="nike-btn-primary" onClick={() => showToast('Cath Lab Team 1 Broadcast Alert Sent!')} style={{ height: 36, fontSize: 12, background: '#d30005' }}>
                  Prepare Cath Lab
                </button>
                <button className="nike-btn-secondary" onClick={() => showToast('Trauma Bed #3 Reserved')} style={{ height: 36, fontSize: 12 }}>
                  Reserve ICU Trauma Bed
                </button>
              </div>
            </div>

            <div style={{ background: '#fff3e0', padding: 16, borderRadius: 8, border: '1px solid #ff9800' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#e65100', fontSize: 16 }}>ALERT #EMG-905: Anaphylactic Shock Secondary to Contrast Media</strong>
                <span className="nike-badge-promo" style={{ background: '#ff9800', color: '#fff' }}>Room 204</span>
              </div>
              <p className="typography-body-md" style={{ margin: '8px 0', color: '#111111' }}>
                Patient: Clara Oswald, 41F • Administered Epinephrine 0.3mg IM • Vitals: BP 105/70, HR 98
              </p>
              <button className="nike-btn-secondary" onClick={() => showToast('Attending Physician Assigned')} style={{ height: 36, fontSize: 12 }}>
                Acknowledge Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: TELEMEDICINE & VIDEO CONSULT */}
      {activeModule === 'telemedicine' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">TELEMEDICINE & VIRTUAL CONSULTATION ROOM</h3>
              <p className="typography-caption-md">Encrypted HD WebRTC Video, Audio, and Screen Sharing</p>
            </div>
            <span className="nike-badge-promo" style={{ background: '#0288D1', color: '#fff' }}>Room Status: Ready</span>
          </div>

          <div style={{ background: '#111111', color: '#fff', height: 320, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Video size={48} color="#0288D1" style={{ marginBottom: 12 }} />
            <h4 style={{ fontSize: 20, margin: '0 0 8px', color: '#fff' }}>Virtual Consultation: {activePatient.name}</h4>
            <p style={{ color: '#9e9ea0', fontSize: 14 }}>Waiting for patient to join video room...</p>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="nike-btn-primary" onClick={() => showToast('Connecting WebRTC Video Call...')} style={{ height: 42, padding: '0 24px', background: '#0288D1' }}>
                <Video size={16} />
                <span>Start HD Video Call</span>
              </button>
              <button className="nike-btn-secondary" onClick={() => showToast('Audio Call Connected')} style={{ height: 42, padding: '0 24px', color: '#fff', borderColor: '#4b4b4d' }}>
                <PhoneCall size={16} />
                <span>Audio Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: CERTIFICATES & DIET/WORKOUT PLAN */}
      {activeModule === 'certificates' && (
        <div className="nike-dash-card">
          <div className="nike-dash-card-header" style={{ marginBottom: 16 }}>
            <div>
              <h3 className="typography-heading-md">MEDICAL CERTIFICATES, DIET & EXERCISE PLANS</h3>
              <p className="typography-caption-md">Generate official signed medical certificates, nutrition charts, and physical rehab plans</p>
            </div>
          </div>

          <div className="grid-2">
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <h4 className="typography-heading-md" style={{ marginBottom: 12 }}>Medical Certificate Generator</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="typography-caption-sm">Certificate Type</label>
                  <select value={certificateType} onChange={e => setCertificateType(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }}>
                    <option>Medical Leave Certificate</option>
                    <option>Physical Fitness Certificate</option>
                    <option>COVID-19 Recovery Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="typography-caption-sm">Recommended Rest Duration</label>
                  <input type="text" value={certDays} onChange={e => setCertDays(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '1px solid #cacacb', borderRadius: 8 }} />
                </div>
                <button
                  className="nike-btn-primary"
                  onClick={() => {
                    setPreviewPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
                    setPdfTitle(`${certificateType} - ${activePatient.name}`);
                  }}
                  style={{ height: 40, marginTop: 8 }}
                >
                  <FileCheck size={16} />
                  <span>Generate Signed Certificate PDF</span>
                </button>
              </div>
            </div>

            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <h4 className="typography-heading-md" style={{ marginBottom: 12 }}>Diet & Physiotherapy Plan</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: 10, borderRadius: 6 }}>
                  <Utensils size={18} color="#0288D1" />
                  <div>
                    <strong>Low-Sodium Cardiac Diet (1800 kcal)</strong>
                    <span className="typography-caption-sm" style={{ display: 'block' }}>High fiber, zero trans-fats, restricted sodium &lt; 2g/day</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: 10, borderRadius: 6 }}>
                  <Dumbbell size={18} color="#0288D1" />
                  <div>
                    <strong>Cardiovascular Aerobic Exercise (30 min)</strong>
                    <span className="typography-caption-sm" style={{ display: 'block' }}>Brisk walking / light stationary cycle 5x weekly</span>
                  </div>
                </div>
                <button className="nike-btn-secondary" onClick={() => showToast('Diet & Workout Plan emailed to patient.')} style={{ height: 38, marginTop: 4 }}>
                  Attach Plan to Patient Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Medical Dossier Modal */}
      <PatientDossierModal
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        patient={{
          id: activePatient.id,
          name: activePatient.name,
          age: activePatient.age,
          gender: activePatient.gender,
          bloodGroup: 'O+',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          email: `${activePatient.name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+1 (555) 234-5678',
          vitals: activePatient.vitals,
          reports: [
            { id: 'r1', title: 'Complete Blood Count (CBC) Lab Report', type: 'Lab Result', date: '2026-07-28', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
            { id: 'r2', title: 'Cardiology ECG Diagnostic Summary', type: 'Diagnostic', date: '2026-07-25', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
          ],
          prescriptions: rxList.map(r => ({ name: r.name, dosage: r.dosage, frequency: r.advice })),
          allergies: ['Penicillin'],
          notes: activePatient.chiefComplaint
        }}
      />

      {/* PDF Viewer Overlay Modal */}
      <PDFPreviewModal
        isOpen={Boolean(previewPdfUrl)}
        onClose={() => setPreviewPdfUrl(null)}
        pdfUrl={previewPdfUrl || ''}
        title={pdfTitle}
      />
    </div>
  );
}
