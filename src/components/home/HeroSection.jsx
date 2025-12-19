import React from 'react';
import { motion } from 'framer-motion';
import NoticeBoard from './NoticeBoard';
const HeroSection = ({
  language
}) => {
  const content = {
    mr: {
      title: 'मिठमुंबरी ग्रामपंचायत',
      subtitle: 'नैसर्गिक सौंदर्य आणि समृद्ध वारसा यांचे केंद्र',
      scrollButton: 'तुमच्या सेवा पहा >'
    },
    en: {
      title: 'Mithmumbari Gram Panchayat',
      subtitle: 'Center of Natural Beauty and Prosperous Heritage',
      scrollButton: 'View Your Services >'
    }
  };
  const currentContent = content[language];
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    servicesSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="relative h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://res.cloudinary.com/daqm7msfs/image/upload/v1764527878/Gemini_Generated_Beach_img_1_pp3flh.jpg" alt="Coastal landscape with fishing boats in Mithmumbari village" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-teal-900/50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {currentContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              {currentContent.subtitle}
            </p>
            <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={scrollToServices} className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2">
              {currentContent.scrollButton}
            </motion.button>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            <NoticeBoard language={language} />
          </motion.div>
        </div>
      </div>
    </div>;
};
export default HeroSection;