import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Baby, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const QuickServices = ({ language }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const iconMap = {
    FileText,
    CreditCard,
    Baby,
    Home
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(4);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    mr: {
      title: 'तुमच्यासाठी जलद सेवा',
      viewAll: 'सर्व सेवा पहा',
      noServices: 'सध्या कोणत्याही सेवा उपलब्ध नाहीत'
    },
    en: {
      title: 'Quick Services for You',
      viewAll: 'View All Services',
      noServices: 'No services available at the moment'
    }
  };

  const currentContent = content[language];

  return (
    <section id="services-section" className="py-20 bg-gradient-to-b from-white to-green-50">
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">{currentContent.noServices}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon_name] || FileText;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all"
                  >
                    <div className="bg-gradient-to-br from-green-500 to-teal-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent size={36} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {language === 'mr' ? service.title_mr : service.title_en}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {language === 'mr' ? service.description_mr : service.description_en}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-teal-700 transition-all inline-flex items-center gap-2 shadow-lg"
                >
                  {currentContent.viewAll}
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default QuickServices;