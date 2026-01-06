import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';

const NoticeBoard = ({ language }) => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await apiService.getNews();
      if (error) throw error;

      const filtered = (data || [])
        .filter(
          n =>
            (n.is_active === 1 || n.is_active === true) &&
            n.category === 'notice'
        )
        .sort(
          (a, b) =>
            new Date(b.date || b.published_date) -
            new Date(a.date || a.published_date)
        )
        .slice(0, 4);

      setNotices(filtered);
    } catch (err) {
      console.error(err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!notices.length) return;

    const interval = setInterval(() => {
      setCurrentNotice(prev => (prev + 1) % notices.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [notices.length]);

  return (
    <div className="max-w-3xl mx-auto h-[380px]">
      {/* WOODEN FRAME */}
      <div className="h-full rounded-3xl border-[16px] border-[#a65503]/65 shadow-2xl">
        {/* BLACKBOARD */}
        <div className="relative h-full rounded-lg bg-black/60 overflow-hidden">

          {/* HEADER */}
          <div className="absolute top-0 left-0 right-0 bg-black/15 text-white py-3 border-b border-white/20">
            <h3 className="text-2xl font-bold text-center">
              {language === 'mr' ? 'सूचना' : 'Notices'}
            </h3>
          </div>

          {/* CONTENT */}
          <div className="h-full flex items-center justify-center pt-10">
            {loading ? (
              <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            ) : notices.length === 0 ? (
              <div className="bg-white rounded-xl px-8 py-6 shadow-xl text-center">
                <p className="text-gray-700">
                  {language === 'mr'
                    ? 'सध्या कोणत्याही सूचना नाहीत'
                    : 'No notices available'}
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNotice}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white rounded-xl px-8 py-6 shadow-xl text-center max-w-md">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {language === 'mr'
                        ? notices[currentNotice].title_mr
                        : notices[currentNotice].title_en}
                    </h4>
                    <p className="text-gray-700">
                      {language === 'mr'
                        ? notices[currentNotice].content_mr
                        : notices[currentNotice].content_en}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* INDICATORS */}
          {notices.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {notices.map((_, index) => (
                <span
                  key={index}
                  className={`h-3 rounded-full transition-all ${
                    index === currentNotice
                      ? 'bg-yellow-400 w-8'
                      : 'bg-yellow-300 w-3'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
