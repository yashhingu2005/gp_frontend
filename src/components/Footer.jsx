import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = ({ language }) => {
  const content = {
    mr: {
      contactTitle: 'संपर्क माहिती',
      address: 'ता.दि. मिठमुंबरी, कांपाळ तालुका',
      phone: '01 1234567',
      email: 'mithmumbari@gramkampal.org',
      quickLinksTitle: 'द्रुत दुवे',
      links: [
        { label: 'मुख्य पान', path: '/' },
        { label: 'आमच्याविषयी', path: '/about' },
        { label: 'नागरीक सेवा', path: '/services' },
        { label: 'घडामोडी', path: '/events' },
        { label: 'संपर्क', path: '/contact' }
      ],
      govLinksTitle: 'महत्वाच्या सरकारी दुवे',
      govLinks: [
        'परीक्षा नोंदणी/Govt @Jobnets',
        'कुटुंब Gravnet',
        'Runggroir rumessing'
      ],
      copyright: '© 2025 मिठमुंबरी ग्रामपंचायत. सर्व हक्क राखीव.'
    },
    en: {
      contactTitle: 'Contact Info',
      address: 'Ta.Di. Mithmumbari, Kampal Taluka',
      phone: '01 1234567',
      email: 'mithmumbari@gramkampal.org',
      quickLinksTitle: 'Quick Links',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Citizen Services', path: '/services' },
        { label: 'Events', path: '/events' },
        { label: 'Contact', path: '/contact' }
      ],
      govLinksTitle: 'Important Govt. Links',
      govLinks: [
        'Exam Registration/Govt @Jobnets',
        'Famlycer Gravnet',
        'Runggroir rumessing'
      ],
      copyright: '© 2025 Mithmumbari Gram Panchayat. All rights reserved.'
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-gradient-to-br from-green-800 to-teal-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-bold mb-4 block">{currentContent.contactTitle}</span>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <p className="text-sm">{currentContent.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0" />
                <p className="text-sm">{currentContent.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0" />
                <p className="text-sm">{currentContent.email}</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xl font-bold mb-4 block">{currentContent.quickLinksTitle}</span>
            <ul className="space-y-2">
              {currentContent.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-green-300 transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xl font-bold mb-4 block">{currentContent.govLinksTitle}</span>
            <ul className="space-y-2">
              {currentContent.govLinks.map((link, index) => (
                <li key={index}>
                  <span className="text-sm hover:text-green-300 transition-colors cursor-pointer inline-block">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p className="text-sm">{currentContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;