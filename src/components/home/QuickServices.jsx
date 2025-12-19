import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, Baby, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickServices = ({ language }) => {
  const content = {
    mr: {
      title: 'तुमच्यासाठी जलद सेवा',
      services: [
        {
          icon: FileText,
          title: 'दस्तऐवज व प्रमाणपत्रे',
          description: 'दस्तऐवज व प्रमाणपत्रे'
        },
        {
          icon: CreditCard,
          title: 'कर भरणा व प्रमाणपत्रे',
          description: 'कर भरणा व प्रमाणपत्रे'
        },
        {
          icon: Baby,
          title: 'जन्म-मृत्यू प्रमाणपत्रे',
          description: 'जन्म-मृत्यू प्रमाणपत्रे'
        },
        {
          icon: Home,
          title: 'निवासी प्रमाणपत्रे',
          description: 'निवासी प्रमाणपत्रे'
        }
      ],
      viewAll: 'सर्व सेवा पहा'
    },
    en: {
      title: 'Quick Services for You',
      services: [
        {
          icon: FileText,
          title: 'Documents & Certificates',
          description: 'Documents & Certificates'
        },
        {
          icon: CreditCard,
          title: 'Tax Payment & Certificates',
          description: 'Tax Payment & Certificates'
        },
        {
          icon: Baby,
          title: 'Birth-Death Certificates',
          description: 'Birth-Death Certificates'
        },
        {
          icon: Home,
          title: 'Residential Certificates',
          description: 'Residential Certificates'
        }
      ],
      viewAll: 'View All Services'
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {currentContent.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all"
            >
              <div className="bg-gradient-to-br from-green-500 to-teal-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <service.icon size={36} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
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
      </div>
    </section>
  );
};

export default QuickServices;