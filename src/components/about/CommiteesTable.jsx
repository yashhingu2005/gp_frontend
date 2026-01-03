import React from 'react';
import { motion } from 'framer-motion';

const CommitteesTable = ({ language }) => {
  const content = {
    mr: {
      tableHeaders: ['अ.क्र.', 'नाव'],
      committees: [
        {
          title: 'ग्राम आरोग्य, पोषण, पाणी पुरवठा व स्वच्छता समिती',
          members: [
            'श्री. बाळकृष्ण आत्माराम गावकर',
            'श्री. गुरुनाथ मारुती गावकर',
            'सौ. अश्मीरा अमित गावकर',
            'सौ. मिलन मिलिंद मुंबरकर',
            'श्री. संदीप सदाशिव मुंबरकर',
            'सौ. सरिता संजय वाघट',
            'श्री. अनिल दत्ताराम गावकर',
            'सौ. सोनाली भास्कर गावकर',
            'सौ. काजल केशव गावकर',
            'सौ. पायल यशवंत गावकर',
            'सौ. शिल्पा सतेश गावकर',
            'सौ. ऋतिका राजेंद्र गावकर',
            'सौ. शिल्पा श्रीकृष्ण गावकर',
            'सौ. अंजली राजाराम आडकर',
            'सौ. किशोरी श्रीकृष्ण खवळे',
            'श्री. अनिल विष्णू मुंबरकर',
            'श्री. उमेश मुकुंद तारी',
            'श्री. पांडुरंग शंकर डामरी',
            'श्री. राजाराम हरी आडकर',
            'श्री. सुरेश गणपत गावकर',
            'श्री. राजेश धोंडू तोडणकर',
            'श्री. लक्ष्मण हरी वाघट',
            'श्री. एम. आर. एस. गावकर',
            'सौ. पल्लवी पांडुरंग डामरी',
            'सौ. अमित्ता अनिल गावकर',
            'सौ. अनुजा आप्पा बांदकर',
            'सौ. तेजल ललित गावकर',
            'सौ. वृपाली विशाल मुंबरकर',
            'श्रीम.सखुबाई देवू गावकर'
          ]
        },

        {
          title: 'ग्रामविकास समिती',
          members: [
            'श्री. बाळकृष्ण आत्माराम गावकर',
            'श्री. गुरुनाथ मारुती गावकर',
            'सौ. अश्मीरा अमित गावकर',
            'सौ. मिलन मिलिंद मुंबरकर',
            'श्री. संदीप सदाशिव मुंबरकर',
            'सौ. सरिता संजय वाघट',
            'श्री. अनिल दत्ताराम गावकर',
            'सौ. सोनाली भास्कर गावकर',
            'सौ. ऋतिका राजेंद्र गावकर',
            'सौ. मुद्रा हेमंत तोडणकर',
            'सौ. पायल पुष्पराज वाघट',
            'सौ. दक्षता दयानंद मुंबरकर',
            'सौ. सुषमा संजय मुंबरकर',
            'सौ. किशोरी श्रीकृष्ण खवळे',
            'सौ. नरगजा नारायण गावकर',
            'श्री. संजय काशीराम कांबळी',
            'श्री. अर्जुन बाबू वाघट',
            'श्री. उमेश मुकुंद तारी',
            'श्री. राजाराम हरी आडकर',
            'श्री. सत्यवान अभिमन्यू गावकर',
            'श्री. राजेश धोंडू तोडणकर',
            'श्री. अमित अरविंद गावकर',
            'श्री. एम. आर. एस. गावकर'
          ]
        },

        {
          title: 'संयुक्त वन व्यवस्थापन समिती',
          members: [
            'श्री. बाळकृष्ण आत्माराम गावकर',
            'श्री. गुरुनाथ मारुती गावकर',
            'सौ. अश्मीरा अमित गावकर',
            'सौ. मिलन मिलिंद मुंबरकर',
            'श्री. संदीप सदाशिव मुंबरकर',
            'सौ. सरिता संजय वाघट',
            'श्रीम. धनश्री प्रकाश शेरम',
            'श्री. अनिल दत्ताराम गावकर',
            'सौ. सोनाली भास्कर गावकर',
            'सौ. शिल्पा सतेश गावकर',
            'सौ. काजल केशव गावकर',
            'सौ. शिल्पा श्रीकृष्ण गावकर',
            'श्री. वैष्णवी चंद्रकुमार तोडणकर',
            'सौ. निलिमा विनायक गावकर',
            'सौ. वेदिका गुरुदेव गावकर',
            'सौ. स्वाती राजेंद्र बांदकर',
            'श्री. संजय सदाशिव मुंबरकर',
            'श्री. निलकंठ राघजी गावकर',
            'श्री. मधुकर राजाराम तोडणकर',
            'श्री. राजेश धोंडू तोडणकर',
            'श्री. सूर्यकांत रायाजी डामरी',
            'श्री. बशीर शेख मुजावर'
          ]
        },

        {
          title: 'ग्राम बाल संरक्षण समिती',
          members: [
            'श्री. बाळकृष्ण आत्माराम गावकर',
            'श्री. दयानंद कृष्णाजी मुंबरकर',
            'सौ. स्वाती मंगेश गावकर',
            'श्री. मधुसूदन घोडे',
            'श्री. हेमंत देऊ तोडणकर',
            'सौ. सोनाली भास्कर गावकर',
            'श्रीम. सरुबाई देऊ गावकर',
            'श्रीम. रंजना रविंद्र मुंबरकर',
            'श्रीम. रसिका तारी'
          ]
        }
      ]
    },

    en: {
    tableHeaders: ['Sr. No.', 'Name'],
    committees: [
        {
        title: 'Village Health, Nutrition, Water Supply & Sanitation Committee',
        members: [
            'Mr. Balkrushna Atmaram Gaonkar',
            'Mr. Gurunath Maruti Gaonkar',
            'Mrs. Ashmira Amit Gaonkar',
            'Mrs. Milan Milind Mumbarkar',
            'Mr. Sandeep Sadashiv Mumbarkar',
            'Mrs. Sarita Sanjay Waghat',
            'Mr. Anil Dattaram Gaonkar',
            'Mrs. Sonali Bhaskar Gaonkar',
            'Mrs. Kajal Keshav Gaonkar',
            'Mrs. Payal Yashwant Gaonkar',
            'Mrs. Shilpa Satesh Gaonkar',
            'Mrs. Ritika Rajendra Gaonkar',
            'Mrs. Shilpa Shrikrushna Gaonkar',
            'Mrs. Anjali Rajaram Adkar',
            'Mrs. Kishori Shrikrushna Khawale',
            'Mr. Anil Vishnu Mumbarkar',
            'Mr. Umesh Mukund Tari',
            'Mr. Pandurang Shankar Damri',
            'Mr. Rajaram Hari Adkar',
            'Mr. Suresh Ganpat Gaonkar',
            'Mr. Rajesh Dhondu Todankar',
            'Mr. Laxman Hari Waghat',
            'Mr. M. R. S. Gaonkar',
            'Mrs. Pallavi Pandurang Damri',
            'Mrs. Amitta Anil Gaonkar',
            'Mrs. Anuja Appa Bandkar',
            'Mrs. Tejal Lalit Gaonkar',
            'Mrs. Vrushali Vishal Mumbarkar',
            'Mrs. Sakhubai Devu Gaonkar'
        ]
        },

        {
        title: 'Village Development Committee',
        members: [
            'Mr. Balkrushna Atmaram Gaonkar',
            'Mr. Gurunath Maruti Gaonkar',
            'Mrs. Ashmira Amit Gaonkar',
            'Mrs. Milan Milind Mumbarkar',
            'Mr. Sandeep Sadashiv Mumbarkar',
            'Mrs. Sarita Sanjay Waghat',
            'Mr. Anil Dattaram Gaonkar',
            'Mrs. Sonali Bhaskar Gaonkar',
            'Mrs. Ritika Rajendra Gaonkar',
            'Mrs. Mudra Hemant Todankar',
            'Mrs. Payal Pushparaj Waghat',
            'Mrs. Dakshata Dayanand Mumbarkar',
            'Mrs. Sushma Sanjay Mumbarkar',
            'Mrs. Kishori Shrikrushna Khawale',
            'Mrs. Nargaja Narayan Gaonkar',
            'Mr. Sanjay Kashiram Kambli',
            'Mr. Arjun Babu Waghat',
            'Mr. Umesh Mukund Tari',
            'Mr. Rajaram Hari Adkar',
            'Mr. Satyawan Abhimanyu Gaonkar',
            'Mr. Rajesh Dhondu Todankar',
            'Mr. Amit Arvind Gaonkar',
            'Mr. M. R. S. Gaonkar'
        ]
        },

        {
        title: 'Joint Forest Management Committee',
        members: [
            'Mr. Balkrushna Atmaram Gaonkar',
            'Mr. Gurunath Maruti Gaonkar',
            'Mrs. Ashmira Amit Gaonkar',
            'Mrs. Milan Milind Mumbarkar',
            'Mr. Sandeep Sadashiv Mumbarkar',
            'Mrs. Sarita Sanjay Waghat',
            'Mrs. Dhanashree Prakash Sheram',
            'Mr. Anil Dattaram Gaonkar',
            'Mrs. Sonali Bhaskar Gaonkar',
            'Mrs. Shilpa Satesh Gaonkar',
            'Mrs. Kajal Keshav Gaonkar',
            'Mrs. Shilpa Shrikrushna Gaonkar',
            'Ms. Vaishnavi Chandrakumar Todankar',
            'Mrs. Nilima Vinayak Gaonkar',
            'Mrs. Vedika Gurudev Gaonkar',
            'Mrs. Swati Rajendra Bandkar',
            'Mr. Sanjay Sadashiv Mumbarkar',
            'Mr. Nilkanth Raghji Gaonkar',
            'Mr. Madhukar Rajaram Todankar',
            'Mr. Rajesh Dhondu Todankar',
            'Mr. Suryakant Rayaji Damri',
            'Mr. Bashir Sheikh Mujawar'
        ]
        },

        {
        title: 'Village Child Protection Committee',
        members: [
            'Mr. Balkrushna Atmaram Gaonkar',
            'Mr. Dayanand Krushnaji Mumbarkar',
            'Mrs. Swati Mangesh Gaonkar',
            'Mr. Madhusudan Ghode',
            'Mr. Hemant Deu Todankar',
            'Mrs. Sonali Bhaskar Gaonkar',
            'Mrs. Sarubai Deu Gaonkar',
            'Mrs. Ranjana Ravindra Mumbarkar',
            'Mrs. Rasika Tari'
        ]
        }
    ]
    }

  };

  const current = content[language];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">

        {current.committees.map((committee, idx) => (
          <div key={idx}>
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl p-6"
            >
              <h2 className="text-lg md:text-2xl font-bold text-center">
                {committee.title}
              </h2>
            </motion.div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-b-2xl overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-yellow-300">
                    {current.tableHeaders.map((h, i) => (
                      <th
                        key={i}
                        className="border border-gray-400 px-4 py-3 text-left font-bold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {committee.members.map((name, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border px-4 py-3 text-center">
                        {i + 1}
                      </td>
                      <td className="border px-4 py-3">{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default CommitteesTable;
