import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from './ImageUploadSupabase';

const GalleryManagement = ({ language }) => {
  const { apiService } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    description_mr: '',
    description_en: '',
    image_url: '',
    image_file_path: '',
    category: 'event',
    display_order: 0
  });

  const content = {
    mr: {
      title: 'गॅलरी व्यवस्थापन',
      addImage: 'नवीन प्रतिमा जोडा',
      editImage: 'प्रतिमा संपादित करा',
      titleMr: 'शीर्षक (मराठी)',
      titleEn: 'शीर्षक (इंग्रजी)',
      descriptionMr: 'वर्णन (मराठी)',
      descriptionEn: 'वर्णन (इंग्रजी)',
      image: 'प्रतिमा',
      category: 'श्रेणी',
      displayOrder: 'प्रदर्शन क्रम',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noImages: 'कोणत्याही प्रतिमा उपलब्ध नाहीत',
      event: 'कार्यक्रम',
      infrastructure: 'पायाभूत सुविधा',
      achievement: 'उपलब्धी'
    },
    en: {
      title: 'Gallery Management',
      addImage: 'Add New Image',
      editImage: 'Edit Image',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      descriptionMr: 'Description (Marathi)',
      descriptionEn: 'Description (English)',
      image: 'Image',
      category: 'Category',
      displayOrder: 'Display Order',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      noImages: 'No images available',
      event: 'Event',
      infrastructure: 'Infrastructure',
      achievement: 'Achievement'
    }
  };

  const currentContent = content[language];

  const fetchGallery = useCallback(async () => {
    try {
      const { data, error } = await apiService.getGallery();
      if (error) throw new Error(error);
      setGallery(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const galleryData = {
        title_mr: formData.title_mr,
        title_en: formData.title_en,
        description_mr: formData.description_mr,
        description_en: formData.description_en,
        image_url: formData.image_url || null,
        image_file_path: formData.image_file_path || null,
        category: formData.category,
        display_order: formData.display_order
      };

      if (editingItem) {
        const { error } = await apiService.updateGalleryItem({
          id: editingItem.id,
          ...galleryData
        });
        if (error) throw new Error(error);
      } else {
        const { error } = await apiService.createGalleryItem(galleryData);
        if (error) throw new Error(error);
      }

      fetchGallery();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await apiService.deleteGalleryItem(id);
      if (error) throw new Error(error);
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item: ' + error.message);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title_mr: item.title_mr,
      title_en: item.title_en,
      description_mr: item.description_mr || '',
      description_en: item.description_en || '',
      image_url: item.image_url || '',
      image_file_path: item.image_file_path || '',
      category: item.category || 'event',
      display_order: item.display_order || 0
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      description_mr: '',
      description_en: '',
      image_url: '',
      image_file_path: '',
      category: 'event',
      display_order: 0
    });
    setEditingItem(null);
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
          {currentContent.addImage}
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{currentContent.noImages}</p>
          </div>
        ) : (
          gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title_en}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                    <ImageIcon size={48} className="text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
                    {currentContent[item.category] || item.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
                  {language === 'mr' ? item.title_mr : item.title_en}
                </h3>
                {(item.description_mr || item.description_en) && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {language === 'mr' ? item.description_mr : item.description_en}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit size={14} />
                    {currentContent.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Trash2 size={14} />
                    {currentContent.delete}
                  </button>
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
                  {editingItem ? currentContent.editImage : currentContent.addImage}
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
                    {currentContent.descriptionMr}
                  </label>
                  <textarea
                    value={formData.description_mr}
                    onChange={(e) => setFormData({ ...formData, description_mr: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.descriptionEn}
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <ImageUpload
                    category="gallery"
                    currentImage={formData.image_url}
                    currentFilePath={formData.image_file_path}
                    onImageChange={(url, path) => {
                      setFormData({
                        ...formData,
                        image_url: url || '',
                        image_file_path: path || ''
                      });
                    }}
                    label={currentContent.image}
                    language={language}
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
                      required
                    >
                      <option value="event">{currentContent.event}</option>
                      <option value="infrastructure">{currentContent.infrastructure}</option>
                      <option value="achievement">{currentContent.achievement}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.displayOrder}
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
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

export default GalleryManagement;