export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  experienceYears: number;
  rate: string;
  rating: number;
  reviewsCount: number;
  img: string;
  badge: string;
  hospital: string;
}

export const MOCK_50_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    degree: 'MBBS, MD, FACC',
    experienceYears: 14,
    rate: '₹1,200',
    rating: 4.9,
    reviewsCount: 210,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    badge: 'Verified Specialist',
    hospital: 'Apollo Heart Institute'
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    specialty: 'Neurology',
    degree: 'MD, PhD (Neuro)',
    experienceYears: 18,
    rate: '₹1,500',
    rating: 4.9,
    reviewsCount: 185,
    img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    badge: 'Top Rated',
    hospital: 'Max Super Specialty Hospital'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    specialty: 'Orthopedics',
    degree: 'MS, M.Ch (Ortho)',
    experienceYears: 12,
    rate: '₹1,350',
    rating: 4.8,
    reviewsCount: 160,
    img: 'https://images.unsplash.com/photo-1594824813566-7885a3961cdc?auto=format&fit=crop&w=400&q=80',
    badge: 'Instant Consult',
    hospital: 'Fortis Bone & Joint Center'
  },
  {
    id: 'doc-4',
    name: 'Dr. David Chen',
    specialty: 'Pediatrics',
    degree: 'MD (Pediatrics), DCH',
    experienceYears: 10,
    rate: '₹950',
    rating: 4.9,
    reviewsCount: 240,
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    badge: 'Available Today',
    hospital: 'Rainbow Children\'s Hospital'
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatology',
    degree: 'MBBS, MD (Derm)',
    experienceYears: 9,
    rate: '₹1,100',
    rating: 4.9,
    reviewsCount: 190,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    badge: 'Skin Expert',
    hospital: 'Kaya Skin Clinic & Hospital'
  },
  {
    id: 'doc-6',
    name: 'Dr. Robert Taylor',
    specialty: 'Oncology',
    degree: 'MD, DM (Oncology)',
    experienceYears: 22,
    rate: '₹1,800',
    rating: 5.0,
    reviewsCount: 310,
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
    badge: 'Senior Consultant',
    hospital: 'Tata Memorial Cancer Center'
  },
  {
    id: 'doc-7',
    name: 'Dr. Aisha Patel',
    specialty: 'Psychiatry',
    degree: 'MD, DPM (Psychiatry)',
    experienceYears: 11,
    rate: '₹1,300',
    rating: 4.8,
    reviewsCount: 145,
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
    badge: 'Mind Wellness Lead',
    hospital: 'NIMHANS Allied Neuro Center'
  },
  {
    id: 'doc-8',
    name: 'Dr. Vikramaditya Verma',
    specialty: 'Gastroenterology',
    degree: 'MBBS, DM (Gastro)',
    experienceYears: 15,
    rate: '₹1,400',
    rating: 4.9,
    reviewsCount: 220,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    badge: 'Liver Specialist',
    hospital: 'Medanta Medicity Hospital'
  },
  {
    id: 'doc-9',
    name: 'Dr. Ananya Roy',
    specialty: 'Endocrinology',
    degree: 'MD, DM (Endo)',
    experienceYears: 13,
    rate: '₹1,250',
    rating: 4.9,
    reviewsCount: 175,
    img: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=400&q=80',
    badge: 'Diabetes Care',
    hospital: 'Manipal Diabetes Institute'
  },
  {
    id: 'doc-10',
    name: 'Dr. Kabir Nair',
    specialty: 'Ophthalmology',
    degree: 'MS (Ophthal), FRCS',
    experienceYears: 16,
    rate: '₹1,000',
    rating: 4.8,
    reviewsCount: 195,
    img: 'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&w=400&q=80',
    badge: 'Laser Eye Expert',
    hospital: 'Sankara Nethralaya'
  },
  {
    id: 'doc-11',
    name: 'Dr. Meera Nambiar',
    specialty: 'Pulmonology',
    degree: 'MD, FCCP (Chest)',
    experienceYears: 14,
    rate: '₹1,200',
    rating: 4.9,
    reviewsCount: 130,
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80',
    badge: 'Lung Specialist',
    hospital: 'Chest & Asthma Care Hospital'
  },
  {
    id: 'doc-12',
    name: 'Dr. Logan Mitchell',
    specialty: 'Emergency Medicine',
    degree: 'MD, EDIC (Critical Care)',
    experienceYears: 14,
    rate: '₹1,500',
    rating: 4.9,
    reviewsCount: 190,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    badge: 'ICU Director',
    hospital: 'Critical Care Trauma Center'
  },
  {
    id: 'doc-13',
    name: 'Dr. Zoe Martinez',
    specialty: 'Rheumatology',
    degree: 'MD, MPH (Arthritis)',
    experienceYears: 8,
    rate: '₹950',
    rating: 4.8,
    reviewsCount: 150,
    img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80',
    badge: 'Joint Care Specialist',
    hospital: 'Rheuma Care Center'
  },
  {
    id: 'doc-14',
    name: 'Dr. Christopher Cole',
    specialty: 'ENT',
    degree: 'MS (ENT), DORL',
    experienceYears: 12,
    rate: '₹1,300',
    rating: 4.9,
    reviewsCount: 140,
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    badge: 'Sinus Specialist',
    hospital: 'ENT & Head Neck Clinic'
  },
  {
    id: 'doc-15',
    name: 'Dr. Sunita Rao',
    specialty: 'Gynecology',
    degree: 'MD, DGO, FICOG',
    experienceYears: 17,
    rate: '₹1,400',
    rating: 4.9,
    reviewsCount: 280,
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    badge: 'Maternal Care',
    hospital: 'Cloudnine Women\'s Hospital'
  },
  {
    id: 'doc-16',
    name: 'Dr. Rajesh Sharma',
    specialty: 'Cardiology',
    degree: 'MBBS, MD, DM (Cardio)',
    experienceYears: 20,
    rate: '₹1,600',
    rating: 5.0,
    reviewsCount: 340,
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    badge: 'Chief Cardiologist',
    hospital: 'Escorts Heart Institute'
  }
];
