import React from 'react';
import { Helmet } from 'react-helmet';
import TeamSection from '../components/about/TeamSection';
import DemographicsTable from '../components/about/DemographicsTable';

const AboutPage = ({ language }) => {
  return (
    <>
      <Helmet>
        <title>आमच्याविषयी - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत संघ आणि माहिती" />
      </Helmet>
      <div className="bg-gray-50">
        <TeamSection language={language} />
        <DemographicsTable language={language} />
      </div>
    </>
  );
};

export default AboutPage;