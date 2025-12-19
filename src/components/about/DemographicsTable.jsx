import React from 'react';
import { motion } from 'framer-motion';

const DemographicsTable = ({ language }) => {
  const content = {
    mr: {
      title: 'ग्रामपंचायत माहिती :',
      subtitle: 'सन २०११ नुसार गावची लोकसंख्या : ५४९०',
      tableHeaders: ['तपशील', 'एकूण', 'पुरुष', 'स्त्री'],
      rows: [
        { label: 'एकूण कुटुंब संख्या', total: '८७७', male: '–', female: '–' },
        { label: 'लोकसंख्या', total: '५४९०', male: '२७७१', female: '२६३९' },
        { label: 'मुले (०-६)', total: '११०४', male: '५२१', female: '५६९' },
        { label: 'अनुसूचित जाती', total: '३५', male: '१७', female: '१८' },
        { label: 'अनुसूचित जमाती', total: '४५५३', male: '२२६२', female: '२२९०' },
        { label: 'साक्षरता', total: '४५.४२%', male: '५४.६५%', female: '३५.६०%' },
        { label: 'एकूण कामगार', total: '२३६६', male: '१२४१', female: '११२५' },
        { label: 'मुख्य कामगार', total: '२३६६', male: '–', female: '–' },
        { label: 'सीमांत कामगार', total: '२९', male: '१५', female: '१४' }
      ],
      additionalInfo: [
        { label: 'एकूण कुटुंब संख्या', value: '८७७' },
        { label: 'दारिद्र रेखाखालील कुटुंब संख्या', value: '७६५' },
        { label: 'प्रधान मंत्री आवास प्रतिक्षा याची कुटुंब संख्या', value: '२३७' },
        { label: 'प्रधान मंत्री आवास योजना मंजूर झालेली संख्या', value: '२३७' },
        { label: 'एकूण महसूली पाहणीचा संख्या', value: '०६' },
        { label: 'रस्ते धान्य दुकान संख्या', value: '०२' },
        { label: '५ कि.मी. अंतरले ग्रामपंचायतीचे नांव : फोंडीरी, लाकच्चया हनुमान, खांवार', value: '' },
        { label: 'गावापासून रेल्वे स्टेशनचे अंतर', value: '५५ कि.मी.' },
        { label: 'गावापासून विमानतळाचे अंतर', value: '२८० कि.मी.' },
        { label: 'गावापासून तालुकास्थाने अंतर', value: '३० कि.मी.' },
        { label: 'गावापासून उपजिल्हा कामगाराचे अंतर', value: '३० कि.मी.' },
        { label: 'गावापासून मोबाईल दळणवर्गाचे अंतर', value: '५५ कि.मी. (साँगली पो.ट्टे.)' }
      ]
    },
    en: {
      title: 'Gram Panchayat Information:',
      subtitle: 'As per 2011 Census Village Population: 5490',
      tableHeaders: ['Details', 'Total', 'Male', 'Female'],
      rows: [
        { label: 'Total Families', total: '877', male: '–', female: '–' },
        { label: 'Population', total: '5490', male: '2771', female: '2639' },
        { label: 'Children (0-6)', total: '1104', male: '521', female: '569' },
        { label: 'Scheduled Castes', total: '35', male: '17', female: '18' },
        { label: 'Scheduled Tribes', total: '4553', male: '2262', female: '2290' },
        { label: 'Literacy', total: '45.42%', male: '54.65%', female: '35.60%' },
        { label: 'Total Workers', total: '2366', male: '1241', female: '1125' },
        { label: 'Main Workers', total: '2366', male: '–', female: '–' },
        { label: 'Marginal Workers', total: '29', male: '15', female: '14' }
      ],
      additionalInfo: [
        { label: 'Total Family Count', value: '877' },
        { label: 'Below Poverty Line Families', value: '765' },
        { label: 'PM Housing Waiting List', value: '237' },
        { label: 'PM Housing Scheme Approved', value: '237' },
        { label: 'Total Revenue Inspection', value: '06' },
        { label: 'Ration Shops', value: '02' },
        { label: '5 km away Gram Panchayat names: Fondiri, Lakachya Hanuman, Khanvar', value: '' },
        { label: 'Distance from village to railway station', value: '55 km' },
        { label: 'Distance from village to airport', value: '280 km' },
        { label: 'Distance from village to taluka place', value: '30 km' },
        { label: 'Distance from village to sub-district office', value: '30 km' },
        { label: 'Distance from village to mobile tower', value: '55 km (Sangli P.O.)' }
      ]
    }
  };

  const currentContent = content[language];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl p-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            {currentContent.title}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-lg rounded-b-2xl overflow-hidden"
        >
          <div className="p-6">
            <p className="text-center font-bold text-gray-800 mb-6">
              {currentContent.subtitle}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-300">
                    {currentContent.tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-400 px-4 py-3 text-left font-bold text-gray-800"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentContent.rows.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                        {row.label}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.total}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.male}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {row.female}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 space-y-3">
              {currentContent.additionalInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-gray-700 flex-1">
                    {info.label}
                  </span>
                  {info.value && (
                    <span className="font-semibold text-gray-900">
                      {info.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemographicsTable;