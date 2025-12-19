import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const content = {
    mr: {
      title: 'संपर्क',
      subtitle: 'आम्हाला संपर्क करा',
      formTitle: 'संदेश पाठवा',
      namePlaceholder: 'तुमचे नाव',
      emailPlaceholder: 'ईमेल पत्ता',
      phonePlaceholder: 'फोन नंबर',
      messagePlaceholder: 'तुमचा संदेश',
      submitButton: 'संदेश पाठवा',
      address: 'पत्ता',
      addressDetails: 'ता.दि., मिठमुंबरी, कांपाळ(का)दुदिअग',
      phone: 'फोन',
      phoneNumber: '123456890',
      email: 'ईमेल',
      emailAddress: 'Mushroom institute.kampal(ka)dudiag',
      workingHours: 'कार्यालय वेळ',
      hours: 'सोमवार - शुक्रवार: 10:00 - 17:00'
    },
    en: {
      title: 'Contact',
      subtitle: 'Get in touch with us',
      formTitle: 'Send a Message',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Email Address',
      phonePlaceholder: 'Phone Number',
      messagePlaceholder: 'Your Message',
      submitButton: 'Send Message',
      address: 'Address',
      addressDetails: 'Ta.Di., Mithmumbari, Kampal(Ka)dudiag',
      phone: 'Phone',
      phoneNumber: '123456890',
      email: 'Email',
      emailAddress: 'Mushroom institute.kampal(ka)dudiag',
      workingHours: 'Working Hours',
      hours: 'Monday - Friday: 10:00 AM - 5:00 PM'
    }
  };

  const currentContent = content[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{currentContent.title} - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत संपर्क माहिती" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-16">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentContent.formTitle}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={currentContent.namePlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={currentContent.emailPlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={currentContent.phonePlaceholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={currentContent.messagePlaceholder}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                      required
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold"
                  >
                    {currentContent.submitButton}
                  </Button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin size={24} className="text-green-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">{currentContent.address}</span>
                    <p className="text-gray-600">{currentContent.addressDetails}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">{currentContent.phone}</span>
                    <p className="text-gray-600">{currentContent.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Mail size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">{currentContent.email}</span>
                    <p className="text-gray-600">{currentContent.emailAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 block mb-1">{currentContent.workingHours}</span>
                    <p className="text-gray-600">{currentContent.hours}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-2 h-80">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=72.8%2C19.0%2C72.9%2C19.1&layer=mapnik"
                  className="w-full h-full rounded-xl"
                  title="Location Map"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;