import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const EventsPage = ({ language }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
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
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
                >
                  {event.image_url ? (
                    <img 
                      alt={language === 'mr' ? event.title_mr : event.title_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      src={event.image_url} 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <ImageIcon size={64} className="text-white opacity-50" />
                    </div>
                  )}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsPage;