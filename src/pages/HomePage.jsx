import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '../components/home/HeroSection';
import QuickServices from '../components/home/QuickServices';
import EventsSection from '../components/home/EventsSection.jsx';
import apiService from '../services/apiService';

const HomePage = ({ language }) => {
  const [latestEvents, setLatestEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestEvents();
  }, []);

  const fetchLatestEvents = async () => {
    try {
      const { data, error } = await apiService.getEvents();

      if (error) throw error;
      
      const activeEvents = (data || [])
        .filter(e => e.is_active === 1 || e.is_active === true)
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
        .slice(0, 5);
      
      setLatestEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching latest events:', error);
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
        <EventsSection language={language} latestEvents={latestEvents} loading={loading} />
      </div>
    </>
  );
};

export default HomePage;