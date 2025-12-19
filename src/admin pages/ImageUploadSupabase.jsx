import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImageToSupabase, deleteImageFromSupabase, extractFilePathFromUrl } from '../contexts/Supabasestorage';
import { useAuth } from '../contexts/AuthContext';

const ImageUpload = ({ 
  category = 'general', 
  currentImage = null,
  currentFilePath = null,
  onImageChange,
  label = 'Upload Image',
  language = 'en'
}) => {
  const { supabase } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [filePath, setFilePath] = useState(currentFilePath);
  const [error, setError] = useState(null);

  const content = {
    mr: {
      uploadImage: 'प्रतिमा अपलोड करा',
      uploading: 'अपलोड करत आहे...',
      dragDrop: 'प्रतिमा येथे ड्रॅग करा किंवा क्लिक करा',
      maxSize: 'कमाल आकार: 5MB',
      validFormats: 'स्वीकृत स्वरूप: JPG, PNG, GIF, WebP',
      remove: 'काढा',
      change: 'बदला'
    },
    en: {
      uploadImage: 'Upload Image',
      uploading: 'Uploading...',
      dragDrop: 'Drag & drop image here or click to browse',
      maxSize: 'Max size: 5MB',
      validFormats: 'Accepted formats: JPG, PNG, GIF, WebP',
      remove: 'Remove',
      change: 'Change'
    }
  };

  const currentContent = content[language];

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      // Upload to Supabase Storage
      const result = await uploadImageToSupabase(file, category, supabase);
      
      // Set preview and file path
      setPreview(result.imageUrl);
      setFilePath(result.filePath);
      
      // Notify parent component
      onImageChange(result.imageUrl, result.filePath);
      
    } catch (err) {
      setError(err.message);
      setPreview(null);
      setFilePath(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (filePath) {
      try {
        await deleteImageFromSupabase(filePath, supabase);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }
    setPreview(null);
    setFilePath(null);
    onImageChange(null, null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {!preview ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="p-8 text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">{currentContent.uploading}</p>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">{currentContent.dragDrop}</p>
                <p className="text-xs text-gray-500">{currentContent.maxSize}</p>
                <p className="text-xs text-gray-500">{currentContent.validFormats}</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2 shadow-lg">
              <ImageIcon size={16} />
              {currentContent.change}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg"
            >
              <X size={16} />
              {currentContent.remove}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;