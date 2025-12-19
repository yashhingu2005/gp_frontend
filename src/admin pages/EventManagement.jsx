import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from './ImageUploadSupabase';
import { deleteImageFromSupabase } from '../contexts/Supabasestorage';


const EventsManagement = ({ language }) => {
  const { supabase } = useAuth();
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
    event_time: '',
    location_mr: '',
    location_en: '',
    image_url: '',
    image_file_path: '',
    category: 'other',
    is_featured: false,
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
      eventDate: 'कार्यक्रम तारीख',
      eventTime: 'कार्यक्रम वेळ',
      locationMr: 'स्थान (मराठी)',
      locationEn: 'स्थान (इंग्रजी)',
      imageUrl: 'कार्यक्रम प्रतिमा',
      category: 'श्रेणी',
      isFeatured: 'वैशिष्ट्यीकृत',
      isActive: 'सक्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      categories: {
        meeting: 'बैठक',
        cultural: 'सांस्कृतिक',
        social: 'सामाजिक',
        health: 'आरोग्य',
        education: 'शिक्षण',
        other: 'इतर'
      }
    },
    en: {
      title: 'Events Management',
      addEvent: 'Add New Event',
      editEvent: 'Edit Event',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      descriptionMr: 'Description (Marathi)',
      descriptionEn: 'Description (English)',
      eventDate: 'Event Date',
      eventTime: 'Event Time',
      locationMr: 'Location (Marathi)',
      locationEn: 'Location (English)',
      imageUrl: 'Event Image',
      category: 'Category',
      isFeatured: 'Featured',
      isActive: 'Active',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      categories: {
        meeting: 'Meeting',
        cultural: 'Cultural',
        social: 'Social',
        health: 'Health',
        education: 'Education',
        other: 'Other'
      }
    }
  };

  const currentContent = content[language];

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  }, [supabase]);

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
        event_time: formData.event_time || null,
        location_mr: formData.location_mr,
        location_en: formData.location_en,
        image_url: formData.image_url || null,
        image_file_path: formData.image_file_path || null,
        category: formData.category,
        is_featured: formData.is_featured,
        is_active: formData.is_active
      };

      if (editingEvent) {
        // If updating and image changed, delete old image
        if (editingEvent.image_file_path && 
            editingEvent.image_file_path !== formData.image_file_path &&
            formData.image_file_path) {
          await deleteImageFromSupabase(editingEvent.image_file_path, supabase);
        }

        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      // Find the event to get the image file path
      const event = events.find(e => e.id === id);
      
      // Delete the image from storage if it exists
      if (event?.image_file_path) {
        await deleteImageFromSupabase(event.image_file_path, supabase);
      }

      // Delete the event record
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title_mr: event.title_mr,
      title_en: event.title_en,
      description_mr: event.description_mr,
      description_en: event.description_en,
      event_date: event.event_date,
      event_time: event.event_time || '',
      location_mr: event.location_mr || '',
      location_en: event.location_en || '',
      image_url: event.image_url || '',
      image_file_path: event.image_file_path || '',
      category: event.category,
      is_featured: event.is_featured,
      is_active: event.is_active
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
      event_time: '',
      location_mr: '',
      location_en: '',
      image_url: '',
      image_file_path: '',
      category: 'other',
      is_featured: false,
      is_active: true
    });
    setEditingEvent(null);
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
          {currentContent.addEvent}
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <Calendar size={64} />
                </div>
              )}
              {event.is_featured && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  Featured
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs text-purple-600 font-semibold uppercase">
                {currentContent.categories[event.category]}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mb-2 mt-1">
                {language === 'mr' ? event.title_mr : event.title_en}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {language === 'mr' ? event.description_mr : event.description_en}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-purple-600" />
                  {new Date(event.event_date).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                </div>
                {event.event_time && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-purple-600" />
                    {event.event_time}
                  </div>
                )}
                {(event.location_mr || event.location_en) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-purple-600" />
                    {language === 'mr' ? event.location_mr : event.location_en}
                  </div>
                )}
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
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
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.eventDate}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.eventTime}
                    </label>
                    <input
                      type="time"
                      value={formData.event_time}
                      onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
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

export default EventsManagement;