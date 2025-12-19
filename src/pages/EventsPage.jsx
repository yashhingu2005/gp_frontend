import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const EventsPage = ({ language }) => {
  const content = {
    mr: {
      title: 'घडामोडी',
      subtitle: 'ग्रामपंचायत कार्यक्रम आणि अपडेट्स',
      events: [
        {
          title: 'गावातील सांस्कृतिक कार्यक्रम',
          description: 'स्थानिक कलाकारांचे सादरीकरण'
        },
        {
          title: 'ग्रामसभा बैठक',
          description: 'महत्वाच्या विषयांवर चर्चा'
        },
        {
          title: 'स्वच्छता अभियान',
          description: 'गाव स्वच्छतेचा उपक्रम'
        },
        {
          title: 'शेतकरी संवाद कार्यक्रम',
          description: 'शेती संबंधित माहिती'
        },
        {
          title: 'महिला बचत गट बैठक',
          description: 'महिला सक्षमीकरण कार्यक्रम'
        },
        {
          title: 'आरोग्य शिबीर',
          description: 'मोफत तपासणी सुविधा'
        }
      ]
    },
    en: {
      title: 'Events & Updates',
      subtitle: 'Gram Panchayat Programs and Updates',
      events: [
        {
          title: 'Village Cultural Program',
          description: 'Performance by local artists'
        },
        {
          title: 'Gram Sabha Meeting',
          description: 'Discussion on important topics'
        },
        {
          title: 'Cleanliness Drive',
          description: 'Village cleanliness initiative'
        },
        {
          title: 'Farmer Dialogue Program',
          description: 'Agriculture related information'
        },
        {
          title: 'Women Savings Group Meeting',
          description: 'Women empowerment program'
        },
        {
          title: 'Health Camp',
          description: 'Free check-up facility'
        }
      ]
    }
  };

  const currentContent = content[language];

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Village cultural event with traditional performance" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1579792808953-85b3438c450d" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[0].title}</h3>
                  <p className="text-sm">{currentContent.events[0].description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Gram Sabha meeting in village hall" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1650433349342-3eefed21339f" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[1].title}</h3>
                  <p className="text-sm">{currentContent.events[1].description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Village cleanliness drive with volunteers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1590874023110-f82d4c63b599" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[2].title}</h3>
                  <p className="text-sm">{currentContent.events[2].description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Farmer dialogue program in agricultural field" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1624433417560-5cee903e80bd" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[3].title}</h3>
                  <p className="text-sm">{currentContent.events[3].description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Women savings group meeting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1691826280718-b365d22809e3" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[4].title}</h3>
                  <p className="text-sm">{currentContent.events[4].description}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative h-80 rounded-2xl overflow-hidden shadow-lg group"
            >
              <img alt="Health camp with medical checkup" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://images.unsplash.com/photo-1545184568-45f348aeb40b" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{currentContent.events[5].title}</h3>
                  <p className="text-sm">{currentContent.events[5].description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;