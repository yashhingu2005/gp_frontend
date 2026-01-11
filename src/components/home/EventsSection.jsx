import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Calendar, MapPin } from 'lucide-react';

const EventsSection = ({ language, latestEvents, loading }) => {
  const content = {
    mr: {
      title: 'आगामी कार्यक्रम आणि घडामोडी',
      viewAll: 'सर्व पहा',
      noEvents: 'सध्या कोणतेही कार्यक्रम उपलब्ध नाहीत',
      upcomingEvents: 'अधिक कार्यक्रम'
    },
    en: {
      title: 'Upcoming Events and Updates',
      viewAll: 'View All',
      noEvents: 'No events available at the moment',
      upcomingEvents: 'More Events'
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

        {latestEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{currentContent.noEvents}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {latestEvents.slice(0, 2).map((event, index) => {
              // Get all images for the event
              const allImages = [
                ...(event.image_url ? [{ url: event.image_url }] : []),
                ...((() => {
                  try {
                    const parsed = typeof event.gallery_images === 'string'
                      ? JSON.parse(event.gallery_images)
                      : event.gallery_images;
                    return Array.isArray(parsed) ? parsed.filter(img => img && img.url) : [];
                  } catch {
                    return [];
                  }
                })())
              ];

              const mainImage = allImages.length > 0 ? allImages[0].url : null;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative h-96 rounded-2xl overflow-hidden shadow-lg group"
                >
                  {mainImage ? (
                    <img 
                      alt={language === 'mr' ? event.title_mr : event.title_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={mainImage} 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                      <ImageIcon size={64} className="text-white opacity-50" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-green-400" />
                        <span className="text-sm font-semibold">
                          {new Date(event.event_date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {language === 'mr' ? event.title_mr : event.title_en}
                      </h3>
                      <p className="text-sm opacity-90 line-clamp-2 mb-2">
                        {language === 'mr' ? event.description_mr : event.description_en}
                      </p>
                      {(event.location_mr || event.location_en) && (
                        <div className="flex items-center gap-2 text-sm opacity-80">
                          <MapPin size={14} />
                          <span className="line-clamp-1">
                            {language === 'mr' ? event.location_mr : event.location_en}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-between h-96"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  {currentContent.upcomingEvents}
                </h3>
                {latestEvents.slice(2, 5).map((event, idx) => (
                  <div key={event.id} className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="bg-white/20 rounded-lg p-2 text-center min-w-[50px]">
                          <div className="text-xs uppercase font-semibold">
                            {new Date(event.event_date).toLocaleDateString('en', { month: 'short' })}
                          </div>
                          <div className="text-xl font-bold">
                            {new Date(event.event_date).getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-relaxed line-clamp-2">
                          {language === 'mr' ? event.title_mr : event.title_en}
                        </p>
                        {(event.location_mr || event.location_en) && (
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                            <MapPin size={12} />
                            <span className="line-clamp-1">
                              {language === 'mr' ? event.location_mr : event.location_en}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-teal-700 px-6 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2 mt-6 w-full justify-center"
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

export default EventsSection;