import { QRHistoryItem } from '@/components/QRHistory';

export const saveToHistory = (qrData: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
  try {
    const existingHistory = JSON.parse(localStorage.getItem('qr-history') || '[]');
    
    const newHistoryItem: QRHistoryItem = {
      ...qrData,
      id: generateId(),
      timestamp: Date.now(),
    };
    
    // Add to beginning of array (newest first)
    const updatedHistory = [newHistoryItem, ...existingHistory];
    
    // Keep only last 100 items
    const trimmedHistory = updatedHistory.slice(0, 100);
    
    localStorage.setItem('qr-history', JSON.stringify(trimmedHistory));
    
    return newHistoryItem;
  } catch (error) {
    console.error('Error saving to QR history:', error);
    return null;
  }
};

export const getQRHistory = (): QRHistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem('qr-history') || '[]');
  } catch (error) {
    console.error('Error reading QR history:', error);
    return [];
  }
};

export const clearQRHistory = () => {
  try {
    localStorage.removeItem('qr-history');
  } catch (error) {
    console.error('Error clearing QR history:', error);
  }
};

export const removeFromHistory = (id: string) => {
  try {
    const existingHistory = getQRHistory();
    const updatedHistory = existingHistory.filter(item => item.id !== id);
    localStorage.setItem('qr-history', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error removing from QR history:', error);
  }
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};