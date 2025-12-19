import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import AdminApp from './admin pages/AdminApp';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent({ language, toggleLanguage }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Helmet>
        <title>मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत - नैसर्गिक सौंदर्य आणि समृद्ध वारसा यांचे केंद्र" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {!isAdminRoute && <Navbar language={language} toggleLanguage={toggleLanguage} />}
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/about" element={<AboutPage language={language} />} />
          <Route path="/services" element={<ServicesPage language={language} />} />
          <Route path="/events" element={<EventsPage language={language} />} />
          <Route path="/contact" element={<ContactPage language={language} />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
        {!isAdminRoute && <Footer language={language} />}
        <Toaster />
      </div>
    </>
  );
}

export default App;