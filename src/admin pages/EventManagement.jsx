import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from './ImageUploadSupabase';

const EventsManagement = ({ language }) => {
  const { apiService } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    description_mr: '',
    description_en: '',
    event_date: '',
    location_mr: '',
    location_en: '',
    image_url: '',
    image_file_path: '',
    gallery_images: [], // Array of {url, file_path} objects
    is_active: true
  });

  const content = {
    mr: {
      title: 'कार्यक्रम व्यवस्थापन',
      addEvent: 'नवीन कार्यक्रम जोडा',
      editEvent: 'कार्यक्रम संपादित करा',
      titleMr: 'शीर्षक (मराठी)',
      titleEn: 'शीर्षक (इंग्रजी)',
      descriptionMr: 'वर्णन (मराठी)',
      descriptionEn: 'वर्णन (इंग्रजी)',
      date: 'तारीख',
      locationMr: 'स्थान (मराठी)',
      locationEn: 'स्थान (इंग्रजी)',
      image: 'मुख्य प्रतिमा',
      galleryImages: 'अतिरिक्त प्रतिमा (गॅलरी)',
      addGalleryImage: 'गॅलरी प्रतिमा जोडा',
      removeImage: 'प्रतिमा काढा',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noEvents: 'कोणतेही कार्यक्रम उपलब्ध नाहीत',
      galleryImageCount: 'गॅलरी प्रतिमा'
    },
    en: {
      title: 'Events Management',
      addEvent: 'Add New Event',
      editEvent: 'Edit Event',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      descriptionMr: 'Description (Marathi)',
      descriptionEn: 'Description (English)',
      date: 'Date',
      locationMr: 'Location (Marathi)',
      locationEn: 'Location (English)',
      image: 'Main Image',
      galleryImages: 'Additional Images (Gallery)',
      addGalleryImage: 'Add Gallery Image',
      removeImage: 'Remove Image',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      noEvents: 'No events available',
      galleryImageCount: 'Gallery Images'
    }
  };

  const currentContent = content[language];

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await apiService.getEvents();
      if (error) throw new Error(error);
      setEvents(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = {
        title_mr: formData.title_mr,
        title_en: formData.title_en,
        description_mr: formData.description_mr,
        description_en: formData.description_en,
        event_date: formData.event_date,
        location_mr: formData.location_mr,
        location_en: formData.location_en,
        image_url: formData.image_url || null,
        image_file_path: formData.image_file_path || null,
        gallery_images: JSON.stringify(formData.gallery_images), // Store as JSON string
        is_active: formData.is_active ? 1 : 0
      };

      if (editingEvent) {
        const { error } = await apiService.updateEvent({
          id: editingEvent.id,
          ...eventData
        });
        if (error) throw new Error(error);
      } else {
        const { error } = await apiService.createEvent(eventData);
        if (error) throw new Error(error);
      }

      fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await apiService.deleteEvent(id);
      if (error) throw new Error(error);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event: ' + error.message);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    
    // Parse gallery_images if it's a JSON string
    let galleryImages = [];
    if (event.gallery_images) {
      try {
        galleryImages = typeof event.gallery_images === 'string' 
          ? JSON.parse(event.gallery_images) 
          : event.gallery_images;
      } catch (e) {
        console.error('Error parsing gallery images:', e);
        galleryImages = [];
      }
    }
    
    setFormData({
      title_mr: event.title_mr,
      title_en: event.title_en,
      description_mr: event.description_mr,
      description_en: event.description_en,
      event_date: event.event_date,
      location_mr: event.location_mr,
      location_en: event.location_en,
      image_url: event.image_url || '',
      image_file_path: event.image_file_path || '',
      gallery_images: galleryImages,
      is_active: event.is_active === 1
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      description_mr: '',
      description_en: '',
      event_date: '',
      location_mr: '',
      location_en: '',
      image_url: '',
      image_file_path: '',
      gallery_images: [],
      is_active: true
    });
    setEditingEvent(null);
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, { url: '', file_path: '' }]
    }));
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = useCallback((index, url, filePath) => {
    setFormData(prev => {
      const newGalleryImages = [...prev.gallery_images];
      // Ensure the index exists
      if (index < newGalleryImages.length) {
        newGalleryImages[index] = { 
          url: url || '', 
          file_path: filePath || '' 
        };
      }
      return {
        ...prev,
        gallery_images: newGalleryImages
      };
    });
  }, []);

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
          {currentContent.addEvent}
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{currentContent.noEvents}</p>
          </div>
        ) : (
          events.map((event, index) => {
            // Parse gallery images count
            let galleryCount = 0;
            if (event.gallery_images) {
              try {
                const parsed = typeof event.gallery_images === 'string' 
                  ? JSON.parse(event.gallery_images) 
                  : event.gallery_images;
                galleryCount = Array.isArray(parsed) ? parsed.filter(img => img.url).length : 0;
              } catch (e) {
                galleryCount = 0;
              }
            }
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                {event.image_url ? (
                  <div className="relative">
                    <img
                      src={event.image_url}
                      alt={event.title_en}
                      className="w-full h-48 object-cover"
                    />
                    {galleryCount > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <ImageIcon size={12} />
                        +{galleryCount}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                    <Calendar size={64} className="text-white opacity-50" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.is_active === 1 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.is_active === 1 ? currentContent.active : currentContent.inactive}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {language === 'mr' ? event.title_mr : event.title_en}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {language === 'mr' ? event.description_mr : event.description_en}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-green-600" />
                      {new Date(event.event_date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="text-green-600" />
                      {language === 'mr' ? event.location_mr : event.location_en}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit size={16} />
                      {currentContent.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      {currentContent.delete}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
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
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingEvent ? currentContent.editEvent : currentContent.addEvent}
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
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.descriptionEn}
                  </label>
                  <textarea
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.locationMr}
                    </label>
                    <input
                      type="text"
                      value={formData.location_mr}
                      onChange={(e) => setFormData({ ...formData, location_mr: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.locationEn}
                    </label>
                    <input
                      type="text"
                      value={formData.location_en}
                      onChange={(e) => setFormData({ ...formData, location_en: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.date}
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <ImageUpload
                    category="events"
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

                {/* Gallery Images Section */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      {currentContent.galleryImages}
                    </label>
                    <Button
                      type="button"
                      onClick={addGalleryImage}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      {currentContent.addGalleryImage}
                    </Button>
                  </div>
                  
                  {formData.gallery_images.length > 0 && (
                    <div className="space-y-4">
                      {formData.gallery_images.map((image, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              {language === 'mr' ? 'प्रतिमा' : 'Image'} {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                            >
                              <Trash2 size={14} />
                              {currentContent.removeImage}
                            </button>
                          </div>
                          <ImageUpload
                            category="events"
                            currentImage={image.url}
                            currentFilePath={image.file_path}
                            onImageChange={(url, path) => updateGalleryImage(index, url, path)}
                            label=""
                            language={language}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
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

export default EventsManagement;