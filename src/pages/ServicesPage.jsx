import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const ServicesPage = ({ language }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

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
      title: 'नागरीक सेवा',
      subtitle: 'आमच्या सर्व सेवा आणि फॉर्म्स येथे उपलब्ध आहेत',
      downloadForm: 'फॉर्म डाउनलोड करा',
      noServices: 'सध्या कोणत्याही सेवा उपलब्ध नाहीत',
      formAvailable: 'फॉर्म उपलब्ध'
    },
    en: {
      title: 'Citizen Services',
      subtitle: 'All our services and forms are available here',
      downloadForm: 'Download Form',
      noServices: 'No services available at the moment',
      formAvailable: 'Form Available'
    }
  };

  const currentContent = content[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
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
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत नागरिक सेवा" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
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

          {services.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">{currentContent.noServices}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-teal-500 p-4 rounded-xl flex-shrink-0">
                      <FileText size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {language === 'mr' ? service.title_mr : service.title_en}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {language === 'mr' ? service.description_mr : service.description_en}
                      </p>
                      {service.form_url ? (
                        <a
                          href={service.form_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                            <Download size={18} className="mr-2" />
                            {currentContent.downloadForm}
                          </Button>
                        </a>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          {language === 'mr' ? 'फॉर्म लवकरच उपलब्ध होईल' : 'Form coming soon'}
                        </div>
                      )}
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

export default ServicesPage;