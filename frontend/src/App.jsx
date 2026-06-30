// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import Login from './components/login';
import Register from './components/register';
import DoctorHome from './components/DoctorHome';
import PatientHome from './components/PatientHome';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import ScrollToTopButton from './components/ScrollToTopButton';
import './i18n';

// Enhanced Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Add smooth scrolling
      });
    });
  }, [pathname]);

  return null;
}

function Home() {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  // If we navigated here with a target section, scroll to it
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  // Role-based rendering
  if (user) {
    if (user.role === 'doctor') {
      return <DoctorHome />;
    } else if (user.role === 'patient') {
      return <PatientHome />;
    }
  }

  return (
    <div className="min-h-screen">
      <main>
        <LandingPage />
        <HowItWorks />
        <AIAssistant />
      </main>
      <Footer />
    </div>
  );
}

const APP_SHELL_ROUTES = ['/doctor-home', '/patient-home', '/dashboard', '/ai-chat'];

function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = React.useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const sync = () => setLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return loggedIn;
}

function AppNavbar() {
  const { pathname } = useLocation();
  const isLoggedIn = useIsLoggedIn();

  // Dashboard pages (and "/" once a logged-in user is redirected into one) render their own
  // header/sidebar, so the marketing Navbar must not stack on top of it.
  const hasOwnChrome = APP_SHELL_ROUTES.includes(pathname) || (pathname === '/' && isLoggedIn);
  if (hasOwnChrome) return null;

  return <Navbar />;
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <ScrollToTop />
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor-home" element={<DoctorHome />} />
          <Route path="/patient-home" element={<PatientHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-chat" element={<AIChat />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ScrollToTopButton />
      </SettingsProvider>
    </Router>
  );
}

export default App;
