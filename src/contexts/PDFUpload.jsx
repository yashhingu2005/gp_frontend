import React, { useState } from 'react';
import { Upload, X, FileText, Loader2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PDFUpload = ({ 
  category = 'forms',
  currentFile,
  currentFilePath,
  onFileChange,
  label,
  language = 'en'
}) => {
  const { supabase } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const content = {
    mr: {
      uploadPDF: 'PDF अपलोड करा',
      dragDrop: 'PDF फाइल येथे ड्रॅग करा किंवा ब्राउझ करण्यासाठी क्लिक करा',
      uploading: 'अपलोड करत आहे...',
      change: 'बदला',
      remove: 'काढा',
      maxSize: 'कमाल फाइल आकार: 10MB',
      onlyPDF: 'फक्त PDF फाईल्स',
      error: 'त्रुटी',
      fileTooLarge: 'फाइल खूप मोठी आहे (कमाल 10MB)',
      invalidType: 'अवैध फाइल प्रकार (फक्त PDF)'
    },
    en: {
      uploadPDF: 'Upload PDF',
      dragDrop: 'Drag and drop PDF file here or click to browse',
      uploading: 'Uploading...',
      change: 'Change',
      remove: 'Remove',
      maxSize: 'Max file size: 10MB',
      onlyPDF: 'PDF files only',
      error: 'Error',
      fileTooLarge: 'File is too large (max 10MB)',
      invalidType: 'Invalid file type (PDF only)'
    }
  };

  const currentContent = content[language];

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError(currentContent.invalidType);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(currentContent.fileTooLarge);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const fileExt = 'pdf';
      const fileName = `${category}_${timestamp}_${random}.${fileExt}`;
      const filePath = `${category}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('gp-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('gp-photos')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        onFileChange(urlData.publicUrl, filePath);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(currentContent.error + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onFileChange('', '');
    setError('');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {currentFile ? (
        // Show uploaded PDF
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Check size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">PDF {currentContent.uploadPDF}</p>
              <a 
                href={currentFile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <FileText size={12} />
                View PDF
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <label className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
              <Upload size={16} />
              {currentContent.change}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleInputChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <button
              onClick={handleRemove}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              disabled={uploading}
            >
              <X size={16} />
              {currentContent.remove}
            </button>
          </div>
        </div>
      ) : (
        // Show upload area
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50"
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={handleInputChange}
            className="hidden"
            id="pdf-upload"
            disabled={uploading}
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 size={48} className="text-green-600 animate-spin mb-3" />
                <p className="text-sm text-gray-600">{currentContent.uploading}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText size={48} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">{currentContent.dragDrop}</p>
                <p className="text-xs text-gray-500">{currentContent.maxSize}</p>
                <p className="text-xs text-gray-500">{currentContent.onlyPDF}</p>
              </div>
            )}
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default PDFUpload;