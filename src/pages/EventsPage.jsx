import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import apiService from '../services/apiService';

const EventsPage = ({ language }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Auto rotate images in modal
  useEffect(() => {
    if (!selectedEvent) return;

    const images = [
      ...(selectedEvent.image_url ? [{ url: selectedEvent.image_url }] : []),
      ...(selectedEvent.parsedGalleryImages || [])
    ];

    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setModalImageIndex(prev => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await apiService.getEvents();
      if (error) throw error;

      const activeEvents = (data || [])
        .filter(e => e.is_active === 1 || e.is_active === true)
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));

      const eventsWithGallery = activeEvents.map(event => {
        let galleryImages = [];
        if (event.gallery_images) {
          try {
            galleryImages =
              typeof event.gallery_images === 'string'
                ? JSON.parse(event.gallery_images)
                : event.gallery_images;
            galleryImages = galleryImages.filter(img => img && img.url);
          } catch {
            galleryImages = [];
          }
        }
        return { ...event, parsedGalleryImages: galleryImages };
      });

      setEvents(eventsWithGallery);

      const indices = {};
      eventsWithGallery.forEach(e => (indices[e.id] = 0));
      setCurrentImageIndex(indices);
    } catch (err) {
      console.error(err);
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

  const navigateGallery = (eventId, dir, total) => {
    setCurrentImageIndex(prev => {
      const curr = prev[eventId] || 0;
      const next =
        dir === 'next' ? (curr + 1) % total : curr === 0 ? total - 1 : curr - 1;
      return { ...prev, [eventId]: next };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentContent.title} - मिठमुंबरी ग्रामपंचायत</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-green-800 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-center text-gray-600 mb-12">
            {currentContent.subtitle}
          </p>

          {events.length === 0 ? (
            <div className="text-center text-gray-500">
              {currentContent.noEvents}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => {
                const allImages = [
                  ...(event.image_url ? [{ url: event.image_url }] : []),
                  ...(event.parsedGalleryImages || [])
                ];
                const idx = currentImageIndex[event.id] || 0;

                return (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setModalImageIndex(0);
                    }}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    className="relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                  >
                    {allImages.length > 0 ? (
                      <img
                        src={allImages[idx].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ImageIcon size={48} />
                      </div>
                    )}

                    {hoveredEvent === event.id && allImages.length > 1 && (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigateGallery(event.id, 'prev', allImages.length);
                          }}
                          className="absolute left-3 top-1/2 bg-white p-2 rounded-full"
                        >
                          <ChevronLeft />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigateGallery(event.id, 'next', allImages.length);
                          }}
                          className="absolute right-3 top-1/2 bg-white p-2 rounded-full"
                        >
                          <ChevronRight />
                        </button>
                      </>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex items-end">
                      <div className="text-white">
                        <h3 className="text-lg font-bold">
                          {language === 'mr'
                            ? event.title_mr
                            : event.title_en}
                        </h3>
                        <p className="text-sm line-clamp-2">
                          {language === 'mr'
                            ? event.description_mr
                            : event.description_en}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden"
            >
              <div className="relative h-96 bg-black overflow-hidden">
  {(() => {
    const images = [
      ...(selectedEvent.image_url
        ? [{ url: selectedEvent.image_url }]
        : []),
      ...(selectedEvent.parsedGalleryImages || [])
    ];

    return images.length ? (
      <AnimatePresence mode="wait">
        <motion.img
          key={modalImageIndex}
          src={images[modalImageIndex].url}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <ImageIcon size={64} className="text-white/50" />
      </div>
    );
  })()}

  {/* LEFT BUTTON */}
  {(() => {
    const images = [
      ...(selectedEvent.image_url
        ? [{ url: selectedEvent.image_url }]
        : []),
      ...(selectedEvent.parsedGalleryImages || [])
    ];

    return images.length > 1 ? (
      <button
        onClick={() =>
          setModalImageIndex(
            modalImageIndex === 0
              ? images.length - 1
              : modalImageIndex - 1
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2
                   bg-white/80 hover:bg-white
                   p-3 rounded-full shadow-lg
                   transition-all hover:scale-110"
      >
        <ChevronLeft size={28} />
      </button>
    ) : null;
  })()}

  {/* RIGHT BUTTON */}
  {(() => {
    const images = [
      ...(selectedEvent.image_url
        ? [{ url: selectedEvent.image_url }]
        : []),
      ...(selectedEvent.parsedGalleryImages || [])
    ];

    return images.length > 1 ? (
      <button
        onClick={() =>
          setModalImageIndex((modalImageIndex + 1) % images.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2
                   bg-white/80 hover:bg-white
                   p-3 rounded-full shadow-lg
                   transition-all hover:scale-110"
      >
        <ChevronRight size={28} />
      </button>
    ) : null;
  })()}

  {/* IMAGE COUNTER */}
  {(() => {
    const images = [
      ...(selectedEvent.image_url
        ? [{ url: selectedEvent.image_url }]
        : []),
      ...(selectedEvent.parsedGalleryImages || [])
    ];

    return images.length > 1 ? (
      <div className="absolute bottom-4 right-4
                      bg-black/70 text-white
                      px-3 py-1 rounded-full text-sm font-semibold">
        {modalImageIndex + 1} / {images.length}
      </div>
    ) : null;
  })()}

  {/* CLOSE BUTTON */}
  <button
    onClick={() => setSelectedEvent(null)}
    className="absolute top-4 right-4 bg-white p-2 rounded-full"
  >
    <X />
  </button>
</div>


              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">
                  {language === 'mr'
                    ? selectedEvent.title_mr
                    : selectedEvent.title_en}
                </h2>

                <p className="text-gray-600">
                  {language === 'mr'
                    ? selectedEvent.description_mr
                    : selectedEvent.description_en}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(selectedEvent.event_date).toLocaleDateString()}
                  </span>
                  {selectedEvent.event_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {selectedEvent.event_time}
                    </span>
                  )}
                  {(selectedEvent.location_mr ||
                    selectedEvent.location_en) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {language === 'mr'
                        ? selectedEvent.location_mr
                        : selectedEvent.location_en}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventsPage;
