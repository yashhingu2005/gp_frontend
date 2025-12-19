import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Lock, Globe, Bell, Database, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const SettingsManagement = ({ language }) => {
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const content = {
    mr: {
      title: 'सेटिंग्ज',
      profile: 'प्रोफाइल',
      security: 'सुरक्षा',
      preferences: 'प्राधान्ये',
      notifications: 'सूचना',
      database: 'डेटाबेस',
      username: 'वापरकर्ता नाव',
      email: 'ईमेल',
      currentPassword: 'सध्याचा पासवर्ड',
      newPassword: 'नवीन पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टी करा',
      changePassword: 'पासवर्ड बदला',
      language: 'भाषा',
      marathi: 'मराठी',
      english: 'इंग्रजी',
      emailNotifications: 'ईमेल सूचना',
      newContactSubmissions: 'नवीन संपर्क सबमिशन',
      newNewsPublished: 'नवीन बातम्या प्रकाशित',
      exportData: 'डेटा निर्यात करा',
      exportAllData: 'सर्व डेटा CSV मध्ये निर्यात करा',
      exportButton: 'निर्यात करा',
      clearCache: 'कॅशे साफ करा',
      clearCacheDesc: 'ब्राउझर कॅशे साफ करा',
      clearButton: 'साफ करा',
      save: 'जतन करा',
      saving: 'जतन करत आहे...',
      success: 'सेटिंग्ज यशस्वीरित्या अद्यतनित केल्या',
      error: 'त्रुटी',
      passwordMismatch: 'पासवर्ड जुळत नाहीत',
      passwordChanged: 'पासवर्ड यशस्वीरित्या बदलला'
    },
    en: {
      title: 'Settings',
      profile: 'Profile',
      security: 'Security',
      preferences: 'Preferences',
      notifications: 'Notifications',
      database: 'Database',
      username: 'Username',
      email: 'Email',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      changePassword: 'Change Password',
      language: 'Language',
      marathi: 'Marathi',
      english: 'English',
      emailNotifications: 'Email Notifications',
      newContactSubmissions: 'New contact submissions',
      newNewsPublished: 'New news published',
      exportData: 'Export Data',
      exportAllData: 'Export all data to CSV',
      exportButton: 'Export',
      clearCache: 'Clear Cache',
      clearCacheDesc: 'Clear browser cache',
      clearButton: 'Clear',
      save: 'Save Changes',
      saving: 'Saving...',
      success: 'Settings updated successfully',
      error: 'Error',
      passwordMismatch: 'Passwords do not match',
      passwordChanged: 'Password changed successfully'
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('username, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfileData(prev => ({
        ...prev,
        username: data?.username || '',
        email: data?.email || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (profileData.new_password !== profileData.confirm_password) {
      alert(currentContent.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: profileData.new_password
      });

      if (error) throw error;

      alert(currentContent.passwordChanged);
      setProfileData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      alert(currentContent.error + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Export all data from different tables
      const tables = ['news_announcements', 'events', 'team_members', 'services', 'gallery', 'contact_submissions'];
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*');

        if (error) throw error;

        // Convert to CSV
        if (data && data.length > 0) {
          const csv = convertToCSV(data);
          downloadCSV(csv, `${table}_${new Date().toISOString().split('T')[0]}.csv`);
        }
      }

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          JSON.stringify(row[header] || '')
        ).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClearCache = () => {
    // Clear localStorage
    const keysToKeep = ['admin_token', 'supabase.auth.token'];
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();

    alert('Cache cleared successfully!');
  };

  const tabs = [
    { id: 'profile', name: currentContent.profile, icon: User },
    { id: 'security', name: currentContent.security, icon: Lock },
    { id: 'preferences', name: currentContent.preferences, icon: Globe },
    { id: 'notifications', name: currentContent.notifications, icon: Bell },
    { id: 'database', name: currentContent.database, icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{currentContent.title}</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{currentContent.profile}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.username}
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.email}
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{currentContent.changePassword}</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.currentPassword}
                    </label>
                    <input
                      type="password"
                      value={profileData.current_password}
                      onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.newPassword}
                    </label>
                    <input
                      type="password"
                      value={profileData.new_password}
                      onChange={(e) => setProfileData({ ...profileData, new_password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.confirmPassword}
                    </label>
                    <input
                      type="password"
                      value={profileData.confirm_password}
                      onChange={(e) => setProfileData({ ...profileData, confirm_password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                  >
                    <Save size={20} className="mr-2" />
                    {loading ? currentContent.saving : currentContent.changePassword}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{currentContent.preferences}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.language}
                    </label>
                    <select
                      value={language}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                    >
                      <option value="mr">{currentContent.marathi}</option>
                      <option value="en">{currentContent.english}</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Use the language toggle in the header to change language</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{currentContent.emailNotifications}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{currentContent.newContactSubmissions}</p>
                      <p className="text-sm text-gray-600">Get notified when someone submits the contact form</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{currentContent.newNewsPublished}</p>
                      <p className="text-sm text-gray-600">Get notified when new news is published</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Note: Notification functionality is currently in development
                </p>
              </div>
            </motion.div>
          )}

          {/* Database Tab */}
          {activeTab === 'database' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="max-w-2xl space-y-6">
                {/* Export Data */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{currentContent.exportData}</h3>
                      <p className="text-sm text-gray-600">{currentContent.exportAllData}</p>
                    </div>
                    <Database size={32} className="text-blue-600" />
                  </div>
                  <Button
                    onClick={handleExportData}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save size={18} className="mr-2" />
                    {currentContent.exportButton}
                  </Button>
                </div>

                {/* Clear Cache */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{currentContent.clearCache}</h3>
                      <p className="text-sm text-gray-600">{currentContent.clearCacheDesc}</p>
                    </div>
                    <Trash2 size={32} className="text-orange-600" />
                  </div>
                  <Button
                    onClick={handleClearCache}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Trash2 size={18} className="mr-2" />
                    {currentContent.clearButton}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;