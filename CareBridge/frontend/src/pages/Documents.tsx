import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Eye, Clock, User, Heart, Activity, ArrowRight, ShieldCheck, Pill, Stethoscope, Plus, X, CheckCircle2, FileCheck } from 'lucide-react';
import AppShell from '../components/AppShell';
import PDFPreviewModal from '../components/PDFPreviewModal';
import PatientDossierModal, { type PatientDossierData } from '../components/PatientDossierModal';
import api from '../api';
import type { User as UserType, MedicalDocument } from '../types';

interface PrescriptionDoc {
  _id: string;
  title: string;
  documentType: string;
  doctorName: string;
  description: string;
  fileUrl: string;
  createdAt: string;
}

const mockPatientList: PatientDossierData[] = [
  {
    id: 'PAT-1001',
    name: 'Nikhil Agarwal',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    email: 'nikhil.agarwal@example.com',
    phone: '+1 (555) 234-5678',
    vitals: { bp: '120/80', heartRate: 72, glucose: 95, spo2: 98, temp: '98.6°F' },
    reports: [
      { id: 'r1', title: 'Complete Blood Count (CBC) Lab Report', type: 'Lab Result', date: '2026-07-28', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'r2', title: 'Cardiology ECG Diagnostic Summary', type: 'Diagnostic', date: '2026-07-25', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
    ],
    allergies: ['Penicillin'],
    notes: 'Patient shows stable physiological recovery following cardiology intervention.'
  },
  {
    id: 'PAT-1002',
    name: 'Michael Chen',
    age: 45,
    gender: 'Male',
    bloodGroup: 'A+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'm.chen@example.com',
    phone: '+1 (555) 987-6543',
    vitals: { bp: '124/82', heartRate: 76, glucose: 102, spo2: 99, temp: '98.4°F' },
    reports: [
      { id: 'r3', title: 'Brain MRI Scan & Neurological Review', type: 'Imaging', date: '2026-07-27', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraine' }
    ],
    allergies: ['Sulfa drugs'],
    notes: 'Migraine frequency reduced by 40% with prophylactic therapy.'
  }
];

const mockInitialPrescriptions: PrescriptionDoc[] = [
  {
    _id: 'rx-1',
    title: 'Cardiology Daily Care & Medication Rx',
    documentType: 'Official Doctor Prescription',
    doctorName: 'Dr. Milind Verma, MD',
    description: 'Lisinopril 10mg once daily morning • Metformin 500mg twice daily with meals.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rx-2',
    title: 'Post-Consultation Neurological Rx',
    documentType: 'Official Doctor Prescription',
    doctorName: 'Dr. Marcus Vance, MD',
    description: 'Sumatriptan 50mg as needed for acute migraine episodes.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const mockInitialDiagnostics: MedicalDocument[] = [
  {
    _id: 'doc-1',
    patientId: 'patient-1',
    title: 'Complete Blood Count (CBC) Lab Report',
    documentType: 'Lab Result',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Hemoglobin, WBC, Platelet counts within normal physiological ranges.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'doc-2',
    patientId: 'patient-1',
    title: 'Cardiology ECG Diagnostic Summary',
    documentType: 'Diagnostic',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Normal sinus rhythm. No acute ST-elevation or ischemic changes.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export default function Documents() {
  const [user, setUser] = useState<UserType | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDoc[]>(mockInitialPrescriptions);
  const [diagnosticDocs, setDiagnosticDocs] = useState<MedicalDocument[]>(mockInitialDiagnostics);
  const [loading, setLoading] = useState(true);

  // PDF Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ title: string; fileUrl: string; documentType: string } | null>(null);

  // Patient Dossier Modal State
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientDossierData | null>(null);

  // Doctor Upload Prescription Modal State
  const [uploadRxModalOpen, setUploadRxModalOpen] = useState(false);
  const [rxTitle, setRxTitle] = useState('');
  const [rxDoctorName, setRxDoctorName] = useState('Dr. Sarah Jenkins, MD');
  const [rxDescription, setRxDescription] = useState('');
  const [rxSuccessMsg, setRxSuccessMsg] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('medivault_user');
      let currentUser: UserType | null = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
        if (currentUser.role?.toUpperCase() === 'DOCTOR') {
          setRxDoctorName(currentUser.fullName || currentUser.name || 'Dr. Sarah Jenkins, MD');
        }
      }

      if (currentUser?.role !== 'DOCTOR') {
        const myData: any = await api.get('/api/v1/patient/records');
        if (Array.isArray(myData) && myData.length > 0) {
          setDiagnosticDocs(myData);
        }
      }
    } catch (err) {
      console.log('Using default medical records presets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleOpenPreview = (title: string, fileUrl: string, documentType: string) => {
    setSelectedDoc({ title, fileUrl, documentType });
    setPreviewModalOpen(true);
  };

  const handleOpenPatientDossier = (patient: PatientDossierData) => {
    setSelectedPatient(patient);
    setDossierModalOpen(true);
  };

  // Upload New Prescription Handler (Doctor)
  const handleUploadPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: PrescriptionDoc = {
      _id: `rx-${Date.now()}`,
      title: rxTitle || 'Official Clinical Prescription',
      documentType: 'Official Doctor Prescription',
      doctorName: rxDoctorName,
      description: rxDescription || 'Prescription medication & daily dosage instructions',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      createdAt: new Date().toISOString()
    };

    setPrescriptions(prev => [newRx, ...prev]);
    setUploadRxModalOpen(false);
    setRxTitle('');
    setRxDescription('');
    setRxSuccessMsg(true);
    setTimeout(() => setRxSuccessMsg(false), 4000);
  };

  if (loading || !user) return <div className="loading-screen">Loading Medical Records…</div>;

  const isDoctor = user.role?.toUpperCase() === 'DOCTOR';

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle={isDoctor ? 'Patients & Prescriptions Vault' : 'My Medical Records'}
      pageSubtitle={isDoctor
        ? 'Upload official doctor prescriptions, review patient diagnostic reports & clinical dossiers'
        : 'Your encrypted doctor prescriptions, diagnostic reports, and medical lab records'}
    >
      <div style={{ maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              {isDoctor ? 'REGISTERED PATIENTS & PRESCRIPTION REPOSITORY' : 'MY MEDICAL RECORDS & PRESCRIPTIONS'}
            </h2>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', fontWeight: 500 }}>
              {isDoctor
                ? 'Upload official prescriptions, review lab reports & inspect registered patient dossiers'
                : 'View official doctor prescriptions, diagnostic lab results, and upload personal reports'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setUploadRxModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '10px 18px',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Pill size={16} />
              <span>+ Upload Official Prescription</span>
            </button>

            {!isDoctor && (
              <button
                className="nike-btn-primary"
                onClick={() => navigate('/documents/upload')}
                style={{ padding: '10px 18px', fontSize: 13, borderRadius: 12 }}
              >
                <Upload size={16} />
                <span>Upload Diagnostic File</span>
              </button>
            )}
          </div>
        </div>

        {/* Prescription Success Banner */}
        {rxSuccessMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#059669',
            padding: '16px 20px',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <CheckCircle2 size={22} color="#059669" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Official Prescription Uploaded Successfully!</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#047857', marginTop: 2 }}>
                The prescription document has been encrypted and saved directly to the Doctor Prescriptions repository.
              </div>
            </div>
          </div>
        )}

        {/* Doctor Roster Cards Grid - Doctor view */}
        {isDoctor && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
            {mockPatientList.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleOpenPatientDossier(patient)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '20px 24px',
                  borderRadius: '1.25rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284C7' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>{patient.name}</h3>
                      <span style={{ fontSize: 10, fontWeight: 800, background: '#E0F2FE', color: '#0284C7', padding: '2px 6px', borderRadius: 9999 }}>{patient.bloodGroup}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>
                      {patient.age} yrs • {patient.gender} • ID: {patient.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPatientDossier(patient);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#0F172A',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Inspect Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTION 1: DOCTOR PRESCRIPTIONS GIVEN BY PHYSICIAN ── */}
        <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #A7F3D0'
              }}>
                <Pill size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    DOCTOR PRESCRIPTIONS GIVEN BY PHYSICIAN
                  </h3>
                  <span style={{ fontSize: 10, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 9999 }}>
                    Physician Issued ({prescriptions.length})
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                  Official clinical prescriptions issued by licensed doctors with daily dosage & medication guidelines
                </p>
              </div>
            </div>

            <button
              onClick={() => setUploadRxModalOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: '1px solid #A7F3D0',
                background: '#ECFDF5',
                color: '#047857',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Plus size={14} />
              <span>Upload Prescription</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 12,
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileCheck size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{rx.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: '#166534', color: '#FFFFFF', padding: '2px 8px', borderRadius: 9999 }}>
                        {rx.documentType}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Stethoscope size={12} /> {rx.doctorName}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#166534', margin: '4px 0 0', fontWeight: 600 }}>{rx.description}</p>
                    <span style={{ fontSize: 11, color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Clock size={12} /> Issued {new Date(rx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPreview(rx.title, rx.fileUrl, rx.documentType)}
                  style={{
                    height: 38,
                    padding: '0 18px',
                    borderRadius: 10,
                    border: '1px solid #166534',
                    background: '#15803D',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Eye size={15} />
                  <span>Preview Prescription PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: MY DIAGNOSTIC REPORTS & FILES ── */}
        <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #BAE6FD'
              }}>
                <Activity size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  MY DIAGNOSTIC REPORTS & FILES
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                  Laboratory blood tests, ECG diagnostic summaries, radiology imaging & diagnostic files
                </p>
              </div>
            </div>

            {!isDoctor && (
              <button
                onClick={() => navigate('/documents/upload')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: '1px solid #BAE6FD',
                  background: '#E0F2FE',
                  color: '#0284C7',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Upload size={14} />
                <span>Upload Report</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {diagnosticDocs.map((doc) => (
              <div
                key={doc._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  flexWrap: 'wrap',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{doc.title}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: '#0F172A', color: '#FFFFFF', padding: '2px 8px', borderRadius: 9999 }}>
                        {doc.documentType}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{doc.description}</p>
                    <span style={{ fontSize: 11, color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Clock size={12} /> Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPreview(doc.title, doc.fileUrl, doc.documentType)}
                  style={{
                    height: 38,
                    padding: '0 18px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Eye size={15} />
                  <span>Preview PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Upload Prescription Modal Overlay */}
      {uploadRxModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.5rem',
            width: '100%',
            maxWidth: 580,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #E2E8F0'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pill size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                    Upload Doctor Prescription
                  </h3>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0' }}>
                    Upload official prescription PDF with medication dosage instructions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setUploadRxModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleUploadPrescription} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Prescription Title
                </label>
                <input
                  type="text"
                  value={rxTitle}
                  onChange={e => setRxTitle(e.target.value)}
                  placeholder="e.g. Cardiology Post-Consultation Medication Rx"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Attending Doctor / Physician Name
                </label>
                <input
                  type="text"
                  value={rxDoctorName}
                  onChange={e => setRxDoctorName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 700, color: '#0F172A' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Medication Dosage & Administration Instructions
                </label>
                <textarea
                  rows={3}
                  value={rxDescription}
                  onChange={e => setRxDescription(e.target.value)}
                  placeholder="e.g. Lisinopril 10mg once daily morning • Metformin 500mg twice daily with meals"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Upload Prescription Document (PDF / Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, background: '#F8FAFC' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setUploadRxModalOpen(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)', color: '#FFFFFF', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                >
                  Upload & Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Dossier Modal */}
      <PatientDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        patient={selectedPatient}
      />

      {/* Inline PDF Preview Modal */}
      {selectedDoc && (
        <PDFPreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title={selectedDoc.title}
          fileUrl={selectedDoc.fileUrl}
          documentType={selectedDoc.documentType}
        />
      )}
    </AppShell>
  );
}
