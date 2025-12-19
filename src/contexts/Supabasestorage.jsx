// Supabase Storage Utility for Image Uploads
// This handles uploading images to Supabase Storage bucket with proper naming

import { supabase } from './AuthContext';

/**
 * Upload image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} category - Category for organizing images (news, gallery, team, events)
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<Object>} - Returns the public URL and file path
 */
export const uploadImageToSupabase = async (file, category = 'general', supabaseClient) => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  try {
    // Generate unique filename with proper naming scheme
    const filename = generateImageFilename(file.name, category);
    
    // Create the file path: category/filename
    const filePath = `${category}/${filename}`;

    // Upload to Supabase Storage bucket named 'gp-photos'
    const { data, error } = await supabaseClient.storage
      .from('gp-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('gp-photos')
      .getPublicUrl(filePath);

    return {
      imageUrl: publicUrl,
      filePath: filePath,
      filename: filename
    };
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} filePath - The file path in the bucket (e.g., "news/news_1766145632281_a3k9x.jpg")
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<boolean>} - Returns true if deletion was successful
 */
export const deleteImageFromSupabase = async (filePath, supabaseClient) => {
  if (!filePath) {
    return false;
  }

  try {
    const { error } = await supabaseClient.storage
      .from('gp-photos')
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image from Supabase:', error);
    return false;
  }
};

/**
 * List all images in a category
 * @param {string} category - Category to list images from
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<Array>} - Returns array of image objects
 */
export const listImagesInCategory = async (category, supabaseClient) => {
  try {
    const { data, error } = await supabaseClient.storage
      .from('gp-photos')
      .list(category, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      throw error;
    }

    // Get public URLs for all images
    const imagesWithUrls = data.map(file => {
      const { data: { publicUrl } } = supabaseClient.storage
        .from('gp-photos')
        .getPublicUrl(`${category}/${file.name}`);

      return {
        name: file.name,
        url: publicUrl,
        filePath: `${category}/${file.name}`,
        size: file.metadata?.size,
        createdAt: file.created_at
      };
    });

    return imagesWithUrls;
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
};

/**
 * Generate a proper filename for the image
 * Format: category_timestamp_randomstring.ext
 * Example: news_1766145632281_a3k9x.jpg
 */
export const generateImageFilename = (originalFilename, category) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 7);
  const extension = originalFilename.split('.').pop().toLowerCase();
  return `${category}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Extract file path from public URL
 * @param {string} publicUrl - The public URL from Supabase
 * @returns {string} - Returns the file path
 */
export const extractFilePathFromUrl = (publicUrl) => {
  if (!publicUrl) return null;
  
  try {
    // URL format: https://xxx.supabase.co/storage/v1/object/public/gp-photos/category/filename.ext
    const parts = publicUrl.split('/gp-photos/');
    return parts[1] || null;
  } catch (error) {
    console.error('Error extracting file path:', error);
    return null;
  }
};

/**
 * Get storage usage statistics
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<Object>} - Returns storage statistics
 */
export const getStorageStats = async (supabaseClient) => {
  try {
    const categories = ['news', 'gallery', 'team', 'events', 'services'];
    const stats = {
      totalImages: 0,
      totalSize: 0,
      categories: {}
    };

    for (const category of categories) {
      const images = await listImagesInCategory(category, supabaseClient);
      const categorySize = images.reduce((sum, img) => sum + (img.size || 0), 0);
      
      stats.categories[category] = {
        count: images.length,
        size: categorySize,
        sizeMB: (categorySize / (1024 * 1024)).toFixed(2)
      };
      
      stats.totalImages += images.length;
      stats.totalSize += categorySize;
    }

    stats.totalSizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);

    return stats;
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

/**
 * Update image (delete old, upload new)
 * @param {string} oldFilePath - Old file path to delete
 * @param {File} newFile - New file to upload
 * @param {string} category - Category for organizing images
 * @param {Object} supabaseClient - Supabase client instance
 * @returns {Promise<Object>} - Returns the new image data
 */
export const updateImage = async (oldFilePath, newFile, category, supabaseClient) => {
  try {
    // Delete old image if it exists
    if (oldFilePath) {
      await deleteImageFromSupabase(oldFilePath, supabaseClient);
    }

    // Upload new image
    const result = await uploadImageToSupabase(newFile, category, supabaseClient);
    
    return result;
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};