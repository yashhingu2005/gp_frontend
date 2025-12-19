import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, User, MessageSquare, Trash2, Eye, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const ContactsManagement = ({ language }) => {
  const { supabase } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read

  const content = {
    mr: {
      title: 'संपर्क व्यवस्थापन',
      all: 'सर्व',
      new: 'नवीन',
      read: 'वाचलेले',
      name: 'नाव',
      email: 'ईमेल',
      phone: 'फोन',
      message: 'संदेश',
      status: 'स्थिती',
      date: 'तारीख',
      markAsRead: 'वाचलेले म्हणून चिन्हांकित करा',
      delete: 'हटवा',
      confirmDelete: 'तुम्हाला खात्री आहे का?',
      noContacts: 'कोणतेही संपर्क सबमिशन नाही'
    },
    en: {
      title: 'Contacts Management',
      all: 'All',
      new: 'New',
      read: 'Read',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      status: 'Status',
      date: 'Date',
      markAsRead: 'Mark as Read',
      delete: 'Delete',
      confirmDelete: 'Are you sure?',
      noContacts: 'No contact submissions'
    }
  };

  const currentContent = content[language];

  const fetchContacts = useCallback(async () => {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'new') {
        query = query.eq('status', 'new');
      } else if (filter === 'read') {
        query = query.eq('status', 'read');
      }

      const { data, error } = await query;

      if (error) throw error;
      setContacts(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    }
  }, [supabase, filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleMarkAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(currentContent.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
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
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setFilter('all')}
            className={`${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.all}
          </Button>
          <Button
            onClick={() => setFilter('new')}
            className={`${
              filter === 'new'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.new}
          </Button>
          <Button
            onClick={() => setFilter('read')}
            className={`${
              filter === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentContent.read}
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">{currentContent.noContacts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                contact.status === 'new' ? 'border-l-4 border-orange-500' : 'border-l-4 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {new Date(contact.created_at).toLocaleString(
                        language === 'mr' ? 'mr-IN' : 'en-IN',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${
                      contact.status === 'new'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {contact.status === 'new' ? currentContent.new : currentContent.read}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {contact.status === 'new' && (
                    <button
                      onClick={() => handleMarkAsRead(contact.id)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                      title={currentContent.markAsRead}
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                    title={currentContent.delete}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;