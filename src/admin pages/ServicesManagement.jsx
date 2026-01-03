import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import PDFUpload from '../contexts/PDFUpload';

const ServicesManagement = ({ language }) => {
  const { apiService } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name_mr: '',
    name_en: '',
    description_mr: '',
    description_en: '',
    pdf_url: '',
    pdf_file_path: '',
    category: 'service',
    is_active: true
  });

  const content = {
    mr: {
      title: 'सेवा व्यवस्थापन',
      addService: 'नवीन सेवा जोडा',
      editService: 'सेवा संपादित करा',
      nameMr: 'नाव (मराठी)',
      nameEn: 'नाव (इंग्रजी)',
      descriptionMr: 'वर्णन (मराठी)',
      descriptionEn: 'वर्णन (इंग्रजी)',
      category: 'श्रेणी',
      pdfForm: 'PDF फॉर्म',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noServices: 'कोणत्याही सेवा उपलब्ध नाहीत',
      service: 'सेवा',
      form: 'फॉर्म',
      scheme: 'योजना'
    },
    en: {
      title: 'Services Management',
      addService: 'Add New Service',
      editService: 'Edit Service',
      nameMr: 'Name (Marathi)',
      nameEn: 'Name (English)',
      descriptionMr: 'Description (Marathi)',
      descriptionEn: 'Description (English)',
      category: 'Category',
      pdfForm: 'PDF Form',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      noServices: 'No services available',
      service: 'Service',
      form: 'Form',
      scheme: 'Scheme'
    }
  };

  const currentContent = content[language];

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await apiService.getServices();
      if (error) throw new Error(error);
      setServices(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const serviceData = {
        name_mr: formData.name_mr,
        name_en: formData.name_en,
        description_mr: formData.description_mr,
        description_en: formData.description_en,
        pdf_url: formData.pdf_url || null,
        pdf_file_path: formData.pdf_file_path || null,
        category: formData.category,
        is_active: formData.is_active ? 1 : 0
      };

      if (editingService) {
        const { error } = await apiService.updateService({
          id: editingService.id,
          ...serviceData
        });
        if (error) throw new Error(error);
      } else {
        const { error } = await apiService.createService(serviceData);
        if (error) throw new Error(error);
      }

      fetchServices();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await apiService.deleteService(id);
      if (error) throw new Error(error);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service: ' + error.message);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name_mr: service.name_mr,
      name_en: service.name_en,
      description_mr: service.description_mr,
      description_en: service.description_en,
      pdf_url: service.pdf_url || '',
      pdf_file_path: service.pdf_file_path || '',
      category: service.category || 'service',
      is_active: service.is_active === 1
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name_mr: '',
      name_en: '',
      description_mr: '',
      description_en: '',
      pdf_url: '',
      pdf_file_path: '',
      category: 'service',
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
        {services.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{currentContent.noServices}</p>
          </div>
        ) : (
          services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                <FileText size={64} className="text-white opacity-50" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.is_active === 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.is_active === 1 ? currentContent.active : currentContent.inactive}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {currentContent[service.category] || service.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {language === 'mr' ? service.name_mr : service.name_en}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {language === 'mr' ? service.description_mr : service.description_en}
                </p>
                {service.pdf_url && (
                  <a
                    href={service.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
                  >
                    <FileText size={16} />
                    View PDF
                  </a>
                )}
                <div className="flex gap-2 mt-4">
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
                      {currentContent.nameMr}
                    </label>
                    <input
                      type="text"
                      value={formData.name_mr}
                      onChange={(e) => setFormData({ ...formData, name_mr: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.nameEn}
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
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
                    <option value="service">{currentContent.service}</option>
                    <option value="form">{currentContent.form}</option>
                    <option value="scheme">{currentContent.scheme}</option>
                  </select>
                </div>

                <div>
                  <PDFUpload
                    category="services"
                    currentFile={formData.pdf_url}
                    currentFilePath={formData.pdf_file_path}
                    onFileChange={(url, path) => {
                      setFormData({
                        ...formData,
                        pdf_url: url || '',
                        pdf_file_path: path || ''
                      });
                    }}
                    label={currentContent.pdfForm}
                    language={language}
                  />
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

export default ServicesManagement;