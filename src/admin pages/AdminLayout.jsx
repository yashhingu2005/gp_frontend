import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Newspaper, Calendar, FileText, 
  MessageSquare, Image, Settings, LogOut, Menu, X,
  ChevronRight, Bell, Search
} from 'lucide-react';

const AdminLayout = ({ children, user, onLogout, language, setLanguage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const content = {
    mr: {
      dashboard: 'डॅशबोर्ड',
      teamMembers: 'संघ सदस्य',
      news: 'बातम्या',
      events: 'कार्यक्रम',
      services: 'सेवा',
      contacts: 'संपर्क',
      gallery: 'दालन',
      settings: 'सेटिंग्ज',
      logout: 'बाहेर पडा',
      welcome: 'स्वागत आहे',
      searchPlaceholder: 'शोधा...'
    },
    en: {
      dashboard: 'Dashboard',
      teamMembers: 'Team Members',
      news: 'News',
      events: 'Events',
      services: 'Services',
      contacts: 'Contacts',
      gallery: 'Gallery',
      settings: 'Settings',
      logout: 'Logout',
      welcome: 'Welcome',
      searchPlaceholder: 'Search...'
    }
  };

  const currentContent = content[language];

  const menuItems = [
    { id: 'dashboard', label: currentContent.dashboard, icon: LayoutDashboard },
    { id: 'team', label: currentContent.teamMembers, icon: Users },
    { id: 'news', label: currentContent.news, icon: Newspaper },
    { id: 'events', label: currentContent.events, icon: Calendar },
    { id: 'services', label: currentContent.services, icon: FileText },
    { id: 'contacts', label: currentContent.contacts, icon: MessageSquare },
    { id: 'gallery', label: currentContent.gallery, icon: Image },
    { id: 'settings', label: currentContent.settings, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-teal-50/30">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-green-800 to-teal-900 text-white shadow-2xl z-50"
          >
            {/* Logo */}
            <div className="p-6 border-b border-green-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">मिठमुंबरी</h2>
                  <p className="text-sm text-green-200">ग्रामपंचायत</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-green-700/50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeMenu === item.id
                      ? 'bg-white text-green-800 shadow-lg'
                      : 'text-green-100 hover:bg-green-700/50'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {activeMenu === item.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* User info & logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700/50 bg-green-900/50">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center font-bold text-green-900">
                  {user?.full_name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{user?.full_name}</p>
                  <p className="text-xs text-green-200">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-200 hover:text-white"
              >
                <LogOut size={18} />
                <span className="font-medium">{currentContent.logout}</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-800">
                  {currentContent.welcome}, {user?.full_name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={currentContent.searchPlaceholder}
                  className="bg-transparent outline-none text-sm w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Language toggle */}
              <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    language === 'mr' 
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
