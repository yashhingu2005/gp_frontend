import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
const Navbar = ({
  language,
  toggleLanguage
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuItems = {
    mr: [{
      label: 'मुख्य पान',
      path: '/'
    }, {
      label: 'आमच्याविषयी',
      path: '/about'
    }, {
      label: 'नागरीक सेवा',
      path: '/services'
    }, {
      label: 'घडामोडी',
      path: '/events'
    }, {
      label: 'संपर्क',
      path: '/contact'
    }],
    en: [{
      label: 'Home',
      path: '/'
    }, {
      label: 'About Us',
      path: '/about'
    }, {
      label: 'Citizen Services',
      path: '/services'
    }, {
      label: 'Events',
      path: '/events'
    }, {
      label: 'Contact',
      path: '/contact'
    }]
  };
  const currentMenu = menuItems[language];
  return <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <img src="https://res.cloudinary.com/daqm7msfs/image/upload/v1764668932/gp_logo_rough_hkpohq.png" alt="मिठमुंबरी ग्रामपंचायत Logo" className="h-14 w-14 object-contain" />
            <div>
              <span className="text-lg font-bold text-green-700 block leading-tight">
                {language === 'mr' ? 'महाराष्ट्र शासन - ग्रामपंचायत कार्यालय' : 'Maharashtra Government - Gram Panchayat Office'}
              </span>
              <span className="text-sm text-red-600 font-semibold">
                {language === 'mr' ? 'अधिकृत वेबसाईट' : 'Official Website'}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {currentMenu.map(item => <Link key={item.path} to={item.path} className={`text-base font-medium transition-colors hover:text-green-600 relative ${location.pathname === item.path ? 'text-green-700' : 'text-gray-700'}`}>
                {item.label}
                {location.pathname === item.path && <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-600" />}
              </Link>)}
            <Button onClick={toggleLanguage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              {language === 'mr' ? 'English' : 'मराठी'}
            </Button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="lg:hidden bg-white border-t overflow-hidden">
            <div className="px-4 py-4 space-y-3">
              {currentMenu.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 px-4 rounded-md transition-colors ${location.pathname === item.path ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {item.label}
                </Link>)}
              <Button onClick={() => {
            toggleLanguage();
            setIsMobileMenuOpen(false);
          }} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {language === 'mr' ? 'English' : 'मराठी'}
              </Button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
export default Navbar;