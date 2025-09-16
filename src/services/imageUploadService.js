import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase.js';

/**
 * 上傳圖片到 Firebase Storage
 * @param {File} file - 要上傳的圖片檔案
 * @param {string} path - 上傳路徑 (例如: 'attractions/cover/' 或 'attractions/background/')
 * @returns {Promise<string>} - 返回上傳後的圖片 URL
 */
export const uploadImage = async (file, path = 'attractions/') => {
  try {
    // 生成唯一的檔案名稱
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const fullPath = `${path}${fileName}`;
    
    // 創建 storage reference
    const storageRef = ref(storage, fullPath);
    
    // 上傳檔案
    const snapshot = await uploadBytes(storageRef, file);
    
    // 獲取下載 URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      path: fullPath
    };
  } catch (error) {
    console.error('圖片上傳失敗:', error);
    throw new Error(`圖片上傳失敗: ${error.message}`);
  }
};

/**
 * 從 Firebase Storage 刪除圖片
 * @param {string} imagePath - 圖片在 storage 中的路徑
 * @returns {Promise<boolean>} - 返回刪除是否成功
 */
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return false;
    
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    
    return true;
  } catch (error) {
    console.error('圖片刪除失敗:', error);
    return false;
  }
};

/**
 * 從 Firebase Storage URL 提取檔案路徑
 * @param {string} url - Firebase Storage 下載 URL
 * @returns {string|null} - 檔案路徑
 */
export const extractPathFromUrl = (url) => {
  try {
    if (!url || !url.includes('firebase')) return null;
    
    // Firebase Storage URL 格式：
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlObj = new URL(url);
    const pathPart = urlObj.pathname.split('/o/')[1];
    if (pathPart) {
      // 解碼路徑部分（Firebase 會編碼路徑中的特殊字符）
      return decodeURIComponent(pathPart.split('?')[0]);
    }
    return null;
  } catch (error) {
    console.error('無法從 URL 提取路徑:', error);
    return null;
  }
};

/**
 * 驗證檔案是否為有效的圖片格式
 * @param {File} file - 要驗證的檔案
 * @param {number} maxSizeMB - 最大檔案大小 (MB)
 * @returns {boolean} - 是否為有效圖片
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  // 檢查檔案類型
  if (!file.type.startsWith('image/')) {
    throw new Error('請選擇圖片檔案');
  }
  
  // 檢查檔案大小
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`圖片大小不能超過 ${maxSizeMB}MB`);
  }
  
  return true;
};