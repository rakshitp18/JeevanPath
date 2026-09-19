import React from 'react';
import { ShieldCheck, Cpu, FileText, Video, Award, Building, Bell, BookOpen, CheckCircle } from 'lucide-react';

export const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    title: '24×7 Emergency SOS',
    desc: 'Instant GPS dispatch and priority ambulance routing with live vital stream to ER doctors.'
  },
  {
    icon: Cpu,
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    title: 'AI Healthcare Diagnostics',
    desc: 'Powered by Groq AI Llama 3.3 for sub-second lab report parsing and preliminary triage.'
  },
  {
    icon: FileText,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    title: 'Encrypted Digital Records',
    desc: 'AES-256 encrypted lifetime EHR vault accessible instantly via cryptographic QR code.'
  },
  {
    icon: Video,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    title: 'Global Telemedicine',
    desc: 'HD video consultation with senior consultants in 15+ countries anytime, anywhere.'
  },
  {
    icon: Award,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    title: 'Certified Specialist Doctors',
    desc: 'Every doctor undergoes 3-tier license verification and international board compliance.'
  },
  {
    icon: Building,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    title: 'Govt Scheme & Insurance Support',
    desc: 'Seamless claims processing with Ayushman Bharat, CGHS, and 50+ global insurance providers.'
  },
  {
    icon: Bell,
    color: 'text-teal-600 bg-teal-50 border-teal-200',
    title: 'Smart Medicine Reminders',
    desc: 'Automated dosage alerts, refill tracking, and direct e-pharmacy delivery integration.'
  },
  {
    icon: BookOpen,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    title: 'Health Learning & Insights',
    desc: 'Curated wellness modules, preventative health risk scores, and personalized dietary guides.'
  }
];

export default function FeatureTrust() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>CLINICAL EXCELLENCE & TRUST</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Patients Trust Us
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Combining cutting-edge medical artificial intelligence with compassionate multi-specialty clinical care.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
