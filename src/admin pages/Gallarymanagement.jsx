import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from './ImageUploadSupabase';
import { deleteImageFromSupabase } from '../contexts/Supabasestorage';

const GalleryManagement = ({ language }) => {
  const { supabase } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    image_url: '',
    image_file_path: '',
    category: 'other',
    is_active: true
  });

  const content = {
    mr: {
      title: 'दालन व्यवस्थापन',
      addImage: 'नवीन प्रतिमा जोडा',
      editImage: 'प्रतिमा संपादित करा',
      titleMr: 'शीर्षक (मराठी)',
      titleEn: 'शीर्षक (इंग्रजी)',
      image: 'प्रतिमा',
      category: 'श्रेणी',
      isActive: 'सक्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      categories: {
        event: 'कार्यक्रम',
        infrastructure: 'पायाभूत सुविधा',
        development: 'विकास कार्य',
        people: 'लोक',
        nature: 'निसर्ग',
        other: 'इतर'
      }
    },
    en: {
      title: 'Gallery Management',
      addImage: 'Add New Image',
      editImage: 'Edit Image',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      image: 'Image',
      category: 'Category',
      isActive: 'Active',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      categories: {
        event: 'Event',
        infrastructure: 'Infrastructure',
        development: 'Development',
        people: 'People',
        nature: 'Nature',
        other: 'Other'
      }
    }
  };

  const currentContent = content[language];

  const fetchGallery = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGallery(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const galleryData = {
        title_mr: formData.title_mr || null,
        title_en: formData.title_en || null,
        image_url: formData.image_url,
        image_file_path: formData.image_file_path || null,
        category: formData.category,
        is_active: formData.is_active
      };

      if (editingImage) {
        // If updating and image changed, delete old image
        if (editingImage.image_file_path && 
            editingImage.image_file_path !== formData.image_file_path &&
            formData.image_file_path) {
          await deleteImageFromSupabase(editingImage.image_file_path, supabase);
        }

        const { error } = await supabase
          .from('gallery')
          .update(galleryData)
          .eq('id', editingImage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([galleryData]);

        if (error) throw error;
      }

      fetchGallery();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gallery image:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      // Find the image to get the file path
      const image = gallery.find(img => img.id === id);
      
      // Delete the image from storage
      if (image?.image_file_path) {
        await deleteImageFromSupabase(image.image_file_path, supabase);
      }

      // Delete the gallery record
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
    }
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setFormData({
      title_mr: image.title_mr || '',
      title_en: image.title_en || '',
      image_url: image.image_url || '',
      image_file_path: image.image_file_path || '',
      category: image.category,
      is_active: image.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      image_url: '',
      image_file_path: '',
      category: 'other',
      is_active: true
    });
    setEditingImage(null);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all aspect-square"
          >
            <div className="w-full h-full">
              {image.image_url ? (
                <img
                  src={image.image_url}
                  alt={image.title_en || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <ImageIcon size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => openEditModal(image)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title={currentContent.edit}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                title={currentContent.delete}
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Title overlay */}
            {(image.title_mr || image.title_en) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-white text-sm font-semibold line-clamp-2">
                  {language === 'mr' ? image.title_mr : image.title_en}
                </p>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-2 right-2">
              <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                {currentContent.categories[image.category]}
              </span>
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingImage ? currentContent.editImage : currentContent.addImage}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                      {currentContent.titleMr}
                    </label>
                    <input
                      type="text"
                      value={formData.title_mr}
                      onChange={(e) => setFormData({ ...formData, title_mr: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Optional"
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
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {Object.keys(currentContent.categories).map(key => (
                      <option key={key} value={key}>{currentContent.categories[key]}</option>
                    ))}
                  </select>
                </div>

                <div>
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
                    disabled={!formData.image_url}
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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