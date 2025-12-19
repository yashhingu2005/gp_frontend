import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

const NewsSection = ({ language, featuredNews, loading }) => {
  const content = {
    mr: {
      title: 'ताज्या घडामोडी आणि महत्वाच्या सूचना',
      viewAll: 'सर्व पहा',
      noNews: 'सध्या कोणत्याही बातम्या उपलब्ध नाहीत'
    },
    en: {
      title: 'Latest Updates and Important Notices',
      viewAll: 'View All',
      noNews: 'No news available at the moment'
    }
  };

  const currentContent = content[language];

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12"
        >
          {currentContent.title}
        </motion.h2>

        {featuredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{currentContent.noNews}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredNews.slice(0, 2).map((newsItem, index) => (
              <motion.div
                key={newsItem.id}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-lg group"
              >
                {newsItem.image_url ? (
                  <img 
                    alt={language === 'mr' ? newsItem.title_mr : newsItem.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src={newsItem.image_url} 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <ImageIcon size={64} className="text-white opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {language === 'mr' ? newsItem.title_mr : newsItem.title_en}
                    </h3>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {language === 'mr' ? newsItem.content_mr : newsItem.content_en}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between h-96"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {currentContent.title}
                </h3>
                {featuredNews.slice(2, 5).map((newsItem, idx) => (
                  <div key={newsItem.id} className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm leading-relaxed line-clamp-2">
                        {language === 'mr' ? newsItem.title_mr : newsItem.title_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-teal-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2 mt-6"
                >
                  {currentContent.viewAll}
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;