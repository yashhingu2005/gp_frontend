import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';

const NoticesPage = ({ language }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await apiService.getNews();
      if (error) throw error;

      const activeNotices = (data || [])
        .filter((n) => (n.is_active === 1 || n.is_active === true) && n.category === 'notice')
        .sort((a, b) => new Date(b.published_date) - new Date(a.published_date));

      setNotices(activeNotices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    mr: {
      title: 'सूचना',
      subtitle: 'ग्रामपंचायत महत्वाच्या सूचना आणि घोषणा',
      noNotices: 'सध्या कोणत्याही सूचना उपलब्ध नाहीत',
    },
    en: {
      title: 'Notices',
      subtitle: 'Gram Panchayat Important Notices and Announcements',
      noNotices: 'No notices available at the moment',
    },
  };

  const currentContent = content[language];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentContent.title} - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत महत्वाच्या सूचना" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-yellow-800 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-center text-gray-600 mb-12">
            {currentContent.subtitle}
          </p>

          {notices.length === 0 ? (
            <div className="text-center text-gray-500">
              {currentContent.noNotices}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedNotice(notice)}
                  className="relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-gradient-to-br from-yellow-100 to-yellow-200"
                >
                  {/* Notice Icon Background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <AlertCircle size={120} className="text-yellow-800" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/90 via-yellow-800/70 to-transparent p-5 flex items-end">
                    <div className="text-white w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-yellow-500 p-2 rounded-lg">
                          <AlertCircle size={20} className="text-yellow-900" />
                        </div>
                        <span className="text-xs uppercase font-semibold bg-yellow-500 text-yellow-900 px-2 py-1 rounded">
                          {language === 'mr' ? 'सूचना' : 'Notice'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        {language === 'mr' ? notice.title_mr : notice.title_en}
                      </h3>
                      <p className="text-sm line-clamp-2 opacity-90">
                        {language === 'mr' ? notice.content_mr : notice.content_en}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-xs opacity-80">
                        <Calendar size={14} />
                        {new Date(notice.published_date).toLocaleDateString(
                          language === 'mr' ? 'mr-IN' : 'en-IN'
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            >
              {/* Header with gradient */}
              <div className="relative h-40 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <AlertCircle size={150} className="text-yellow-900" />
                </div>
                <div className="relative z-10 text-center text-yellow-900">
                  <div className="inline-flex items-center gap-2 bg-yellow-900 text-yellow-100 px-4 py-2 rounded-full mb-3">
                    <AlertCircle size={20} />
                    <span className="font-bold uppercase text-sm">
                      {language === 'mr' ? 'महत्वाची सूचना' : 'Important Notice'}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {language === 'mr' ? selectedNotice.title_mr : selectedNotice.title_en}
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b">
                  <Calendar size={16} />
                  <span>
                    {language === 'mr' ? 'प्रकाशित: ' : 'Published: '}
                    {new Date(selectedNotice.published_date).toLocaleDateString(
                      language === 'mr' ? 'mr-IN' : 'en-IN',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {language === 'mr' ? selectedNotice.content_mr : selectedNotice.content_en}
                  </p>
                </div>

                {/* Image if available */}
                {selectedNotice.image_url && (
                  <div className="mt-6">
                    <img
                      src={selectedNotice.image_url}
                      alt={language === 'mr' ? selectedNotice.title_mr : selectedNotice.title_en}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 border-t">
                <p className="text-sm text-gray-600 text-center">
                  {language === 'mr'
                    ? 'अधिक माहितीसाठी कार्यालयाशी संपर्क साधा'
                    : 'For more information, please contact the office'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NoticesPage;