import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import TeamManagement from './TeamManagement';
import { useAuth } from '../contexts/AuthContext';
// Import other management components as needed

const AdminApp = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [language, setLanguage] = useState('mr'); // Default to Marathi
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render current page based on selection
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard language={language} setCurrentPage={setCurrentPage} />;
      case 'team':
        return <TeamManagement language={language} />;
      // Add other pages here:
      // case 'news':
      //   return <NewsManagement language={language} />;
      // case 'events':
      //   return <EventsManagement language={language} />;
      // case 'services':
      //   return <ServicesManagement language={language} />;
      // case 'contacts':
      //   return <ContactsManagement language={language} />;
      // case 'gallery':
      //   return <GalleryManagement language={language} />;
      // case 'settings':
      //   return <SettingsManagement language={language} />;
      default:
        return <Dashboard language={language} setCurrentPage={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      language={language}
      setLanguage={setLanguage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;
