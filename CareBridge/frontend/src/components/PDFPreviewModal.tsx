import { X, Download, FileText, ExternalLink } from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  documentType?: string;
}

export default function PDFPreviewModal({ isOpen, onClose, title, fileUrl, documentType }: PDFPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300 }}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '900px',
          maxWidth: '95vw',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          background: 'var(--canvas)'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--hairline-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--soft-cloud)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="stat-icon-circle blue" style={{ width: 36, height: 36 }}>
              <FileText size={18} />
            </div>
            <div>
              <h3 className="typography-body-strong" style={{ fontSize: 16 }}>{title}</h3>
              {documentType && <span className="nike-badge-promo" style={{ marginLeft: 0, marginTop: 2 }}>{documentType}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={fileUrl}
              download
              className="nike-btn-secondary"
              style={{ height: 36, padding: '0 14px', fontSize: 13 }}
            >
              <Download size={14} />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink)',
                cursor: 'pointer',
                padding: 6,
                borderRadius: '50%'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* PDF Embedded View Container */}
        <div style={{ flex: 1, background: '#525659', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
          <iframe
            src={`${fileUrl}#toolbar=0`}
            title={title}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
