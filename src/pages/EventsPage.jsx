import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import apiService from '../services/apiService';

const EventsPage = ({ language }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await apiService.getEvents();

      if (error) throw error;
      
      const activeEvents = (data || [])
        .filter(e => e.is_active === 1 || e.is_active === true)
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
      
      // Parse gallery images for each event
      const eventsWithGallery = activeEvents.map(event => {
        let galleryImages = [];
        if (event.gallery_images) {
          try {
            galleryImages = typeof event.gallery_images === 'string' 
              ? JSON.parse(event.gallery_images) 
              : event.gallery_images;
            // Filter out any empty images
            galleryImages = galleryImages.filter(img => img && img.url);
          } catch (e) {
            console.error('Error parsing gallery images:', e);
            galleryImages = [];
          }
        }
        return { ...event, parsedGalleryImages: galleryImages };
      });
      
      setEvents(eventsWithGallery);
      
      // Initialize image indices
      const indices = {};
      eventsWithGallery.forEach(event => {
        indices[event.id] = 0;
      });
      setCurrentImageIndex(indices);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    mr: {
      title: 'घडामोडी',
      subtitle: 'ग्रामपंचायत कार्यक्रम आणि अपडेट्स',
      noEvents: 'सध्या कोणतेही कार्यक्रम उपलब्ध नाहीत'
    },
    en: {
      title: 'Events & Updates',
      subtitle: 'Gram Panchayat Programs and Updates',
      noEvents: 'No events available at the moment'
    }
  };

  const currentContent = content[language];

  const navigateGallery = (eventId, direction, totalImages) => {
    setCurrentImageIndex(prev => {
      const current = prev[eventId] || 0;
      let newIndex;
      if (direction === 'next') {
        newIndex = (current + 1) % totalImages;
      } else {
        newIndex = current === 0 ? totalImages - 1 : current - 1;
      }
      return { ...prev, [eventId]: newIndex };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentContent.title} - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत कार्यक्रम आणि अपडेट्स" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              {currentContent.title}
            </h1>
            <p className="text-lg text-gray-600">
              {currentContent.subtitle}
            </p>
          </motion.div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">{currentContent.noEvents}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => {
                const hasGallery = event.parsedGalleryImages && event.parsedGalleryImages.length > 0;
                const allImages = [
                  ...(event.image_url ? [{ url: event.image_url, isMain: true }] : []),
                  ...(hasGallery ? event.parsedGalleryImages : [])
                ];
                const totalImages = allImages.length;
                const currentIdx = currentImageIndex[event.id] || 0;
                const isHovered = hoveredEvent === event.id;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => {
                      setHoveredEvent(null);
                      setCurrentImageIndex(prev => ({ ...prev, [event.id]: 0 }));
                    }}
                  >
                    {/* Image Display */}
                    <AnimatePresence mode="wait">
                      {totalImages > 0 ? (
                        <motion.img
                          key={currentIdx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          alt={language === 'mr' ? event.title_mr : event.title_en}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={allImages[currentIdx].url}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                          <ImageIcon size={64} className="text-white opacity-50" />
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Gallery Navigation - Only show on hover and if there are multiple images */}
                    {isHovered && totalImages > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-10"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateGallery(event.id, 'prev', totalImages);
                          }}
                          className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateGallery(event.id, 'next', totalImages);
                          }}
                          className="pointer-events-auto bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all hover:scale-110"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </motion.div>
                    )}

                    {/* Image Counter Badge */}
                    {totalImages > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-20">
                        <ImageIcon size={14} />
                        {currentIdx + 1}/{totalImages}
                      </div>
                    )}

                    {/* Image Dots Indicator */}
                    {isHovered && totalImages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-20"
                      >
                        {allImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({ ...prev, [event.id]: idx }));
                            }}
                            className={`transition-all ${
                              idx === currentIdx
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            } rounded-full`}
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Event Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                      <div className="text-white w-full">
                        <h3 className="text-xl font-bold mb-2">
                          {language === 'mr' ? event.title_mr : event.title_en}
                        </h3>
                        <p className="text-sm opacity-90 mb-3 line-clamp-2">
                          {language === 'mr' ? event.description_mr : event.description_en}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} />
                            {new Date(event.event_date).toLocaleDateString(
                              language === 'mr' ? 'mr-IN' : 'en-IN',
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </div>
                          {event.event_time && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={14} />
                              {event.event_time}
                            </div>
                          )}
                          {(event.location_mr || event.location_en) && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} />
                              {language === 'mr' ? event.location_mr : event.location_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;