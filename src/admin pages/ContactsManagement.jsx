import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, Calendar, MessageSquare, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ContactsManagement = ({ language }) => {
  const { apiService } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, resolved

  const content = {
    mr: {
      title: 'संपर्क व्यवस्थापन',
      all: 'सर्व',
      pending: 'प्रलंबित',
      resolved: 'सोडवलेले',
      name: 'नाव',
      email: 'ईमेल',
      phone: 'फोन',
      message: 'संदेश',
      date: 'तारीख',
      markResolved: 'सोडवलेले म्हणून चिन्हांकित करा',
      markPending: 'प्रलंबित म्हणून चिन्हांकित करा',
      delete: 'हटवा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noContacts: 'कोणतेही संपर्क उपलब्ध नाहीत',
      status: 'स्थिती'
    },
    en: {
      title: 'Contacts Management',
      all: 'All',
      pending: 'Pending',
      resolved: 'Resolved',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      date: 'Date',
      markResolved: 'Mark as Resolved',
      markPending: 'Mark as Pending',
      delete: 'Delete',
      confirmDelete: 'Are you sure?',
      noContacts: 'No contacts available',
      status: 'Status'
    }
  };

  const currentContent = content[language];

  const fetchContacts = useCallback(async () => {
    try {
      const { data, error } = await apiService.getContacts();
      if (error) throw new Error(error);
      setContacts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleStatusChange = async (id, newStatus) => {
  try {
    const { error } = await apiService.updateContactStatus(id, newStatus);
    if (error) throw new Error(error);
    fetchContacts();
  } catch (error) {
    console.error('Error updating contact status:', error);
    alert('Failed to update status');
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await apiService.deleteContact(id);
      if (error) throw new Error(error);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact: ' + error.message);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStatusBadge = (status) => {
    if (status === 'resolved') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle size={14} />
          {currentContent.resolved}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 flex items-center gap-1">
        <Clock size={14} />
        {currentContent.pending}
      </span>
    );
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
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.all} ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.pending} ({contacts.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'resolved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.resolved} ({contacts.filter(c => c.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{currentContent.noContacts}</p>
          </div>
        ) : (
          filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusBadge(contact.status)}
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        {new Date(contact.created_at).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">{currentContent.name}</p>
                          <p className="font-semibold text-gray-800">{contact.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">{currentContent.email}</p>
                          <a href={`mailto:${contact.email}`} className="font-semibold text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">{currentContent.phone}</p>
                          <a href={`tel:${contact.phone}`} className="font-semibold text-blue-600 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare size={18} className="text-green-600 mt-1" />
                        <p className="text-sm font-semibold text-gray-700">{currentContent.message}:</p>
                      </div>
                      <p className="text-gray-600 ml-7">{contact.message}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-gray-200 pt-4">
                  {contact.status === 'pending' ? (
                    <button
                      onClick={() => handleStatusChange(contact.id, 'resolved')}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle size={18} />
                      {currentContent.markResolved}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(contact.id, 'pending')}
                      className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Clock size={18} />
                      {currentContent.markPending}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 size={18} />
                    {currentContent.delete}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactsManagement;