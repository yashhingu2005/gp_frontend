import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Newspaper, Calendar, MessageSquare,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = ({ language, setCurrentPage }) => {
  const { supabase } = useAuth();
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    pendingContacts: 0,
    teamMembers: 0
  });
  const [loading, setLoading] = useState(true);

  const content = {
    mr: {
      title: 'डॅशबोर्ड विहंगावलोकन',
      totalNews: 'एकूण बातम्या',
      upcomingEvents: 'आगामी कार्यक्रम',
      pendingContacts: 'प्रलंबित संपर्क',
      teamMembers: 'संघ सदस्य',
      recentActivity: 'अलीकडील क्रियाकलाप',
      viewAll: 'सर्व पहा'
    },
    en: {
      title: 'Dashboard Overview',
      totalNews: 'Total News',
      upcomingEvents: 'Upcoming Events',
      pendingContacts: 'Pending Contacts',
      teamMembers: 'Team Members',
      recentActivity: 'Recent Activity',
      viewAll: 'View All'
    }
  };

  const currentContent = content[language];

  const fetchStats = useCallback(async () => {
    try {
      const [newsCount, eventsCount, contactsCount, teamCount] = await Promise.all([
        supabase.from('news_announcements').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('team_members').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        news: newsCount.count || 0,
        events: eventsCount.count || 0,
        pendingContacts: contactsCount.count || 0,
        teamMembers: teamCount.count || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: currentContent.totalNews,
      value: stats.news,
      icon: Newspaper,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12%',
      trendUp: true,
      onClick: () => setCurrentPage('news')
    },
    {
      title: currentContent.upcomingEvents,
      value: stats.events,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8%',
      trendUp: true,
      onClick: () => setCurrentPage('events')
    },
    {
      title: currentContent.pendingContacts,
      value: stats.pendingContacts,
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-3%',
      trendUp: false,
      onClick: () => setCurrentPage('contacts')
    },
    {
      title: currentContent.teamMembers,
      value: stats.teamMembers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      trend: '+2',
      trendUp: true,
      onClick: () => setCurrentPage('team')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{currentContent.title}</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{currentContent.recentActivity}</h2>
          <button className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
            {currentContent.viewAll}
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { action: 'New contact submission', time: '5 minutes ago', icon: MessageSquare, color: 'bg-orange-100 text-orange-600' },
            { action: 'News article published', time: '1 hour ago', icon: Newspaper, color: 'bg-blue-100 text-blue-600' },
            { action: 'Team member added', time: '3 hours ago', icon: Users, color: 'bg-green-100 text-green-600' },
            { action: 'Event created', time: '5 hours ago', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
            { action: 'News article updated', time: '1 day ago', icon: Newspaper, color: 'bg-blue-100 text-blue-600' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <activity.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;