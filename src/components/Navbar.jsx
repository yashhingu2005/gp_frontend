import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const Navbar = ({ language, toggleLanguage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = {
    mr: [
      { label: 'मुख्य पान', path: '/' },
      { label: 'सूचना', path: '/notices' },
      { label: 'आमच्याविषयी', path: '/about' },
      { label: 'नागरीक सेवा', path: '/services' },
      { label: 'घडामोडी', path: '/events' },
      { label: 'संपर्क', path: '/contact' }
    ],
    en: [
      { label: 'Home', path: '/' },
      { label: 'Notices', path: '/notices' },
      { label: 'About Us', path: '/about' },
      { label: 'Citizen Services', path: '/services' },
      { label: 'Events', path: '/events' },
      { label: 'Contact', path: '/contact' }
    ]
  };

  const currentMenu = menuItems[language];

  return (
    <nav className="bg-blue-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title Section */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            <img
              src="https://assets.gpmithmumbari.com/gallery/logo.png"
              alt="मिठमुंबरी ग्रामपंचायत Logo"
              className="h-16 w-16 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-bold text-green-700 leading-tight">
                {language === 'mr'
                  ? 'महाराष्ट्र शासन - ग्रामपंचायत कार्यालय मिठमुंबरी'
                  : 'Maharashtra Government - Gram Panchayat Office Mithmumbari'}
              </span>
              <span className="text-xs md:text-sm text-red-600 font-semibold">
                {language === 'mr' ? 'अधिकृत वेबसाईट' : 'Official Website'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {currentMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all relative ${
                  location.pathname === item.path
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button
              onClick={toggleLanguage}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {language === 'mr' ? 'English' : 'मराठी'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {currentMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {language === 'mr' ? 'English' : 'मराठी'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;