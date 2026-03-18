import i18n from 'i18next';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const language = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const language = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj);
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const language = i18n.language || 'en';
  
  return new Intl.DateTimeFormat(language === 'es' ? 'es-ES' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dateObj);
};

export const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  const language = i18n.language || 'en';
  
  return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', options).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const language = i18n.language || 'en';
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = i18n.language === 'es' 
    ? ['Bytes', 'KB', 'MB', 'GB'] 
    : ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatPercent = (value: number, decimals: number = 0): string => {
  const language = i18n.language || 'en';
  
  return new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
