import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NoticeBoard = ({ language }) => {
  const [currentNotice, setCurrentNotice] = useState(0);

  const notices = {
    mr: [
      {
        title: 'विशेष ग्राम सभा बैठक (Special Gram Sabha Notice)',
        content: 'कर भरणा आखेरचा दिनांक: ३१ डिसेंबर'
      },
      {
        title: 'साप्ताहिक बाजार पेढी वरून (Water Supply Notice)',
        content: 'पाणीपुरवठा सुविधा यादी आता ऑनलाइन'
      },
      {
        title: 'सार्वजनिक लसीकरण (Application for [Scheme Name] Scheme)',
        content: 'मोफत लसीकरण शिबीर दिनांक २० डिसेंबर'
      },
      {
        title: 'सार्वजनिक सुट्टी (Public Holiday)',
        content: 'गणेश चतुर्थी - सार्वजनिक सुट्टी'
      }
    ],
    en: [
      {
        title: 'Special Gram Sabha Notice',
        content: 'Tax Payment Final Date: 31st December'
      },
      {
        title: 'Water Supply Notice',
        content: 'Water supply facility list now online'
      },
      {
        title: 'Application for Scheme',
        content: 'Free vaccination camp on 20th December'
      },
      {
        title: 'Public Holiday',
        content: 'Ganesh Chaturthi - Public Holiday'
      }
    ]
  };

  const currentNotices = notices[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % currentNotices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentNotices.length]);

  return (
    <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl shadow-2xl p-8 h-[350px] overflow-hidden border-4 border-yellow-600"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white py-3 px-6 rounded-t-xl">
        <h3 className="text-2xl font-bold text-center">
          {language === 'mr' ? 'सूचना' : 'Notices'}
        </h3>
      </div>

      <div className="mt-12 relative h-56 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNotice}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center px-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                {currentNotices[currentNotice].title}
              </h4>
              <p className="text-gray-600">
                {currentNotices[currentNotice].content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {currentNotices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentNotice(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentNotice ? 'bg-yellow-600 w-8' : 'bg-yellow-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;