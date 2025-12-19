import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import DemographicsTable from '../components/about/DemographicsTable';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const AboutPage = ({ language }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = {
    mr: {
      title: 'आमचा संघ',
      noMembers: 'सध्या कोणतेही संघ सदस्य उपलब्ध नाहीत'
    },
    en: {
      title: 'Meet the Team',
      noMembers: 'No team members available at the moment'
    }
  };

  const currentContent = content[language];

  return (
    <>
      <Helmet>
        <title>आमच्याविषयी - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत संघ आणि माहिती" />
      </Helmet>
      <div className="bg-gray-50">
        {/* Team Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
            >
              {currentContent.title}
            </motion.h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{currentContent.noMembers}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg bg-gradient-to-br from-green-400 to-teal-500">
                      {member.photo_url ? (
                        <img 
                          alt={language === 'mr' ? member.name_mr : member.name_en}
                          className="w-full h-full object-cover" 
                          src={member.photo_url} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {(language === 'mr' ? member.name_mr : member.name_en).charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-center">
                      {language === 'mr' ? member.name_mr : member.name_en}
                    </h3>
                    <p className="text-sm text-gray-600 text-center">
                      {language === 'mr' ? member.position_mr : member.position_en}
                    </p>
                    {member.phone && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        📞 {member.phone}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <DemographicsTable language={language} />
      </div>
    </>
  );
};

export default AboutPage;