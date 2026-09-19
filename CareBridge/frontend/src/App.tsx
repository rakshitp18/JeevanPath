import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ServicesPage from './pages/ServicesPage';
import GlobalNetworkPage from './pages/GlobalNetworkPage';
import DoctorsPage from './pages/DoctorsPage';
import ReviewsPage from './pages/ReviewsPage';
import FaqPage from './pages/FaqPage';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Documents from './pages/Documents';
import UploadDocument from './pages/UploadDocument';
import AiScannerPage from './pages/AiScannerPage';
import EmergencyAccess from './pages/EmergencyAccess';
import PublicEmergencyProfile from './pages/PublicEmergencyProfile';
import HealthAnalytics from './pages/HealthAnalytics';
import DoctorAvailability from './pages/DoctorAvailability';
import VideosPage from './pages/VideosPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/global-network" element={<GlobalNetworkPage />} />
        <Route path="/global-presence" element={<GlobalNetworkPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/public/emergency/:token" element={<PublicEmergencyProfile />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/upload" element={<UploadDocument />} />
          <Route path="/rx-scanner" element={<AiScannerPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/emergency-access" element={<EmergencyAccess />} />
          <Route path="/health-analytics" element={<HealthAnalytics />} />
          <Route path="/availability" element={<DoctorAvailability />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
