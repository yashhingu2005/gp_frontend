import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const NewsManagement = ({ language }) => {
  const { apiService } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    content_mr: '',
    content_en: '',
    date: new Date().toISOString().split('T')[0],
    is_active: true
  });

  const content = {
    mr: {
      title: 'बातम्या व्यवस्थापन',
      addNews: 'नवीन बातमी जोडा',
      editNews: 'बातमी संपादित करा',
      titleMr: 'शीर्षक (मराठी)',
      titleEn: 'शीर्षक (इंग्रजी)',
      contentMr: 'सामग्री (मराठी)',
      contentEn: 'सामग्री (इंग्रजी)',
      date: 'तारीख',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noNews: 'कोणतीही बातमी उपलब्ध नाही'
    },
    en: {
      title: 'News Management',
      addNews: 'Add New News',
      editNews: 'Edit News',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      contentMr: 'Content (Marathi)',
      contentEn: 'Content (English)',
      date: 'Date',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      noNews: 'No news available'
    }
  };

  const currentContent = content[language];

  const fetchNews = useCallback(async () => {
    try {
      const { data, error } = await apiService.getNews();
      if (error) throw new Error(error);
      setNews(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newsData = {
        title_mr: formData.title_mr,
        title_en: formData.title_en,
        content_mr: formData.content_mr,
        content_en: formData.content_en,
        date: formData.date,
        is_active: formData.is_active ? 1 : 0
      };

      if (editingNews) {
        const { error } = await apiService.updateNews({
          id: editingNews.id,
          ...newsData
        });
        if (error) throw new Error(error);
      } else {
        const { error } = await apiService.createNews(newsData);
        if (error) throw new Error(error);
      }

      fetchNews();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Failed to save news: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await apiService.deleteNews(id);
      if (error) throw new Error(error);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news: ' + error.message);
    }
  };

  const openEditModal = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title_mr: newsItem.title_mr,
      title_en: newsItem.title_en,
      content_mr: newsItem.content_mr,
      content_en: newsItem.content_en,
      date: newsItem.date,
      is_active: newsItem.is_active === 1
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      content_mr: '',
      content_en: '',
      date: new Date().toISOString().split('T')[0],
      is_active: true
    });
    setEditingNews(null);
  };

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{currentContent.title}</h1>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center gap-2"
        >
          <Plus size={20} />
          {currentContent.addNews}
        </Button>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{currentContent.noNews}</p>
          </div>
        ) : (
          news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.is_active === 1 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.is_active === 1 ? currentContent.active : currentContent.inactive}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(item.date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {language === 'mr' ? item.title_mr : item.title_en}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">
                      {language === 'mr' ? item.content_mr : item.content_en}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingNews ? currentContent.editNews : currentContent.addNews}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.titleMr}
                    </label>
                    <input
                      type="text"
                      value={formData.title_mr}
                      onChange={(e) => setFormData({ ...formData, title_mr: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.titleEn}
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.contentMr}
                  </label>
                  <textarea
                    value={formData.content_mr}
                    onChange={(e) => setFormData({ ...formData, content_mr: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.contentEn}
                  </label>
                  <textarea
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.date}
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {currentContent.active}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {currentContent.save}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3"
                  >
                    {currentContent.cancel}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsManagement;