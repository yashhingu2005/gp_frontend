import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/home/HeroSection';
import QuickServices from '../components/home/QuickServices';
import NewsSection from '../components/home/NewsSection';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const HomePage = ({ language }) => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  const fetchFeaturedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_announcements')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('published_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedNews(data || []);
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