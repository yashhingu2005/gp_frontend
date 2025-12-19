import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NewsSection = ({ language }) => {
  const content = {
    mr: {
      title: 'ताज्या घडामोडी आणि महत्वाच्या सूचना',
      news: [
        {
          title: 'आरे गावच्या पूर्णीचे उद्घाटन दिवस्तील',
          description: 'सर्व नागरिक सेवा आता ऑनलाइन उपलब्ध करपात आली'
        },
        {
          title: 'आधार कार्ड धारसांची सोभी सुविधा',
          description: 'नवीन रोजगार निर्माण करणार'
        }
      ],
      textNews: {
        title: 'सर्व नागरिक सेवा ऑनलाइन उपलब्ध',
        items: [
          'आपार कार्ड साखली ऑनलाइन करणार आल्या',
          'सर्व सेवा ऑनलाइन उपलब्ध करण्यात आल्या'
        ]
      },
      viewAll: 'सर्व पहा'
    },
    en: {
      title: 'Latest Updates and Important Notices',
      news: [
        {
          title: 'Village Development Inauguration Scheduled',
          description: 'All citizen services now available online'
        },
        {
          title: 'Aadhaar Card Facility Updates',
          description: 'Will create new employment'
        }
      ],
      textNews: {
        title: 'All Citizen Services Available Online',
        items: [
          'Aadhaar card facilities now online',
          'All services made available online'
        ]
      },
      viewAll: 'View All'
    }
  };

  const currentContent = content[language];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-lg group"
          >
            <img alt="Village development project inauguration ceremony" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1700145420992-d75e4d56dc93" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">
                  {currentContent.news[0].title}
                </h3>
                <p className="text-sm opacity-90">
                  {currentContent.news[0].description}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-lg group"
          >
            <img alt="Aadhaar card enrollment and verification center" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1649056172285-79288aefaaa8" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">
                  {currentContent.news[1].title}
                </h3>
                <p className="text-sm opacity-90">
                  {currentContent.news[1].description}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between h-96"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {currentContent.textNews.title}
              </h3>
              <ul className="space-y-4">
                {currentContent.textNews.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
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
      </div>
    </section>
  );
};

export default NewsSection;