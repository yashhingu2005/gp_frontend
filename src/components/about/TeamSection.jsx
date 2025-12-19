import React from 'react';
import { motion } from 'framer-motion';

const TeamSection = ({ language }) => {
  const content = {
    mr: {
      title: 'Meet the team',
      members: [
        { name: 'Lyn Bryth', role: 'CEO' },
        { name: 'Lauren Pybus', role: 'VP Growth & Development' },
        { name: 'Rajeeve Thomas', role: 'VP Finance & Operations' },
        { name: 'Mitchell Fawcett', role: 'VP Strategy' },
        { name: 'Jhen Segal', role: 'VP Sales & Marketing' },
        { name: 'Darren Maher', role: 'Creative Director' },
        { name: 'Ben Van Exen', role: 'Snr Account Executive' },
        { name: 'John Brown', role: 'Founding Partner' },
        { name: 'Chris Brekkos', role: 'Founding Partner' }
      ]
    },
    en: {
      title: 'Meet the team',
      members: [
        { name: 'Lyn Bryth', role: 'CEO' },
        { name: 'Lauren Pybus', role: 'VP Growth & Development' },
        { name: 'Rajeeve Thomas', role: 'VP Finance & Operations' },
        { name: 'Mitchell Fawcett', role: 'VP Strategy' },
        { name: 'Jhen Segal', role: 'VP Sales & Marketing' },
        { name: 'Darren Maher', role: 'Creative Director' },
        { name: 'Ben Van Exen', role: 'Snr Account Executive' },
        { name: 'John Brown', role: 'Founding Partner' },
        { name: 'Chris Brekkos', role: 'Founding Partner' }
      ]
    }
  };

  const currentContent = content[language];

  return (
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Lyn Bryth" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1608875848903-06eec0bd71e2" />
            <h3 className="font-bold text-gray-800">{currentContent.members[0].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[0].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Lauren Pybus" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1663431513084-209e4934a473" />
            <h3 className="font-bold text-gray-800">{currentContent.members[1].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[1].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Rajeeve Thomas" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1629896295208-66aed41e62a2" />
            <h3 className="font-bold text-gray-800">{currentContent.members[2].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[2].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Mitchell Fawcett" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1546888673-4db7ff10251a" />
            <h3 className="font-bold text-gray-800">{currentContent.members[3].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[3].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Jhen Segal" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1608875848903-06eec0bd71e2" />
            <h3 className="font-bold text-gray-800">{currentContent.members[4].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[4].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Darren Maher" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1542981532-0eb1c784c9a9" />
            <h3 className="font-bold text-gray-800">{currentContent.members[5].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[5].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Ben Van Exen" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1580128637392-35b81ba47467" />
            <h3 className="font-bold text-gray-800">{currentContent.members[6].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[6].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of John Brown" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1700227047786-8835486ba7af" />
            <h3 className="font-bold text-gray-800">{currentContent.members[7].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[7].role}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col items-center"
          >
            <img alt="Professional headshot of Chris Brekkos" className="w-32 h-32 rounded-full object-cover mb-4 shadow-lg" src="https://images.unsplash.com/photo-1697145556467-1c5b50845d8d" />
            <h3 className="font-bold text-gray-800">{currentContent.members[8].name}</h3>
            <p className="text-sm text-gray-600">{currentContent.members[8].role}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;