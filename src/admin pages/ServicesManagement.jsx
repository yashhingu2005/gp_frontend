import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import PDFUpload from '../contexts/PDFUpload';
import { deleteImageFromSupabase } from '../contexts/Supabasestorage';

const ServicesManagement = ({ language }) => {
  const { supabase } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title_mr: '',
    title_en: '',
    description_mr: '',
    description_en: '',
    icon_name: '',
    category: 'other',
    form_url: '',
    form_file_path: '',
    display_order: 0,
    is_active: true
  });

  const content = {
    mr: {
      title: 'सेवा व्यवस्थापन',
      addService: 'नवीन सेवा जोडा',
      editService: 'सेवा संपादित करा',
      titleMr: 'शीर्षक (मराठी)',
      titleEn: 'शीर्षक (इंग्रजी)',
      descriptionMr: 'वर्णन (मराठी)',
      descriptionEn: 'वर्णन (इंग्रजी)',
      iconName: 'चिन्ह नाव',
      category: 'श्रेणी',
      displayOrder: 'प्रदर्शन क्रम',
      isActive: 'सक्रिय',
      formUpload: 'फॉर्म अपलोड करा (PDF)',
      formAvailable: 'फॉर्म उपलब्ध',
      downloadForm: 'फॉर्म डाउनलोड',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      categories: {
        certificate: 'प्रमाणपत्र',
        license: 'परवाना',
        registration: 'नोंदणी',
        application: 'अर्ज',
        tax: 'कर',
        other: 'इतर'
      }
    },
    en: {
      title: 'Services Management',
      addService: 'Add New Service',
      editService: 'Edit Service',
      titleMr: 'Title (Marathi)',
      titleEn: 'Title (English)',
      descriptionMr: 'Description (Marathi)',
      descriptionEn: 'Description (English)',
      iconName: 'Icon Name',
      category: 'Category',
      displayOrder: 'Display Order',
      isActive: 'Active',
      formUpload: 'Upload Form (PDF)',
      formAvailable: 'Form Available',
      downloadForm: 'Download Form',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      categories: {
        certificate: 'Certificate',
        license: 'License',
        registration: 'Registration',
        application: 'Application',
        tax: 'Tax',
        other: 'Other'
      }
    }
  };

  const currentContent = content[language];

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const serviceData = {
        title_mr: formData.title_mr,
        title_en: formData.title_en,
        description_mr: formData.description_mr,
        description_en: formData.description_en,
        icon_name: formData.icon_name || null,
        category: formData.category,
        form_url: formData.form_url || null,
        form_file_path: formData.form_file_path || null,
        display_order: formData.display_order,
        is_active: formData.is_active
      };

      if (editingService) {
        // If updating and form changed, delete old form
        if (editingService.form_file_path && 
            editingService.form_file_path !== formData.form_file_path &&
            formData.form_file_path) {
          await deleteImageFromSupabase(editingService.form_file_path, supabase);
        }

        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
      }

      fetchServices();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      // Find the service to get the form file path
      const service = services.find(s => s.id === id);
      
      // Delete the form from storage if it exists
      if (service?.form_file_path) {
        await deleteImageFromSupabase(service.form_file_path, supabase);
      }

      // Delete the service record
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title_mr: service.title_mr,
      title_en: service.title_en,
      description_mr: service.description_mr,
      description_en: service.description_en,
      icon_name: service.icon_name || '',
      category: service.category,
      form_url: service.form_url || '',
      form_file_path: service.form_file_path || '',
      display_order: service.display_order,
      is_active: service.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title_mr: '',
      title_en: '',
      description_mr: '',
      description_en: '',
      icon_name: '',
      category: 'other',
      form_url: '',
      form_file_path: '',
      display_order: 0,
      is_active: true
    });
    setEditingService(null);
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
          {currentContent.addService}
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-4 rounded-xl">
                <FileText size={32} className="text-white" />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="text-xs text-green-600 font-semibold uppercase px-3 py-1 bg-green-50 rounded-full">
                  {currentContent.categories[service.category]}
                </span>
                {service.form_url && (
                  <span className="text-xs text-blue-600 font-semibold uppercase px-3 py-1 bg-blue-50 rounded-full flex items-center gap-1">
                    <Download size={12} />
                    {currentContent.formAvailable}
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {language === 'mr' ? service.title_mr : service.title_en}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {language === 'mr' ? service.description_mr : service.description_en}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(service)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Edit size={16} />
                {currentContent.edit}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={16} />
                {currentContent.delete}
              </button>
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
                  {editingService ? currentContent.editService : currentContent.addService}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.iconName}
                    </label>
                    <input
                      type="text"
                      value={formData.icon_name}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="FileText"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.displayOrder}
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <PDFUpload
                    category="forms"
                    currentFile={formData.form_url}
                    currentFilePath={formData.form_file_path}
                    onFileChange={(url, path) => {
                      setFormData({
                        ...formData,
                        form_url: url || '',
                        form_file_path: path || ''
                      });
                    }}
                    label={currentContent.formUpload}
                    language={language}
                  />
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

export default ServicesManagement;