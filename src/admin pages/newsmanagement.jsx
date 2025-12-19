import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from './ImageUploadSupabase';
import { deleteImageFromSupabase, extractFilePathFromUrl } from '../contexts/Supabasestorage';

const NewsManagement = ({ language }) => {
  const { supabase } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    content_mr: '',
    content_en: '',
    category: 'news',
    image_url: '',
    image_file_path: '',
    is_featured: false,
    published_date: new Date().toISOString().split('T')[0],
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
      category: 'श्रेणी',
      imageUrl: 'प्रतिमा URL',
      publishedDate: 'प्रकाशन तारीख',
      isFeatured: 'वैशिष्ट्यीकृत',
      isActive: 'सक्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      categories: {
        news: 'बातमी',
        announcement: 'घोषणा',
        notice: 'सूचना'
      }
    },
    en: {
      title: 'News Management',
      addNews: 'Add New News',
      editNews: 'Edit News',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      contentMr: 'Content (Marathi)',
      contentEn: 'Content (English)',
      category: 'Category',
      imageUrl: 'Image URL',
      publishedDate: 'Published Date',
      isFeatured: 'Featured',
      isActive: 'Active',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      categories: {
        news: 'News',
        announcement: 'Announcement',
        notice: 'Notice'
      }
    }
  };

  const currentContent = content[language];

  const fetchNews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('news_announcements')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setNews(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  }, [supabase]);

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
        category: formData.category,
        image_url: formData.image_url || null,
        image_file_path: formData.image_file_path || null,
        is_featured: formData.is_featured,
        published_date: formData.published_date,
        is_active: formData.is_active
      };

      if (editingNews) {
        // If updating and image changed, delete old image
        if (editingNews.image_file_path && 
            editingNews.image_file_path !== formData.image_file_path &&
            formData.image_file_path) {
          await deleteImageFromSupabase(editingNews.image_file_path, supabase);
        }

        const { error } = await supabase
          .from('news_announcements')
          .update(newsData)
          .eq('id', editingNews.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news_announcements')
          .insert([newsData]);

        if (error) throw error;
      }

      fetchNews();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      // Find the news item to get the image file path
      const newsItem = news.find(n => n.id === id);
      
      // Delete the image from storage if it exists
      if (newsItem?.image_file_path) {
        await deleteImageFromSupabase(newsItem.image_file_path, supabase);
      }

      // Delete the news record
      const { error } = await supabase
        .from('news_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const openEditModal = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title_mr: newsItem.title_mr,
      title_en: newsItem.title_en,
      content_mr: newsItem.content_mr,
      content_en: newsItem.content_en,
      category: newsItem.category,
      image_url: newsItem.image_url || '',
      image_file_path: newsItem.image_file_path || '',
      is_featured: newsItem.is_featured,
      published_date: newsItem.published_date,
      is_active: newsItem.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      content_mr: '',
      content_en: '',
      category: 'news',
      image_url: '',
      image_file_path: '',
      is_featured: false,
      published_date: new Date().toISOString().split('T')[0],
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

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem, index) => (
          <motion.div
            key={newsItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
              {newsItem.image_url ? (
                <img
                  src={newsItem.image_url}
                  alt={newsItem.title_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <ImageIcon size={64} />
                </div>
              )}
              {newsItem.is_featured && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs text-blue-600 font-semibold uppercase">
                {currentContent.categories[newsItem.category]}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2 mt-1">
                {language === 'mr' ? newsItem.title_mr : newsItem.title_en}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {language === 'mr' ? newsItem.content_mr : newsItem.content_en}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(newsItem.published_date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(newsItem)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit size={16} />
                  {currentContent.edit}
                </button>
                <button
                  onClick={() => handleDelete(newsItem.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  {currentContent.delete}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="4"
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.category}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="news">{currentContent.categories.news}</option>
                      <option value="announcement">{currentContent.categories.announcement}</option>
                      <option value="notice">{currentContent.categories.notice}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.publishedDate}
                    </label>
                    <input
                      type="date"
                      value={formData.published_date}
                      onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <ImageUpload
                    category="news"
                    currentImage={formData.image_url}
                    currentFilePath={formData.image_file_path}
                    onImageChange={(url, path) => {
                      setFormData({
                        ...formData,
                        image_url: url || '',
                        image_file_path: path || ''
                      });
                    }}
                    label={currentContent.imageUrl}
                    language={language}
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">{currentContent.isFeatured}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">{currentContent.isActive}</span>
                  </label>
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