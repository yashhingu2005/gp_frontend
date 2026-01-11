import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import apiService from '../services/apiService';

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

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
      submitting: 'पाठवत आहे...',
      address: 'पत्ता',
      addressDetails: 'मिठमुंबरी, देवगड तालुका, जि. सिंधुदुर्ग ४१६६१२ ',
      phone: 'फोन',
      phoneNumber: '9869127240',
      email: 'ईमेल',
      emailAddress: 'gpmithmumbari01@gmail.com',
      workingHours: 'कार्यालय वेळ',
      hours: 'सोमवार - शुक्रवार: 09:45 AM - 06:15 PM'
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
      submitting: 'Sending...',
      address: 'Address',
      addressDetails: 'Mithmumbari, Devgad Taluka, District- Sindhudurg 416612',
      phone: 'Phone',
      phoneNumber: '9869127240',
      email: 'Email',
      emailAddress: 'gpmithmumbari01@gmail.com',
      workingHours: 'Working Hours',
      hours: 'Monday - Friday: 09:45 AM - 6:15 PM'
    }
  };

  const currentContent = content[language];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(formData.email)) {
      toast({
        title: language === 'mr' ? 'अवैध ईमेल' : 'Invalid Email',
        description: language === 'mr' ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address',
        variant: 'destructive'
      });
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      toast({
        title: language === 'mr' ? 'अवैध फोन नंबर' : 'Invalid Phone Number',
        description: language === 'mr' ? 'कृपया वैध 10 अंकी फोन नंबर प्रविष्ट करा' : 'Please enter a valid 10-digit phone number',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await apiService.createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      if (error) throw error;

      toast({
        title: language === 'mr' ? 'यशस्वी' : 'Success',
        description: language === 'mr' ? 'आपला संदेश यशस्वीरित्या पाठविला गेला' : 'Your message has been sent successfully',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'mr' ? 'संदेश पाठविण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा' : 'Failed to send message. Please try again',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                      disabled={submitting}
                      maxLength="10"
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
                      disabled={submitting}
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? currentContent.submitting : currentContent.submitButton}
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
                  src="https://www.openstreetmap.org/export/embed.html?bbox=73.367789%2C16.363511%2C73.387789%2C16.383511&layer=mapnik"
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