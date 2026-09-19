import { useState } from 'react';
import {
  X, User, Heart, Activity, Droplet, Thermometer, Eye,
  FileText, Clock, ShieldCheck, Pill, ChevronRight, Download
} from 'lucide-react';
import PDFPreviewModal from './PDFPreviewModal';

export interface PatientDossierData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  avatar: string;
  email: string;
  phone: string;
  vitals: {
    bp: string;
    heartRate: number;
    glucose: number;
    spo2: number;
    temp: string;
  };
  reports: {
    id: string;
    title: string;
    type: string;
    date: string;
    fileUrl: string;
  }[];
  prescriptions: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  allergies: string[];
  notes: string;
}

interface PatientDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientDossierData | null;
}

export default function PatientDossierModal({ isOpen, onClose, patient }: PatientDossierModalProps) {
  const [previewPdf, setPreviewPdf] = useState<{ title: string; fileUrl: string; type: string } | null>(null);

  if (!isOpen || !patient) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 250 }}>
        <div
          className="modal-box"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '920px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 0,
            borderRadius: '16px',
            background: 'var(--canvas)'
          }}
        >
          {/* Header Area */}
          <div
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid var(--hairline-soft)',
              background: 'var(--soft-cloud)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <img
                src={patient.avatar}
                alt={patient.name}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--ink)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 className="typography-heading-lg" style={{ fontSize: 24 }}>{patient.name}</h2>
                  <span className="nike-badge-promo" style={{ marginLeft: 0 }}>Patient ID #{patient.id}</span>
                </div>
                <p className="typography-caption-md" style={{ marginTop: 2 }}>
                  {patient.age} yrs • {patient.gender} • Blood Group: <strong>{patient.bloodGroup}</strong>
                </p>
                <span className="typography-utility-xs" style={{ display: 'block', marginTop: 2 }}>
                  {patient.email} • {patient.phone}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'var(--canvas)',
                border: '1px solid var(--hairline)',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Dossier Content Grid */}
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* 1. Live Vitals Snapshot Grid */}
            <div>
              <h3 className="typography-heading-md" style={{ marginBottom: 12 }}>LIVE PATIENT VITALS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div style={{ padding: 14, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                  <span className="typography-caption-sm" style={{ color: 'var(--mute)' }}>Blood Pressure</span>
                  <div className="typography-body-strong" style={{ fontSize: 20, marginTop: 4 }}>{patient.vitals.bp}</div>
                  <span className="nike-badge-promo" style={{ marginLeft: 0, marginTop: 6, background: '#ECFDF5', color: '#059669' }}>Optimal</span>
                </div>

                <div style={{ padding: 14, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                  <span className="typography-caption-sm" style={{ color: 'var(--mute)' }}>Heart Rate</span>
                  <div className="typography-body-strong" style={{ fontSize: 20, marginTop: 4 }}>{patient.vitals.heartRate} <span style={{ fontSize: 13, color: 'var(--mute)' }}>bpm</span></div>
                  <span className="nike-badge-promo" style={{ marginLeft: 0, marginTop: 6, background: '#ECFDF5', color: '#059669' }}>Normal</span>
                </div>

                <div style={{ padding: 14, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                  <span className="typography-caption-sm" style={{ color: 'var(--mute)' }}>Fasting Glucose</span>
                  <div className="typography-body-strong" style={{ fontSize: 20, marginTop: 4 }}>{patient.vitals.glucose} <span style={{ fontSize: 13, color: 'var(--mute)' }}>mg/dL</span></div>
                  <span className="nike-badge-promo" style={{ marginLeft: 0, marginTop: 6, background: '#ECFDF5', color: '#059669' }}>Normal</span>
                </div>

                <div style={{ padding: 14, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                  <span className="typography-caption-sm" style={{ color: 'var(--mute)' }}>Oxygen (SpO2)</span>
                  <div className="typography-body-strong" style={{ fontSize: 20, marginTop: 4 }}>{patient.vitals.spo2}%</div>
                  <span className="nike-badge-promo" style={{ marginLeft: 0, marginTop: 6, background: '#ECFDF5', color: '#059669' }}>Normal</span>
                </div>
              </div>
            </div>

            {/* 2. Diagnostic Reports & PDF Records */}
            <div>
              <h3 className="typography-heading-md" style={{ marginBottom: 12 }}>MEDICAL REPORTS & DIAGNOSTIC FILES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {patient.reports.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: 'var(--soft-cloud)',
                      border: '1px solid var(--hairline-soft)',
                      borderRadius: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="stat-icon-circle blue" style={{ width: 38, height: 38 }}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="typography-body-strong">{report.title}</span>
                          <span className="nike-badge-promo">{report.type}</span>
                        </div>
                        <span className="typography-utility-xs">Uploaded {report.date}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="nike-btn-secondary"
                      onClick={() => setPreviewPdf({ title: report.title, fileUrl: report.fileUrl, type: report.type })}
                      style={{ height: 36, padding: '0 16px', fontSize: 13 }}
                    >
                      <Eye size={14} />
                      <span>Preview PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Prescriptions & Doctor Notes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
              <div style={{ padding: 18, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                <h4 className="typography-body-strong" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Pill size={16} /> ACTIVE PRESCRIPTIONS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {patient.prescriptions.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <strong>{p.name}</strong>
                      <span className="typography-caption-md">{p.dosage} • {p.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: 18, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', borderRadius: 8 }}>
                <h4 className="typography-body-strong" style={{ marginBottom: 6 }}>CLINICAL NOTES</h4>
                <p className="typography-caption-md" style={{ color: 'var(--ink)' }}>{patient.notes}</p>
                <div style={{ marginTop: 10 }}>
                  <span className="typography-utility-xs" style={{ color: 'var(--sale)', fontWeight: 600 }}>
                    Allergies: {patient.allergies.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Overlay inside Dossier Modal */}
      {previewPdf && (
        <PDFPreviewModal
          isOpen={Boolean(previewPdf)}
          onClose={() => setPreviewPdf(null)}
          title={previewPdf.title}
          fileUrl={previewPdf.fileUrl}
          documentType={previewPdf.type}
        />
      )}
    </>
  );
}
