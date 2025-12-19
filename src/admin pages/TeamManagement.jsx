import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const TeamManagement = ({ language }) => {
  const { supabase } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name_mr: '',
    name_en: '',
    position_mr: '',
    position_en: '',
    phone: '',
    email: '',
    photo: null,
    display_order: 0
  });

  const content = {
    mr: {
      title: 'संघ सदस्य व्यवस्थापन',
      addMember: 'नवीन सदस्य जोडा',
      editMember: 'सदस्य संपादित करा',
      nameMr: 'नाव (मराठी)',
      nameEn: 'नाव (इंग्रजी)',
      positionMr: 'पद (मराठी)',
      positionEn: 'पद (इंग्रजी)',
      phone: 'फोन नंबर',
      email: 'ईमेल',
      photo: 'फोटो',
      displayOrder: 'प्रदर्शन क्रम',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      delete: 'हटवा',
      edit: 'संपादित करा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      uploadPhoto: 'फोटो अपलोड करा'
    },
    en: {
      title: 'Team Members Management',
      addMember: 'Add New Member',
      editMember: 'Edit Member',
      nameMr: 'Name (Marathi)',
      nameEn: 'Name (English)',
      positionMr: 'Position (Marathi)',
      positionEn: 'Position (English)',
      phone: 'Phone Number',
      email: 'Email',
      photo: 'Photo',
      displayOrder: 'Display Order',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirmDelete: 'Are you sure?',
      uploadPhoto: 'Upload Photo'
    }
  };

  const currentContent = content[language];

  const fetchMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const memberData = {
        name_mr: formData.name_mr,
        name_en: formData.name_en,
        position_mr: formData.position_mr,
        position_en: formData.position_en,
        phone: formData.phone,
        email: formData.email,
        display_order: formData.display_order
      };

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([memberData]);

        if (error) throw error;
      }

      fetchMembers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    const token = localStorage.getItem('admin_token');
    try {
      await fetch(`http://localhost:5000/api/team-members/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name_mr: member.name_mr,
      name_en: member.name_en,
      position_mr: member.position_mr,
      position_en: member.position_en,
      phone: member.phone || '',
      email: member.email || '',
      photo: null,
      display_order: member.display_order
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name_mr: '',
      name_en: '',
      position_mr: '',
      position_en: '',
      phone: '',
      email: '',
      photo: null,
      display_order: 0
    });
    setEditingMember(null);
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
          {currentContent.addMember}
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="h-48 bg-gradient-to-br from-green-400 to-teal-500 relative">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                  {member.name_en.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {language === 'mr' ? member.name_mr : member.name_en}
              </h3>
              <p className="text-sm text-green-600 font-semibold mb-3">
                {language === 'mr' ? member.position_mr : member.position_en}
              </p>
              {member.phone && (
                <p className="text-sm text-gray-600 mb-1">📞 {member.phone}</p>
              )}
              {member.email && (
                <p className="text-sm text-gray-600 mb-4">✉️ {member.email}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit size={16} />
                  {currentContent.edit}
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingMember ? currentContent.editMember : currentContent.addMember}
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.positionMr}
                    </label>
                    <input
                      type="text"
                      value={formData.position_mr}
                      onChange={(e) => setFormData({ ...formData, position_mr: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.positionEn}
                    </label>
                    <input
                      type="text"
                      value={formData.position_en}
                      onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.phone}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {currentContent.email}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {currentContent.photo}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">{currentContent.uploadPhoto}</p>
                    </label>
                  </div>
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

export default TeamManagement;