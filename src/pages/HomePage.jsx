import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/home/HeroSection';
import QuickServices from '../components/home/QuickServices';
import NewsSection from '../components/home/NewsSection';
import apiService from '../services/apiService';

const HomePage = ({ language }) => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      const { data, error } = await apiService.getNews();

      if (error) throw error;
      
      const featured = (data || [])
        .filter(n => (n.is_active === 1 || n.is_active === true) && (n.is_featured === 1 || n.is_featured === true))
        .sort((a, b) => new Date(b.date || b.published_date) - new Date(a.date || a.published_date))
        .slice(0, 3);
      
      setFeaturedNews(featured);
    } catch (error) {
      console.error('Error fetching featured news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>मुख्य पान - मिठमुंबरी ग्रामपंचायत</title>
        <meta name="description" content="मिठमुंबरी ग्रामपंचायत मुख्य पृष्ठ - नागरिक सेवा आणि माहिती" />
      </Helmet>
      <div>
        <HeroSection language={language} />
        <QuickServices language={language} />
        <NewsSection language={language} featuredNews={featuredNews} loading={loading} />
      </div>
    </>
  );
};

export default HomePage;