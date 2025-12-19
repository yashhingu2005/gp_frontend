import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/home/HeroSection';
import QuickServices from '../components/home/QuickServices';
import NewsSection from '../components/home/NewsSection';

const HomePage = ({ language }) => {
  return (
    <>
      <Helmet>
        <title>मुख्य पान - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत मुख्य पृष्ठ - नागरिक सेवा आणि माहिती" />
      </Helmet>
      <div>
        <HeroSection language={language} />
        <QuickServices language={language} />
        <NewsSection language={language} />
      </div>
    </>
  );
};

export default HomePage;