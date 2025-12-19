import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, CreditCard, Baby, Home, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';

const ServicesPage = ({ language }) => {
  const content = {
    mr: {
      title: 'नागरीक सेवा',
      subtitle: 'आमच्या सर्व सेवा आणि फॉर्म्स येथे उपलब्ध आहेत',
      services: [
        {
          icon: FileText,
          title: 'दस्तऐवज व प्रमाणपत्रे',
          description: 'विविध प्रकारचे प्रमाणपत्रे आणि दस्तऐवज मिळवा'
        },
        {
          icon: CreditCard,
          title: 'कर भरणा व प्रमाणपत्रे',
          description: 'ऑनलाईन कर भरणा आणि पावत्या डाउनलोड करा'
        },
        {
          icon: Baby,
          title: 'जन्म-मृत्यू प्रमाणपत्रे',
          description: 'जन्म आणि मृत्यू प्रमाणपत्रांसाठी अर्ज करा'
        },
        {
          icon: Home,
          title: 'निवासी प्रमाणपत्रे',
          description: 'रहिवासी प्रमाणपत्र मिळवा'
        }
      ],
      downloadForm: 'फॉर्म डाउनलोड करा'
    },
    en: {
      title: 'Citizen Services',
      subtitle: 'All our services and forms are available here',
      services: [
        {
          icon: FileText,
          title: 'Documents & Certificates',
          description: 'Get various types of certificates and documents'
        },
        {
          icon: CreditCard,
          title: 'Tax Payment & Certificates',
          description: 'Pay taxes online and download receipts'
        },
        {
          icon: Baby,
          title: 'Birth-Death Certificates',
          description: 'Apply for birth and death certificates'
        },
        {
          icon: Home,
          title: 'Residential Certificates',
          description: 'Get residential certificates'
        }
      ],
      downloadForm: 'Download Form'
    }
  };

  const currentContent = content[language];

  const handleDownload = () => {
    toast({
      title: "🚧 This feature isn't implemented yet. "
    });
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentContent.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-teal-500 p-4 rounded-xl">
                    <service.icon size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <Button
                      onClick={handleDownload}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download size={18} className="mr-2" />
                      {currentContent.downloadForm}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;